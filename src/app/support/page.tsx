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
  CheckCircle2,
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
  Loader2,
  AlertCircle,
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
};

type SupportTicket = {
  id: string;
  reference: string;
  topic: string;
  orderId?: string;
  status: "open" | "waiting_for_agent" | "resolved";
  userLastReadAt?: string;
  createdAt: string;
  updatedAt: string;
};

type Order = {
  id: string;
  reference: string;
  status: string;
  total: number;
  paymentReference?: string;
};

const MESSAGES_KEY = "refurnish_support_messages";
const TICKET_KEY = "refurnish_support_ticket";

const SUPPORT_TOPICS = [
  { id: "escrow", title: "Escrow protection", desc: "Payment release, received item, seller payout", icon: ShieldCheck },
  { id: "refund", title: "Refund / dispute", desc: "Item not as described, damaged item, return request", icon: RefreshCcw },
  { id: "payment", title: "Payment issue", desc: "Bank transfer receipt, card payment, payment reference", icon: CreditCard },
  { id: "delivery", title: "Delivery / pickup", desc: "Logistics partner, pickup address, delivery updates", icon: Truck },
  { id: "order", title: "Order support", desc: "Track order, update contact info, seller details", icon: Package },
  { id: "general", title: "General question", desc: "Anything else you need help with", icon: MessageCircle },
];

const FAQS = [
  { q: "When is money released to the seller?", a: "Funds are released when the buyer confirms delivery/pickup, or automatically after the protection window if no dispute is raised." },
  { q: "What if the buyer never clicks received?", a: "Seller protection applies. If there is delivery proof and no dispute, Refurnish can automatically release funds after the protection window." },
  { q: "Can I request a refund?", a: "Yes. If the item is not as described, damaged, or missing parts, open a dispute and upload photos within the refund window." },
  { q: "How do bank transfers get confirmed?", a: "Use your payment reference in the transfer narration, upload your receipt, and our team verifies it before notifying the seller." },
];

function makeId(prefix = "id") {
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString([], { month: "short", day: "numeric", year: "numeric" });
}

export default function SupportPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [input, setInput] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [searchOrders, setSearchOrders] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [initialFetched, setInitialFetched] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const selectedOrder = useMemo(() => {
    return orders.find((order) => order.id === selectedOrderId);
  }, [orders, selectedOrderId]);

  const filteredOrders = useMemo(() => {
    if (!searchOrders.trim()) return orders;
    const q = searchOrders.toLowerCase();
    return orders.filter((order) => {
      const id = String(order.id || "").toLowerCase();
      const ref = String(order.reference || "").toLowerCase();
      const status = String(order.status || "").toLowerCase();
      return id.includes(q) || ref.includes(q) || status.includes(q);
    });
  }, [orders, searchOrders]);

  // Fetch ticket and messages
  const fetchTicket = async () => {
    try {
      const res = await fetch("/api/support/mine", { credentials: "include" });
      const data = await res.json();
      
      if (data.ticket) {
        setTicket(data.ticket);
        localStorage.setItem(TICKET_KEY, JSON.stringify(data.ticket));
        
        if (data.messages && data.messages.length > 0) {
          const formattedMessages: ChatMessage[] = data.messages.map((msg: any) => ({
            id: msg.id,
            role: msg.role,
            text: msg.text,
            createdAt: msg.createdAt,
            attachments: msg.attachments ? JSON.parse(msg.attachments) : undefined,
          }));
          setMessages(formattedMessages);
          localStorage.setItem(MESSAGES_KEY, JSON.stringify(formattedMessages));
        } else if (data.messages?.length === 0 && !initialFetched) {
          // First time user - show welcome message
          setMessages([{
            id: makeId("msg"),
            role: "agent",
            text: "Hi, welcome to Refurnish Support. I can help with escrow, refunds, payment verification, delivery, pickup, and order issues. What would you like help with today?",
            createdAt: new Date().toISOString(),
          }]);
        }
      } else if (!initialFetched) {
        // No ticket exists - show welcome message
        setMessages([{
          id: makeId("msg"),
          role: "agent",
          text: "Hi, welcome to Refurnish Support. I can help with escrow, refunds, payment verification, delivery, pickup, and order issues. What would you like help with today?",
          createdAt: new Date().toISOString(),
        }]);
      }
    } catch (err) {
      console.error("Failed to fetch ticket:", err);
      if (!initialFetched) {
        setMessages([{
          id: makeId("msg"),
          role: "agent",
          text: "Hi, welcome to Refurnish Support. How can we help today?",
          createdAt: new Date().toISOString(),
        }]);
      }
    }
  };

  // Fetch orders
  const fetchOrders = async () => {
    try {
      const res = await fetch("/api/orders/mine", { credentials: "include" });
      const data = await res.json();
      if (data.orders) {
        setOrders(data.orders);
      }
    } catch (err) {
      console.error("Failed to fetch orders:", err);
    }
  };

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      await Promise.all([fetchTicket(), fetchOrders()]);
      setLoading(false);
      setInitialFetched(true);
    };
    init();
  }, []);

  // Restore from localStorage if needed
  useEffect(() => {
    if (!loading && !ticket) {
      try {
        const storedTicket = localStorage.getItem(TICKET_KEY);
        const storedMessages = localStorage.getItem(MESSAGES_KEY);
        
        if (storedTicket) {
          setTicket(JSON.parse(storedTicket));
        }
        if (storedMessages) {
          const parsed = JSON.parse(storedMessages);
          if (parsed.length > 0 && messages.length === 0) {
            setMessages(parsed);
          }
        }
      } catch {
        // Ignore localStorage errors
      }
    }
  }, [loading]);

  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (message: string, type: "success" | "error" = "success") => {
    setToastType(type);
    setToast(message);
  };

  // Update ticket metadata (topic, orderId)
  const updateTicketMeta = async (topic?: string, orderId?: string) => {
    try {
      const res = await fetch("/api/support/mine", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ topic, orderId }),
      });
      const data = await res.json();
      if (data.ticket) {
        setTicket(data.ticket);
        localStorage.setItem(TICKET_KEY, JSON.stringify(data.ticket));
      }
    } catch (err) {
      console.error("Failed to update ticket meta:", err);
    }
  };

  // Send message to backend
  const sendMessage = async (overrideText?: string) => {
    const text = typeof overrideText === "string" ? overrideText : input.trim();

    if (!text && pendingAttachments.length === 0) return;
    if (sending) return;

    setSending(true);

    const userMessage: ChatMessage = {
      id: makeId("msg"),
      role: "user",
      text: text || "Sent an attachment",
      createdAt: new Date().toISOString(),
      attachments: pendingAttachments.length > 0 ? pendingAttachments : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPendingAttachments([]);

    try {
      // If no ticket exists yet, create one first
      if (!ticket) {
        await updateTicketMeta(selectedTopic, selectedOrderId || undefined);
      } else if (ticket.topic !== selectedTopic || ticket.orderId !== selectedOrderId) {
        // Update metadata if changed
        await updateTicketMeta(selectedTopic, selectedOrderId || undefined);
      }

      // Build form data for attachments
      const formData = new FormData();
      formData.append("text", text || "Sent an attachment");
      
      // Handle file uploads - in real implementation, upload to Cloudinary first
      // For now, we'll send attachment metadata
      if (pendingAttachments.length > 0) {
        formData.append("attachments", JSON.stringify(pendingAttachments));
      }

      const res = await fetch("/api/support/mine/messages", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      const data = await res.json();

      if (data.ticket && !ticket) {
        setTicket(data.ticket);
        localStorage.setItem(TICKET_KEY, JSON.stringify(data.ticket));
        
        // Add system message about ticket creation
        setMessages((prev) => [
          ...prev,
          {
            id: makeId("msg"),
            role: "system",
            text: `Support ticket created: ${data.ticket.reference}`,
            createdAt: new Date().toISOString(),
          },
        ]);
        
        showToast("Ticket created - our team will review shortly");
      }

      if (data.message) {
        // Add system message indicating message sent
        setMessages((prev) => [
          ...prev,
          {
            id: makeId("msg"),
            role: "system",
            text: "Message sent to support team",
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to send message:", err);
      showToast("Failed to send message. Please try again.", "error");
      
      // Remove the optimistic message on error
      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
    } finally {
      setSending(false);
    }
  };

  // Topic selection handler
  const handleTopicSelect = (topicId: string) => {
    setSelectedTopic(topicId);
    const topic = SUPPORT_TOPICS.find((t) => t.id === topicId);
    if (topic) {
      sendMessage(`I need help with ${topic.title}.`);
    }
  };

  // Create ticket manually
  const createTicket = () => {
    if (ticket) {
      showToast("This chat is already attached to a support ticket");
      return;
    }
    sendMessage("I'd like to speak with a support agent.");
  };

  // Resolve ticket (clear chat)
  const resolveTicket = async () => {
    if (!ticket) {
      // Just clear local state
      clearChatLocal();
      return;
    }

    try {
      const res = await fetch("/api/support/mine/resolve", {
        method: "POST",
        credentials: "include",
      });

      if (res.ok) {
        clearChatLocal();
        showToast("Ticket resolved");
      } else {
        showToast("Failed to resolve ticket", "error");
      }
    } catch (err) {
      console.error("Failed to resolve ticket:", err);
      showToast("Failed to resolve ticket", "error");
    }
  };

  const clearChatLocal = () => {
    const starter: ChatMessage[] = [{
      id: makeId("msg"),
      role: "agent",
      text: "Chat cleared. How can we help you today?",
      createdAt: new Date().toISOString(),
    }];

    setMessages(starter);
    setTicket(null);
    localStorage.removeItem(TICKET_KEY);
    localStorage.setItem(MESSAGES_KEY, JSON.stringify(starter));
    showToast("Chat cleared");
  };

  const clearChat = () => {
    if (ticket) {
      resolveTicket();
    } else {
      clearChatLocal();
    }
  };

  const copyTicketId = () => {
    if (!ticket?.reference) return;
    navigator.clipboard.writeText(ticket.reference);
    showToast("Ticket ID copied");
  };

  const copyOrderId = () => {
    if (!selectedOrderId) return;
    navigator.clipboard.writeText(selectedOrderId);
    showToast("Order ID copied");
  };

  const handleAttachmentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    const remaining = 3 - pendingAttachments.length;
    const selectedFiles = files.slice(0, Math.max(0, remaining));

    selectedFiles.forEach((file) => {
      const validTypes = ["image/png", "image/jpeg", "image/jpg", "application/pdf"];

      if (!validTypes.includes(file.type)) {
        showToast("Only JPG, PNG, or PDF files are allowed", "error");
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        showToast("Each file must be under 5MB", "error");
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

  const statusConfig: Record<string, { label: string; color: string }> = {
    open: { label: "Open", color: "text-[#B66B44] bg-[#B66B44]/10" },
    waiting_for_agent: { label: "Waiting for agent", color: "text-[#5F7161] bg-[#5F7161]/10" },
    resolved: { label: "Resolved", color: "text-[#211000]/50 bg-[#211000]/5" },
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF4EC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 text-[#B66B44] animate-spin" />
          <p className="text-sm text-[#211000]/50 font-medium">Loading support...</p>
        </div>
      </main>
    );
  }

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
                Support
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight mt-2 leading-tight">
                We&apos;re here to help.
              </h1>
              <p className="text-sm text-[#211000]/55 font-medium mt-2 max-w-xl">
                Chat with Refurnish support for escrow, refunds, delivery, pickup, payment verification, and order issues.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#5F7161]/10 border border-[#5F7161]/20 px-4 py-2">
              <span className="size-2 rounded-full bg-[#5F7161] animate-pulse" />
              <span className="text-xs font-bold text-[#5F7161]">
                {ticket ? `Ticket: ${ticket.reference}` : "Start a conversation"}
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
                        {ticket.reference}
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
                    <span className="text-[#211000]/50 font-medium">Status</span>
                    <span className={`font-bold px-2 py-0.5 rounded-full ${statusConfig[ticket.status]?.color || ""}`}>
                      {statusConfig[ticket.status]?.label || ticket.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#211000]/8 flex items-center justify-between text-xs">
                    <span className="text-[#211000]/50 font-medium">Created</span>
                    <span className="font-medium">{formatDate(ticket.createdAt)}</span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={createTicket}
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
                    No orders found. Your orders will appear here after purchase.
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
                    onChange={(e) => {
                      setSelectedOrderId(e.target.value);
                      if (ticket) {
                        updateTicketMeta(undefined, e.target.value || undefined);
                      }
                    }}
                    className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/10 px-4 py-3 text-xs font-bold focus:outline-none focus:border-[#B66B44]"
                  >
                    <option value="">No order selected</option>
                    {filteredOrders.map((order) => (
                      <option key={order.id} value={order.id}>
                        {order.reference || order.id} · {order.status?.replaceAll("_", " ")}
                      </option>
                    ))}
                  </select>

                  {selectedOrder && (
                    <div className="mt-4 rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 p-4">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <p className="text-[10px] uppercase tracking-wider text-[#211000]/45 font-bold">
                            Order
                          </p>
                          <p className="font-mono text-xs font-bold mt-0.5">
                            {selectedOrder.reference || selectedOrder.id}
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
                          <span className="text-[#211000]/50 font-medium">Total</span>
                          <span className="font-bold">{formatNaira(selectedOrder.total)}</span>
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
                      onClick={() => handleTopicSelect(topic.id)}
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
                          <p className={`text-[11px] mt-0.5 leading-relaxed ${
                            active ? "text-[#E8CEB0]/65" : "text-[#211000]/45"
                          }`}>
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
                onClick={() => sendMessage("Please explain how escrow protection works.")}
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
                          className={`size-4 text-[#211000]/40 transition-transform ${open ? "rotate-180" : ""}`}
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
                      {ticket?.status === "waiting_for_agent" 
                        ? "Waiting for agent response" 
                        : ticket?.status === "resolved"
                        ? "This ticket has been resolved"
                        : "Average response: under 2 minutes"}
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
                    />
                  ))}

                  {sending && (
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
                    disabled={ticket?.status === "resolved"}
                  >
                    <Paperclip className="size-4" />
                  </button>

                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      // Auto-resize
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.min(e.target.scrollHeight, 128)}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={ticket?.status === "resolved" ? "This ticket is resolved" : "Type your message..."}
                    disabled={ticket?.status === "resolved" || sending}
                    className="min-h-11 max-h-32 flex-1 resize-none rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                  <button
                    onClick={() => sendMessage()}
                    disabled={(!input.trim() && pendingAttachments.length === 0) || sending || ticket?.status === "resolved"}
                    className="size-11 rounded-full bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors grid place-items-center shrink-0 shadow-md shadow-[#B66B44]/15"
                    aria-label="Send message"
                  >
                    {sending ? (
                      <Loader2 className="size-4 animate-spin" />
                    ) : (
                      <Send className="size-4" />
                    )}
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

      <Toast message={toast} type={toastType} />
    </main>
  );
}

function MessageBubble({ message }: { message: ChatMessage }) {
  const isUser = message.role === "user";
  const isSystem = message.role === "system";

  if (isSystem) {
    return (
      <div className="flex justify-center">
        <div className="rounded-full bg-[#211000]/5 border border-[#211000]/8 px-4 py-2 text-[11px] font-bold text-[#211000]/45 flex items-center gap-2">
          {message.text.includes("sent to support") ? (
            <CheckCircle2 className="size-3.5 text-[#5F7161]" />
          ) : message.text.includes("created") ? (
            <Headphones className="size-3.5 text-[#B66B44]" />
          ) : null}
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
      </div>

      {isUser && (
        <div className="size-8 rounded-full bg-[#211000] text-[#E8CEB0] flex items-center justify-center shrink-0">
          <User className="size-4" />
        </div>
      )}
    </motion.div>
  );
}

function Toast({ message, type }: { message: string; type?: "success" | "error" }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className={`fixed bottom-6 left-1/2 z-[90] inline-flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl ${
            type === "error" ? "bg-red-600 text-white" : "bg-[#211000] text-[#FAF4EC]"
          }`}
        >
          {type === "error" ? (
            <AlertCircle className="size-4" />
          ) : (
            <CheckCircle2 className="size-4 text-[#5F7161]" />
          )}
          <span className="text-xs font-bold">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}