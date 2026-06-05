"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Send,
  Paperclip,
  X,
  MessageCircle,
  Bot,
  User,
  ShieldCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  Headphones,
  Package,
  CreditCard,
  Truck,
  RefreshCcw,
  FileText,
  ChevronDown,
  Copy,
  Trash2,
  ImageIcon,
  Search,
  Lock,
  Sparkles,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

type MessageRole = "user" | "agent" | "system";

type Attachment = {
  id: string;
  name: string;
  type: string;
  size: number;
  url: string;
};

type ChatMessage = {
  id: string;
  role: MessageRole;
  text: string;
  createdAt: string;
  attachments?: Attachment[];
  quickReplies?: string[];
};

type SupportTicket = {
  id: string;
  topic: string;
  orderId?: string;
  status: "open" | "waiting_for_agent" | "resolved";
  createdAt: string;
};

const MESSAGES_KEY = "refurnish_support_messages";
const TICKET_KEY = "refurnish_support_ticket";
const ORDERS_KEY = "refurnish_orders";

const SUPPORT_TOPICS = [
  {
    id: "escrow",
    title: "Escrow protection",
    desc: "Payment release, received item, seller payout",
    icon: ShieldCheck,
  },
  {
    id: "refund",
    title: "Refund / dispute",
    desc: "Item not as described, damaged item, return request",
    icon: RefreshCcw,
  },
  {
    id: "payment",
    title: "Payment issue",
    desc: "Bank transfer receipt, card payment, payment reference",
    icon: CreditCard,
  },
  {
    id: "delivery",
    title: "Delivery / pickup",
    desc: "Logistics partner, pickup address, delivery updates",
    icon: Truck,
  },
  {
    id: "order",
    title: "Order support",
    desc: "Track order, update contact info, seller details",
    icon: Package,
  },
  {
    id: "general",
    title: "General question",
    desc: "Anything else you need help with",
    icon: MessageCircle,
  },
];

const FAQS = [
  {
    q: "When is money released to the seller?",
    a: "Funds are released when the buyer confirms delivery/pickup, or automatically after the protection window if no dispute is raised.",
  },
  {
    q: "What if the buyer never clicks received?",
    a: "Seller protection applies. If there is delivery proof and no dispute, Refurnish can automatically release funds after the protection window.",
  },
  {
    q: "Can I request a refund?",
    a: "Yes. If the item is not as described, damaged, or missing parts, open a dispute and upload photos within the refund window.",
  },
  {
    q: "How do bank transfers get confirmed?",
    a: "Use your payment reference in the transfer narration, upload your receipt, and our team verifies it before notifying the seller.",
  },
];

function makeId(prefix = "id") {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return `${prefix}-${crypto.randomUUID()}`;
  }

  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function makeTicketId() {
  return `RF-SUP-${Date.now().toString(36).toUpperCase()}`;
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function shorten(text: string, count = 36) {
  return text.length > count ? `${text.slice(0, count)}…` : text;
}

export default function SupportPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [orders, setOrders] = useState<any[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("escrow");
  const [input, setInput] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [agentTyping, setAgentTyping] = useState(false);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [toast, setToast] = useState("");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [searchOrders, setSearchOrders] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const selectedOrder = useMemo(() => {
    return orders.find((order) => order.id === selectedOrderId);
  }, [orders, selectedOrderId]);

  const filteredOrders = useMemo(() => {
    if (!searchOrders.trim()) return orders;

    const q = searchOrders.toLowerCase();

    return orders.filter((order) => {
      const id = String(order.id || "").toLowerCase();
      const ref = String(order.paymentReference || "").toLowerCase();
      const status = String(order.status || "").toLowerCase();

      return id.includes(q) || ref.includes(q) || status.includes(q);
    });
  }, [orders, searchOrders]);

  useEffect(() => {
    try {
      const storedMessages = localStorage.getItem(MESSAGES_KEY);
      const storedTicket = localStorage.getItem(TICKET_KEY);
      const storedOrders = localStorage.getItem(ORDERS_KEY);

      if (storedOrders) {
        const parsedOrders = JSON.parse(storedOrders);
        setOrders(parsedOrders.reverse());
        if (parsedOrders.length > 0) {
          setSelectedOrderId(parsedOrders[0].id);
        }
      }

      if (storedTicket) {
        setTicket(JSON.parse(storedTicket));
      }

      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      } else {
        setMessages([
          {
            id: makeId("msg"),
            role: "agent",
            text: "Hi, welcome to Refurnish Support. I can help with escrow, refunds, payment verification, delivery, pickup, and order issues. What would you like help with today?",
            createdAt: new Date().toISOString(),
            quickReplies: [
              "I need escrow help",
              "Open dispute ticket",
              "Payment receipt issue",
              "Delivery or pickup help",
            ],
          },
        ]);
      }
    } catch {
      setMessages([
        {
          id: makeId("msg"),
          role: "agent",
          text: "Hi, welcome to Refurnish Support. How can we help today?",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const generateAgentResponse = (text: string): ChatMessage => {
    const lower = text.toLowerCase();

    let reply =
      "Thanks for sharing that. I’ve noted the details. If this is related to an order, please select the order on the left so our team can investigate faster.";
    let quickReplies = ["Create support ticket", "Upload evidence", "Talk to an agent"];

    if (
      lower.includes("refund") ||
      lower.includes("dispute") ||
      lower.includes("not as described") ||
      lower.includes("damaged")
    ) {
      reply =
        "I’m sorry about that. For refund/dispute cases, please upload clear photos or videos showing the issue, the delivery condition, and any visible defects. We can freeze escrow while support reviews the case.";
      quickReplies = ["Open dispute ticket", "Upload evidence", "Refund policy"];
    } else if (
      lower.includes("receipt") ||
      lower.includes("transfer") ||
      lower.includes("payment") ||
      lower.includes("bank")
    ) {
      reply =
        "For bank transfers, please make sure your transfer narration includes your payment reference. Upload your receipt here if you haven’t already. Our team usually verifies receipts within 1–2 hours.";
      quickReplies = ["Upload receipt", "Create support ticket", "Payment reference help"];
    } else if (
      lower.includes("delivery") ||
      lower.includes("logistics") ||
      lower.includes("pickup") ||
      lower.includes("address")
    ) {
      reply =
        "For home delivery, our logistics partner coordinates pickup from the seller and delivery to you. For self-pickup, the seller/pickup location is shared after payment confirmation to keep both parties protected.";
      quickReplies = ["Track delivery", "Pickup location help", "Talk to an agent"];
    } else if (
      lower.includes("received") ||
      lower.includes("release") ||
      lower.includes("seller payout") ||
      lower.includes("escrow")
    ) {
      reply =
        "Escrow funds are released to the seller only after the buyer confirms delivery/pickup, or automatically after the protection window if no dispute is raised. If there is an issue, open a dispute before the window closes.";
      quickReplies = ["Confirm received", "Open dispute ticket", "Escrow policy"];
    } else if (
      lower.includes("agent") ||
      lower.includes("human") ||
      lower.includes("support")
    ) {
      reply =
        "I can connect you with a Refurnish support agent. Creating a ticket helps us attach this conversation to your selected order and preserve the transcript.";
      quickReplies = ["Create support ticket", "Upload evidence", "Continue chatting"];
    }

    return {
      id: makeId("msg"),
      role: "agent",
      text: reply,
      createdAt: new Date().toISOString(),
      quickReplies,
    };
  };

  const sendMessage = async (overrideText?: string) => {
    const text = typeof overrideText === "string" ? overrideText : input.trim();

    if (!text && pendingAttachments.length === 0) return;

    const userMessage: ChatMessage = {
      id: makeId("msg"),
      role: "user",
      text: text || "Uploaded attachment",
      createdAt: new Date().toISOString(),
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPendingAttachments([]);

    setAgentTyping(true);

    setTimeout(() => {
      const agentReply = generateAgentResponse(text);
      setMessages((prev) => [...prev, agentReply]);
      setAgentTyping(false);
    }, 900);
  };

  const createTicket = (topicLabel?: string) => {
    if (ticket) {
      setToast("This chat is already attached to a support ticket");
      setMessages((prev) => [
        ...prev,
        {
          id: makeId("msg"),
          role: "system",
          text: `Existing ticket: ${ticket.id}`,
          createdAt: new Date().toISOString(),
        },
      ]);
      return;
    }

    const topic =
      topicLabel ||
      SUPPORT_TOPICS.find((t) => t.id === selectedTopic)?.title ||
      "General support";

    const newTicket: SupportTicket = {
      id: makeTicketId(),
      topic,
      orderId: selectedOrderId || undefined,
      status: "open",
      createdAt: new Date().toISOString(),
    };

    setTicket(newTicket);
    localStorage.setItem(TICKET_KEY, JSON.stringify(newTicket));

    setMessages((prev) => [
      ...prev,
      {
        id: makeId("msg"),
        role: "system",
        text: `Support ticket created: ${newTicket.id}`,
        createdAt: new Date().toISOString(),
      },
      {
        id: makeId("msg"),
        role: "agent",
        text: `Your ticket ${newTicket.id} is open. A Refurnish support specialist will review this conversation${
          selectedOrderId ? ` and order ${selectedOrderId}` : ""
        }. You can continue sending messages, receipts, photos, or evidence here.`,
        createdAt: new Date().toISOString(),
        quickReplies: ["Upload evidence", "Add more details", "View orders"],
      },
    ]);

    setToast("Support ticket created");
  };

  const handleQuickReply = (reply: string) => {
    const lower = reply.toLowerCase();

    if (lower.includes("open dispute")) {
      setSelectedTopic("refund");
      createTicket("Refund / dispute");
      return;
    }

    if (lower.includes("create support ticket") || lower.includes("talk to an agent")) {
      createTicket();
      return;
    }

    if (
      lower.includes("upload evidence") ||
      lower.includes("upload receipt") ||
      lower.includes("receipt")
    ) {
      fileInputRef.current?.click();
      return;
    }

    if (lower.includes("view orders") || lower.includes("track")) {
      setToast("Use the order selector to choose the order you need help with");
      return;
    }

    if (lower.includes("refund policy")) {
      sendMessage("Please explain the refund policy.");
      return;
    }

    if (lower.includes("escrow policy")) {
      sendMessage("Please explain how escrow protection works.");
      return;
    }

    sendMessage(reply);
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = 3 - pendingAttachments.length;
    const selectedFiles = files.slice(0, remaining);

    selectedFiles.forEach((file) => {
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

      if (!validTypes.includes(file.type)) {
        setToast("Only JPG, PNG, or PDF files are allowed");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        setToast("Each file must be under 5MB");
        return;
      }

      const reader = new FileReader();

      reader.onload = (event) => {
        const attachment: Attachment = {
          id: makeId("att"),
          name: file.name,
          type: file.type,
          size: file.size,
          url: String(event.target?.result || ""),
        };

        setPendingAttachments((prev) => [...prev, attachment]);
      };

      reader.readAsDataURL(file);
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) => prev.filter((file) => file.id !== id));
  };

  const clearChat = () => {
    const starter: ChatMessage[] = [
      {
        id: makeId("msg"),
        role: "agent",
        text: "Chat cleared. How can we help you today?",
        createdAt: new Date().toISOString(),
        quickReplies: [
          "I need escrow help",
          "Open dispute ticket",
          "Payment receipt issue",
          "Delivery or pickup help",
        ],
      },
    ];

    setMessages(starter);
    setTicket(null);
    localStorage.removeItem(TICKET_KEY);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(starter));
    setToast("Chat cleared");
  };

  const copyTicketId = () => {
    if (!ticket) return;
    navigator.clipboard.writeText(ticket.id);
    setToast("Ticket ID copied");
  };

  const copyOrderId = () => {
    if (!selectedOrderId) return;
    navigator.clipboard.writeText(selectedOrderId);
    setToast("Order ID copied");
  };

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased pt-28 sm:pt-32 lg:pt-40 pb-24 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/50 hover:text-[#B66B44] transition-colors mb-5"
          >
            <ArrowLeft className="size-4" />
            Back to shop
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
                Live Support
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight mt-2 leading-tight">
                We’re here to help.
              </h1>
              <p className="text-sm text-[#211000]/55 font-medium mt-2 max-w-xl">
                Chat with Refurnish support for escrow, refunds, delivery, pickup, payment verification, and order issues.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#5F7161]/10 border border-[#5F7161]/20 px-4 py-2">
              <span className="size-2 rounded-full bg-[#5F7161] animate-pulse" />
              <span className="text-xs font-bold text-[#5F7161]">
                Support online
              </span>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Sidebar */}
          <aside className="lg:col-span-4 space-y-5">
            {/* Ticket card */}
            <div className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                    Conversation
                  </p>
                  <h2 className="font-serif text-xl font-medium mt-1">
                    {ticket ? "Ticket active" : "No ticket yet"}
                  </h2>
                </div>

                <button
                  onClick={clearChat}
                  className="size-9 rounded-full bg-[#FAF4EC] border border-[#211000]/8 hover:bg-red-50 hover:text-red-500 transition-colors grid place-items-center"
                  aria-label="Clear chat"
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {ticket ? (
                <div className="mt-4 rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[10px] uppercase tracking-wider text-[#211000]/45 font-bold">
                        Ticket ID
                      </p>
                      <p className="font-mono text-xs font-bold mt-0.5">
                        {ticket.id}
                      </p>
                    </div>

                    <button
                      onClick={copyTicketId}
                      className="size-8 rounded-full bg-white border border-[#211000]/8 hover:text-[#B66B44] transition-colors grid place-items-center"
                    >
                      <Copy className="size-3.5" />
                    </button>
                  </div>

                  <div className="mt-3 flex items-center justify-between text-xs">
                    <span className="text-[#211000]/50 font-medium">
                      Status
                    </span>
                    <span className="font-bold text-[#5F7161] capitalize">
                      {ticket.status.replaceAll("_", " ")}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={() => createTicket()}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-[#B66B44]/15"
                >
                  <Headphones className="size-4" />
                  Create support ticket
                </button>
              )}
            </div>

            {/* Order selector */}
            <div className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-5">
              <div className="flex items-start justify-between gap-4 mb-4">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                    Related order
                  </p>
                  <h2 className="font-serif text-xl font-medium mt-1">
                    Attach an order
                  </h2>
                </div>

                {selectedOrderId && (
                  <button
                    onClick={copyOrderId}
                    className="size-9 rounded-full bg-[#FAF4EC] border border-[#211000]/8 hover:text-[#B66B44] transition-colors grid place-items-center"
                  >
                    <Copy className="size-4" />
                  </button>
                )}
              </div>

              {orders.length === 0 ? (
                <div className="rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 p-4 text-center">
                  <Package className="size-6 text-[#211000]/35 mx-auto mb-2" />
                  <p className="text-xs text-[#211000]/50 font-medium">
                    No orders found yet. You can still chat with support.
                  </p>
                </div>
              ) : (
                <>
                  <div className="relative mb-3">
                    <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-[#211000]/35" />
                    <input
                      value={searchOrders}
                      onChange={(e) => setSearchOrders(e.target.value)}
                      placeholder="Search orders..."
                      className="w-full rounded-full bg-[#FAF4EC] border border-[#211000]/8 pl-10 pr-3 py-2.5 text-xs font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44]"
                    />
                  </div>

                  <select
                    value={selectedOrderId}
                    onChange={(e) => setSelectedOrderId(e.target.value)}
                    className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/10 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#B66B44]"
                  >
                    <option value="">No order selected</option>
                    {filteredOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.id} · {order.status?.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>

                  {selectedOrder && (
                    <div className="mt-4 rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#211000]/45 font-bold">
                            Order ID
                          </p>
                          <p className="font-mono text-xs font-bold mt-0.5">
                            {selectedOrder.id}
                          </p>
                        </div>

                        <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#5F7161]/10 text-[#5F7161] capitalize">
                          {String(selectedOrder.status || "active").replaceAll("_", " ")}
                        </span>
                      </div>

                      {selectedOrder.paymentReference && (
                        <div className="mt-3 pt-3 border-t border-[#211000]/8">
                          <p className="text-[10px] uppercase tracking-wider text-[#211000]/45 font-bold">
                            Payment reference
                          </p>
                          <p className="font-mono text-[11px] font-bold mt-0.5">
                            {selectedOrder.paymentReference}
                          </p>
                        </div>
                      )}

                      {typeof selectedOrder.total === "number" && (
                        <div className="mt-3 flex items-center justify-between text-xs">
                          <span className="text-[#211000]/50 font-medium">
                            Total
                          </span>
                          <span className="font-bold">
                            {formatNaira(selectedOrder.total)}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Topics */}
            <div className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44] mb-4">
                What do you need help with?
              </p>

              <div className="grid gap-2">
                {SUPPORT_TOPICS.map((topic) => {
                  const Icon = topic.icon;
                  const active = selectedTopic === topic.id;

                  return (
                    <button
                      key={topic.id}
                      onClick={() => {
                        setSelectedTopic(topic.id);
                        sendMessage(`I need help with ${topic.title}.`);
                      }}
                      className={`text-left rounded-2xl border p-3 transition-all ${
                        active
                          ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                          : "bg-[#FAF4EC] border-[#211000]/8 hover:border-[#B66B44]/30"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <Icon className="size-4 mt-0.5 shrink-0" />
                        <div>
                          <p className="text-xs font-bold">{topic.title}</p>
                          <p
                            className={`text-[11px] mt-0.5 leading-relaxed ${
                              active ? "text-[#E8CEB0]/65" : "text-[#211000]/45"
                            }`}
                          >
                            {topic.desc}
                          </p>
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Escrow protection card */}
            <div className="rounded-3xl bg-[#211000] text-[#FAF4EC] shadow-sm p-5">
              <div className="flex items-center gap-2 mb-3">
                <ShieldCheck className="size-5 text-[#E8CEB0]" />
                <h3 className="font-serif text-xl font-medium">
                  Escrow protection
                </h3>
              </div>

              <div className="space-y-3 text-xs text-[#FAF4EC]/65 leading-relaxed">
                <p className="flex gap-2">
                  <CheckCircle2 className="size-4 text-[#5F7161] shrink-0" />
                  Buyer funds are held until delivery or pickup is confirmed.
                </p>
                <p className="flex gap-2">
                  <CheckCircle2 className="size-4 text-[#5F7161] shrink-0" />
                  Sellers are protected by auto-release if no dispute is raised.
                </p>
                <p className="flex gap-2">
                  <CheckCircle2 className="size-4 text-[#5F7161] shrink-0" />
                  Refunds are reviewed with evidence from both buyer and seller.
                </p>
              </div>

              <button
                onClick={() => sendMessage("Please explain escrow protection.")}
                className="mt-5 w-full rounded-full bg-[#FAF4EC]/10 hover:bg-[#FAF4EC]/15 border border-[#FAF4EC]/15 py-3 text-xs font-bold transition-colors"
              >
                Ask about escrow
              </button>
            </div>

            {/* FAQ */}
            <div className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-5">
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44] mb-4">
                Quick answers
              </p>

              <div className="space-y-2">
                {FAQS.map((faq, index) => {
                  const open = expandedFaq === index;

                  return (
                    <div
                      key={faq.q}
                      className="rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 overflow-hidden"
                    >
                      <button
                        onClick={() => setExpandedFaq(open ? null : index)}
                        className="w-full flex items-center justify-between gap-3 text-left p-3"
                      >
                        <span className="text-xs font-bold">{faq.q}</span>
                        <ChevronDown
                          className={`size-4 text-[#211000]/40 transition-transform ${
                            open ? "rotate-180" : ""
                          }`}
                        />
                      </button>

                      <AnimatePresence>
                        {open && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            className="overflow-hidden"
                          >
                            <p className="px-3 pb-3 text-[11px] text-[#211000]/55 font-medium leading-relaxed">
                              {faq.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          </aside>

          {/* Chat panel */}
          <section className="lg:col-span-8">
            <div className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm overflow-hidden">
              {/* Chat header */}
              <div className="p-5 sm:p-6 border-b border-[#211000]/8 flex items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="relative size-11 rounded-full bg-[#B66B44]/10 flex items-center justify-center">
                    <Headphones className="size-5 text-[#B66B44]" />
                    <span className="absolute bottom-0 right-0 size-3 rounded-full bg-[#5F7161] border-2 border-white" />
                  </div>

                  <div>
                    <h2 className="font-serif text-xl font-medium">
                      Refurnish Support
                    </h2>
                    <p className="text-xs text-[#211000]/45 font-medium">
                      Average response: under 2 minutes
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-2 rounded-full bg-[#5F7161]/10 border border-[#5F7161]/20 px-3 py-1.5">
                  <Lock className="size-3.5 text-[#5F7161]" />
                  <span className="text-[11px] font-bold text-[#5F7161]">
                    Secure chat
                  </span>
                </div>
              </div>

              {/* Messages */}
              <div className="h-[62vh] min-h-[520px] overflow-y-auto bg-[#FAF4EC] p-4 sm:p-6">
                <div className="space-y-5">
                  {messages.map((message) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      onQuickReply={handleQuickReply}
                    />
                  ))}

                  {agentTyping && (
                    <motion.div
                      initial={{ opacity: 0, y: 8 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="flex items-start gap-3"
                    >
                      <div className="size-8 rounded-full bg-[#B66B44]/10 flex items-center justify-center shrink-0">
                        <Bot className="size-4 text-[#B66B44]" />
                      </div>

                      <div className="rounded-2xl rounded-tl-sm bg-white border border-[#211000]/8 px-4 py-3 shadow-sm">
                        <div className="flex items-center gap-1">
                          <span className="size-1.5 rounded-full bg-[#211000]/30 animate-bounce" />
                          <span className="size-1.5 rounded-full bg-[#211000]/30 animate-bounce [animation-delay:120ms]" />
                          <span className="size-1.5 rounded-full bg-[#211000]/30 animate-bounce [animation-delay:240ms]" />
                        </div>
                      </div>
                    </motion.div>
                  )}

                  <div ref={bottomRef} />
                </div>
              </div>

              {/* Composer */}
              <div className="border-t border-[#211000]/8 bg-white p-4 sm:p-5">
                {/* Pending attachments */}
                <AnimatePresence>
                  {pendingAttachments.length > 0 && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      exit={{ opacity: 0, height: 0 }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-wrap gap-2 mb-3">
                        {pendingAttachments.map((file) => (
                          <div
                            key={file.id}
                            className="inline-flex items-center gap-2 rounded-xl bg-[#FAF4EC] border border-[#211000]/8 px-3 py-2"
                          >
                            {file.type.startsWith("image/") ? (
                              <ImageIcon className="size-4 text-[#B66B44]" />
                            ) : (
                              <FileText className="size-4 text-[#B66B44]" />
                            )}
                            <span className="text-xs font-bold max-w-[150px] truncate">
                              {file.name}
                            </span>
                            <button
                              onClick={() => removePendingAttachment(file.id)}
                              className="text-[#211000]/40 hover:text-red-500"
                            >
                              <X className="size-3.5" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/jpg,application/pdf"
                  multiple
                  onChange={handleAttachmentUpload}
                  className="hidden"
                />

                <div className="flex items-end gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="size-11 rounded-full bg-[#FAF4EC] border border-[#211000]/8 hover:border-[#B66B44]/30 hover:text-[#B66B44] transition-colors grid place-items-center shrink-0"
                    aria-label="Attach file"
                  >
                    <Paperclip className="size-4" />
                  </button>

                  <textarea
                    rows={1}
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder="Type your message..."
                    className="min-h-11 max-h-32 flex-1 resize-none rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all"
                  />

                  <button
                    onClick={() => sendMessage()}
                    disabled={!input.trim() && pendingAttachments.length === 0}
                    className="size-11 rounded-full bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors grid place-items-center shrink-0 shadow-md shadow-[#B66B44]/15"
                    aria-label="Send message"
                  >
                    <Send className="size-4" />
                  </button>
                </div>

                <p className="mt-2 text-[11px] text-[#211000]/35 font-medium">
                  Attach JPG, PNG, or PDF files up to 5MB. For disputes, upload photos/videos of the issue where possible.
                </p>
              </div>
            </div>
          </section>
        </div>
      </div>

      <Toast message={toast} />
    </main>
  );
}

function MessageBubble({
  message,
  onQuickReply,
}: {
  message: ChatMessage;
  onQuickReply: (reply: string) => void;
}) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="rounded-full bg-[#211000]/5 border border-[#211000]/8 px-4 py-2 text-[11px] font-bold text-[#211000]/45">
          {message.text}
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex items-start gap-3 ${isUser ? "justify-end" : "justify-start"}`}
    >
      {!isUser && (
        <div className="size-8 rounded-full bg-[#B66B44]/10 flex items-center justify-center shrink-0">
          <Bot className="size-4 text-[#B66B44]" />
        </div>
      )}

      <div className={`max-w-[86%] sm:max-w-[72%] ${isUser ? "items-end" : "items-start"} flex flex-col`}>
        <div
          className={`rounded-2xl px-4 py-3 shadow-sm ${
            isUser
              ? "rounded-tr-sm bg-[#211000] text-[#E8CEB0]"
              : "rounded-tl-sm bg-white border border-[#211000]/8 text-[#211000]"
          }`}
        >
          <p className="text-sm leading-relaxed whitespace-pre-wrap">
            {message.text}
          </p>

          {message.attachments && message.attachments.length > 0 && (
            <div className="mt-3 grid gap-2">
              {message.attachments.map((file) => (
                <a
                  key={file.id}
                  href={file.url}
                  target="_blank"
                  rel="noreferrer"
                  className={`flex items-center gap-2 rounded-xl px-3 py-2 ${
                    isUser ? "bg-[#FAF4EC]/10" : "bg-[#FAF4EC]"
                  }`}
                >
                  {file.type.startsWith("image/") ? (
                    <ImageIcon className="size-4" />
                  ) : (
                    <FileText className="size-4" />
                  )}
                  <span className="text-xs font-bold truncate">{file.name}</span>
                </a>
              ))}
            </div>
          )}
        </div>

        <p className="text-[10px] text-[#211000]/35 font-medium mt-1 px-1">
          {formatTime(message.createdAt)}
        </p>

        {!isUser && message.quickReplies && message.quickReplies.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-2">
            {message.quickReplies.map((reply) => (
              <button
                key={reply}
                onClick={() => onQuickReply(reply)}
                className="rounded-full bg-white border border-[#211000]/8 hover:border-[#B66B44]/30 hover:text-[#B66B44] px-3 py-1.5 text-[11px] font-bold transition-colors"
              >
                {reply}
              </button>
            ))}
          </div>
        )}
      </div>

      {isUser && (
        <div className="size-8 rounded-full bg-[#211000] text-[#E8CEB0] flex items-center justify-center shrink-0">
          <User className="size-4" />
        </div>
      )}
    </motion.div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className="fixed bottom-6 left-1/2 z-[90] inline-flex items-center gap-2 bg-[#211000] text-[#FAF4EC] px-5 py-3 rounded-full shadow-2xl"
        >
          <CheckCircle2 className="size-4 text-[#5F7161]" />
          <span className="text-xs font-bold">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}