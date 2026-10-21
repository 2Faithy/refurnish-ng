"use client";

import { Suspense, useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { io, type Socket } from "socket.io-client";
import {
  ArrowLeft,
  Search,
  Send,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
  Ban,
  Flag,
  X,
  MessageCircle,
  HandCoins,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

const NEGOTIATED_PRICES_KEY = "refurnish_negotiated_prices";
const CART_KEY = "refurnish_cart";
const QTY_KEY = "refurnish_cart_quantities";

// Client-side heads-up only — the backend is the real enforcement point,
// this just gives instant feedback before hitting send.
const ALWAYS_BLOCKED_PATTERNS = [
  { regex: /\b0[7-9][01]\d{8}\b/, label: "phone number" },
  { regex: /\+234[7-9][01]\d{8,9}\b/, label: "phone number" },
  {
    regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/,
    label: "email address",
  },
  {
    regex: /https?:\/\/|www\.|\.com\b|\.ng\b|\.org\b/,
    label: "website link",
  },
  {
    regex: /\b(account number|acct no|sort code|routing number|bank name)\b/i,
    label: "bank details",
  },
  {
    regex: /\b(whatsapp|telegram|instagram dm|twitter dm|tiktok dm)\b/i,
    label: "social contact",
  },
  {
    regex: /\b(call me|text me|reach me on|contact me on|hit me up)\b/i,
    label: "off-platform contact",
  },
  {
    regex:
      /\b(pay directly|pay offline|outside platform|skip escrow|avoid refurnish|cash payment|direct transfer)\b/i,
    label: "off-platform payment",
  },
];

// Only blocked before checkout — once a real order exists,
// coordinating pickup is legitimate.
const PRE_CHECKOUT_ONLY_PATTERNS = [
  {
    regex: /\b(meet( me)? at|can we meet|let'?s meet|meet up)\b/i,
    label: "meetup arrangement",
  },
  {
    regex: /\bi'?m at\b|\bi am at\b/i,
    label: "location sharing",
  },
  {
    regex: /\bmy location is\b|\bcome to\b/i,
    label: "location sharing",
  },
];

function scanMessage(text: string, checkedOut: boolean) {
  const patterns = checkedOut
    ? ALWAYS_BLOCKED_PATTERNS
    : [...ALWAYS_BLOCKED_PATTERNS, ...PRE_CHECKOUT_ONLY_PATTERNS];

  const violations: string[] = [];

  for (const pattern of patterns) {
    if (pattern.regex.test(text)) {
      violations.push(pattern.label);
    }
  }

  return {
    clean: violations.length === 0,
    violations: [...new Set(violations)],
  };
}

function appendMessageOnce(previous: any[], message: any) {
  if (previous.some((item) => item.id === message.id)) {
    return previous;
  }

  return [...previous, message];
}

function getAuthedUser() {
  try {
    return JSON.parse(localStorage.getItem("refurnish_user") || "null");
  } catch {
    return null;
  }
}

function timeAgo(iso: string) {
  const diffMs = Date.now() - new Date(iso).getTime();
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return "Just now";
  if (mins < 60) return `${mins} min ago`;

  const hrs = Math.floor(mins / 60);

  if (hrs < 24) {
    return `${hrs} hour${hrs > 1 ? "s" : ""} ago`;
  }

  const days = Math.floor(hrs / 24);

  if (days < 7) {
    return `${days} day${days > 1 ? "s" : ""} ago`;
  }

  return new Date(iso).toLocaleDateString();
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

const BUYER_QUICK_REPLIES = [
  "Is this still available?",
  "Can you share more photos?",
];

const SELLER_QUICK_REPLIES = [
  "Yes, it's still available!",
  "I can share more details",
];

function MessagesPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const conversationIdFromUrl = searchParams.get("conversationId");

  const [user, setUser] = useState<any>(null);
  const [conversations, setConversations] = useState<any[]>([]);
  const [loadingList, setLoadingList] = useState(true);
  const [listError, setListError] = useState("");

  const [activeId, setActiveId] = useState<string | null>(null);
  const [activeConv, setActiveConv] = useState<any>(null);
  const [activeMessages, setActiveMessages] = useState<any[]>([]);
  const [loadingChat, setLoadingChat] = useState(false);

  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState<
    "all" | "buying" | "selling"
  >("all");

  const [input, setInput] = useState("");
  const [blockedWarning, setBlockedWarning] = useState("");
  const [sending, setSending] = useState(false);

  const [offerOpen, setOfferOpen] = useState(false);
  const [offerAmount, setOfferAmount] = useState("");
  const [offerBusy, setOfferBusy] = useState(false);

  const [showReportModal, setShowReportModal] = useState(false);
  const [reportBusy, setReportBusy] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  const bottomRef = useRef<HTMLDivElement>(null);
  const socketRef = useRef<Socket | null>(null);
  const activeIdRef = useRef<string | null>(null);

  useEffect(() => {
    activeIdRef.current = activeId;
  }, [activeId]);

  const authedFetch = (path: string, options: RequestInit = {}) => {
    const currentUser = getAuthedUser();

    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${currentUser?.token}`,
      },
    });
  };

  const fetchConversations = async () => {
    try {
      const res = await authedFetch("/api/conversations/mine");
      const data = await res.json();

      if (!res.ok) {
        setListError(data.message || "Couldn't load your conversations.");
        return;
      }

      setConversations(data.conversations || []);
      setListError("");
    } catch (err) {
      console.error(err);
      setListError("Couldn't reach the server. Please try again.");
    } finally {
      setLoadingList(false);
    }
  };

  useEffect(() => {
    const currentUser = getAuthedUser();
    setUser(currentUser);

    if (!currentUser?.token) {
      setLoadingList(false);
      setListError("You need to be logged in to view your messages.");
      return;
    }

    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversationIdFromUrl) {
      setActiveId(conversationIdFromUrl);
    }
  }, [conversationIdFromUrl]);

  const openConversation = async (id: string) => {
    setActiveId(id);
    setLoadingChat(true);
    setOfferOpen(false);

    try {
      const res = await authedFetch(`/api/conversations/${id}/messages`);
      const data = await res.json();

      if (!res.ok) {
        setListError(data.message || "Couldn't load this conversation.");
        setActiveId(null);
        return;
      }

      setActiveConv(data.conversation);
      setActiveMessages(data.messages || []);

      setConversations((previous) =>
        previous.map((conversation) =>
          conversation.id === id
            ? {
                ...conversation,
                unreadCount: 0,
              }
            : conversation
        )
      );

      // Tell the sidebar to refresh its unread badge.
      // The backend already marked this conversation as read
      // in getConversationMessages, so the API will return
      // the updated count.
      window.dispatchEvent(new Event("refurnish:refresh-unread"));
    } catch (err) {
      console.error(err);
      setListError("Couldn't reach the server. Please try again.");
      setActiveId(null);
    } finally {
      setLoadingChat(false);
    }
  };

  useEffect(() => {
    if (activeId && user?.token) {
      openConversation(activeId);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeId, user?.token]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [activeMessages]);

  useEffect(() => {
    if (!toastMsg) return;

    const timeout = setTimeout(() => {
      setToastMsg("");
    }, 2500);

    return () => clearTimeout(timeout);
  }, [toastMsg]);

  useEffect(() => {
    if (!user?.token) return;

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;

    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not configured.");
      return;
    }

    const socket = io(apiUrl, {
      auth: {
        token: user.token,
      },
    });

    socketRef.current = socket;

    socket.on("connect", () => {
      console.log("Socket connected:", socket.id);
    });

    socket.on(
      "message:new",
      (event: {
        conversationId: string;
        message: any;
      }) => {
        const { conversationId, message } = event;

        // Update the open conversation without duplicating messages.
        if (activeIdRef.current === conversationId) {
          setActiveMessages((previous) =>
            appendMessageOnce(previous, message)
          );
        }

        // Update the conversation preview and unread counter.
        setConversations((previous) =>
          previous.map((conversation) => {
            if (conversation.id !== conversationId) {
              return conversation;
            }

            const existingMessages = conversation.messages || [];
            const isActive = activeIdRef.current === conversationId;

            const isIncoming =
              message.role !== "system" &&
              message.role !== conversation.myRole;

            const alreadyExists = existingMessages.some(
              (item: any) => item.id === message.id
            );

            return {
              ...conversation,
              messages: alreadyExists
                ? existingMessages
                : [message, ...existingMessages],
              unreadCount: isActive
                ? 0
                : isIncoming
                  ? (conversation.unreadCount || 0) + 1
                  : conversation.unreadCount || 0,
            };
          })
        );
      }
    );

    socket.on(
      "conversation:update",
      (event: {
        conversationId: string;
        conversation: any;
      }) => {
        const { conversationId, conversation } = event;

        setConversations((previous) =>
          previous.map((currentConversation) =>
            currentConversation.id === conversationId
              ? {
                  ...currentConversation,
                  ...conversation,
                }
              : currentConversation
          )
        );

        setActiveConv((previous: any) =>
          previous && previous.id === conversationId
            ? {
                ...previous,
                ...conversation,
              }
            : previous
        );
      }
    );

    socket.on("connect_error", (error) => {
      console.error("Socket connection failed:", error.message);
    });

    return () => {
      socket.removeAllListeners();
      socket.disconnect();

      if (socketRef.current === socket) {
        socketRef.current = null;
      }
    };
  }, [user?.token]);

  useEffect(() => {
    if (!activeId || !user?.token) return;

    socketRef.current?.emit("conversation:join", activeId);
  }, [activeId, user?.token]);

  const closeConversation = () => {
    setActiveId(null);
    setActiveConv(null);
    setActiveMessages([]);
    setOfferOpen(false);
    setBlockedWarning("");

    router.replace("/dashboard/messages");
    fetchConversations();

    // Refresh the sidebar unread badge after leaving
    // a conversation that was just read.
    window.dispatchEvent(new Event("refurnish:refresh-unread"));
  };

  const filteredConversations = useMemo(() => {
    let list = [...conversations];

    if (filterStatus !== "all") {
      list = list.filter((conversation) =>
        filterStatus === "buying"
          ? conversation.myRole === "buyer"
          : conversation.myRole === "seller"
      );
    }

    if (search.trim()) {
      const query = search.toLowerCase();

      list = list.filter((conversation) => {
        const otherName =
          conversation.myRole === "buyer"
            ? conversation.seller?.name
            : conversation.buyer?.name;

        return (
          otherName?.toLowerCase().includes(query) ||
          conversation.listing?.itemTitle?.toLowerCase().includes(query)
        );
      });
    }

    return list;
  }, [conversations, filterStatus, search]);

  const quickReplies = useMemo(() => {
    if (!activeConv) return [];

    return activeConv.myRole === "buyer"
      ? BUYER_QUICK_REPLIES
      : SELLER_QUICK_REPLIES;
  }, [activeConv]);

  const handleInputChange = (text: string) => {
    setInput(text);

    if (text.length > 5) {
      const scan = scanMessage(text, !!activeConv?.orderId);

      setBlockedWarning(
        scan.clean
          ? ""
          : `For your safety, sharing ${scan.violations.join(
              ", "
            )} is not allowed. Keep all transactions on Refurnish.`
      );
    } else {
      setBlockedWarning("");
    }
  };

  const sendText = async (text: string, isQuickReply = false) => {
    if (!activeId || !text.trim() || sending) return;

    if (!isQuickReply) {
      const scan = scanMessage(text, !!activeConv?.orderId);

      if (!scan.clean) {
        setBlockedWarning(
          `Message blocked: ${scan.violations.join(", ")} detected.`
        );
        return;
      }
    }

    setSending(true);

    try {
      const res = await authedFetch(
        `/api/conversations/${activeId}/messages`,
        {
          method: "POST",
          body: JSON.stringify({
            text,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setBlockedWarning(data.message || "Couldn't send message.");
        return;
      }

      setActiveMessages((previous) =>
        appendMessageOnce(previous, data.message)
      );

      setInput("");
      setBlockedWarning("");
    } catch (err) {
      console.error(err);
      setBlockedWarning("Couldn't reach the server. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const sendOffer = async () => {
    const amount = Number(offerAmount);

    if (!activeId || !amount || amount <= 0) return;

    setOfferBusy(true);

    try {
      const res = await authedFetch(
        `/api/conversations/${activeId}/offer`,
        {
          method: "POST",
          body: JSON.stringify({
            amount,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setBlockedWarning(data.message || "Couldn't send offer.");
        return;
      }

      setActiveMessages((previous) =>
        appendMessageOnce(previous, data.message)
      );

      setActiveConv((previous: any) => ({
        ...previous,
        ...data.conversation,
      }));

      setOfferOpen(false);
      setOfferAmount("");
      setBlockedWarning("");
    } catch (err) {
      console.error(err);
      setBlockedWarning("Couldn't reach the server. Please try again.");
    } finally {
      setOfferBusy(false);
    }
  };

  const respondToOffer = async (action: "accept" | "reject") => {
    if (!activeId) return;

    setOfferBusy(true);

    try {
      const res = await authedFetch(
        `/api/conversations/${activeId}/offer/respond`,
        {
          method: "POST",
          body: JSON.stringify({
            action,
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        setBlockedWarning(data.message || "Couldn't respond to offer.");
        return;
      }

      setActiveMessages((previous) =>
        appendMessageOnce(previous, data.message)
      );

      setActiveConv((previous: any) => ({
        ...previous,
        ...data.conversation,
      }));

      setBlockedWarning("");
    } catch (err) {
      console.error(err);
      setBlockedWarning("Couldn't reach the server. Please try again.");
    } finally {
      setOfferBusy(false);
    }
  };

  const proceedToCheckout = () => {
    if (!activeConv) return;

    const listingId = activeConv.listingId;

    try {
      localStorage.setItem(CART_KEY, JSON.stringify([listingId]));
      localStorage.setItem(
        QTY_KEY,
        JSON.stringify({
          [listingId]: 1,
        })
      );

      const negotiated = JSON.parse(
        localStorage.getItem(NEGOTIATED_PRICES_KEY) || "{}"
      );

      negotiated[listingId] = activeConv.agreedPrice;

      localStorage.setItem(
        NEGOTIATED_PRICES_KEY,
        JSON.stringify(negotiated)
      );

      router.push("/checkout");
    } catch (err) {
      console.error(err);
    }
  };

  const submitReport = async (reason: string, details: string) => {
    if (!activeId) return;

    setReportBusy(true);

    try {
      const res = await authedFetch("/api/reports", {
        method: "POST",
        body: JSON.stringify({
          conversationId: activeId,
          reason,
          details,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setToastMsg(data.message || "Couldn't submit report.");
        return;
      }

      setShowReportModal(false);
      setToastMsg("Report submitted — our team will review it");
    } catch (err) {
      console.error(err);
      setToastMsg("Couldn't reach the server. Please try again.");
    } finally {
      setReportBusy(false);
    }
  };

  // ─── NOT LOGGED IN / LOAD ERROR ───
  if (listError && !activeId) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-16 max-w-3xl mx-auto text-center">
        <MessageCircle className="size-10 text-[#211000]/20 mx-auto mb-3" />

        <p className="font-serif text-xl font-medium mb-1">{listError}</p>

        {!user?.token && (
          <Link
            href="/login"
            className="text-sm font-bold text-[#B66B44] hover:underline"
          >
            Log in
          </Link>
        )}
      </div>
    );
  }

  // ─── CONVERSATION LIST VIEW ───
  if (!activeId) {
    return (
      <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-10 max-w-3xl mx-auto">
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
            Messages
          </p>

          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mt-1">
            Conversations
          </h1>

          <p className="text-sm text-[#211000]/55 font-medium mt-1">
            All communication is monitored for your safety.
          </p>
        </div>

        <div className="mb-6 rounded-2xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-4 flex items-start gap-3">
          <ShieldCheck className="size-5 text-[#5F7161] shrink-0 mt-0.5" />

          <div className="text-xs text-[#211000]/65 leading-relaxed">
            <strong className="text-[#211000] font-bold">
              Protected messaging.
            </strong>{" "}
            Sharing phone numbers, emails, bank details, or suggesting
            off-platform deals is automatically blocked. Negotiate price freely
            — but every payment must go through Refurnish escrow.
          </div>
        </div>

        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#211000]/35" />

          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-full bg-white border border-[#211000]/8 pl-11 pr-4 py-3 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44] transition-colors"
          />
        </div>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-5">
          {[
            { id: "all", label: "All" },
            { id: "buying", label: "Buying" },
            { id: "selling", label: "Selling" },
          ].map((filter) => (
            <button
              key={filter.id}
              onClick={() =>
                setFilterStatus(
                  filter.id as "all" | "buying" | "selling"
                )
              }
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                filterStatus === filter.id
                  ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                  : "bg-white text-[#211000]/60 border-[#211000]/10 hover:border-[#211000]/25"
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>

        {loadingList ? (
          <div className="rounded-2xl bg-white border border-[#211000]/6 py-16 text-center text-sm text-[#211000]/50 font-medium">
            Loading conversations…
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#211000]/6 py-16 text-center">
            <MessageCircle className="size-10 text-[#211000]/20 mx-auto mb-3" />

            <p className="font-serif text-xl font-medium mb-1">
              No conversations
            </p>

            <p className="text-sm text-[#211000]/50 font-medium">
              Start browsing or selling to begin messaging.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conversation) => {
              const otherName =
                conversation.myRole === "buyer"
                  ? conversation.seller?.name
                  : conversation.buyer?.name;

              const lastMessage = conversation.messages?.[0];

              return (
                <button
                  key={conversation.id}
                  onClick={() => setActiveId(conversation.id)}
                  className="w-full text-left rounded-2xl bg-white border border-[#211000]/6 hover:border-[#B66B44]/25 hover:shadow-sm transition-all p-4 flex items-center gap-4"
                >
                  <div className="size-14 rounded-xl overflow-hidden bg-[#E8CEB0]/30 shrink-0">
                    {conversation.listing?.photos?.[0] && (
                      <img
                        src={conversation.listing.photos[0]}
                        alt={conversation.listing.itemTitle}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-bold">
                          {otherName || "Refurnish user"}
                        </p>

                        {conversation.offerStatus === "pending" && (
                          <span className="size-2 rounded-full bg-[#B66B44]" />
                        )}

                        {conversation.offerStatus === "accepted" && (
                          <span className="size-2 rounded-full bg-[#5F7161]" />
                        )}
                      </div>

                      <span className="text-[11px] text-[#211000]/40 font-medium whitespace-nowrap">
                        {lastMessage
                          ? timeAgo(lastMessage.createdAt)
                          : timeAgo(conversation.createdAt)}
                      </span>
                    </div>

                    <p className="text-xs text-[#211000]/45 font-medium mt-0.5 truncate">
                      {conversation.listing?.itemTitle}
                    </p>

                    <p className="text-xs text-[#211000]/60 font-medium mt-1 truncate">
                      {lastMessage?.text || "No messages yet"}
                    </p>
                  </div>

                  {conversation.unreadCount > 0 && (
                    <span className="size-5 rounded-full bg-[#B66B44] text-white text-[10px] font-bold grid place-items-center shrink-0">
                      {conversation.unreadCount}
                    </span>
                  )}

                  <ChevronRight className="size-4 text-[#211000]/20 shrink-0 hidden sm:block" />
                </button>
              );
            })}
          </div>
        )}
      </div>
    );
  }

  // ─── ACTIVE CHAT VIEW ───
  const otherName =
    activeConv?.myRole === "buyer"
      ? activeConv?.seller?.name
      : activeConv?.buyer?.name;

  const isBuyer = activeConv?.myRole === "buyer";

  const canMakeOffer =
    isBuyer &&
    !["pending", "accepted", "completed"].includes(activeConv?.offerStatus);

  const isSellerWithPendingOffer =
    !isBuyer && activeConv?.offerStatus === "pending";

  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col bg-[#FAF4EC]">
      <div className="shrink-0 bg-white border-b border-[#211000]/8 px-4 sm:px-6 py-3 flex items-center gap-3">
        <button
          onClick={closeConversation}
          className="size-9 rounded-full bg-[#FAF4EC] hover:bg-[#E8CEB0]/30 text-[#211000] flex items-center justify-center transition-colors shrink-0"
          title="Back to conversations"
        >
          <ArrowLeft className="size-4" />
        </button>

        <div className="size-10 rounded-xl overflow-hidden bg-[#E8CEB0]/30 shrink-0">
          {activeConv?.listing?.photos?.[0] && (
            <img
              src={activeConv.listing.photos[0]}
              alt=""
              className="w-full h-full object-cover"
            />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p className="text-sm font-bold truncate">
              {otherName || "Refurnish user"}
            </p>

            {activeConv?.listing?.status === "active" && (
              <Link
                href={`/product/${activeConv.listingId}`}
                className="text-[10px] font-bold bg-[#E8CEB0]/40 px-1.5 py-0.5 rounded text-[#211000]/60 hover:text-[#B66B44]"
              >
                View listing
              </Link>
            )}
          </div>

          <p className="text-[11px] text-[#211000]/45 truncate">
            {activeConv?.listing?.itemTitle}
          </p>
        </div>

        <button
          onClick={() => setShowReportModal(true)}
          className="size-9 rounded-full bg-[#FAF4EC] hover:bg-red-50 hover:text-red-500 grid place-items-center transition-colors"
          title="Report user"
        >
          <Flag className="size-4" />
        </button>
      </div>

      {/* Offer status banner */}
      {activeConv?.offerStatus === "pending" && (
        <div className="shrink-0 bg-[#B66B44]/8 border-b border-[#B66B44]/15 px-4 py-2.5 flex items-center justify-center gap-2 text-center">
          <HandCoins className="size-3.5 text-[#B66B44]" />

          <p className="text-[11px] font-bold text-[#B66B44]">
            Offer pending: {formatNaira(Number(activeConv.offerAmount))}
            {isBuyer ? " — waiting on seller" : " — respond below"}
          </p>
        </div>
      )}

      {activeConv?.offerStatus === "accepted" && (
        <div className="shrink-0 bg-[#5F7161]/8 border-b border-[#5F7161]/15 px-4 py-2.5 flex flex-col sm:flex-row items-center justify-center gap-2 text-center">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="size-3.5 text-[#5F7161]" />

            <p className="text-[11px] font-bold text-[#5F7161]">
              Offer accepted at{" "}
              {formatNaira(Number(activeConv.agreedPrice))}
            </p>
          </div>

          {isBuyer && (
            <button
              onClick={proceedToCheckout}
              className="inline-flex items-center gap-1.5 rounded-full bg-[#211000] text-[#FAF4EC] px-3 py-1.5 text-[10px] font-bold hover:bg-[#211000]/90 transition-colors"
            >
              Proceed to checkout
              <ArrowRight className="size-3" />
            </button>
          )}
        </div>
      )}

      {activeConv?.offerStatus === "completed" && (
        <div className="shrink-0 bg-[#5F7161]/8 border-b border-[#5F7161]/15 px-4 py-2.5 flex items-center justify-center gap-2 text-center">
          <CheckCircle2 className="size-3.5 text-[#5F7161]" />

          <p className="text-[11px] font-bold text-[#5F7161]">
            Order placed at {formatNaira(Number(activeConv.agreedPrice))} —
            you can coordinate pickup here.
          </p>
        </div>
      )}

      {activeConv?.offerStatus === "rejected" && (
        <div className="shrink-0 bg-red-50 border-b border-red-100 px-4 py-2.5 flex items-center justify-center gap-2">
          <Ban className="size-3.5 text-red-500" />

          <p className="text-[11px] font-bold text-red-600">
            Offer of {formatNaira(Number(activeConv.offerAmount))} was
            declined.
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#211000]/5 border border-[#211000]/8 px-3 py-1.5">
            <ShieldCheck className="size-3 text-[#5F7161]" />

            <span className="text-[10px] font-bold text-[#211000]/50">
              Messages are filtered for your protection
            </span>
          </div>
        </div>

        {loadingChat ? (
          <div className="flex justify-center py-10">
            <Loader2 className="size-6 animate-spin text-[#B66B44]" />
          </div>
        ) : (
          activeMessages.map((message) => {
            if (message.role === "system") {
              return (
                <div key={message.id} className="flex justify-center">
                  <div className="rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] px-4 py-2.5 text-center max-w-sm">
                    <p className="text-[11px] text-[#211000]/70 font-medium leading-relaxed">
                      {message.text}
                    </p>

                    <p className="text-[10px] text-[#211000]/40 font-medium mt-1">
                      {formatTime(message.createdAt)}
                    </p>
                  </div>
                </div>
              );
            }

            const isMe = message.role === activeConv?.myRole;
            const isOffer = message.type === "offer";

            return (
              <div
                key={message.id}
                className={`flex ${
                  isMe ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                    isOffer
                      ? "bg-[#B66B44]/10 border border-[#B66B44]/25 text-[#211000]"
                      : isMe
                        ? "rounded-tr-sm bg-[#211000] text-[#E8CEB0]"
                        : "rounded-tl-sm bg-white border border-[#211000]/8 text-[#211000]"
                  }`}
                >
                  {isOffer && (
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#B66B44] mb-1">
                      Offer
                    </p>
                  )}

                  <p className="text-sm leading-relaxed">
                    {message.text}
                  </p>

                  <p
                    className={`text-[10px] mt-1.5 font-medium ${
                      isMe && !isOffer
                        ? "text-[#E8CEB0]/50"
                        : "text-[#211000]/35"
                    }`}
                  >
                    {formatTime(message.createdAt)}
                  </p>
                </div>
              </div>
            );
          })
        )}

        <AnimatePresence>
          {blockedWarning && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 10 }}
              className="flex justify-center"
            >
              <div className="rounded-xl bg-red-50 border border-red-200 px-4 py-3 flex items-start gap-2.5 max-w-md">
                <Ban className="size-4 text-red-500 shrink-0 mt-0.5" />

                <div>
                  <p className="text-xs font-bold text-red-700">
                    {blockedWarning}
                  </p>

                  <p className="text-[10px] text-red-600/70 font-medium mt-1">
                    All deals must stay on Refurnish. Use escrow for
                    payments.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Seller: respond to pending offer */}
      {isSellerWithPendingOffer && (
        <div className="shrink-0 bg-white border-t border-[#211000]/8 px-4 py-3 flex items-center justify-center gap-3">
          <button
            onClick={() => respondToOffer("reject")}
            disabled={offerBusy}
            className="inline-flex items-center gap-1.5 rounded-full border border-red-200 text-red-500 px-4 py-2 text-xs font-bold hover:bg-red-50 transition-colors disabled:opacity-50"
          >
            <ThumbsDown className="size-3.5" />
            Decline
          </button>

          <button
            onClick={() => respondToOffer("accept")}
            disabled={offerBusy}
            className="inline-flex items-center gap-1.5 rounded-full bg-[#5F7161] text-white px-4 py-2 text-xs font-bold hover:bg-[#4d5c4f] transition-colors disabled:opacity-50"
          >
            <ThumbsUp className="size-3.5" />
            Accept offer
          </button>
        </div>
      )}

      {/* Buyer: make an offer */}
      {canMakeOffer && (
        <div className="shrink-0 bg-white border-t border-[#211000]/8 px-4 pt-3">
          <AnimatePresence>
            {offerOpen ? (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                className="flex items-center gap-2 pb-3"
              >
                <span className="text-sm font-bold text-[#211000]/50">
                  ₦
                </span>

                <input
                  type="number"
                  value={offerAmount}
                  onChange={(event) =>
                    setOfferAmount(event.target.value)
                  }
                  placeholder="Your offer amount"
                  className="flex-1 rounded-full bg-[#FAF4EC] border border-[#211000]/8 px-4 py-2.5 text-sm font-medium focus:outline-none focus:border-[#B66B44]"
                />

                <button
                  onClick={sendOffer}
                  disabled={offerBusy || !offerAmount}
                  className="rounded-full bg-[#B66B44] text-white px-4 py-2.5 text-xs font-bold hover:bg-[#a05934] transition-colors disabled:opacity-50"
                >
                  {offerBusy ? "Sending…" : "Send offer"}
                </button>

                <button
                  onClick={() => setOfferOpen(false)}
                  className="size-9 rounded-full hover:bg-[#211000]/5 grid place-items-center shrink-0"
                >
                  <X className="size-4 text-[#211000]/50" />
                </button>
              </motion.div>
            ) : (
              <button
                onClick={() => setOfferOpen(true)}
                className="mb-3 inline-flex items-center gap-1.5 rounded-full border border-[#B66B44]/30 text-[#B66B44] px-4 py-2 text-xs font-bold hover:bg-[#B66B44]/5 transition-colors"
              >
                <HandCoins className="size-3.5" />
                Make an offer
              </button>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Quick Replies */}
      <div className="shrink-0 bg-white border-t border-[#211000]/8 px-4 pt-3 pb-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/40 mb-2 px-1">
          Quick replies
        </p>

        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => sendText(reply, true)}
              disabled={sending}
              className="shrink-0 rounded-full bg-[#FAF4EC] border border-[#211000]/8 hover:border-[#B66B44]/30 hover:bg-[#E8CEB0]/30 px-4 py-2 text-[11px] font-bold transition-colors disabled:opacity-50"
            >
              {reply}
            </button>
          ))}
        </div>
      </div>

      {/* Composer */}
      <div className="shrink-0 bg-white border-t border-[#211000]/6 px-4 py-3 pb-5">
        <div className="flex items-end gap-2">
          <textarea
            rows={1}
            value={input}
            onChange={(event) => handleInputChange(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault();
                sendText(input);
              }
            }}
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all max-h-24"
          />

          <button
            onClick={() => sendText(input)}
            disabled={!input.trim() || !!blockedWarning || sending}
            className="size-11 rounded-full bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-40 disabled:cursor-not-allowed text-white grid place-items-center transition-colors shadow-sm"
          >
            {sending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Send className="size-4" />
            )}
          </button>
        </div>

        <p className="mt-2 text-[10px] text-[#211000]/35 font-medium px-1">
          Messages are scanned before sending. Off-platform contact and
          payments are blocked.
        </p>
      </div>

      <AnimatePresence>
        {showReportModal && (
          <ReportModal
            userName={otherName || "this user"}
            busy={reportBusy}
            onClose={() => setShowReportModal(false)}
            onSubmit={submitReport}
          />
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{
              opacity: 0,
              y: 20,
              x: "-50%",
            }}
            animate={{
              opacity: 1,
              y: 0,
              x: "-50%",
            }}
            exit={{
              opacity: 0,
              y: 20,
              x: "-50%",
            }}
            className="fixed bottom-6 left-1/2 z-[90] inline-flex items-center gap-2 bg-[#211000] text-[#FAF4EC] px-5 py-3 rounded-full shadow-2xl"
          >
            <CheckCircle2 className="size-4 text-[#5F7161]" />
            <span className="text-xs font-bold">{toastMsg}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function ReportModal({
  userName,
  busy,
  onClose,
  onSubmit,
}: {
  userName: string;
  busy: boolean;
  onClose: () => void;
  onSubmit: (reason: string, details: string) => void;
}) {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");

  const reasons = [
    "Trying to deal outside Refurnish",
    "Rude or abusive language",
    "Spam or irrelevant messages",
    "Fraudulent listing",
    "Other",
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center px-0 sm:px-4 bg-[#211000]/40 backdrop-blur-sm"
    >
      <motion.div
        initial={{
          opacity: 0,
          y: 40,
          scale: 0.97,
        }}
        animate={{
          opacity: 1,
          y: 0,
          scale: 1,
        }}
        exit={{
          opacity: 0,
          y: 40,
          scale: 0.97,
        }}
        transition={{
          type: "spring",
          stiffness: 280,
          damping: 28,
        }}
        className="relative w-full sm:max-w-md bg-[#FAF4EC] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#211000]/10 p-6 sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 size-9 rounded-full hover:bg-[#211000]/5 grid place-items-center"
        >
          <X className="size-4 text-[#211000]/60" />
        </button>

        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
            <Flag className="size-7 text-red-500" />
          </div>

          <h3 className="font-serif text-2xl font-medium tracking-tight">
            Report {userName}
          </h3>

          <p className="text-sm text-[#211000]/55 font-medium mt-1">
            Help us keep Refurnish safe for everyone.
          </p>
        </div>

        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
              Reason *
            </label>

            <div className="grid gap-2">
              {reasons.map((reportReason) => (
                <button
                  key={reportReason}
                  onClick={() => setReason(reportReason)}
                  className={`text-left text-xs font-bold px-3 py-2.5 rounded-xl border transition-all ${
                    reason === reportReason
                      ? "bg-[#c0392b]/8 border-[#c0392b]/25 text-[#c0392b]"
                      : "bg-white border-[#211000]/8 hover:border-[#211000]/20"
                  }`}
                >
                  {reportReason}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
              Details (optional)
            </label>

            <textarea
              rows={3}
              value={details}
              onChange={(event) => setDetails(event.target.value)}
              placeholder="Add any specific details..."
              className="w-full rounded-xl bg-white border border-[#211000]/10 px-3 py-2.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] resize-none"
            />
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 rounded-full border border-[#211000]/10 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#E8CEB0]/20 transition-colors"
          >
            Cancel
          </button>

          <button
            onClick={() => onSubmit(reason, details)}
            disabled={!reason || busy}
            className="flex-1 rounded-full bg-[#c0392b] hover:bg-[#a93226] disabled:opacity-50 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            {busy ? "Submitting…" : "Submit report"}
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function MessagesPage() {
  return (
    <Suspense
      fallback={
        <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-16 max-w-3xl mx-auto text-center">
          <Loader2 className="size-6 animate-spin text-[#B66B44] mx-auto" />
        </div>
      }
    >
      <MessagesPageContent />
    </Suspense>
  );
}