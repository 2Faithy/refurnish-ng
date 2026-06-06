"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Search,
  Send,
  ShieldCheck,
  AlertTriangle,
  CheckCircle2,
  Clock,
  MoreVertical,
  Flag,
  Phone,
  Mail,
  Ban,
  ChevronRight,
  ImageIcon,
  Package,
  Lock,
  X,
  MessageCircle,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

const CONVERSATIONS_KEY = "refurnish_conversations";
const MESSAGES_KEY = "refurnish_chat_messages";

// ─── MOCK DATA ───
const MOCK_CONVERSATIONS = [
  {
    id: "conv-1",
    participantName: "Adaeze",
    participantRole: "seller",
    avatar: "",
    itemTitle: "Beni Linen Three-Seater Sofa",
    itemImage:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=200&q=80",
    itemPrice: 285000,
    orderId: "RF-ORD-ABC123",
    escrowStatus: "funds_held",
    lastMessage: "The sofa is ready for pickup whenever you are.",
    lastMessageTime: "10 min ago",
    unreadCount: 2,
  },
  {
    id: "conv-2",
    participantName: "Tunde",
    participantRole: "buyer",
    avatar: "",
    itemTitle: "Oak Round Dining Set",
    itemImage:
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=200&q=80",
    itemPrice: 195000,
    orderId: "RF-ORD-XYZ789",
    escrowStatus: "released",
    lastMessage: "Thanks for the smooth transaction!",
    lastMessageTime: "2 hours ago",
    unreadCount: 0,
  },
  {
    id: "conv-3",
    participantName: "Chiamaka",
    participantRole: "seller",
    avatar: "",
    itemTitle: "Curved Rattan Accent Chair",
    itemImage:
      "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=200&q=80",
    itemPrice: 78000,
    orderId: null,
    escrowStatus: null,
    lastMessage: "Is this still available?",
    lastMessageTime: "Yesterday",
    unreadCount: 1,
  },
];

const MOCK_MESSAGES: Record<string, any[]> = {
  "conv-1": [
    {
      id: "m1",
      role: "them",
      text: "Hi! Thanks for your interest in the Beni Linen Sofa. It's in excellent condition.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
    {
      id: "m2",
      role: "me",
      text: "Great! Is the price negotiable?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60).toISOString(),
    },
    {
      id: "m3",
      role: "them",
      text: "I can do ₦270,000 if we complete through Refurnish escrow today.",
      createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    },
    {
      id: "m4",
      role: "me",
      text: "Deal. Let's do it through the platform.",
      createdAt: new Date(Date.now() - 1000 * 60 * 15).toISOString(),
    },
    {
      id: "m5",
      role: "system",
      text: "Order RF-ORD-ABC123 created. Payment is now held in escrow.",
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
    {
      id: "m6",
      role: "them",
      text: "The sofa is ready for pickup whenever you are.",
      createdAt: new Date(Date.now() - 1000 * 60 * 10).toISOString(),
    },
  ],
  "conv-2": [
    {
      id: "m1",
      role: "me",
      text: "Hello, is the dining set still available?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(),
    },
    {
      id: "m2",
      role: "them",
      text: "Yes it is! I can deliver to Yaba this weekend.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 4).toISOString(),
    },
    {
      id: "m3",
      role: "system",
      text: "Order RF-ORD-XYZ789 completed. Escrow released to seller.",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 3).toISOString(),
    },
    {
      id: "m4",
      role: "them",
      text: "Thanks for the smooth transaction!",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(),
    },
  ],
  "conv-3": [
    {
      id: "m1",
      role: "them",
      text: "Hi! I saw your Curved Rattan Chair. Is this still available?",
      createdAt: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(),
    },
  ],
};

// ─── QUICK REPLIES ───
const BUYER_QUICK_REPLIES = [
  "Is this still available?",
  "Can you share more photos?",
  "What's the exact condition?",
  "I'm ready to buy through Refurnish escrow",
  "Can you deliver to my location?",
  "Is the price negotiable?",
  "Does it come with all original parts?",
  "When can I inspect it?",
];

const SELLER_QUICK_REPLIES = [
  "Yes, it's still available!",
  "I can share more details",
  "Price is slightly negotiable",
  "Let's complete this through Refurnish",
  "I can arrange delivery",
  "The item is exactly as described",
  "When would you like to inspect it?",
  "Thanks for your interest!",
];

// ─── CONTENT FILTER ───
const BLOCKED_PATTERNS = [
  { regex: /\b0[7-9][01]\d{8}\b/, label: "phone number" },
  { regex: /\+234[7-9][01]\d{8,9}\b/, label: "phone number" },
  { regex: /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/, label: "email address" },
  { regex: /https?:\/\/|www\.|\.com\b|\.ng\b|\.org\b/, label: "website link" },
  { regex: /\b(account number|acct no|sort code|routing number|bank name)\b/i, label: "bank details" },
  { regex: /\b(whatsapp|telegram|instagram dm|twitter dm|tiktok dm)\b/i, label: "social contact" },
  { regex: /\b(call me|text me|reach me on|contact me on|hit me up)\b/i, label: "off-platform contact" },
  { regex: /\b(pay directly|pay offline|outside platform|skip escrow|avoid refurnish|cash payment|direct transfer)\b/i, label: "off-platform payment" },
];

function scanMessage(text: string): { clean: boolean; violations: string[] } {
  const violations: string[] = [];
  for (const pattern of BLOCKED_PATTERNS) {
    if (pattern.regex.test(text)) {
      violations.push(pattern.label);
    }
  }
  return { clean: violations.length === 0, violations: [...new Set(violations)] };
}

function formatTime(iso: string) {
  return new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

export default function MessagesPage() {
  const [conversations, setConversations] = useState<any[]>([]);
  const [messages, setMessages] = useState<Record<string, any[]>>({});
  const [activeId, setActiveId] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [input, setInput] = useState("");
  const [filterStatus, setFilterStatus] = useState<"all" | "buying" | "selling">("all");
  const [blockedWarning, setBlockedWarning] = useState("");
  const [showReportModal, setShowReportModal] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Load data
  useEffect(() => {
    try {
      const c = localStorage.getItem(CONVERSATIONS_KEY);
      const m = localStorage.getItem(MESSAGES_KEY);
      if (c) {
        setConversations(JSON.parse(c));
      } else {
        setConversations(MOCK_CONVERSATIONS);
        localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(MOCK_CONVERSATIONS));
      }
      if (m) {
        setMessages(JSON.parse(m));
      } else {
        setMessages(MOCK_MESSAGES);
        localStorage.setItem(MESSAGES_KEY, JSON.stringify(MOCK_MESSAGES));
      }
    } catch {
      setConversations(MOCK_CONVERSATIONS);
      setMessages(MOCK_MESSAGES);
    }
  }, []);

  // Scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, activeId]);

  const activeConv = useMemo(
    () => conversations.find((c) => c.id === activeId),
    [conversations, activeId]
  );

  const activeMessages = useMemo(
    () => (activeId ? messages[activeId] || [] : []),
    [messages, activeId]
  );

  const filteredConversations = useMemo(() => {
    let list = [...conversations];
    if (filterStatus !== "all") {
      list = list.filter((c) =>
        filterStatus === "buying" ? c.participantRole === "seller" : c.participantRole === "buyer"
      );
    }
    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (c) =>
          c.participantName.toLowerCase().includes(q) ||
          c.itemTitle.toLowerCase().includes(q)
      );
    }
    return list;
  }, [conversations, filterStatus, search]);

  const quickReplies = useMemo(() => {
    if (!activeConv) return [];
    return activeConv.participantRole === "seller" ? BUYER_QUICK_REPLIES : SELLER_QUICK_REPLIES;
  }, [activeConv]);

  const handleInputChange = (text: string) => {
    setInput(text);
    if (text.length > 5) {
      const scan = scanMessage(text);
      if (!scan.clean) {
        setBlockedWarning(
          `For your safety, sharing ${scan.violations.join(", ")} is not allowed. Keep all transactions on Refurnish.`
        );
      } else {
        setBlockedWarning("");
      }
    } else {
      setBlockedWarning("");
    }
  };

  const sendMessage = (text: string, isQuickReply = false) => {
    if (!activeId || !text.trim()) return;

    const scan = scanMessage(text);
    if (!scan.clean && !isQuickReply) {
      setBlockedWarning(
        `Message blocked: ${scan.violations.join(", ")} detected.`
      );
      return;
    }

    const newMsg = {
      id: `m-${Date.now()}`,
      role: "me",
      text: text.trim(),
      createdAt: new Date().toISOString(),
    };

    const updated = {
      ...messages,
      [activeId]: [...(messages[activeId] || []), newMsg],
    };

    setMessages(updated);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(updated));
    setInput("");
    setBlockedWarning("");

    // Update last message preview
    const updatedConvs = conversations.map((c) =>
      c.id === activeId
        ? { ...c, lastMessage: newMsg.text, lastMessageTime: "Just now", unreadCount: 0 }
        : c
    );
    setConversations(updatedConvs);
    localStorage.setItem(CONVERSATIONS_KEY, JSON.stringify(updatedConvs));
  };

  if (!activeId) {
    // ─── CONVERSATION LIST VIEW ───
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

        {/* Escrow notice */}
        <div className="mb-6 rounded-2xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-4 flex items-start gap-3">
          <ShieldCheck className="size-5 text-[#5F7161] shrink-0 mt-0.5" />
          <div className="text-xs text-[#211000]/65 leading-relaxed">
            <strong className="text-[#211000] font-bold">
              Protected messaging.
            </strong>{" "}
            Sharing phone numbers, emails, bank details, or suggesting off-platform deals is automatically blocked. All payments must go through Refurnish escrow.
          </div>
        </div>

        {/* Search */}
        <div className="relative mb-4">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#211000]/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search conversations..."
            className="w-full rounded-full bg-white border border-[#211000]/8 pl-11 pr-4 py-3 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44] transition-colors"
          />
        </div>

        {/* Filters */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-5">
          {[
            { id: "all", label: "All" },
            { id: "buying", label: "Buying" },
            { id: "selling", label: "Selling" },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterStatus(f.id as any)}
              className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                filterStatus === f.id
                  ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                  : "bg-white text-[#211000]/60 border-[#211000]/10 hover:border-[#211000]/25"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* List */}
        {filteredConversations.length === 0 ? (
          <div className="rounded-2xl bg-white border border-[#211000]/6 py-16 text-center">
            <MessageCircle className="size-10 text-[#211000]/20 mx-auto mb-3" />
            <p className="font-serif text-xl font-medium mb-1">No conversations</p>
            <p className="text-sm text-[#211000]/50 font-medium">
              Start browsing or selling to begin messaging.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {filteredConversations.map((conv) => (
              <button
                key={conv.id}
                onClick={() => setActiveId(conv.id)}
                className="w-full text-left rounded-2xl bg-white border border-[#211000]/6 hover:border-[#B66B44]/25 hover:shadow-sm transition-all p-4 flex items-center gap-4"
              >
                <div className="size-14 rounded-xl overflow-hidden bg-[#E8CEB0]/30 shrink-0">
                  <img
                    src={conv.itemImage}
                    alt={conv.itemTitle}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold">{conv.participantName}</p>
                      {conv.escrowStatus === "funds_held" && (
                        <span className="size-2 rounded-full bg-[#B66B44]" />
                      )}
                    </div>
                    <span className="text-[11px] text-[#211000]/40 font-medium whitespace-nowrap">
                      {conv.lastMessageTime}
                    </span>
                  </div>

                  <p className="text-xs text-[#211000]/45 font-medium mt-0.5 truncate">
                    {conv.itemTitle}
                  </p>

                  <p className="text-xs text-[#211000]/60 font-medium mt-1 truncate">
                    {conv.lastMessage}
                  </p>
                </div>

                {conv.unreadCount > 0 && (
                  <span className="size-5 rounded-full bg-[#B66B44] text-white text-[10px] font-bold grid place-items-center shrink-0">
                    {conv.unreadCount}
                  </span>
                )}

                <ChevronRight className="size-4 text-[#211000]/20 shrink-0 hidden sm:block" />
              </button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ─── ACTIVE CHAT VIEW ───
  return (
    <div className="h-[calc(100vh-64px)] lg:h-screen flex flex-col bg-[#FAF4EC]">
      {/* Chat Header */}
<div className="shrink-0 bg-white border-b border-[#211000]/8 px-4 sm:px-6 py-3 flex items-center gap-3">
  {/* Back button is now visible on all screen sizes */}
  <button
    onClick={() => setActiveId(null)}
    className="size-9 rounded-full bg-[#FAF4EC] hover:bg-[#E8CEB0]/30 text-[#211000] flex items-center justify-center transition-colors shrink-0"
    title="Back to conversations"
  >
    <ArrowLeft className="size-4" />
  </button>

  <div className="size-10 rounded-xl overflow-hidden bg-[#E8CEB0]/30 shrink-0">
    <img
      src={activeConv.itemImage}
      alt=""
      className="w-full h-full object-cover"
    />
  </div>

  <div className="flex-1 min-w-0">
    <div className="flex items-center gap-2">
      <p className="text-sm font-bold truncate">{activeConv.participantName}</p>
      {activeConv.orderId && (
        <Link
          href={`/dashboard/orders/${activeConv.orderId}`}
          className="text-[10px] font-bold bg-[#E8CEB0]/40 px-1.5 py-0.5 rounded text-[#211000]/60 hover:text-[#B66B44]"
        >
          {activeConv.orderId}
        </Link>
      )}
    </div>
    <p className="text-[11px] text-[#211000]/45 truncate">{activeConv.itemTitle}</p>
  </div>

  <button
    onClick={() => setShowReportModal(true)}
    className="size-9 rounded-full bg-[#FAF4EC] hover:bg-red-50 hover:text-red-500 grid place-items-center transition-colors"
    title="Report user"
  >
    <Flag className="size-4" />
  </button>
</div>

      {/* Escrow Banner */}
      {activeConv.escrowStatus === "funds_held" && (
        <div className="shrink-0 bg-[#B66B44]/8 border-b border-[#B66B44]/15 px-4 py-2.5 flex items-center justify-center gap-2">
          <Lock className="size-3.5 text-[#B66B44]" />
          <p className="text-[11px] font-bold text-[#B66B44]">
            Escrow active: Payment held until delivery confirmed
          </p>
        </div>
      )}
      {activeConv.escrowStatus === "released" && (
        <div className="shrink-0 bg-[#5F7161]/8 border-b border-[#5F7161]/15 px-4 py-2.5 flex items-center justify-center gap-2">
          <CheckCircle2 className="size-3.5 text-[#5F7161]" />
          <p className="text-[11px] font-bold text-[#5F7161]">
            Transaction completed
          </p>
        </div>
      )}

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-4 space-y-4">
        {/* Safety reminder */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-2 rounded-full bg-[#211000]/5 border border-[#211000]/8 px-3 py-1.5">
            <ShieldCheck className="size-3 text-[#5F7161]" />
            <span className="text-[10px] font-bold text-[#211000]/50">
              Messages are filtered for your protection
            </span>
          </div>
        </div>

        {activeMessages.map((msg) => {
          if (msg.role === "system") {
            return (
              <div key={msg.id} className="flex justify-center">
                <div className="rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] px-4 py-2.5 text-center max-w-sm">
                  <p className="text-[11px] text-[#211000]/70 font-medium leading-relaxed">
                    {msg.text}
                  </p>
                  <p className="text-[10px] text-[#211000]/40 font-medium mt-1">
                    {formatTime(msg.createdAt)}
                  </p>
                </div>
              </div>
            );
          }

          const isMe = msg.role === "me";

          return (
            <div key={msg.id} className={`flex ${isMe ? "justify-end" : "justify-start"}`}>
              <div
                className={`max-w-[85%] sm:max-w-[70%] rounded-2xl px-4 py-3 ${
                  isMe
                    ? "rounded-tr-sm bg-[#211000] text-[#E8CEB0]"
                    : "rounded-tl-sm bg-white border border-[#211000]/8 text-[#211000]"
                }`}
              >
                <p className="text-sm leading-relaxed">{msg.text}</p>
                <p
                  className={`text-[10px] mt-1.5 font-medium ${
                    isMe ? "text-[#E8CEB0]/50" : "text-[#211000]/35"
                  }`}
                >
                  {formatTime(msg.createdAt)}
                </p>
              </div>
            </div>
          );
        })}

        {/* Blocked warning */}
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
                  <p className="text-xs font-bold text-red-700">{blockedWarning}</p>
                  <p className="text-[10px] text-red-600/70 font-medium mt-1">
                    All deals must stay on Refurnish. Use escrow for payments.
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div ref={bottomRef} />
      </div>

      {/* Quick Replies */}
      <div className="shrink-0 bg-white border-t border-[#211000]/8 px-4 pt-3 pb-1">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/40 mb-2 px-1">
          Quick replies
        </p>
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2">
          {quickReplies.map((reply) => (
            <button
              key={reply}
              onClick={() => sendMessage(reply, true)}
              className="shrink-0 rounded-full bg-[#FAF4EC] border border-[#211000]/8 hover:border-[#B66B44]/30 hover:bg-[#E8CEB0]/30 px-4 py-2 text-[11px] font-bold transition-colors"
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
            onChange={(e) => handleInputChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                sendMessage(input);
              }
            }}
            placeholder="Type a message..."
            className="flex-1 resize-none rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all max-h-24"
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || !!blockedWarning}
            className="size-11 rounded-full bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-40 disabled:cursor-not-allowed text-white grid place-items-center transition-colors shadow-sm"
          >
            <Send className="size-4" />
          </button>
        </div>
        <p className="mt-2 text-[10px] text-[#211000]/35 font-medium px-1">
          Custom messages are scanned. Quick replies are always safe.
        </p>
      </div>

      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <ReportModal
            userName={activeConv.participantName}
            onClose={() => setShowReportModal(false)}
            onSubmit={() => {
              setShowReportModal(false);
              // Would send to backend
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

function ReportModal({
  userName,
  onClose,
  onSubmit,
}: {
  userName: string;
  onClose: () => void;
  onSubmit: () => void;
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
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
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
              {reasons.map((r) => (
                <button
                  key={r}
                  onClick={() => setReason(r)}
                  className={`text-left text-xs font-bold px-3 py-2.5 rounded-xl border transition-all ${
                    reason === r
                      ? "bg-[#c0392b]/8 border-[#c0392b]/25 text-[#c0392b]"
                      : "bg-white border-[#211000]/8 hover:border-[#211000]/20"
                  }`}
                >
                  {r}
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
              onChange={(e) => setDetails(e.target.value)}
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
            onClick={onSubmit}
            disabled={!reason}
            className="flex-1 rounded-full bg-[#c0392b] hover:bg-[#a93226] disabled:opacity-50 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Submit report
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
}