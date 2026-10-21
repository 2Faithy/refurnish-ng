"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  AlertCircle,
  ArrowRight,
  BadgeCheck,
  Banknote,
  CheckCircle2,
  Clock,
  Copy,
  FileText,
  Flag,
  Headphones,
  Home,
  LayoutDashboard,
  ListChecks,
  Loader2,
  LogOut,
  Mail,
  MessageCircle,
  Package,
  RefreshCcw,
  Search,
  Send,
  ShieldCheck,
  Trash2,
  Truck,
  UserCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

const ADMIN_SESSION_KEY = "refurnish_admin_session";

const ORDERS_KEY = "refurnish_orders";
const PAYOUTS_KEY = "refurnish_seller_payouts";
const LISTINGS_KEY = "refurnish_listings";
const PROFILE_KEY = "refurnish_profile_extended";
const USER_KEY = "refurnish_user";
const COMPLAINTS_KEY = "refurnish_complaints";
const CONTACT_MESSAGES_KEY = "refurnish_contact_messages";
const SUPPORT_TICKET_KEY = "refurnish_support_ticket";

type AdminTab =
  | "overview"
  | "payouts"
  | "listings"
  | "orders"
  | "delivery"
  | "verifications"
  | "disputes"
  | "users"
  | "support"
  | "reports";

const tabs: { id: AdminTab; label: string; icon: any }[] = [
  { id: "listings", label: "Listings", icon: Package },
  { id: "orders", label: "Orders", icon: ListChecks },
  { id: "delivery", label: "Delivery", icon: Truck },
  { id: "verifications", label: "Verifications", icon: UserCheck },
  { id: "payouts", label: "Payouts", icon: Wallet },
  { id: "support", label: "Support", icon: Headphones },
  { id: "reports", label: "Reports", icon: Flag },
];

export default function AdminPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [admin, setAdmin] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>("listings");
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const [orders, setOrders] = useState<any[]>([]);
  const [payouts, setPayouts] = useState<any[]>([]);
  const [listings, setListings] = useState<any[]>([]);
  const [profile, setProfile] = useState<any | null>(null);
  const [user, setUser] = useState<any | null>(null);
  const [complaints, setComplaints] = useState<any[]>([]);
  const [contactMessages, setContactMessages] = useState<any[]>([]);
  const [supportTicket, setSupportTicket] = useState<any | null>(null);

  const [listingsLoading, setListingsLoading] = useState(true);
  const [listingsError, setListingsError] = useState("");
  const [listingTab, setListingTab] = useState<
    "pending" | "approved" | "rejected"
  >("pending");
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);

  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState("");
  const [orderTab, setOrderTab] = useState<
    "pending" | "confirmed" | "rejected"
  >("pending");
  const [selectedOrder, setSelectedOrder] = useState<any | null>(null);
  const [orderRejectReason, setOrderRejectReason] = useState("");
  const [showOrderRejectBox, setShowOrderRejectBox] = useState(false);

  const [verifications, setVerifications] = useState<any[]>([]);
  const [verificationsLoading, setVerificationsLoading] = useState(true);
  const [verificationsError, setVerificationsError] = useState("");
  const [selectedVerification, setSelectedVerification] = useState<any | null>(
    null
  );
  const [verificationRejectReason, setVerificationRejectReason] = useState("");
  const [showVerificationRejectBox, setShowVerificationRejectBox] =
    useState(false);

  const [payoutsData, setPayoutsData] = useState<any[]>([]);
  const [payoutsLoading, setPayoutsLoading] = useState(true);
  const [payoutsError, setPayoutsError] = useState("");
  const [payoutTab, setPayoutTab] = useState<"pending" | "paid">("pending");
  const [selectedPayout, setSelectedPayout] = useState<any | null>(null);
  const [payoutReceiptUrl, setPayoutReceiptUrl] = useState("");
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [payoutActionBusy, setPayoutActionBusy] = useState(false);

  // ── Support state ──
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [supportLoading, setSupportLoading] = useState(true);
  const [supportError, setSupportError] = useState("");
  const [supportTab, setSupportTab] = useState<
    "waiting_for_agent" | "open" | "resolved"
  >("waiting_for_agent");
  const [selectedTicket, setSelectedTicket] = useState<any | null>(null);
  const [ticketMessages, setTicketMessages] = useState<any[]>([]);
  const [ticketMessagesLoading, setTicketMessagesLoading] = useState(false);
  const [replyText, setReplyText] = useState("");
  const [sendingReply, setSendingReply] = useState(false);
  const [resolvingTicket, setResolvingTicket] = useState(false);
  const [showAgentIntroModal, setShowAgentIntroModal] = useState(false);
  const [agentIntroName, setAgentIntroName] = useState("");

  // ── Reports state ──
  const [reports, setReports] = useState<any[]>([]);
  const [reportsLoading, setReportsLoading] = useState(true);
  const [reportsError, setReportsError] = useState("");
  const [reportTab, setReportTab] = useState<
    "open" | "reviewing" | "resolved" | "dismissed"
  >("open");
  const [reportNotes, setReportNotes] = useState<Record<string, string>>({});
  const [reportActionBusy, setReportActionBusy] = useState<string | null>(null);

  const getAdminToken = () => {
    const session = JSON.parse(
      localStorage.getItem(ADMIN_SESSION_KEY) || "null"
    );
    return session?.token || "";
  };

  const fetchListings = async () => {
    setListingsLoading(true);
    setListingsError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listings/admin/all`,
        { headers: { Authorization: `Bearer ${getAdminToken()}` } }
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem(ADMIN_SESSION_KEY);
          router.push("/admin/login");
          return;
        }
        throw new Error(data?.message || "Failed to load listings.");
      }
      setListings(data.listings || []);
    } catch (err: any) {
      console.error(err);
      setListingsError(err.message || "Could not load listings.");
    } finally {
      setListingsLoading(false);
    }
  };

  const fetchOrders = async () => {
    setOrdersLoading(true);
    setOrdersError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/admin/all`,
        { headers: { Authorization: `Bearer ${getAdminToken()}` } }
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem(ADMIN_SESSION_KEY);
          router.push("/admin/login");
          return;
        }
        throw new Error(data?.message || "Failed to load orders.");
      }
      setOrdersData(data.orders || []);
    } catch (err: any) {
      console.error(err);
      setOrdersError(err.message || "Could not load orders.");
    } finally {
      setOrdersLoading(false);
    }
  };

  const fetchVerifications = async () => {
    setVerificationsLoading(true);
    setVerificationsError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/id-verifications`,
        { headers: { Authorization: `Bearer ${getAdminToken()}` } }
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem(ADMIN_SESSION_KEY);
          router.push("/admin/login");
          return;
        }
        throw new Error(data?.message || "Failed to load verifications.");
      }
      setVerifications(data.users || []);
    } catch (err: any) {
      console.error(err);
      setVerificationsError(err.message || "Could not load verifications.");
    } finally {
      setVerificationsLoading(false);
    }
  };

  const fetchPayouts = async () => {
    setPayoutsLoading(true);
    setPayoutsError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payouts/admin/all`,
        { headers: { Authorization: `Bearer ${getAdminToken()}` } }
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem(ADMIN_SESSION_KEY);
          router.push("/admin/login");
          return;
        }
        throw new Error(data?.message || "Failed to load payouts.");
      }
      setPayoutsData(data.payouts || []);
    } catch (err: any) {
      console.error(err);
      setPayoutsError(err.message || "Could not load payouts.");
    } finally {
      setPayoutsLoading(false);
    }
  };

  const fetchSupportTickets = async () => {
    setSupportLoading(true);
    setSupportError("");
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/support/admin/tickets`,
        { headers: { Authorization: `Bearer ${getAdminToken()}` } }
      );
      const data = await res.json();
      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem(ADMIN_SESSION_KEY);
          router.push("/admin/login");
          return;
        }
        throw new Error(data?.message || "Failed to load support tickets.");
      }
      setSupportTickets(data.tickets || []);
    } catch (err: any) {
      console.error(err);
      setSupportError(err.message || "Could not load support tickets.");
    } finally {
      setSupportLoading(false);
    }
  };

  const fetchReports = async () => {
    setReportsLoading(true);
    setReportsError("");

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports`,
        {
          headers: { Authorization: `Bearer ${getAdminToken()}` },
        }
      );

      const data = await res.json();

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
          localStorage.removeItem(ADMIN_SESSION_KEY);
          router.push("/admin/login");
          return;
        }

        throw new Error(data?.message || "Failed to load reports.");
      }

      setReports(data.reports || []);
    } catch (err: any) {
      console.error(err);
      setReportsError(err.message || "Could not load reports.");
    } finally {
      setReportsLoading(false);
    }
  };

  const updateReport = async (
    id: string,
    status: "open" | "reviewing" | "resolved" | "dismissed"
  ) => {
    setReportActionBusy(id);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAdminToken()}`,
          },
          body: JSON.stringify({
            status,
            adminNotes:
              reportNotes[id] ??
              reports.find((r) => r.id === id)?.adminNotes ??
              "",
          }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update report.");
      }

      setToast(`Report marked as ${status.replaceAll("_", " ")}`);
      await fetchReports();
    } catch (err: any) {
      console.error(err);
      setToast(err.message || "Failed to update report.");
    } finally {
      setReportActionBusy(null);
    }
  };

  const saveReportNotes = async (id: string) => {
    setReportActionBusy(id);

    try {
      const report = reports.find((r) => r.id === id);
      if (!report) return;

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/admin/reports/${id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAdminToken()}`,
          },
          body: JSON.stringify({
            status: report.status,
            adminNotes: reportNotes[id] ?? report.adminNotes ?? "",
          }),
        }
      );

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.message || "Failed to save notes.");
      }

      setToast("Admin notes saved");
      await fetchReports();
    } catch (err: any) {
      setToast(err.message || "Failed to save notes.");
    } finally {
      setReportActionBusy(null);
    }
  };

  useEffect(() => {
    try {
      const session = localStorage.getItem(ADMIN_SESSION_KEY);

      if (!session) {
        router.push("/admin/login");
        return;
      }

      setAdmin(JSON.parse(session));
      fetchListings();
      fetchOrders();
      fetchVerifications();
      fetchPayouts();
      fetchSupportTickets();
      fetchReports();
    } catch {
      router.push("/admin/login");
    } finally {
      setCheckingAuth(false);
    }
  }, [router]);

  // Light polling while on the Support tab
  useEffect(() => {
    if (activeTab !== "support") return;
    const interval = setInterval(() => {
      fetchSupportTickets();
    }, 20000);
    return () => clearInterval(interval);
  }, [activeTab]);

  // Light polling while on the Reports tab
  useEffect(() => {
    if (activeTab !== "reports") return;
    const interval = setInterval(() => {
      fetchReports();
    }, 20000);
    return () => clearInterval(interval);
  }, [activeTab]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const logout = () => {
    localStorage.removeItem(ADMIN_SESSION_KEY);
    router.push("/admin/login");
  };

  const saveOrders = (next: any[]) => {
    setOrders(next);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(next));
  };

  const savePayouts = (next: any[]) => {
    setPayouts(next);
    localStorage.setItem(PAYOUTS_KEY, JSON.stringify(next));
  };

  const saveProfile = (next: any) => {
    setProfile(next);
    localStorage.setItem(PROFILE_KEY, JSON.stringify(next));
  };

  const saveUser = (next: any) => {
    setUser(next);
    localStorage.setItem(USER_KEY, JSON.stringify(next));
  };

  const saveComplaints = (next: any[]) => {
    setComplaints(next);
    localStorage.setItem(COMPLAINTS_KEY, JSON.stringify(next));
  };

  const filteredListings = useMemo(() => {
    const statusMap: Record<string, string> = {
      pending: "pending",
      approved: "active",
      rejected: "rejected",
    };
    return listings
      .filter((l) => l.status === statusMap[listingTab])
      .filter((l) => searchable(l, search));
  }, [listings, listingTab, search]);

  const tabCounts = useMemo(
    () => ({
      pending: listings.filter((l) => l.status === "pending").length,
      approved: listings.filter((l) => l.status === "active").length,
      rejected: listings.filter((l) => l.status === "rejected").length,
    }),
    [listings]
  );

  const openListingModal = (listing: any) => {
    setSelectedListing(listing);
    setShowRejectBox(false);
    setRejectReason("");
  };

  const closeListingModal = () => {
    setSelectedListing(null);
    setShowRejectBox(false);
    setRejectReason("");
  };

  const approveFromModal = async () => {
    if (!selectedListing) return;
    await updateListingStatus(selectedListing.id, "active");
    closeListingModal();
  };

  const confirmRejectFromModal = async () => {
    if (!selectedListing || !rejectReason.trim()) return;
    await updateListingStatus(
      selectedListing.id,
      "rejected",
      rejectReason.trim()
    );
    closeListingModal();
  };

  const filteredOrders = useMemo(() => {
    const statusMap: Record<string, string[]> = {
      pending: ["pending_verification", "pending_payment"],
      confirmed: ["confirmed", "completed", "disputed"],
      rejected: ["rejected", "payment_failed"],
    };
    return ordersData
      .filter((o) => statusMap[orderTab].includes(o.status))
      .filter((o) => searchable(o, search));
  }, [ordersData, orderTab, search]);

  const orderTabCounts = useMemo(
    () => ({
      pending: ordersData.filter((o) =>
        ["pending_verification", "pending_payment"].includes(o.status)
      ).length,
      confirmed: ordersData.filter((o) =>
        ["confirmed", "completed", "disputed"].includes(o.status)
      ).length,
      rejected: ordersData.filter((o) =>
        ["rejected", "payment_failed"].includes(o.status)
      ).length,
    }),
    [ordersData]
  );

  const deliveryOrders = useMemo(
    () =>
      ordersData
        .filter((o) => o.deliveryType === "delivery")
        .filter((o) => searchable(o, search)),
    [ordersData, search]
  );

  const toWhatsAppNumber = (phone: string) => {
    const digits = (phone || "").replace(/\D/g, "");
    if (digits.startsWith("234")) return digits;
    if (digits.startsWith("0")) return `234${digits.slice(1)}`;
    return digits;
  };

  const copyDeliveryDetails = (order: any) => {
    const lines = [
      `Order ${order.reference}`,
      `Buyer: ${order.fullName} · ${order.phone} · ${order.email}`,
      `Address: ${order.address || ""}, ${order.lga || ""}, ${order.state || ""}`,
      order.landmark ? `Landmark: ${order.landmark}` : "",
      "",
      "Items:",
      ...(order.items || []).map(
        (item: any) =>
          `- ${item.itemTitle} (Qty ${item.quantity}) — pickup from ${item.sellerName || "seller"}, ${item.sellerAddress || ""}, ${item.sellerState || ""}`
      ),
    ].filter(Boolean);
    navigator.clipboard.writeText(lines.join("\n"));
    setToast("Delivery details copied");
  };

  const updateOrderStatus = async (
    id: string,
    status: string,
    rejectionReason?: string
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAdminToken()}`,
          },
          body: JSON.stringify({ status, rejectionReason }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to update order.");
      setToast(`Order marked as ${status}`);
      await fetchOrders();
    } catch (err: any) {
      console.error(err);
      setToast(err.message || "Failed to update order.");
    }
  };

  const openOrderModal = (order: any) => {
    setSelectedOrder(order);
    setShowOrderRejectBox(false);
    setOrderRejectReason("");
  };

  const closeOrderModal = () => {
    setSelectedOrder(null);
    setShowOrderRejectBox(false);
    setOrderRejectReason("");
  };

  const confirmOrderFromModal = async () => {
    if (!selectedOrder) return;
    await updateOrderStatus(selectedOrder.id, "confirmed");
    closeOrderModal();
  };

  const confirmOrderRejectFromModal = async () => {
    if (!selectedOrder || !orderRejectReason.trim()) return;
    await updateOrderStatus(
      selectedOrder.id,
      "rejected",
      orderRejectReason.trim()
    );
    closeOrderModal();
  };

  const updateVerificationStatus = async (
    id: string,
    status: string,
    rejectionReason?: string
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users/admin/id-verifications/${id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAdminToken()}`,
          },
          body: JSON.stringify({ status, rejectionReason }),
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to update verification.");
      setToast(`ID marked as ${status}`);
      await fetchVerifications();
    } catch (err: any) {
      console.error(err);
      setToast(err.message || "Failed to update verification.");
    }
  };

  const openVerificationModal = (v: any) => {
    setSelectedVerification(v);
    setShowVerificationRejectBox(false);
    setVerificationRejectReason("");
  };

  const closeVerificationModal = () => {
    setSelectedVerification(null);
    setShowVerificationRejectBox(false);
    setVerificationRejectReason("");
  };

  const approveVerificationFromModal = async () => {
    if (!selectedVerification) return;
    await updateVerificationStatus(selectedVerification.id, "verified");
    closeVerificationModal();
  };

  const confirmVerificationRejectFromModal = async () => {
    if (!selectedVerification || !verificationRejectReason.trim()) return;
    await updateVerificationStatus(
      selectedVerification.id,
      "rejected",
      verificationRejectReason.trim()
    );
    closeVerificationModal();
  };

  const filteredVerifications = useMemo(
    () => verifications.filter((v) => searchable(v, search)),
    [verifications, search]
  );

  const filteredPayouts = useMemo(() => {
    return payoutsData
      .filter((p) =>
        payoutTab === "pending" ? p.status !== "paid" : p.status === "paid"
      )
      .filter((p) => searchable(p, search));
  }, [payoutsData, payoutTab, search]);

  const payoutTabCounts = useMemo(
    () => ({
      pending: payoutsData.filter((p) => p.status !== "paid").length,
      paid: payoutsData.filter((p) => p.status === "paid").length,
    }),
    [payoutsData]
  );

  const requestBankDetails = async (id: string) => {
    setPayoutActionBusy(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payouts/admin/${id}/request-bank-details`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getAdminToken()}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to send reminder.");
      setToast("Reminder email sent to seller");
    } catch (err: any) {
      setToast(err.message || "Failed to send reminder.");
    } finally {
      setPayoutActionBusy(false);
    }
  };

  const uploadReceiptToCloudinary = async (file: File) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset as string);
    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      {
        method: "POST",
        body: formData,
      }
    );
    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Upload failed.");
    return data.secure_url as string;
  };

  const handleReceiptUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadingReceipt(true);
    try {
      const url = await uploadReceiptToCloudinary(file);
      setPayoutReceiptUrl(url);
    } catch (err: any) {
      setToast(err.message || "Couldn't upload receipt.");
    } finally {
      setUploadingReceipt(false);
    }
  };

  const markPayoutPaidFromModal = async () => {
    if (!selectedPayout || !payoutReceiptUrl) return;
    setPayoutActionBusy(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/payouts/admin/${selectedPayout.id}/mark-paid`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAdminToken()}`,
          },
          body: JSON.stringify({ receiptUrl: payoutReceiptUrl }),
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to mark payout as paid.");
      setToast("Payout marked as paid — seller notified");
      setSelectedPayout(null);
      setPayoutReceiptUrl("");
      await fetchPayouts();
    } catch (err: any) {
      setToast(err.message || "Failed to mark payout as paid.");
    } finally {
      setPayoutActionBusy(false);
    }
  };

  // ── Support helpers ──

  const filteredSupportTickets = useMemo(() => {
    return supportTickets
      .filter((t) => t.status === supportTab)
      .filter((t) => searchable(t, search));
  }, [supportTickets, supportTab, search]);

  const supportTabCounts = useMemo(
    () => ({
      waiting_for_agent: supportTickets.filter(
        (t) => t.status === "waiting_for_agent"
      ).length,
      open: supportTickets.filter((t) => t.status === "open").length,
      resolved: supportTickets.filter((t) => t.status === "resolved").length,
    }),
    [supportTickets]
  );

  const openTicketModal = async (ticket: any) => {
    setSelectedTicket(ticket);
    setTicketMessages([]);
    setReplyText("");
    setTicketMessagesLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/support/admin/tickets/${ticket.id}/messages`,
        { headers: { Authorization: `Bearer ${getAdminToken()}` } }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to load conversation.");
      setSelectedTicket(data.ticket);
      setTicketMessages(data.messages || []);

      setSupportTickets((prev) =>
        prev.map((t) =>
          t.id === ticket.id
            ? { ...t, adminLastReadAt: new Date().toISOString() }
            : t
        )
      );
    } catch (err: any) {
      console.error(err);
      setToast(err.message || "Failed to load conversation.");
    } finally {
      setTicketMessagesLoading(false);
    }
  };

  const closeTicketModal = () => {
    setSelectedTicket(null);
    setTicketMessages([]);
    setReplyText("");
    setShowAgentIntroModal(false);
    setAgentIntroName("");
  };

  const sendTicketReply = async (quickReply?: string) => {
    const messageText = (quickReply ?? replyText).trim();
    if (!selectedTicket || !messageText || sendingReply) return false;
    setSendingReply(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/support/admin/tickets/${selectedTicket.id}/messages`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAdminToken()}`,
          },
          body: JSON.stringify({ text: messageText }),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to send reply.");

      setTicketMessages((prev) => [...prev, data.message]);
      if (!quickReply) setReplyText("");
      setToast("Reply sent — user notified by email");

      setSelectedTicket((prev: any) =>
        prev ? { ...prev, status: "open" } : prev
      );
      setSupportTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id
            ? { ...t, status: "open", updatedAt: new Date().toISOString() }
            : t
        )
      );
      return true;
    } catch (err: any) {
      console.error(err);
      setToast(err.message || "Failed to send reply.");
      return false;
    } finally {
      setSendingReply(false);
    }
  };

  const sendAgentIntroduction = async () => {
    const name = agentIntroName.trim();
    if (!name) {
      setToast("Enter the name you want the customer to see.");
      return;
    }
    if (!selectedTicket) return;
    const customerFirstName = selectedTicket.user?.name?.split(" ")[0] || "there";
    const sent = await sendTicketReply(
      `Hi ${customerFirstName}, I'm ${name}. ${name} has joined this chat and will help you with your issue.`
    );
    if (sent) {
      setShowAgentIntroModal(false);
      setAgentIntroName("");
    }
  };

  const resolveTicketFromModal = async () => {
    if (!selectedTicket || resolvingTicket) return;
    setResolvingTicket(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/support/admin/tickets/${selectedTicket.id}/resolve`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getAdminToken()}` },
        }
      );
      const data = await res.json();
      if (!res.ok)
        throw new Error(data?.message || "Failed to resolve ticket.");
      setToast("Ticket resolved");
      setSupportTickets((prev) =>
        prev.map((t) =>
          t.id === selectedTicket.id ? { ...t, status: "resolved" } : t
        )
      );
      closeTicketModal();
    } catch (err: any) {
      console.error(err);
      setToast(err.message || "Failed to resolve ticket.");
    } finally {
      setResolvingTicket(false);
    }
  };

  // ── Reports helpers ──

  const reportTabCounts = useMemo(
    () => ({
      open: reports.filter((r) => r.status === "open").length,
      reviewing: reports.filter((r) => r.status === "reviewing").length,
      resolved: reports.filter((r) => r.status === "resolved").length,
      dismissed: reports.filter((r) => r.status === "dismissed").length,
    }),
    [reports]
  );

  const stats = useMemo(() => {
    const pendingPayouts = payouts.filter((p) => p.status === "pending").length;
    const pendingListings = listings.filter(
      (l) => l.status === "pending"
    ).length;
    const escrowOrders = orders.filter(
      (o) => o.escrowStatus === "funds_held"
    ).length;
    const openComplaints = complaints.filter(
      (c) => c.status !== "resolved"
    ).length;

    const payoutAmount = payouts
      .filter((p) => p.status === "pending")
      .reduce((sum, p) => sum + Number(p.amount || 0), 0);

    return {
      pendingPayouts,
      pendingListings,
      escrowOrders,
      openComplaints,
      payoutAmount,
    };
  }, [payouts, listings, orders, complaints]);

  const updatePayoutStatus = (id: string, status: string) => {
    const next = payouts.map((p) =>
      p.id === id
        ? {
            ...p,
            status,
            updatedAt: new Date().toISOString(),
            ...(status === "paid"
              ? { paidAt: new Date().toISOString() }
              : {}),
          }
        : p
    );

    savePayouts(next);
    setToast(`Payout marked as ${status}`);
  };

  const updateListingStatus = async (
    id: string,
    status: string,
    rejectionReason?: string
  ) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}/review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getAdminToken()}`,
          },
          body: JSON.stringify({ status, rejectionReason }),
        }
      );

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update listing.");
      }

      setToast(`Listing marked as ${status}`);
      await fetchListings();
    } catch (err: any) {
      console.error("Failed to update listing:", err);
      setToast(err.message || "Failed to update listing.");
    }
  };

  const deleteListing = async (id: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${id}`,
        {
          method: "DELETE",
          headers: { Authorization: `Bearer ${getAdminToken()}` },
        }
      );
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to delete listing.");
      }

      setToast("Listing deleted");
      await fetchListings();
    } catch (err: any) {
      console.error("Failed to delete listing:", err);
      setToast(err.message || "Failed to delete listing.");
    }
  };

  const updateOrder = (id: string, updates: any) => {
    const next = orders.map((o) =>
      o.id === id
        ? {
            ...o,
            ...updates,
            adminUpdatedAt: new Date().toISOString(),
          }
        : o
    );

    saveOrders(next);
    setToast("Order updated");
  };

  const updateComplaint = (index: number, updates: any) => {
    const next = complaints.map((c, i) =>
      i === index
        ? {
            ...c,
            ...updates,
            updatedAt: new Date().toISOString(),
          }
        : c
    );

    saveComplaints(next);
    setToast("Dispute updated");
  };

  if (checkingAuth) {
    return (
      <main className="min-h-screen bg-[#FAF4EC] text-[#211000] flex items-center justify-center">
        <Loader2 className="size-8 animate-spin text-[#B66B44]" />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000]">
      {/* Topbar */}
      <header className="sticky top-0 z-40 bg-[#FAF4EC]/90 backdrop-blur-xl border-b border-[#211000]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 h-16 flex items-center justify-between">
          <Link href="/admin" className="flex items-center gap-3">
            <div className="size-10 rounded-2xl bg-[#211000] text-[#E8CEB0] grid place-items-center">
              <ShieldCheck className="size-5" />
            </div>

            <div>
              <p className="font-serif text-lg font-medium leading-none">
                Refurnish Admin
              </p>
              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44] mt-1">
                Control panel
              </p>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-2 rounded-full border border-[#211000]/10 bg-white px-4 py-2 text-xs font-bold hover:border-[#B66B44]/30 transition-colors"
            >
              <Home className="size-3.5" />
              Site
            </Link>

            <button
              onClick={logout}
              className="inline-flex items-center gap-2 rounded-full bg-[#211000] text-[#FAF4EC] px-4 py-2 text-xs font-bold hover:bg-[#211000]/90 transition-colors"
            >
              <LogOut className="size-3.5" />
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-10 py-8">
        {/* Header */}
        <div className="mb-8">
          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
            Admin dashboard
          </p>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-5 mt-2">
            <div>
              <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight">
                Operations overview
              </h1>
              <p className="text-sm text-[#211000]/55 font-medium mt-2">
                Review and moderate seller listings.
              </p>
            </div>

            <div className="text-xs text-[#211000]/45 font-medium">
              Signed in as{" "}
              <span className="font-bold text-[#211000]">{admin?.email}</span>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2 mb-6">
          {tabs.map((tab) => {
            const Icon = tab.icon;

            let badgeCount = 0;
            if (tab.id === "support") {
              badgeCount = supportTabCounts.waiting_for_agent;
            } else if (tab.id === "reports") {
              badgeCount = reportTabCounts.open;
            }

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold border transition-all relative ${
                  activeTab === tab.id
                    ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                    : "bg-white text-[#211000]/60 border-[#211000]/10 hover:border-[#211000]/25"
                }`}
              >
                <Icon className="size-3.5" />
                {tab.label}
                {badgeCount > 0 && (
                  <span className="inline-flex items-center justify-center min-w-4 h-4 rounded-full bg-[#B66B44] text-white text-[9px] px-1">
                    {badgeCount}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="relative mb-6">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#211000]/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${activeTab}...`}
            className="w-full rounded-full bg-white border border-[#211000]/8 pl-11 pr-10 py-3 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44]"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              <X className="size-4 text-[#211000]/35" />
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {activeTab === "listings" && (
            <AdminSection key="listings">
              <AdminCard title="Listings moderation">
                <div className="flex gap-1.5 mb-6">
                  {(["pending", "approved", "rejected"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setListingTab(t)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all capitalize ${
                        listingTab === t
                          ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                          : "bg-white text-[#211000]/60 border-[#211000]/10 hover:border-[#211000]/25"
                      }`}
                    >
                      {t}
                      <span
                        className={`inline-flex items-center justify-center min-w-5 h-5 rounded-full text-[10px] px-1 ${
                          listingTab === t
                            ? "bg-[#E8CEB0] text-[#211000]"
                            : "bg-[#211000]/8 text-[#211000]/60"
                        }`}
                      >
                        {tabCounts[t]}
                      </span>
                    </button>
                  ))}
                </div>

                {listingsLoading ? (
                  <div className="py-14 flex justify-center">
                    <Loader2 className="size-6 animate-spin text-[#B66B44]" />
                  </div>
                ) : listingsError ? (
                  <div className="py-14 text-center">
                    <p className="text-sm text-red-600 font-medium mb-3">
                      {listingsError}
                    </p>
                    <button
                      onClick={fetchListings}
                      className="text-xs font-bold text-[#B66B44] hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : filteredListings.length === 0 ? (
                  <EmptyState
                    text={
                      listingTab === "pending"
                        ? "No listings awaiting review."
                        : listingTab === "approved"
                          ? "No approved listings yet."
                          : "No rejected listings."
                    }
                  />
                ) : (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {filteredListings.map((listing) => (
                      <div
                        key={listing.id}
                        className="rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 overflow-hidden"
                      >
                        <div className="aspect-[4/3] bg-[#E8CEB0]/30 overflow-hidden">
                          {listing.photos?.[0] && (
                            <img
                              src={listing.photos[0]}
                              alt={listing.itemTitle}
                              className="w-full h-full object-cover"
                            />
                          )}
                        </div>

                        <div className="p-4">
                          <p className="text-[10px] uppercase tracking-wider text-[#211000]/45 font-bold">
                            {listing.category}
                          </p>
                          <p className="font-serif text-lg font-medium mt-1 truncate">
                            {listing.itemTitle}
                          </p>
                          <p className="text-sm font-bold mt-1">
                            {formatNaira(Number(listing.sellingPrice) || 0)}
                          </p>

                          <div className="mt-3">
                            <StatusBadge status={listing.status} />
                          </div>

                          {listing.status === "rejected" &&
                            listing.rejectionReason && (
                              <p className="mt-2 text-[11px] text-red-600 font-medium">
                                Reason: {listing.rejectionReason}
                              </p>
                            )}

                          <div className="mt-4 flex flex-wrap gap-2">
                            {listingTab === "pending" && (
                              <ActionButton
                                label="View"
                                onClick={() => openListingModal(listing)}
                              />
                            )}

                            {listingTab === "approved" && (
                              <>
                                <Link
                                  href={`/product/${listing.id}`}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-[#211000]/10 hover:border-[#B66B44]/30 bg-white px-3 py-2 text-xs font-bold transition-colors"
                                >
                                  View
                                </Link>
                                <button
                                  onClick={() => {
                                    if (
                                      window.confirm(
                                        `Delete "${listing.itemTitle}"? This can't be undone.`
                                      )
                                    ) {
                                      deleteListing(listing.id);
                                    }
                                  }}
                                  className="inline-flex items-center gap-1.5 rounded-full border border-red-200 text-red-500 px-3 py-2 text-xs font-bold hover:bg-red-50"
                                >
                                  <Trash2 className="size-3.5" />
                                  Delete
                                </button>
                              </>
                            )}

                            {listingTab === "rejected" && (
                              <button
                                onClick={() => deleteListing(listing.id)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 text-red-500 px-3 py-2 text-xs font-bold hover:bg-red-50"
                              >
                                <Trash2 className="size-3.5" />
                                Delete
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AdminCard>
            </AdminSection>
          )}

          {activeTab === "orders" && (
            <AdminSection key="orders">
              <AdminCard title="Order & payment review">
                <div className="flex gap-1.5 mb-6">
                  {(["pending", "confirmed", "rejected"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setOrderTab(t)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all capitalize ${
                        orderTab === t
                          ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                          : "bg-white text-[#211000]/60 border-[#211000]/10 hover:border-[#211000]/25"
                      }`}
                    >
                      {t}
                      <span
                        className={`inline-flex items-center justify-center min-w-5 h-5 rounded-full text-[10px] px-1 ${
                          orderTab === t
                            ? "bg-[#E8CEB0] text-[#211000]"
                            : "bg-[#211000]/8 text-[#211000]/60"
                        }`}
                      >
                        {orderTabCounts[t]}
                      </span>
                    </button>
                  ))}
                </div>

                {ordersLoading ? (
                  <div className="py-14 flex justify-center">
                    <Loader2 className="size-6 animate-spin text-[#B66B44]" />
                  </div>
                ) : ordersError ? (
                  <div className="py-14 text-center">
                    <p className="text-sm text-red-600 font-medium mb-3">
                      {ordersError}
                    </p>
                    <button
                      onClick={fetchOrders}
                      className="text-xs font-bold text-[#B66B44] hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : filteredOrders.length === 0 ? (
                  <EmptyState
                    text={
                      orderTab === "pending"
                        ? "No orders awaiting review."
                        : orderTab === "confirmed"
                          ? "No confirmed orders yet."
                          : "No rejected orders."
                    }
                  />
                ) : (
                  <div className="divide-y divide-[#211000]/6">
                    {filteredOrders.map((order) => (
                      <div
                        key={order.id}
                        className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div>
                          <p className="font-bold font-mono text-sm">
                            {order.reference}
                          </p>
                          <p className="text-xs text-[#211000]/55 font-medium mt-1">
                            {formatNaira(Number(order.total))} ·{" "}
                            {order.paymentMethod} · {order.fullName}
                          </p>
                          <p className="text-[10px] text-[#211000]/35 mt-1">
                            {order.email} · {order.createdAt?.split("T")[0]}
                          </p>
                          {order.status === "rejected" &&
                            order.rejectionReason && (
                              <p className="text-[11px] text-red-600 font-medium mt-1">
                                Reason: {order.rejectionReason}
                              </p>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status={order.status} />
                          {order.status === "pending_verification" &&
                            order.paymentMethod === "transfer" && (
                              <ActionButton
                                label="Review"
                                onClick={() => openOrderModal(order)}
                              />
                            )}
                          {order.status !== "pending_verification" && (
                            <ActionButton
                              label="View"
                              onClick={() => openOrderModal(order)}
                            />
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AdminCard>
            </AdminSection>
          )}

          {activeTab === "delivery" && (
            <AdminSection key="delivery">
              <AdminCard title="Deliveries to arrange">
                {ordersLoading ? (
                  <div className="py-14 flex justify-center">
                    <Loader2 className="size-6 animate-spin text-[#B66B44]" />
                  </div>
                ) : ordersError ? (
                  <div className="py-14 text-center">
                    <p className="text-sm text-red-600 font-medium mb-3">
                      {ordersError}
                    </p>
                    <button
                      onClick={fetchOrders}
                      className="text-xs font-bold text-[#B66B44] hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : deliveryOrders.length === 0 ? (
                  <EmptyState text="No home-delivery orders right now." />
                ) : (
                  <div className="grid md:grid-cols-2 gap-4">
                    {deliveryOrders.map((order) => (
                      <div
                        key={order.id}
                        className="rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 p-5"
                      >
                        <div className="flex items-start justify-between gap-3 mb-3">
                          <div>
                            <p className="font-bold font-mono text-sm">
                              {order.reference}
                            </p>
                            <p className="text-xs text-[#211000]/55 font-medium mt-0.5">
                              {order.fullName} · {order.phone}
                            </p>
                          </div>
                          <StatusBadge status={order.status} />
                        </div>

                        <div className="rounded-xl bg-white border border-[#211000]/8 p-3 mb-3">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/40 mb-1">
                            Delivery address
                          </p>
                          <p className="text-sm font-medium">
                            {order.address}, {order.lga}, {order.state}
                          </p>
                          {order.landmark && (
                            <p className="text-xs text-[#211000]/55 mt-1">
                              Landmark: {order.landmark}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2 mb-4">
                          {(order.items || []).map((item: any, i: number) => (
                            <div
                              key={i}
                              className="rounded-xl bg-white border border-[#211000]/8 p-3 text-xs"
                            >
                              <p className="font-bold">{item.itemTitle}</p>
                              <p className="text-[#211000]/55 mt-0.5">
                                Qty {item.quantity} · Pickup from{" "}
                                {item.sellerName} — {item.sellerAddress},{" "}
                                {item.sellerState}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div className="flex flex-wrap gap-2">
                          <a
                            href={`https://wa.me/${toWhatsAppNumber(order.phone)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#211000]/10 hover:border-[#5F7161]/40 bg-white px-3 py-2 text-xs font-bold transition-colors"
                          >
                            <MessageCircle className="size-3.5 text-[#5F7161]" />
                            WhatsApp buyer
                          </a>
                          <a
                            href={`mailto:${order.email}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#211000]/10 hover:border-[#B66B44]/30 bg-white px-3 py-2 text-xs font-bold transition-colors"
                          >
                            <Mail className="size-3.5" />
                            Email buyer
                          </a>
                          <button
                            onClick={() => copyDeliveryDetails(order)}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#211000]/10 hover:border-[#B66B44]/30 bg-white px-3 py-2 text-xs font-bold transition-colors"
                          >
                            <Copy className="size-3.5" />
                            Copy details
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AdminCard>
            </AdminSection>
          )}

          {activeTab === "verifications" && (
            <AdminSection key="verifications">
              <AdminCard title="Identity verifications">
                {verificationsLoading ? (
                  <div className="py-14 flex justify-center">
                    <Loader2 className="size-6 animate-spin text-[#B66B44]" />
                  </div>
                ) : verificationsError ? (
                  <div className="py-14 text-center">
                    <p className="text-sm text-red-600 font-medium mb-3">
                      {verificationsError}
                    </p>
                    <button
                      onClick={fetchVerifications}
                      className="text-xs font-bold text-[#B66B44] hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : filteredVerifications.length === 0 ? (
                  <EmptyState text="No IDs awaiting review." />
                ) : (
                  <div className="divide-y divide-[#211000]/6">
                    {filteredVerifications.map((v) => (
                      <div
                        key={v.id}
                        className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <div className="size-11 rounded-xl overflow-hidden bg-[#E8CEB0]/40 shrink-0">
                            {v.profileImage ? (
                              <img
                                src={v.profileImage}
                                alt=""
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center font-bold text-[#B66B44]">
                                {v.name?.[0]?.toUpperCase() || "U"}
                              </div>
                            )}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{v.name}</p>
                            <p className="text-xs text-[#211000]/55 font-medium mt-0.5">
                              {v.email}
                            </p>
                            <p className="text-[10px] text-[#211000]/35 mt-1">
                              {v.idType} · {v.idNumber}
                            </p>
                          </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-2">
                          <StatusBadge status="pending" />
                          <ActionButton
                            label="Review"
                            onClick={() => openVerificationModal(v)}
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </AdminCard>
            </AdminSection>
          )}

          {activeTab === "payouts" && (
            <AdminSection key="payouts">
              <AdminCard title="Seller payouts">
                <div className="flex gap-1.5 mb-6">
                  {(["pending", "paid"] as const).map((t) => (
                    <button
                      key={t}
                      onClick={() => setPayoutTab(t)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all capitalize ${
                        payoutTab === t
                          ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                          : "bg-white text-[#211000]/60 border-[#211000]/10 hover:border-[#211000]/25"
                      }`}
                    >
                      {t}
                      <span
                        className={`inline-flex items-center justify-center min-w-5 h-5 rounded-full text-[10px] px-1 ${
                          payoutTab === t
                            ? "bg-[#E8CEB0] text-[#211000]"
                            : "bg-[#211000]/8 text-[#211000]/60"
                        }`}
                      >
                        {payoutTabCounts[t]}
                      </span>
                    </button>
                  ))}
                </div>

                {payoutsLoading ? (
                  <div className="py-14 flex justify-center">
                    <Loader2 className="size-6 animate-spin text-[#B66B44]" />
                  </div>
                ) : payoutsError ? (
                  <div className="py-14 text-center">
                    <p className="text-sm text-red-600 font-medium mb-3">
                      {payoutsError}
                    </p>
                    <button
                      onClick={fetchPayouts}
                      className="text-xs font-bold text-[#B66B44] hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : filteredPayouts.length === 0 ? (
                  <EmptyState
                    text={
                      payoutTab === "pending"
                        ? "No pending payouts."
                        : "No payouts made yet."
                    }
                  />
                ) : (
                  <div className="divide-y divide-[#211000]/6">
                    {filteredPayouts.map((payout) => {
                      const hasBank = !!(
                        payout.seller?.bankName &&
                        payout.seller?.accountNumber
                      );
                      return (
                        <div
                          key={payout.id}
                          className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          <div>
                            <p className="font-bold text-sm">
                              {payout.itemTitle}
                            </p>
                            <p className="text-xs text-[#211000]/55 font-medium mt-1">
                              {payout.seller?.name} · {payout.seller?.email}
                            </p>
                            <p className="text-xs text-[#211000]/45 font-medium mt-1">
                              Net {formatNaira(Number(payout.netAmount))} (gross{" "}
                              {formatNaira(Number(payout.grossAmount))},{" "}
                              {payout.feePercent}% fee)
                            </p>
                            {hasBank ? (
                              <p className="text-[11px] text-[#5F7161] font-bold mt-1">
                                {payout.seller.bankName} ·{" "}
                                {payout.seller.accountNumber}
                              </p>
                            ) : (
                              <p className="text-[11px] text-red-500 font-bold mt-1">
                                No bank details on file
                              </p>
                            )}
                            {payout.issueReported && (
                              <p className="text-[11px] text-red-600 font-medium mt-1">
                                Issue reported: {payout.issueDescription}
                              </p>
                            )}
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={payout.status} />
                            {payout.status !== "paid" && !hasBank && (
                              <ActionButton
                                label="Request bank details"
                                onClick={() => requestBankDetails(payout.id)}
                              />
                            )}
                            {payout.status !== "paid" && hasBank && (
                              <ActionButton
                                label="Mark as paid"
                                tone="success"
                                onClick={() => {
                                  setSelectedPayout(payout);
                                  setPayoutReceiptUrl("");
                                }}
                              />
                            )}
                            {payout.status === "paid" &&
                              payout.receiptUrl && (
                                <a
                                  href={payout.receiptUrl}
                                  target="_blank"
                                  rel="noreferrer"
                                  className="rounded-full border border-[#211000]/10 hover:border-[#B66B44]/30 bg-white px-3 py-2 text-xs font-bold transition-colors"
                                >
                                  View receipt
                                </a>
                              )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </AdminCard>
            </AdminSection>
          )}

          {activeTab === "support" && (
            <AdminSection key="support">
              <AdminCard title="Support tickets">
                <div className="flex gap-1.5 mb-6">
                  {(
                    ["waiting_for_agent", "open", "resolved"] as const
                  ).map((t) => (
                    <button
                      key={t}
                      onClick={() => setSupportTab(t)}
                      className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border transition-all capitalize ${
                        supportTab === t
                          ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                          : "bg-white text-[#211000]/60 border-[#211000]/10 hover:border-[#211000]/25"
                      }`}
                    >
                      {t.replaceAll("_", " ")}
                      <span
                        className={`inline-flex items-center justify-center min-w-5 h-5 rounded-full text-[10px] px-1 ${
                          supportTab === t
                            ? "bg-[#E8CEB0] text-[#211000]"
                            : "bg-[#211000]/8 text-[#211000]/60"
                        }`}
                      >
                        {supportTabCounts[t]}
                      </span>
                    </button>
                  ))}

                  <button
                    onClick={fetchSupportTickets}
                    className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-[#211000]/10 bg-white hover:border-[#B66B44]/30 transition-colors"
                  >
                    <RefreshCcw className="size-3.5" />
                    Refresh
                  </button>
                </div>

                {supportLoading ? (
                  <div className="py-14 flex justify-center">
                    <Loader2 className="size-6 animate-spin text-[#B66B44]" />
                  </div>
                ) : supportError ? (
                  <div className="py-14 text-center">
                    <p className="text-sm text-red-600 font-medium mb-3">
                      {supportError}
                    </p>
                    <button
                      onClick={fetchSupportTickets}
                      className="text-xs font-bold text-[#B66B44] hover:underline"
                    >
                      Try again
                    </button>
                  </div>
                ) : filteredSupportTickets.length === 0 ? (
                  <EmptyState
                    text={
                      supportTab === "waiting_for_agent"
                        ? "No tickets waiting for a reply."
                        : supportTab === "open"
                          ? "No open tickets."
                          : "No resolved tickets yet."
                    }
                  />
                ) : (
                  <div className="divide-y divide-[#211000]/6">
                    {filteredSupportTickets.map((ticket) => {
                      const lastMessage = ticket.messages?.[0];
                      return (
                        <div
                          key={ticket.id}
                          className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          <div className="flex items-start gap-3 min-w-0">
                            <div className="size-10 rounded-full bg-[#B66B44]/10 flex items-center justify-center shrink-0 font-bold text-[#B66B44] text-sm">
                              {ticket.user?.name?.[0]?.toUpperCase() || "U"}
                            </div>
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 flex-wrap">
                                <p className="font-bold text-sm">
                                  {ticket.user?.name}
                                </p>
                                <span className="font-mono text-[10px] text-[#211000]/40">
                                  {ticket.reference}
                                </span>
                              </div>
                              <p className="text-xs text-[#211000]/55 font-medium mt-0.5">
                                {ticket.user?.email}
                              </p>
                              <p className="text-xs text-[#211000]/45 font-medium mt-1 truncate max-w-md">
                                {lastMessage
                                  ? `${lastMessage.role === "agent" ? "You: " : ""}${lastMessage.text}`
                                  : "No messages yet"}
                              </p>
                              <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                                <span className="text-[10px] font-bold bg-[#E8CEB0]/30 px-2 py-0.5 rounded-full capitalize">
                                  {ticket.topic}
                                </span>
                                {ticket.order && (
                                  <span className="text-[10px] font-bold bg-[#5F7161]/10 text-[#5F7161] px-2 py-0.5 rounded-full font-mono">
                                    {ticket.order.reference}
                                  </span>
                                )}
                                <span className="text-[10px] text-[#211000]/35 font-medium">
                                  Updated{" "}
                                  {new Date(ticket.updatedAt).toLocaleString(
                                    [],
                                    {
                                      month: "short",
                                      day: "numeric",
                                      hour: "2-digit",
                                      minute: "2-digit",
                                    }
                                  )}
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap items-center gap-2 shrink-0">
                            <StatusBadge status={ticket.status} />
                            <ActionButton
                              label={
                                ticket.status === "resolved" ? "View" : "Reply"
                              }
                              onClick={() => openTicketModal(ticket)}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </AdminCard>
            </AdminSection>
          )}

          {activeTab === "reports" && (
            <AdminSection key="reports">
              <AdminCard title="User reports">
                <div className="flex flex-wrap gap-2 mb-6">
                  {(
                    ["open", "reviewing", "resolved", "dismissed"] as const
                  ).map((status) => {
                    const count = reports.filter(
                      (r) => r.status === status
                    ).length;

                    return (
                      <button
                        key={status}
                        onClick={() => setReportTab(status)}
                        className={`inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border capitalize ${
                          reportTab === status
                            ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                            : "bg-white text-[#211000]/60 border-[#211000]/10"
                        }`}
                      >
                        {status}
                        <span className="rounded-full bg-[#211000]/10 px-2 py-0.5">
                          {count}
                        </span>
                      </button>
                    );
                  })}

                  <button
                    onClick={fetchReports}
                    className="ml-auto inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold border border-[#211000]/10 bg-white hover:border-[#B66B44]/30 transition-colors"
                  >
                    <RefreshCcw className="size-3.5" />
                    Refresh
                  </button>
                </div>

                {reportsLoading ? (
                  <div className="py-14 flex justify-center">
                    <Loader2 className="size-6 animate-spin text-[#B66B44]" />
                  </div>
                ) : reportsError ? (
                  <div className="py-10 text-center">
                    <p className="text-sm text-red-600 mb-3">{reportsError}</p>
                    <button
                      onClick={fetchReports}
                      className="text-xs font-bold text-[#B66B44]"
                    >
                      Try again
                    </button>
                  </div>
                ) : reports.filter(
                    (r) => r.status === reportTab && searchable(r, search)
                  ).length === 0 ? (
                  <EmptyState text={`No ${reportTab} reports.`} />
                ) : (
                  <div className="divide-y divide-[#211000]/10">
                    {reports
                      .filter(
                        (r) =>
                          r.status === reportTab && searchable(r, search)
                      )
                      .map((report) => (
                        <div key={report.id} className="py-5 space-y-4">
                          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-3">
                            <div>
                              <p className="font-bold text-sm">
                                {report.reason}
                              </p>
                              <p className="text-xs text-[#211000]/50 mt-1">
                                Reported{" "}
                                {new Date(report.createdAt).toLocaleString()}
                              </p>
                            </div>
                            <StatusBadge status={report.status} />
                          </div>

                          <div className="grid sm:grid-cols-2 gap-4">
                            <div className="rounded-xl bg-[#FAF4EC] p-4">
                              <p className="text-[10px] uppercase tracking-wider font-bold text-[#211000]/50 mb-2">
                                Reported by
                              </p>
                              <p className="text-sm font-bold">
                                {report.reporter?.name}
                              </p>
                              <p className="text-xs text-[#211000]/60">
                                {report.reporter?.email}
                              </p>
                            </div>

                            <div className="rounded-xl bg-[#FAF4EC] p-4">
                              <p className="text-[10px] uppercase tracking-wider font-bold text-[#211000]/50 mb-2">
                                Reported user
                              </p>
                              <p className="text-sm font-bold">
                                {report.reportedUser?.name}
                              </p>
                              <p className="text-xs text-[#211000]/60">
                                {report.reportedUser?.email}
                              </p>
                            </div>
                          </div>

                          {report.conversation?.listing?.itemTitle && (
                            <p className="text-xs text-[#211000]/70">
                              Listing:{" "}
                              <span className="font-bold">
                                {report.conversation.listing.itemTitle}
                              </span>
                            </p>
                          )}

                          <div>
                            <p className="text-xs font-bold mb-1">
                              Report details
                            </p>
                            <p className="text-sm whitespace-pre-wrap text-[#211000]/70">
                              {report.details ||
                                "No additional details supplied."}
                            </p>
                          </div>

                          <div>
                            <label className="text-xs font-bold block mb-2">
                              Internal admin notes
                            </label>
                            <textarea
                              value={
                                reportNotes[report.id] ??
                                report.adminNotes ??
                                ""
                              }
                              onChange={(e) =>
                                setReportNotes((prev) => ({
                                  ...prev,
                                  [report.id]: e.target.value,
                                }))
                              }
                              rows={2}
                              placeholder="Add investigation notes..."
                              className="w-full rounded-xl border border-[#211000]/10 bg-white p-3 text-sm focus:outline-none focus:border-[#B66B44]"
                            />
                          </div>

                          <div className="flex flex-wrap gap-2">
                            <Link
                              href={`/dashboard/messages?conversationId=${encodeURIComponent(report.conversationId)}`}
                              className="inline-flex items-center justify-center rounded-full border border-[#211000]/10 bg-white px-4 py-2 text-xs font-bold"
                            >
                              View conversation
                            </Link>

                            <button
                              onClick={() => saveReportNotes(report.id)}
                              disabled={reportActionBusy === report.id}
                              className="rounded-full border border-[#211000]/10 bg-white px-4 py-2 text-xs font-bold disabled:opacity-50"
                            >
                              Save notes
                            </button>

                            {report.status === "open" && (
                              <button
                                onClick={() =>
                                  updateReport(report.id, "reviewing")
                                }
                                disabled={reportActionBusy === report.id}
                                className="rounded-full bg-[#211000] text-white px-4 py-2 text-xs font-bold disabled:opacity-50"
                              >
                                Start review
                              </button>
                            )}

                            {(report.status === "open" ||
                              report.status === "reviewing") && (
                              <>
                                <button
                                  onClick={() =>
                                    updateReport(report.id, "resolved")
                                  }
                                  disabled={reportActionBusy === report.id}
                                  className="rounded-full bg-[#5F7161] text-white px-4 py-2 text-xs font-bold disabled:opacity-50"
                                >
                                  Resolve
                                </button>

                                <button
                                  onClick={() =>
                                    updateReport(report.id, "dismissed")
                                  }
                                  disabled={reportActionBusy === report.id}
                                  className="rounded-full border border-red-200 text-red-600 px-4 py-2 text-xs font-bold disabled:opacity-50"
                                >
                                  Dismiss
                                </button>
                              </>
                            )}

                            {(report.status === "resolved" ||
                              report.status === "dismissed") && (
                              <button
                                onClick={() =>
                                  updateReport(report.id, "open")
                                }
                                disabled={reportActionBusy === report.id}
                                className="rounded-full border border-[#211000]/10 bg-white px-4 py-2 text-xs font-bold disabled:opacity-50"
                              >
                                Reopen
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </AdminCard>
            </AdminSection>
          )}
        </AnimatePresence>
      </div>

      <AnimatePresence>
        {selectedPayout && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8"
          >
            <div
              className="absolute inset-0 bg-[#211000]/60 backdrop-blur-sm"
              onClick={() => setSelectedPayout(null)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-[#211000]/10 p-6"
            >
              <button
                onClick={() => setSelectedPayout(null)}
                className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-[#211000]/5 transition-colors shadow-sm"
              >
                <X className="size-4 text-[#211000]/60" />
              </button>

              <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                Mark payout as paid
              </p>
              <h2 className="font-serif text-2xl font-medium mt-1">
                {selectedPayout.itemTitle}
              </h2>
              <p className="text-sm text-[#211000]/55 font-medium mt-1">
                Paying {selectedPayout.seller?.name} —{" "}
                {formatNaira(Number(selectedPayout.netAmount))} to{" "}
                {selectedPayout.seller?.bankName} (
                {selectedPayout.seller?.accountNumber})
              </p>

              <div className="mt-5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                  Upload proof of payment
                </label>
                {payoutReceiptUrl ? (
                  <div className="rounded-xl bg-[#FAF4EC] border border-[#211000]/8 p-3 flex items-center justify-between">
                    <img
                      src={payoutReceiptUrl}
                      alt="Receipt"
                      className="max-h-32 rounded-lg"
                    />
                    <button
                      onClick={() => setPayoutReceiptUrl("")}
                      className="text-xs font-bold text-red-500 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                ) : (
                  <label className="block border-2 border-dashed border-[#211000]/15 rounded-xl p-6 text-center cursor-pointer hover:border-[#B66B44]/40 transition-all">
                    {uploadingReceipt
                      ? "Uploading…"
                      : "Click to upload receipt"}
                    <input
                      type="file"
                      accept="image/*,application/pdf"
                      onChange={handleReceiptUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              <button
                onClick={markPayoutPaidFromModal}
                disabled={!payoutReceiptUrl || payoutActionBusy}
                className="mt-6 w-full inline-flex items-center justify-center gap-2 bg-[#5F7161] hover:bg-[#4d5e50] disabled:opacity-50 text-white font-bold text-sm px-5 py-3 rounded-full transition-colors"
              >
                {payoutActionBusy ? "Sending…" : "Confirm payout"}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {selectedListing && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8"
          >
            <div
              className="absolute inset-0 bg-[#211000]/60 backdrop-blur-sm"
              onClick={closeListingModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-[#211000]/10"
            >
              <button
                onClick={closeListingModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-[#211000]/5 transition-colors z-10 shadow-sm"
              >
                <X className="size-4 text-[#211000]/60" />
              </button>

              {selectedListing.photos?.[0] && (
                <div className="aspect-video w-full overflow-hidden rounded-t-3xl">
                  <img
                    src={selectedListing.photos[0]}
                    alt={selectedListing.itemTitle}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              {selectedListing.photos?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto px-6 pt-4">
                  {selectedListing.photos
                    .slice(1)
                    .map((p: string, i: number) => (
                      <div
                        key={i}
                        className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#211000]/8"
                      >
                        <img
                          src={p}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                </div>
              )}

              <div className="p-6 space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                    {selectedListing.category}
                    {selectedListing.brand && ` · ${selectedListing.brand}`}
                  </p>
                  <h2 className="font-serif text-2xl font-medium mt-1">
                    {selectedListing.itemTitle}
                  </h2>
                  {selectedListing.model && (
                    <p className="text-xs text-[#211000]/50 font-medium mt-0.5">
                      Model: {selectedListing.model}
                    </p>
                  )}
                </div>

                <div className="flex items-baseline gap-3 flex-wrap">
                  <span className="text-2xl font-bold">
                    {formatNaira(Number(selectedListing.sellingPrice) || 0)}
                  </span>
                  {selectedListing.originalPrice && (
                    <span className="text-sm text-[#211000]/40 line-through">
                      {formatNaira(
                        Number(selectedListing.originalPrice) || 0
                      )}
                    </span>
                  )}
                  {selectedListing.negotiable && (
                    <span className="text-[10px] font-bold bg-[#E8CEB0]/40 px-2 py-0.5 rounded-full">
                      Negotiable
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoBlock
                    label="Condition"
                    value={selectedListing.condition || "—"}
                  />
                  <InfoBlock
                    label="Age"
                    value={selectedListing.age || "—"}
                  />
                  <InfoBlock
                    label="Color"
                    value={selectedListing.color || "—"}
                  />
                  <InfoBlock
                    label="Material"
                    value={selectedListing.material || "—"}
                  />
                  <InfoBlock
                    label="Dimensions"
                    value={
                      selectedListing.dimLength ||
                      selectedListing.dimWidth ||
                      selectedListing.dimHeight
                        ? `${selectedListing.dimLength || "—"} × ${selectedListing.dimWidth || "—"} × ${selectedListing.dimHeight || "—"} cm`
                        : "—"
                    }
                  />
                  <InfoBlock
                    label="Weight"
                    value={
                      selectedListing.dimWeight
                        ? `${selectedListing.dimWeight} kg`
                        : "—"
                    }
                  />
                  <InfoBlock
                    label="Seller"
                    value={`${selectedListing.sellerName} · ${selectedListing.phone}`}
                  />
                  <InfoBlock
                    label="Email"
                    value={selectedListing.email || "—"}
                  />
                  <InfoBlock
                    label="Location"
                    value={`${selectedListing.address || "—"}${selectedListing.lga ? `, ${selectedListing.lga}` : ""}, ${selectedListing.state || "—"}`}
                  />
                  <InfoBlock
                    label="Sell reason"
                    value={selectedListing.sellReason || "—"}
                  />
                  <InfoBlock
                    label="Availability"
                    value={selectedListing.availability || "—"}
                  />
                  <InfoBlock
                    label="Urgency"
                    value={selectedListing.urgency || "—"}
                  />
                </div>

                {selectedListing.defects?.length > 0 && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#211000]/50 mb-2">
                      Reported defects
                    </p>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedListing.defects.map((d: string) => (
                        <span
                          key={d}
                          className="text-[10px] font-bold bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded-full"
                        >
                          {d}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div className="border-t border-[#211000]/8 pt-4">
                  <p className="text-xs font-bold uppercase tracking-wider text-[#211000]/50 mb-1.5">
                    Description
                  </p>
                  <p className="text-sm text-[#211000]/70 font-medium leading-relaxed">
                    {selectedListing.description}
                  </p>
                  {selectedListing.conditionNotes && (
                    <div className="mt-3 pt-3 border-t border-[#211000]/6">
                      <p className="text-xs font-bold text-[#211000]/50 mb-1">
                        Condition notes:
                      </p>
                      <p className="text-xs text-[#211000]/60 leading-relaxed">
                        {selectedListing.conditionNotes}
                      </p>
                    </div>
                  )}
                </div>

                {selectedListing.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-1.5">
                    {selectedListing.tags.map((tag: string, i: number) => (
                      <span
                        key={i}
                        className="text-[10px] font-bold bg-[#E8CEB0]/30 border border-[#E8CEB0] px-2 py-0.5 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}

                {selectedListing.warranty &&
                  selectedListing.warranty !== "None" && (
                    <InfoBlock
                      label="Warranty"
                      value={`${selectedListing.warranty}${selectedListing.warrantyDuration ? ` · ${selectedListing.warrantyDuration}` : ""}`}
                    />
                  )}

                <div className="border-t border-[#211000]/8 pt-5">
                  {!showRejectBox ? (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={approveFromModal}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#5F7161] hover:bg-[#4d5e50] text-white font-bold text-sm px-5 py-3 rounded-full transition-colors"
                      >
                        <CheckCircle2 className="size-4" />
                        Approve listing
                      </button>
                      <button
                        onClick={() => setShowRejectBox(true)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-5 py-3 rounded-full transition-colors"
                      >
                        <X className="size-4" />
                        Reject listing
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block">
                        Reason for rejection (shown to the seller)
                      </label>
                      <textarea
                        rows={3}
                        value={rejectReason}
                        onChange={(e) => setRejectReason(e.target.value)}
                        placeholder="e.g. Photos are unclear — please add clearer images of the item."
                        className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all resize-none"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={confirmRejectFromModal}
                          disabled={!rejectReason.trim()}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold text-sm px-5 py-3 rounded-full transition-colors"
                        >
                          Confirm rejection
                        </button>
                        <button
                          onClick={() => {
                            setShowRejectBox(false);
                            setRejectReason("");
                          }}
                          className="rounded-full border border-[#211000]/10 hover:border-[#211000]/25 bg-white px-5 py-3 text-sm font-bold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedOrder && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8"
          >
            <div
              className="absolute inset-0 bg-[#211000]/60 backdrop-blur-sm"
              onClick={closeOrderModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-[#211000]/10"
            >
              <button
                onClick={closeOrderModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-[#211000]/5 transition-colors z-10 shadow-sm"
              >
                <X className="size-4 text-[#211000]/60" />
              </button>

              <div className="p-6 space-y-5">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                    {selectedOrder.paymentMethod === "transfer"
                      ? "Bank Transfer"
                      : "Paystack"}
                  </p>
                  <h2 className="font-serif text-2xl font-medium mt-1 font-mono">
                    {selectedOrder.reference}
                  </h2>
                  <StatusBadge status={selectedOrder.status} />
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoBlock label="Buyer" value={selectedOrder.fullName} />
                  <InfoBlock label="Phone" value={selectedOrder.phone} />
                  <InfoBlock label="Email" value={selectedOrder.email} />
                  <InfoBlock
                    label="Amount"
                    value={formatNaira(Number(selectedOrder.total))}
                  />
                  <InfoBlock
                    label="Delivery"
                    value={
                      selectedOrder.deliveryType === "delivery"
                        ? "Home delivery"
                        : "Pickup"
                    }
                  />
                  <InfoBlock
                    label="Created"
                    value={selectedOrder.createdAt?.split("T")[0]}
                  />
                </div>

                {selectedOrder.deliveryType === "delivery" && (
                  <InfoBlock
                    label="Delivery address"
                    value={`${selectedOrder.address || "—"}, ${selectedOrder.lga || ""}, ${selectedOrder.state || ""}`}
                  />
                )}

                <div>
                  <p className="text-xs font-bold uppercase tracking-wider text-[#211000]/50 mb-2">
                    Items
                  </p>
                  <div className="space-y-2">
                    {(selectedOrder.items || []).map(
                      (item: any, i: number) => (
                        <div
                          key={i}
                          className="rounded-xl bg-[#FAF4EC] border border-[#211000]/8 p-3 text-xs"
                        >
                          <p className="font-bold">{item.itemTitle}</p>
                          <p className="text-[#211000]/55 mt-0.5">
                            Qty {item.quantity} · {formatNaira(item.price)} ·
                            Seller: {item.sellerName}
                          </p>
                        </div>
                      )
                    )}
                  </div>
                </div>

                {selectedOrder.receiptUrl && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#211000]/50 mb-2">
                      Payment receipt
                    </p>
                    <a
                      href={selectedOrder.receiptUrl}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={selectedOrder.receiptUrl}
                        alt="Receipt"
                        className="max-h-64 rounded-xl border border-[#211000]/10"
                      />
                    </a>
                  </div>
                )}

                {selectedOrder.status === "pending_verification" &&
                  selectedOrder.paymentMethod === "transfer" && (
                    <div className="border-t border-[#211000]/8 pt-5">
                      {!showOrderRejectBox ? (
                        <div className="flex flex-wrap gap-3">
                          <button
                            onClick={confirmOrderFromModal}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-[#5F7161] hover:bg-[#4d5e50] text-white font-bold text-sm px-5 py-3 rounded-full transition-colors"
                          >
                            <CheckCircle2 className="size-4" />
                            Confirm payment
                          </button>
                          <button
                            onClick={() => setShowOrderRejectBox(true)}
                            className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-5 py-3 rounded-full transition-colors"
                          >
                            <X className="size-4" />
                            Reject payment
                          </button>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block">
                            Reason for rejection (shown to the buyer)
                          </label>
                          <textarea
                            rows={3}
                            value={orderRejectReason}
                            onChange={(e) =>
                              setOrderRejectReason(e.target.value)
                            }
                            placeholder="e.g. We could not find a matching transfer for this reference."
                            className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all resize-none"
                          />
                          <div className="flex gap-3">
                            <button
                              onClick={confirmOrderRejectFromModal}
                              disabled={!orderRejectReason.trim()}
                              className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold text-sm px-5 py-3 rounded-full transition-colors"
                            >
                              Confirm rejection
                            </button>
                            <button
                              onClick={() => {
                                setShowOrderRejectBox(false);
                                setOrderRejectReason("");
                              }}
                              className="rounded-full border border-[#211000]/10 hover:border-[#211000]/25 bg-white px-5 py-3 text-sm font-bold transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedVerification && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8"
          >
            <div
              className="absolute inset-0 bg-[#211000]/60 backdrop-blur-sm"
              onClick={closeVerificationModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border border-[#211000]/10"
            >
              <button
                onClick={closeVerificationModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-[#211000]/5 transition-colors z-10 shadow-sm"
              >
                <X className="size-4 text-[#211000]/60" />
              </button>

              <div className="p-6 space-y-5">
                <div className="flex items-center gap-3">
                  <div className="size-14 rounded-full overflow-hidden bg-[#E8CEB0]/40 shrink-0">
                    {selectedVerification.profileImage ? (
                      <img
                        src={selectedVerification.profileImage}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center font-bold text-lg text-[#B66B44]">
                        {selectedVerification.name?.[0]?.toUpperCase() || "U"}
                      </div>
                    )}
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                      Identity verification
                    </p>
                    <h2 className="font-serif text-2xl font-medium mt-0.5">
                      {selectedVerification.name}
                    </h2>
                    <p className="text-xs text-[#211000]/55 font-medium">
                      {selectedVerification.email}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoBlock
                    label="ID type"
                    value={selectedVerification.idType || "—"}
                  />
                  <InfoBlock
                    label="ID number"
                    value={selectedVerification.idNumber || "—"}
                  />
                  <InfoBlock
                    label="Phone"
                    value={selectedVerification.phone || "—"}
                  />
                  <InfoBlock
                    label="Address"
                    value={
                      selectedVerification.address
                        ? `${selectedVerification.address}, ${selectedVerification.state || ""}`
                        : "—"
                    }
                  />
                </div>

                {selectedVerification.idImage && (
                  <div>
                    <p className="text-xs font-bold uppercase tracking-wider text-[#211000]/50 mb-2">
                      ID document
                    </p>
                    <a
                      href={selectedVerification.idImage}
                      target="_blank"
                      rel="noreferrer"
                    >
                      <img
                        src={selectedVerification.idImage}
                        alt="ID document"
                        className="max-h-80 rounded-xl border border-[#211000]/10"
                      />
                    </a>
                  </div>
                )}

                <div className="border-t border-[#211000]/8 pt-5">
                  {!showVerificationRejectBox ? (
                    <div className="flex flex-wrap gap-3">
                      <button
                        onClick={approveVerificationFromModal}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-[#5F7161] hover:bg-[#4d5e50] text-white font-bold text-sm px-5 py-3 rounded-full transition-colors"
                      >
                        <CheckCircle2 className="size-4" />
                        Verify
                      </button>
                      <button
                        onClick={() => setShowVerificationRejectBox(true)}
                        className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 text-white font-bold text-sm px-5 py-3 rounded-full transition-colors"
                      >
                        <X className="size-4" />
                        Reject
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block">
                        Reason for rejection (shown to the user)
                      </label>
                      <textarea
                        rows={3}
                        value={verificationRejectReason}
                        onChange={(e) =>
                          setVerificationRejectReason(e.target.value)
                        }
                        placeholder="e.g. Document is blurry — please upload a clearer photo."
                        className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all resize-none"
                      />
                      <div className="flex gap-3">
                        <button
                          onClick={confirmVerificationRejectFromModal}
                          disabled={!verificationRejectReason.trim()}
                          className="flex-1 inline-flex items-center justify-center gap-2 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white font-bold text-sm px-5 py-3 rounded-full transition-colors"
                        >
                          Confirm rejection
                        </button>
                        <button
                          onClick={() => {
                            setShowVerificationRejectBox(false);
                            setVerificationRejectReason("");
                          }}
                          className="rounded-full border border-[#211000]/10 hover:border-[#211000]/25 bg-white px-5 py-3 text-sm font-bold transition-colors"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center px-4 py-8"
          >
            <div
              className="absolute inset-0 bg-[#211000]/60 backdrop-blur-sm"
              onClick={closeTicketModal}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl border border-[#211000]/10 flex flex-col overflow-hidden"
            >
              <button
                onClick={closeTicketModal}
                className="absolute top-4 right-4 p-2 rounded-full bg-white hover:bg-[#211000]/5 transition-colors z-10 shadow-sm"
              >
                <X className="size-4 text-[#211000]/60" />
              </button>

              {/* Ticket header */}
              <div className="p-6 pb-4 border-b border-[#211000]/8 shrink-0">
                <div className="flex items-center gap-3">
                  <div className="size-12 rounded-full bg-[#B66B44]/10 flex items-center justify-center font-bold text-[#B66B44]">
                    {selectedTicket.user?.name?.[0]?.toUpperCase() || "U"}
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif text-xl font-medium truncate">
                      {selectedTicket.user?.name}
                    </p>
                    <p className="text-xs text-[#211000]/55 font-medium flex items-center gap-1.5">
                      <Mail className="size-3" />
                      {selectedTicket.user?.email}
                    </p>
                  </div>
                  <div className="ml-auto text-right shrink-0">
                    <StatusBadge status={selectedTicket.status} />
                    <p className="font-mono text-[10px] text-[#211000]/40 mt-1">
                      {selectedTicket.reference}
                    </p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-[10px] font-bold bg-[#E8CEB0]/30 px-2 py-1 rounded-full capitalize">
                    {selectedTicket.topic}
                  </span>
                  {selectedTicket.order && (
                    <span className="text-[10px] font-bold bg-[#5F7161]/10 text-[#5F7161] px-2 py-1 rounded-full font-mono">
                      Order {selectedTicket.order.reference} ·{" "}
                      {formatNaira(
                        Number(selectedTicket.order.total || 0)
                      )}
                    </span>
                  )}
                </div>
              </div>

              {/* Agent quick replies */}
              {selectedTicket.status !== "resolved" && (
                <div className="shrink-0 border-b border-[#211000]/8 bg-white px-5 py-3">
                  <p className="text-[10px] uppercase tracking-wider font-bold text-[#211000]/45 mb-2">
                    Quick replies
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <button
                      onClick={() => {
                        setAgentIntroName("");
                        setShowAgentIntroModal(true);
                      }}
                      disabled={sendingReply}
                      className="rounded-full bg-[#B66B44]/10 text-[#8C482F] hover:bg-[#B66B44]/20 px-3 py-2 text-[11px] font-bold disabled:opacity-50"
                    >
                      <span className="inline-flex items-center gap-1.5">
                        <UserCheck className="size-3.5" /> Join chat
                      </span>
                    </button>
                    <button
                      onClick={() =>
                        sendTicketReply(
                          `Hi ${selectedTicket.user?.name?.split(" ")[0] || "there"}, thanks for your patience. I'm reviewing the details now and will update you here shortly.`
                        )
                      }
                      disabled={sendingReply}
                      className="rounded-full border border-[#211000]/10 hover:bg-[#FAF4EC] px-3 py-2 text-[11px] font-bold disabled:opacity-50"
                    >
                      Thanks for your patience
                    </button>
                    <button
                      onClick={() =>
                        sendTicketReply(
                          "Could you please share a little more detail so I can investigate? If relevant, attach a screenshot or a clear photo. Please do not share passwords or verification codes."
                        )
                      }
                      disabled={sendingReply}
                      className="rounded-full border border-[#211000]/10 hover:bg-[#FAF4EC] px-3 py-2 text-[11px] font-bold disabled:opacity-50"
                    >
                      Ask for details
                    </button>
                    <button
                      onClick={() =>
                        sendTicketReply(
                          "Does this solve your problem? Please let me know if everything is resolved or if you still need help."
                        )
                      }
                      disabled={sendingReply}
                      className="rounded-full border border-[#5F7161]/30 text-[#5F7161] hover:bg-[#5F7161]/10 px-3 py-2 text-[11px] font-bold disabled:opacity-50"
                    >
                      Check if solved
                    </button>
                    <button
                      onClick={() =>
                        sendTicketReply(
                          "Thank you for contacting the Refurnish Support team. We're glad we could help. If you need anything else, please start a new support ticket. Have a lovely day!"
                        )
                      }
                      disabled={sendingReply}
                      className="rounded-full border border-[#211000]/10 hover:bg-[#FAF4EC] px-3 py-2 text-[11px] font-bold disabled:opacity-50"
                    >
                      Thank-you message
                    </button>
                  </div>
                </div>
              )}

              {/* Messages */}
              <div className="flex-1 overflow-y-auto bg-[#FAF4EC] p-5 space-y-4">
                {ticketMessagesLoading ? (
                  <div className="py-10 flex justify-center">
                    <Loader2 className="size-6 animate-spin text-[#B66B44]" />
                  </div>
                ) : ticketMessages.length === 0 ? (
                  <p className="text-center text-xs text-[#211000]/45 font-medium py-10">
                    No messages yet.
                  </p>
                ) : (
                  ticketMessages.map((msg) => {
                    const isAgent = msg.role === "agent";
                    let attachments: any[] = [];
                    try {
                      attachments = msg.attachments
                        ? typeof msg.attachments === "string"
                          ? JSON.parse(msg.attachments)
                          : msg.attachments
                        : [];
                    } catch {
                      attachments = [];
                    }

                    return (
                      <div
                        key={msg.id}
                        className={`flex ${isAgent ? "justify-end" : "justify-start"}`}
                      >
                        <div className="max-w-[80%]">
                          <div
                            className={`rounded-2xl px-4 py-3 shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                              isAgent
                                ? "rounded-tr-sm bg-[#211000] text-[#E8CEB0]"
                                : "rounded-tl-sm bg-white border border-[#211000]/8"
                            }`}
                          >
                            {msg.text}
                            {attachments.length > 0 && (
                              <div className="mt-2 grid gap-1.5">
                                {attachments.map((file: any) => (
                                  <a
                                    key={file.id}
                                    href={file.url}
                                    target="_blank"
                                    rel="noreferrer"
                                    className={`flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-xs font-bold ${
                                      isAgent
                                        ? "bg-[#FAF4EC]/10"
                                        : "bg-[#FAF4EC]"
                                    }`}
                                  >
                                    <FileText className="size-3.5" />
                                    {file.name}
                                  </a>
                                ))}
                              </div>
                            )}
                          </div>
                          <p className="text-[10px] text-[#211000]/35 font-medium mt-1 px-1">
                            {isAgent ? "You" : selectedTicket.user?.name} ·{" "}
                            {new Date(msg.createdAt).toLocaleTimeString([], {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Composer */}
              <div className="border-t border-[#211000]/8 bg-white p-4 shrink-0">
                {selectedTicket.status === "resolved" ? (
                  <p className="text-center text-xs text-[#211000]/45 font-medium py-2">
                    This ticket has been resolved.
                  </p>
                ) : (
                  <div className="flex items-end gap-2">
                    <textarea
                      rows={1}
                      value={replyText}
                      onChange={(e) => setReplyText(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === "Enter" && !e.shiftKey) {
                          e.preventDefault();
                          sendTicketReply();
                        }
                      }}
                      placeholder="Type your reply..."
                      className="min-h-11 max-h-32 flex-1 resize-none rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all"
                    />
                    <button
                      onClick={sendTicketReply}
                      disabled={!replyText.trim() || sendingReply}
                      className="size-11 rounded-full bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-40 disabled:cursor-not-allowed text-white transition-colors grid place-items-center shrink-0"
                    >
                      {sendingReply ? (
                        <Loader2 className="size-4 animate-spin" />
                      ) : (
                        <Send className="size-4" />
                      )}
                    </button>
                  </div>
                )}

                <div className="flex items-center justify-between mt-3">
                  <p className="text-[10px] text-[#211000]/35 font-medium">
                    Replying sends an email notification to the user.
                  </p>
                  {selectedTicket.status !== "resolved" && (
                    <button
                      onClick={resolveTicketFromModal}
                      disabled={resolvingTicket}
                      className="inline-flex items-center gap-1.5 rounded-full border border-[#5F7161]/30 text-[#5F7161] hover:bg-[#5F7161]/10 px-3 py-1.5 text-xs font-bold transition-colors disabled:opacity-50"
                    >
                      <CheckCircle2 className="size-3.5" />
                      {resolvingTicket ? "Resolving…" : "Resolve ticket"}
                    </button>
                  )}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {showAgentIntroModal && selectedTicket && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[110] flex items-center justify-center px-4 py-8"
          >
            <button
              aria-label="Close agent introduction"
              className="absolute inset-0 bg-[#211000]/60 backdrop-blur-sm"
              onClick={() => setShowAgentIntroModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 12 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 12 }}
              className="relative w-full max-w-md rounded-3xl border border-[#211000]/10 bg-white p-6 shadow-2xl"
            >
              <div className="flex items-start gap-3 mb-5">
                <div className="size-11 rounded-2xl bg-[#B66B44]/10 text-[#B66B44] grid place-items-center shrink-0">
                  <UserCheck className="size-5" />
                </div>
                <div>
                  <h3 className="font-serif text-xl font-medium">Introduce yourself</h3>
                  <p className="text-xs text-[#211000]/55 mt-1">The customer will see your name in the chat, and it will be saved with this ticket.</p>
                </div>
              </div>
              <label className="block text-xs font-bold text-[#211000]/60 mb-2" htmlFor="agent-intro-name">Agent name</label>
              <input
                id="agent-intro-name"
                autoFocus
                value={agentIntroName}
                onChange={(e) => setAgentIntroName(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); void sendAgentIntroduction(); } }}
                placeholder="e.g. Mike"
                maxLength={80}
                className="w-full rounded-2xl border border-[#211000]/12 bg-[#FAF4EC] px-4 py-3 text-sm font-medium focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10"
              />
              <div className="flex gap-3 mt-5">
                <button
                  onClick={() => setShowAgentIntroModal(false)}
                  className="flex-1 rounded-full border border-[#211000]/10 px-4 py-3 text-xs font-bold hover:bg-[#FAF4EC]"
                >Cancel</button>
                <button
                  onClick={() => void sendAgentIntroduction()}
                  disabled={!agentIntroName.trim() || sendingReply}
                  className="flex-1 rounded-full bg-[#B66B44] px-4 py-3 text-xs font-bold text-white hover:bg-[#a05934] disabled:opacity-50"
                >{sendingReply ? "Sending…" : "Send introduction"}</button>
              </div>
            </motion.div>
          </motion.div>
        )}

        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-[90] inline-flex items-center gap-2 bg-[#211000] text-[#FAF4EC] px-5 py-3 rounded-full shadow-2xl"
          >
            <CheckCircle2 className="size-4 text-[#5F7161]" />
            <span className="text-xs font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* ---------------- Helpers ---------------- */

function searchable(item: any, search: string) {
  if (!search.trim()) return true;
  const q = search.toLowerCase();
  return JSON.stringify(item).toLowerCase().includes(q);
}

function AdminSection({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -12 }}
    >
      {children}
    </motion.div>
  );
}

function AdminCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm p-5 sm:p-6">
      <h2 className="font-serif text-2xl font-medium mb-5">{title}</h2>
      {children}
    </div>
  );
}

function StatCard({
  label,
  value,
  sub,
  icon,
  accent,
}: {
  label: string;
  value: any;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#211000]/8 p-4">
      <div
        className="size-10 rounded-xl flex items-center justify-center mb-4"
        style={{ backgroundColor: `${accent}15`, color: accent }}
      >
        {icon}
      </div>
      <p className="text-2xl font-bold">{value}</p>
      <p className="text-xs text-[#211000]/50 font-medium mt-0.5">{label}</p>
      {sub && (
        <p className="text-[11px] text-[#B66B44] font-bold mt-1">{sub}</p>
      )}
    </div>
  );
}

function AttentionRow({
  title,
  count,
  onClick,
}: {
  title: string;
  count: number;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 p-4 flex items-center justify-between gap-4 hover:border-[#B66B44]/30 transition-colors mb-3"
    >
      <span className="text-sm font-bold">{title}</span>
      <span className="inline-flex items-center justify-center min-w-8 h-8 rounded-full bg-[#B66B44] text-white text-xs font-bold">
        {count}
      </span>
    </button>
  );
}

function StatusBadge({ status }: { status: string }) {
  const normalized = String(status || "unknown").toLowerCase();

  const color = [
    "active",
    "paid",
    "completed",
    "released",
    "verified",
    "resolved",
  ].includes(normalized)
    ? "bg-[#5F7161]/10 text-[#5F7161]"
    : [
          "pending",
          "processing",
          "reviewing",
          "waiting_for_agent",
        ].includes(normalized)
      ? "bg-yellow-50 text-yellow-700"
      : [
            "rejected",
            "refunded",
            "disputed",
            "unverified",
            "dismissed",
          ].includes(normalized)
        ? "bg-red-50 text-red-600"
        : ["open"].includes(normalized)
          ? "bg-[#B66B44]/10 text-[#B66B44]"
          : "bg-[#211000]/8 text-[#211000]/60";

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-[10px] font-bold capitalize ${color}`}
    >
      {normalized.replaceAll("_", " ")}
    </span>
  );
}

function ActionButton({
  label,
  onClick,
  tone = "default",
}: {
  label: string;
  onClick: () => void;
  tone?: "default" | "success" | "danger";
}) {
  const cls =
    tone === "success"
      ? "bg-[#5F7161] text-white hover:bg-[#4d5e50]"
      : tone === "danger"
        ? "bg-red-500 text-white hover:bg-red-600"
        : "border border-[#211000]/10 hover:border-[#B66B44]/30 bg-white";

  return (
    <button
      onClick={onClick}
      className={`rounded-full px-3 py-2 text-xs font-bold transition-colors ${cls}`}
    >
      {label}
    </button>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-white border border-[#211000]/8 p-3">
      <p className="text-[10px] uppercase tracking-wider text-[#211000]/40 font-bold">
        {label}
      </p>
      <p className="text-sm font-bold mt-0.5">{value}</p>
    </div>
  );
}

function EmptyState({ text }: { text: string }) {
  return (
    <div className="py-14 text-center">
      <div className="size-14 rounded-full bg-[#E8CEB0]/40 mx-auto grid place-items-center mb-4">
        <AlertCircle className="size-6 text-[#B66B44]" />
      </div>
      <p className="text-sm text-[#211000]/55 font-medium">{text}</p>
    </div>
  );
}