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

const API_URL = (process.env.NEXT_PUBLIC_API_URL || "").replace(/\/+$/, "");

const apiUrl = (path: string) =>
  `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

// Reads the same stored session the rest of the app uses and builds
// the Authorization header the backend's auth middleware expects.
function getSupportAuthHeaders(includeJson = false): HeadersInit {
  const rawUser = localStorage.getItem("refurnish_user");
  const storedUser = rawUser ? JSON.parse(rawUser) : null;
  const token = storedUser?.token;

  if (!token) {
    throw new Error("Your session has expired. Please log in again.");
  }

  return {
    ...(includeJson ? { "Content-Type": "application/json" } : {}),
    Authorization: `Bearer ${token}`,
  };
}

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
  return `${prefix}-${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function formatTime(dateString: string) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatDate(dateString: string) {
  return new Date(dateString).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function parseAttachments(raw: unknown): Attachment[] | undefined {
  if (!raw) return undefined;
  try {
    const parsed = typeof raw === "string" ? JSON.parse(raw) : raw;
    return Array.isArray(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

export default function SupportPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<string>("");
  const [selectedTopic, setSelectedTopic] = useState("general");
  const [input, setInput] = useState("");
  const [pendingAttachments, setPendingAttachments] = useState<Attachment[]>([]);
  const [ticket, setTicket] = useState<SupportTicket | null>(null);
  const [ticketHistory, setTicketHistory] = useState<SupportTicket[]>([]);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [toast, setToast] = useState("");
  const [toastType, setToastType] = useState<"success" | "error">("success");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);
  const [searchOrders, setSearchOrders] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [initialFetched, setInitialFetched] = useState(false);
  const [pendingBotQuestion, setPendingBotQuestion] = useState<string | null>(null);
  const [pendingBotAttachments, setPendingBotAttachments] = useState<Attachment[]>([]);
  const [uploadingAttachments, setUploadingAttachments] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
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

  const fetchTicket = async () => {
    try {
      const res = await fetch(apiUrl("/api/support/mine"), {
        headers: getSupportAuthHeaders(),
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load support ticket.");
      }

      const data = await res.json();

      if (data.ticket) {
        setTicket(data.ticket);
        localStorage.setItem(TICKET_KEY, JSON.stringify(data.ticket));

        if (data.messages && data.messages.length > 0) {
          const formattedMessages: ChatMessage[] = data.messages.map(
            (msg: any) => ({
              id: msg.id,
              role: msg.role,
              text: msg.text,
              createdAt: msg.createdAt,
              attachments: parseAttachments(msg.attachments),
            })
          );
          const displayMessages =
            data.ticket.status === "waiting_for_agent" &&
            !formattedMessages.some((message) => message.role === "agent")
              ? [
                  ...formattedMessages,
                  {
                    id: `agent-waiting-${refreshedTicket?.id || ticket.id}`,
                    role: "agent" as const,
                    text: "We've received your request and will connect an agent to this chat as soon as possible, usually within 0–3 minutes.",
                    createdAt: new Date().toISOString(),
                  },
                ]
              : formattedMessages;
          setMessages(displayMessages);
          localStorage.setItem(MESSAGES_KEY, JSON.stringify(displayMessages));
        } else if (data.messages?.length === 0 && !initialFetched) {
          setMessages([
            {
              id: makeId("msg"),
              role: "agent",
              text: "Hi, welcome to Refurnish Support. I can help with escrow, refunds, payment verification, delivery, pickup, and order issues. What would you like help with today?",
              createdAt: new Date().toISOString(),
            },
          ]);
        }
      } else if (!initialFetched) {
        setMessages([
          {
            id: makeId("msg"),
            role: "agent",
            text: "Hi, welcome to Refurnish Support. I can help with escrow, refunds, payment verification, delivery, pickup, and order issues. What would you like help with today?",
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    } catch (err) {
      console.error("Failed to fetch ticket:", err);
      if (!initialFetched) {
        setMessages([
          {
            id: makeId("msg"),
            role: "agent",
            text: "Hi, welcome to Refurnish Support. How can we help today?",
            createdAt: new Date().toISOString(),
          },
        ]);
      }
    }
  };

  const fetchTicketHistory = async () => {
    setHistoryLoading(true);
    try {
      const res = await fetch(apiUrl("/api/support/mine/tickets"), {
        headers: getSupportAuthHeaders(),
        credentials: "include",
        cache: "no-store",
      });
      if (!res.ok) throw new Error("Failed to load ticket history.");
      const data = await res.json();
      const tickets: SupportTicket[] = Array.isArray(data.tickets) ? data.tickets : [];
      setTicketHistory(tickets);
    } catch (err) {
      console.error("Failed to load support ticket history:", err);
    } finally {
      setHistoryLoading(false);
    }
  };

  const openTicketFromHistory = async (selected: SupportTicket) => {
    try {
      const res = await fetch(apiUrl(`/api/support/mine/tickets/${selected.id}/messages`), {
        headers: getSupportAuthHeaders(),
        credentials: "include",
        cache: "no-store",
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || "Could not open this ticket.");
      const selectedTicket = data.ticket || selected;
      const formatted: ChatMessage[] = (data.messages || []).map((msg: any) => ({
        id: msg.id,
        role: msg.role,
        text: msg.text,
        createdAt: msg.createdAt,
        attachments: parseAttachments(msg.attachments),
      }));
      setTicket(selectedTicket);
      setMessages(formatted);
      setSelectedTopic(selectedTicket.topic || "general");
      setSelectedOrderId(selectedTicket.orderId || selectedTicket.order?.id || "");
      localStorage.setItem(TICKET_KEY, JSON.stringify(selectedTicket));
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(formatted));
    } catch (err: any) {
      showToast(err?.message || "Could not open this ticket.", "error");
    }
  };

  const startNewTicket = async () => {
    if (sending) return;
    try {
      const res = await fetch(apiUrl("/api/support/mine/tickets"), {
        method: "POST",
        headers: getSupportAuthHeaders(true),
        credentials: "include",
        body: JSON.stringify({ topic: selectedTopic, orderId: selectedOrderId || undefined }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ticket) throw new Error(data.message || "Could not create a new ticket.");
      setTicket(data.ticket);
      setMessages([]);
      setPendingBotQuestion(null);
      setPendingBotAttachments([]);
      setInput("");
      setPendingAttachments([]);
      localStorage.setItem(TICKET_KEY, JSON.stringify(data.ticket));
      localStorage.setItem(MESSAGES_KEY, JSON.stringify([]));
      await fetchTicketHistory();
      showToast("New support ticket created");
      textareaRef.current?.focus();
    } catch (err: any) {
      showToast(err?.message || "Could not create a new ticket.", "error");
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(apiUrl("/api/orders/mine"), {
        headers: getSupportAuthHeaders(),
        credentials: "include",
        cache: "no-store",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Failed to load orders.");
      }

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
      await Promise.all([fetchTicket(), fetchOrders(), fetchTicketHistory()]);
      setLoading(false);
      setInitialFetched(true);
    };
    init();
  }, []);

  // Poll for new agent replies while a ticket is active.
  useEffect(() => {
    if (!ticket || ticket.status === "resolved") return;

    const pollMessages = async () => {
      try {
        const res = await fetch(apiUrl(`/api/support/mine/tickets/${ticket.id}/messages`), {
          headers: getSupportAuthHeaders(),
          credentials: "include",
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();

        if ((data.ticket || ticket) && Array.isArray(data.messages)) {
          const refreshedTicket = data.ticket || ticket;
          setTicket(refreshedTicket);
          if (refreshedTicket) {
            setTicketHistory((prev) => prev.map((item) => item.id === refreshedTicket.id ? refreshedTicket : item));
            localStorage.setItem(TICKET_KEY, JSON.stringify(refreshedTicket));
          }

          const formattedMessages: ChatMessage[] = data.messages.map(
            (msg: any) => ({
              id: msg.id,
              role: msg.role,
              text: msg.text,
              createdAt: msg.createdAt,
              attachments: parseAttachments(msg.attachments),
            })
          );

          const displayMessages =
            refreshedTicket?.status === "waiting_for_agent" &&
            !formattedMessages.some((message) => message.role === "agent")
              ? [
                  ...formattedMessages,
                  {
                    id: `agent-waiting-${refreshedTicket?.id || ticket.id}`,
                    role: "agent" as const,
                    text: "We've received your request and will connect an agent to this chat as soon as possible, usually within 0–3 minutes.",
                    createdAt: new Date().toISOString(),
                  },
                ]
              : formattedMessages;
          setMessages(displayMessages);
        }
      } catch (error) {
        console.error("Failed to refresh support messages:", error);
      }
    };

    const interval = setInterval(pollMessages, 5000);

    return () => clearInterval(interval);
  }, [ticket?.id, ticket?.status]);


  useEffect(() => {
    if (messages.length > 0) {
      localStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
    }
    // Scroll only the chat history, not the entire page.
    const container = messagesContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const showToast = (
    message: string,
    type: "success" | "error" = "success"
  ) => {
    setToastType(type);
    setToast(message);
  };

  const updateTicketMeta = async (topic?: string, orderId?: string) => {
    try {
      const res = await fetch(apiUrl("/api/support/mine"), {
        method: "PATCH",
        headers: getSupportAuthHeaders(true),
        credentials: "include",
        body: JSON.stringify({ topic, orderId, ticketId: ticket?.id }),
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

  const sendMessageToSupport = async (
    overrideText?: string,
    overrideTopic?: string,
    overrideAttachments?: Attachment[]
  ) => {
    const text = typeof overrideText === "string" ? overrideText : input.trim();
    const topicToSend = overrideTopic || selectedTopic;

    if (!text && (overrideAttachments ?? pendingAttachments).length === 0) return false;
    if (sending) return false;

    setSending(true);

    const attachmentsToSend = overrideAttachments ?? pendingAttachments;

    const userMessage: ChatMessage = {
      id: makeId("msg"),
      role: "user",
      text: text || "Sent an attachment",
      createdAt: new Date().toISOString(),
      attachments: attachmentsToSend.length > 0 ? attachmentsToSend : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPendingAttachments([]);

    try {
      let activeTicket = ticket;
      if (!activeTicket) {
        const createRes = await fetch(apiUrl("/api/support/mine/tickets"), {
          method: "POST",
          headers: getSupportAuthHeaders(true),
          credentials: "include",
          body: JSON.stringify({ topic: topicToSend, orderId: selectedOrderId || undefined }),
        });
        const createData = await createRes.json().catch(() => ({}));
        if (!createRes.ok || !createData.ticket) {
          throw new Error(createData.message || "Could not create a support ticket.");
        }
        activeTicket = createData.ticket;
        setTicket(activeTicket);
        localStorage.setItem(TICKET_KEY, JSON.stringify(activeTicket));
      } else if (
        activeTicket.topic !== topicToSend ||
        (activeTicket.orderId || "") !== selectedOrderId
      ) {
        await updateTicketMeta(topicToSend, selectedOrderId || undefined);
      }

      const res = await fetch(apiUrl("/api/support/mine/messages"), {
        method: "POST",
        headers: getSupportAuthHeaders(true),
        credentials: "include",
        body: JSON.stringify({
          text: text || "Sent an attachment",
          attachments: attachmentsToSend.length
            ? JSON.stringify(attachmentsToSend)
            : undefined,
          topic: topicToSend,
          orderId: selectedOrderId || undefined,
          ticketId: activeTicket?.id,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Failed to send message");
      }

      if (data.ticket) {
        setTicket(data.ticket);
        localStorage.setItem(TICKET_KEY, JSON.stringify(data.ticket));
        setTicketHistory((prev) => [data.ticket, ...prev.filter((item) => item.id !== data.ticket.id)]);
      }
      void fetchTicketHistory();

      if (data.message) {
        setMessages((prev) => [
          ...prev,
          {
            id: makeId("msg"),
            role: "system",
            text: "Message sent to support team",
            createdAt: new Date().toISOString(),
          },
        ]);

        showToast("Message sent successfully");
      }
      return true;
    } catch (err: any) {
      console.error("Failed to send message:", err);
      showToast(
        err?.message || "Failed to send message. Please try again.",
        "error"
      );

      setMessages((prev) => prev.filter((m) => m.id !== userMessage.id));
      return false;
    } finally {
      setSending(false);
    }
  };

  const getBotReply = (question: string, topicId: string) => {
    const q = question.toLowerCase().trim().replace(/[!?.,]+$/g, "");

    // Greetings should receive a friendly bot response, never an agent-waiting message.
    if (/^(hi|hello|hey|good morning|good afternoon|good evening|hiya|hey there)(\s|$)/i.test(q)) {
      return "Hi there! 👋 Welcome to Refurnish Support. I'm here to help with escrow protection, refunds and disputes, payment issues, delivery or pickup, and orders. What can I help you with today? You can describe the issue in your own words or choose a support topic.";
    }
    if (/^(thanks|thank you|thank u|thx)(\s|$)/i.test(q)) {
      return "You're very welcome! 😊 Is there anything else about your Refurnish order or account that I can help with?";
    }
    if (/^(bye|goodbye|that's all|that is all|nothing else)(\s|$)/i.test(q)) {
      return "Thanks for contacting Refurnish Support. If you need help later, just start a new chat and I'll be happy to help. Have a lovely day!";
    }
    if (/refund|return|damaged|broken|missing part|not as described|dispute/.test(q)) {
      return "If your item arrived damaged, is missing parts, or is not as described, open a dispute within the applicable protection window and upload clear photos as evidence. Our team can review the case and guide you through the next steps.";
    }
    if (/escrow|release|seller.*(money|payment|fund|payout)|when.*paid|received|buyer confirm/.test(q)) {
      return FAQS[0].a + "\n\nIf an item has not arrived or a dispute is open, contact support before confirming receipt so the team can review the case.";
    }
    if (/transfer|bank|receipt|payment|paid|paystack|transaction|payment reference|card declined|charged/.test(q)) {
      return FAQS[3].a + " If the payment still hasn't been confirmed, share your payment reference and receipt with support.";
    }
    if (/delivery|deliver|pickup|pick up|logistics|shipping|tracking|courier|collection address/.test(q)) {
      return "For delivery or pickup, open your order details to review the latest status and confirm that your contact and pickup information are correct. Refurnish may use a logistics partner depending on the order. If the delivery is delayed, the pickup address is wrong, or tracking has not updated, select the relevant order and I can help you contact support.";
    }
    if (/order|seller|track|tracking number|contact info|change.*phone|update.*contact|seller detail/.test(q)) {
      return "You can check your order status in your Refurnish account. Select the relevant order in this support page so the team can identify it more easily. For a status that looks incorrect or an update you can't make yourself, I can connect you with a support agent.";
    }
    if (/account|login|log in|password|profile/.test(q)) {
      return "For account access issues, first make sure you're using the email address registered with Refurnish. Never share your password or verification codes in chat. If you still can't access your account, I can connect you with a support agent.";
    }
    if (topicId === "refund") return "For refund or dispute concerns, explain what went wrong and upload clear photos if the item is damaged or not as described. A support agent can review the details if the guidance here doesn't resolve it.";
    if (topicId === "escrow") return FAQS[0].a;
    if (topicId === "payment") return FAQS[3].a;
    if (topicId === "delivery") return "For delivery or pickup concerns, check your order status and make sure your contact and pickup details are correct. If you still need help, I can connect you with our support team.";
    if (topicId === "order") return "You can check your order status in your Refurnish account and attach the relevant order using the order selector on this page. If you need an update or something looks wrong, I can connect you with an agent.";
    return "Thanks for contacting Refurnish Support. I can help with escrow protection, refunds and disputes, payment verification, delivery or pickup, and order questions. Please share a little more detail so I can point you in the right direction.";
  };

  const sendMessage = async (overrideText?: string, overrideTopic?: string) => {
    const text = typeof overrideText === "string" ? overrideText : input.trim();
    const topicToUse = overrideTopic || selectedTopic;

    if (!text && pendingAttachments.length === 0) return;
    if (sending || uploadingAttachments) return;

    // Once a ticket is active, send new messages directly to the support team.
    if (ticket && ticket.status !== "resolved") {
      await sendMessageToSupport(text, topicToUse);
      return;
    }

    const attachmentsToSend = pendingAttachments;
    const userMessage: ChatMessage = {
      id: makeId("msg"),
      role: "user",
      text: text || "Sent an attachment",
      createdAt: new Date().toISOString(),
      attachments: attachmentsToSend.length ? attachmentsToSend : undefined,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setPendingAttachments([]);
    setPendingBotQuestion(text || "I have attached an image for support.");
    setPendingBotAttachments(attachmentsToSend);

    const botReply = getBotReply(text, topicToUse);
    setMessages((prev) => [
      ...prev,
      {
        id: makeId("bot"),
        role: "agent",
        text: `${botReply}\n\nDid this solve your issue?`,
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleBotSolved = () => {
    setPendingBotQuestion(null);
    setPendingBotAttachments([]);
    setMessages((prev) => [
      ...prev,
      {
        id: makeId("bot"),
        role: "agent",
        text: "You're welcome! 😊 Thanks for contacting Refurnish Support. We're glad we could help. If you need anything else, we're here for you!",
        createdAt: new Date().toISOString(),
      },
    ]);
  };

  const handleBotNeedsAgent = async () => {
    if (sending) return;
    const originalQuestion = pendingBotQuestion || "I'd like to speak with a support agent.";
    const escalationText = `Please connect me to a support agent.\n\nOriginal question: ${originalQuestion}`;
    const didSend = await sendMessageToSupport(
      escalationText,
      selectedTopic,
      pendingBotAttachments
    );

    if (didSend) {
      setPendingBotQuestion(null);
      setPendingBotAttachments([]);
      setMessages((prev) => [
        ...prev,
        {
          id: `agent-waiting-${ticket?.id || "new"}`,
          role: "agent",
          text: "No worries! We've received your request and will connect an agent to this chat as soon as possible, usually within 0–3 minutes.",
          createdAt: new Date().toISOString(),
        },
      ]);
    }
  };

  const handleTopicSelect = (topicId: string) => {
    if (ticket?.status === "resolved") {
      setTicket(null);
      setMessages([]);
      localStorage.removeItem(TICKET_KEY);
    }
    setSelectedTopic(topicId);
    const topic = SUPPORT_TOPICS.find((t) => t.id === topicId);
    if (topic) {
      sendMessage(`I need help with ${topic.title}.`, topicId);
    }
  };

  const createTicket = async () => {
    await startNewTicket();
  };

  const resolveTicket = async () => {
    if (!ticket) {
      clearChatLocal();
      return;
    }

    try {
      const res = await fetch(apiUrl("/api/support/mine/resolve"), {
        method: "POST",
        headers: getSupportAuthHeaders(true),
        credentials: "include",
        body: JSON.stringify({ ticketId: ticket.id }),
      });

      if (res.ok) {
        const data = await res.json().catch(() => ({}));
        const resolvedTicket = data.ticket || { ...ticket, status: "resolved" as const };
        setTicket(resolvedTicket);
        localStorage.setItem(TICKET_KEY, JSON.stringify(resolvedTicket));
        setTicketHistory((prev) => prev.map((item) => item.id === resolvedTicket.id ? resolvedTicket : item));
        await fetchTicketHistory();
        showToast("Ticket resolved. You can start a new ticket anytime.");
      } else {
        showToast("Failed to resolve ticket", "error");
      }
    } catch (err: any) {
      console.error("Failed to resolve ticket:", err);
      showToast(err?.message || "Failed to resolve ticket", "error");
    }
  };

  const clearChatLocal = () => {
    const starter: ChatMessage[] = [
      {
        id: makeId("msg"),
        role: "agent",
        text: "Chat cleared. How can we help you today?",
        createdAt: new Date().toISOString(),
      },
    ];

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

  const handleAttachmentUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    const remaining = 3 - pendingAttachments.length;
    const selectedFiles = files.slice(0, Math.max(0, remaining));
    if (selectedFiles.length === 0) {
      showToast("You can attach up to 3 images per message", "error");
      e.target.value = "";
      return;
    }

    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    if (!cloudName || !uploadPreset) {
      showToast("Image upload is not configured. Please contact support.", "error");
      e.target.value = "";
      return;
    }

    const validFiles = selectedFiles.filter((file) => {
      if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
        showToast("Only JPG, PNG, or WEBP images are allowed", "error");
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        showToast("Each image must be under 5MB", "error");
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) {
      e.target.value = "";
      return;
    }

    setUploadingAttachments(true);
    try {
      const uploaded = await Promise.all(
        validFiles.map(async (file): Promise<Attachment> => {
          const formData = new FormData();
          formData.append("file", file);
          formData.append("upload_preset", uploadPreset);

          const response = await fetch(
            `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
            { method: "POST", body: formData }
          );
          const data = await response.json();

          if (!response.ok || !data.secure_url) {
            throw new Error(data.error?.message || `Could not upload ${file.name}`);
          }

          return {
            id: makeId("att"),
            name: file.name,
            type: file.type,
            size: file.size,
            url: data.secure_url,
          };
        })
      );

      setPendingAttachments((prev) => [...prev, ...uploaded].slice(0, 3));
      showToast(`${uploaded.length} image${uploaded.length === 1 ? "" : "s"} uploaded`);
    } catch (err: any) {
      console.error("Cloudinary upload failed:", err);
      showToast(err?.message || "Image upload failed. Please try again.", "error");
    } finally {
      setUploadingAttachments(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removePendingAttachment = (id: string) => {
    setPendingAttachments((prev) =>
      prev.filter((file) => file.id !== id)
    );
  };

  const statusConfig: Record<string, { label: string; color: string }> = {
    open: { label: "Open", color: "text-[#B66B44] bg-[#B66B44]/10" },
    waiting_for_agent: {
      label: "Waiting for agent",
      color: "text-[#5F7161] bg-[#5F7161]/10",
    },
    resolved: {
      label: "Resolved",
      color: "text-[#211000]/50 bg-[#211000]/5",
    },
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-[#FAF4EC] flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="size-8 text-[#B66B44] animate-spin" />
          <p className="text-sm text-[#211000]/50 font-medium">
            Loading support...
          </p>
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
                Chat with Refurnish support for escrow, refunds, delivery,
                pickup, payment verification, and order issues.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#5F7161]/10 border border-[#5F7161]/20 px-4 py-2">
              <span className="size-2 rounded-full bg-[#5F7161] animate-pulse" />
              <span className="text-xs font-bold text-[#5F7161]">
                {ticket
                  ? `Ticket: ${ticket.reference}`
                  : "Start a conversation"}
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
                    {ticket ? (ticket.status === "resolved" ? "Ticket closed" : "Ticket active") : "No active ticket"}
                  </h2>
                </div>

                <button
                  onClick={() => ticket?.status === "resolved" ? startNewTicket() : clearChat()}
                  className="size-9 rounded-full bg-[#FAF4EC] border border-[#211000]/8 hover:bg-red-50 hover:text-red-500 transition-colors grid place-items-center"
                  aria-label={ticket?.status === "resolved" ? "Start a new ticket" : "Resolve ticket"}
                >
                  <Trash2 className="size-4" />
                </button>
              </div>

              {ticket && ticket.status !== "resolved" ? (
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
                    <span className="text-[#211000]/50 font-medium">
                      Status
                    </span>
                    <span
                      className={`font-bold px-2 py-0.5 rounded-full ${
                        statusConfig[ticket.status]?.color || ""
                      }`}
                    >
                      {statusConfig[ticket.status]?.label || ticket.status}
                    </span>
                  </div>

                  <div className="mt-3 pt-3 border-t border-[#211000]/8 flex items-center justify-between text-xs">
                    <span className="text-[#211000]/50 font-medium">
                      Created
                    </span>
                    <span className="font-medium">
                      {formatDate(ticket.createdAt)}
                    </span>
                  </div>
                </div>
              ) : (
                <button
                  onClick={createTicket}
                  className="mt-4 w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-[#B66B44]/15"
                >
                  <Headphones className="size-4" />
                  {ticket?.status === "resolved" ? "Start a new ticket" : "Create support ticket"}
                </button>
              )}
            </div>

            {/* Persistent ticket history */}
            <div className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-5">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">Your support history</p>
                  <h2 className="font-serif text-xl font-medium mt-1">Previous tickets</h2>
                </div>
                <span className="text-[10px] font-bold rounded-full bg-[#FAF4EC] px-2.5 py-1">{ticketHistory.length}</span>
              </div>
              {historyLoading ? (
                <div className="py-4 flex justify-center"><Loader2 className="size-5 animate-spin text-[#B66B44]" /></div>
              ) : ticketHistory.length === 0 ? (
                <p className="text-xs text-[#211000]/45 py-2">Your previous support tickets will appear here.</p>
              ) : (
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {ticketHistory.map((item) => (
                    <button key={item.id} onClick={() => openTicketFromHistory(item)} className={`w-full text-left rounded-2xl border p-3 transition-colors ${ticket?.id === item.id ? "border-[#B66B44]/50 bg-[#B66B44]/5" : "border-[#211000]/8 bg-[#FAF4EC] hover:border-[#B66B44]/30"}`}>
                      <div className="flex items-start justify-between gap-2">
                        <span className="font-mono text-[10px] font-bold">{item.reference}</span>
                        <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full ${statusConfig[item.status]?.color || ""}`}>{statusConfig[item.status]?.label || item.status}</span>
                      </div>
                      <p className="text-xs font-bold mt-1 capitalize">{String(item.topic || "general").replaceAll("_", " ")}</p>
                      <p className="text-[10px] text-[#211000]/40 mt-1">{formatDate(item.createdAt)}</p>
                    </button>
                  ))}
                </div>
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
                    No orders found. Your orders will appear here after
                    purchase.
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
                        {order.reference || order.id} ·{" "}
                        {order.status?.replaceAll("_", " ")}
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
                          {String(
                            selectedOrder.status || "active"
                          ).replaceAll("_", " ")}
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
                          <p
                            className={`text-[11px] mt-0.5 leading-relaxed ${
                              active
                                ? "text-[#E8CEB0]/65"
                                : "text-[#211000]/45"
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
                onClick={() =>
                  sendMessage("Please explain how escrow protection works.")
                }
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
              <div ref={messagesContainerRef} className="h-[62vh] min-h-[520px] overflow-y-auto overscroll-contain bg-[#FAF4EC] p-4 sm:p-6">
                <div className="space-y-5">
                  {messages.map((message) => (
                    <MessageBubble key={message.id} message={message} />
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

                  {pendingBotQuestion && !ticket && (
                    <div className="ml-11 flex flex-wrap gap-2">
                      <button
                        onClick={handleBotSolved}
                        className="rounded-full bg-[#5F7161] hover:bg-[#4d5f4f] text-white px-4 py-2.5 text-xs font-bold transition-colors"
                      >
                        Yes, thank you
                      </button>
                      <button
                        onClick={handleBotNeedsAgent}
                        disabled={sending}
                        className="rounded-full border border-[#B66B44]/40 bg-white hover:bg-[#B66B44]/5 text-[#8C482F] px-4 py-2.5 text-xs font-bold transition-colors disabled:opacity-50"
                      >
                        No, connect me to an agent
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {ticket?.status === "resolved" && (
                <div className="border-t border-[#211000]/8 bg-[#5F7161]/5 px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#5F7161]">This conversation is closed</p>
                    <p className="text-xs text-[#211000]/50 mt-1">Your messages are saved in ticket history. Start a new ticket if you need more help.</p>
                  </div>
                  <button onClick={createTicket} className="shrink-0 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-4 py-2.5 text-xs font-bold">Start new ticket</button>
                </div>
              )}

              {/* Composer */}
              <div className="border-t border-[#211000]/8 bg-white p-4 sm:p-5">
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
                  accept="image/png,image/jpeg,image/webp"
                  multiple
                  onChange={handleAttachmentUpload}
                  className="hidden"
                />

                <div className="flex items-end gap-2">
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="size-11 rounded-full bg-[#FAF4EC] border border-[#211000]/8 hover:border-[#B66B44]/30 hover:text-[#B66B44] transition-colors grid place-items-center shrink-0"
                    aria-label="Attach file"
                    disabled={ticket?.status === "resolved" || uploadingAttachments || sending || (!!pendingBotQuestion && !ticket)}
                  >
                    {uploadingAttachments ? <Loader2 className="size-4 animate-spin" /> : <Paperclip className="size-4" />}
                  </button>

                  <textarea
                    ref={textareaRef}
                    rows={1}
                    value={input}
                    onChange={(e) => {
                      setInput(e.target.value);
                      e.target.style.height = "auto";
                      e.target.style.height = `${Math.min(
                        e.target.scrollHeight,
                        128
                      )}px`;
                    }}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    placeholder={
                      ticket?.status === "resolved"
                        ? "This ticket is resolved"
                        : "Type your message..."
                    }
                    disabled={ticket?.status === "resolved" || sending || (!!pendingBotQuestion && !ticket)}
                    className="min-h-11 max-h-32 flex-1 resize-none rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  />

                  <button
                    onClick={() => sendMessage()}
                    disabled={
                      (!input.trim() && pendingAttachments.length === 0) ||
                      sending ||
                      uploadingAttachments ||
                      (!!pendingBotQuestion && !ticket) ||
                      ticket?.status === "resolved"
                    }
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
                  Attach JPG, PNG, or PDF files up to 5MB. For disputes, upload
                  photos/videos of the issue where possible.
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
      className={`flex items-start gap-3 ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      {!isUser && (
        <div className="size-8 rounded-full bg-[#B66B44]/10 flex items-center justify-center shrink-0">
          <Bot className="size-4 text-[#B66B44]" />
        </div>
      )}

      <div
        className={`max-w-[86%] sm:max-w-[72%] ${
          isUser ? "items-end" : "items-start"
        } flex flex-col`}
      >
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
                    <img
                      src={file.url}
                      alt={file.name}
                      className="max-h-48 max-w-full rounded-lg object-contain"
                    />
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

function Toast({
  message,
  type,
}: {
  message: string;
  type?: "success" | "error";
}) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className={`fixed bottom-6 left-1/2 z-[90] inline-flex items-center gap-2 px-5 py-3 rounded-full shadow-2xl ${
            type === "error"
              ? "bg-red-600 text-white"
              : "bg-[#211000] text-[#FAF4EC]"
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