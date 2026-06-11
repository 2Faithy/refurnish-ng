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
  FileText,
  Flag,
  Home,
  LayoutDashboard,
  ListChecks,
  Loader2,
  LogOut,
  Package,
  RefreshCcw,
  Search,
  ShieldCheck,
  Trash2,
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
  | "verifications"
  | "disputes"
  | "users"
  | "support";

const tabs: { id: AdminTab; label: string; icon: any }[] = [
  { id: "overview", label: "Overview", icon: LayoutDashboard },
  { id: "payouts", label: "Payouts", icon: Wallet },
  { id: "listings", label: "Listings", icon: Package },
  { id: "orders", label: "Orders", icon: ListChecks },
  { id: "verifications", label: "Verification", icon: UserCheck },
  { id: "disputes", label: "Disputes", icon: Flag },
  { id: "users", label: "Users", icon: Users },
  { id: "support", label: "Support", icon: FileText },
];

export default function AdminPage() {
  const router = useRouter();

  const [checkingAuth, setCheckingAuth] = useState(true);
  const [admin, setAdmin] = useState<any>(null);

  const [activeTab, setActiveTab] = useState<AdminTab>("overview");
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

  useEffect(() => {
    try {
      const session = localStorage.getItem(ADMIN_SESSION_KEY);

      if (!session) {
        router.push("/admin/login");
        return;
      }

      setAdmin(JSON.parse(session));

      setOrders(JSON.parse(localStorage.getItem(ORDERS_KEY) || "[]"));
      setPayouts(JSON.parse(localStorage.getItem(PAYOUTS_KEY) || "[]"));
      setListings(JSON.parse(localStorage.getItem(LISTINGS_KEY) || "[]"));
      setProfile(JSON.parse(localStorage.getItem(PROFILE_KEY) || "null"));
      setUser(JSON.parse(localStorage.getItem(USER_KEY) || "null"));
      setComplaints(JSON.parse(localStorage.getItem(COMPLAINTS_KEY) || "[]"));
      setContactMessages(
        JSON.parse(localStorage.getItem(CONTACT_MESSAGES_KEY) || "[]")
      );
      setSupportTicket(
        JSON.parse(localStorage.getItem(SUPPORT_TICKET_KEY) || "null")
      );
    } catch {
      router.push("/admin/login");
    } finally {
      setCheckingAuth(false);
    }
  }, [router]);

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

  const saveListings = (next: any[]) => {
    setListings(next);
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(next));
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

  const stats = useMemo(() => {
    const pendingPayouts = payouts.filter((p) => p.status === "pending").length;
    const pendingListings = listings.filter((l) => l.status === "pending").length;
    const escrowOrders = orders.filter((o) => o.escrowStatus === "funds_held").length;
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
            ...(status === "paid" ? { paidAt: new Date().toISOString() } : {}),
          }
        : p
    );

    savePayouts(next);
    setToast(`Payout marked as ${status}`);
  };

  const updateListingStatus = (id: string, status: string) => {
    const next = listings.map((l) =>
      l.id === id
        ? {
            ...l,
            status,
            reviewedAt: new Date().toISOString(),
          }
        : l
    );

    saveListings(next);
    setToast(`Listing marked as ${status}`);
  };

  const deleteListing = (id: string) => {
    const next = listings.filter((l) => l.id !== id);
    saveListings(next);
    setToast("Listing deleted");
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

  const approveVerification = () => {
    if (!profile && !user) return;

    const now = new Date().toISOString();

    const nextProfile = {
      ...(profile || {}),
      idVerified: true,
      idVerifiedAt: now,
      id_uploaded: true,
      id_verified_at: now,
    };

    const nextUser = {
      ...(user || {}),
      idVerified: true,
      idUploaded: true,
    };

    saveProfile(nextProfile);
    saveUser(nextUser);
    setToast("User verification approved");
  };

  const rejectVerification = () => {
    const nextProfile = {
      ...(profile || {}),
      idVerified: false,
      idVerifiedAt: null,
      idImage: "",
      id_uploaded: false,
      id_verified_at: null,
    };

    const nextUser = {
      ...(user || {}),
      idVerified: false,
      idUploaded: false,
    };

    saveProfile(nextProfile);
    saveUser(nextUser);
    setToast("Verification rejected");
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
                Manage payouts, listings, KYC, orders, disputes and support.
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

            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold border transition-all ${
                  activeTab === tab.id
                    ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                    : "bg-white text-[#211000]/60 border-[#211000]/10 hover:border-[#211000]/25"
                }`}
              >
                <Icon className="size-3.5" />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Search */}
        {activeTab !== "overview" && (
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
        )}

        <AnimatePresence mode="wait">
          {activeTab === "overview" && (
            <AdminSection key="overview">
              <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
                <StatCard
                  label="Pending payouts"
                  value={stats.pendingPayouts}
                  sub={formatNaira(stats.payoutAmount)}
                  icon={<Wallet className="size-5" />}
                  accent="#B66B44"
                />
                <StatCard
                  label="Pending listings"
                  value={stats.pendingListings}
                  icon={<Package className="size-5" />}
                  accent="#ca8a04"
                />
                <StatCard
                  label="Escrow orders"
                  value={stats.escrowOrders}
                  icon={<ShieldCheck className="size-5" />}
                  accent="#5F7161"
                />
                <StatCard
                  label="Open disputes"
                  value={stats.openComplaints}
                  icon={<Flag className="size-5" />}
                  accent="#c0392b"
                />
                <StatCard
                  label="Users"
                  value={user ? 1 : 0}
                  icon={<Users className="size-5" />}
                  accent="#211000"
                />
              </div>

              <div className="grid lg:grid-cols-2 gap-6">
                <AdminCard title="What needs attention">
                  <AttentionRow
                    title="Pending payout requests"
                    count={stats.pendingPayouts}
                    onClick={() => setActiveTab("payouts")}
                  />
                  <AttentionRow
                    title="Listings awaiting approval"
                    count={stats.pendingListings}
                    onClick={() => setActiveTab("listings")}
                  />
                  <AttentionRow
                    title="Open disputes"
                    count={stats.openComplaints}
                    onClick={() => setActiveTab("disputes")}
                  />
                  <AttentionRow
                    title="KYC review"
                    count={
                      profile?.idImage && !profile?.idVerified ? 1 : 0
                    }
                    onClick={() => setActiveTab("verifications")}
                  />
                </AdminCard>

                <AdminCard title="Admin notes">
                  <div className="rounded-2xl bg-[#E8CEB0]/35 border border-[#E8CEB0] p-4">
                    <p className="text-xs text-[#211000]/65 font-medium leading-relaxed">
                      This panel currently reads and writes to localStorage for
                      prototype testing. Production admin actions must be
                      protected by backend authentication, roles, and audit logs.
                    </p>
                  </div>
                </AdminCard>
              </div>
            </AdminSection>
          )}

          {activeTab === "payouts" && (
            <AdminSection key="payouts">
              <AdminCard title="Seller payout requests">
                {payouts.length === 0 ? (
                  <EmptyState text="No payout requests yet." />
                ) : (
                  <div className="divide-y divide-[#211000]/6">
                    {payouts
                      .filter((p) => searchable(p, search))
                      .map((payout) => (
                        <div
                          key={payout.id}
                          className="py-4 flex flex-col lg:flex-row lg:items-center justify-between gap-4"
                        >
                          <div>
                            <p className="text-lg font-bold">
                              {formatNaira(Number(payout.amount || 0))}
                            </p>
                            <p className="text-xs text-[#211000]/50 font-medium mt-1">
                              {payout.bankName} · {payout.accountName} ·{" "}
                              {payout.accountNumber}
                            </p>
                            <p className="text-[10px] font-mono text-[#211000]/35 mt-1">
                              {payout.id}
                            </p>
                          </div>

                          <div className="flex flex-wrap items-center gap-2">
                            <StatusBadge status={payout.status} />

                            {payout.status === "pending" && (
                              <>
                                <ActionButton
                                  label="Processing"
                                  onClick={() =>
                                    updatePayoutStatus(
                                      payout.id,
                                      "processing"
                                    )
                                  }
                                />
                                <ActionButton
                                  label="Reject"
                                  tone="danger"
                                  onClick={() =>
                                    updatePayoutStatus(payout.id, "rejected")
                                  }
                                />
                              </>
                            )}

                            {payout.status === "processing" && (
                              <ActionButton
                                label="Mark paid"
                                tone="success"
                                onClick={() =>
                                  updatePayoutStatus(payout.id, "paid")
                                }
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

          {activeTab === "listings" && (
            <AdminSection key="listings">
              <AdminCard title="Listings moderation">
                {listings.length === 0 ? (
                  <EmptyState text="No listings found." />
                ) : (
                  <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4">
                    {listings
                      .filter((l) => searchable(l, search))
                      .map((listing) => (
                        <div
                          key={listing.id}
                          className="rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 overflow-hidden"
                        >
                          <div className="aspect-[4/3] bg-[#E8CEB0]/30 overflow-hidden">
                            {listing.image && (
                              <img
                                src={listing.image}
                                alt={listing.title}
                                className="w-full h-full object-cover"
                              />
                            )}
                          </div>

                          <div className="p-4">
                            <p className="text-[10px] uppercase tracking-wider text-[#211000]/45 font-bold">
                              {listing.category}
                            </p>
                            <p className="font-serif text-lg font-medium mt-1 truncate">
                              {listing.title}
                            </p>
                            <p className="text-sm font-bold mt-1">
                              {formatNaira(listing.price || 0)}
                            </p>

                            <div className="mt-3 flex items-center justify-between">
                              <StatusBadge status={listing.status} />

                              <Link
                                href={`/product/${listing.slug || listing.id}`}
                                className="text-xs font-bold text-[#B66B44] hover:underline"
                              >
                                View
                              </Link>
                            </div>

                            <div className="mt-4 flex flex-wrap gap-2">
                              <ActionButton
                                label="Approve"
                                tone="success"
                                onClick={() =>
                                  updateListingStatus(listing.id, "active")
                                }
                              />
                              <ActionButton
                                label="Pause"
                                onClick={() =>
                                  updateListingStatus(listing.id, "paused")
                                }
                              />
                              <ActionButton
                                label="Reject"
                                tone="danger"
                                onClick={() =>
                                  updateListingStatus(listing.id, "rejected")
                                }
                              />
                              <button
                                onClick={() => deleteListing(listing.id)}
                                className="inline-flex items-center gap-1.5 rounded-full border border-red-200 text-red-500 px-3 py-2 text-xs font-bold hover:bg-red-50"
                              >
                                <Trash2 className="size-3.5" />
                                Delete
                              </button>
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
              <AdminCard title="Orders & escrow control">
                {orders.length === 0 ? (
                  <EmptyState text="No orders found." />
                ) : (
                  <div className="divide-y divide-[#211000]/6">
                    {orders
                      .filter((o) => searchable(o, search))
                      .map((order) => (
                        <div key={order.id} className="py-4">
                          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                            <div>
                              <p className="font-bold">{order.id}</p>
                              <p className="text-xs text-[#211000]/50 font-medium mt-1">
                                {order.items?.[0]?.title || "Order"} ·{" "}
                                {formatNaira(order.total || 0)}
                              </p>
                              <p className="text-[10px] text-[#211000]/35 mt-1">
                                Escrow: {order.escrowStatus || "unknown"} ·
                                Status: {order.status || "unknown"}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <ActionButton
                                label="Release escrow"
                                tone="success"
                                onClick={() =>
                                  updateOrder(order.id, {
                                    status: "completed",
                                    escrowStatus: "released",
                                    releasedAt: new Date().toISOString(),
                                  })
                                }
                              />
                              <ActionButton
                                label="Refund"
                                tone="danger"
                                onClick={() =>
                                  updateOrder(order.id, {
                                    status: "refunded",
                                    escrowStatus: "refunded",
                                    refundedAt: new Date().toISOString(),
                                  })
                                }
                              />
                              <ActionButton
                                label="Freeze dispute"
                                onClick={() =>
                                  updateOrder(order.id, {
                                    status: "disputed",
                                    disputeFrozenAt:
                                      new Date().toISOString(),
                                  })
                                }
                              />
                              <Link
                                href={`/dashboard/orders/${order.id}`}
                                className="rounded-full border border-[#211000]/10 px-3 py-2 text-xs font-bold hover:border-[#B66B44]/30"
                              >
                                View
                              </Link>
                            </div>
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
              <AdminCard title="Identity verification review">
                {!profile?.idImage && !profile?.idNumber ? (
                  <EmptyState text="No verification submission found." />
                ) : (
                  <div className="rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 p-5">
                    <div className="flex flex-col lg:flex-row gap-6">
                      <div className="flex-1">
                        <p className="text-[10px] uppercase tracking-wider text-[#211000]/45 font-bold">
                          User
                        </p>
                        <p className="font-serif text-2xl font-medium mt-1">
                          {user?.name || profile?.name || "User"}
                        </p>
                        <p className="text-sm text-[#211000]/55 font-medium mt-1">
                          {user?.email || profile?.email}
                        </p>

                        <div className="mt-5 grid sm:grid-cols-2 gap-3 text-sm">
                          <InfoBlock label="ID type" value={profile?.idType || profile?.id_type || "N/A"} />
                          <InfoBlock label="ID number" value={profile?.idNumber || profile?.id_number || "N/A"} />
                          <InfoBlock
                            label="Verification"
                            value={
                              profile?.idVerified || profile?.id_verified_at
                                ? "Verified"
                                : "Pending"
                            }
                          />
                          <InfoBlock
                            label="DOB"
                            value={profile?.dateOfBirth || profile?.dob || "N/A"}
                          />
                        </div>

                        <div className="mt-5 flex gap-2">
                          <ActionButton
                            label="Approve"
                            tone="success"
                            onClick={approveVerification}
                          />
                          <ActionButton
                            label="Reject"
                            tone="danger"
                            onClick={rejectVerification}
                          />
                        </div>
                      </div>

                      <div className="lg:w-64">
                        <p className="text-xs font-bold text-[#211000]/50 mb-2">
                          Uploaded document
                        </p>
                        <div className="aspect-[4/3] rounded-2xl bg-white border border-[#211000]/8 overflow-hidden grid place-items-center">
                          {profile?.idImage ? (
                            <img
                              src={profile.idImage}
                              alt="ID document"
                              className="w-full h-full object-cover"
                            />
                          ) : (
                            <FileText className="size-8 text-[#211000]/30" />
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </AdminCard>
            </AdminSection>
          )}

          {activeTab === "disputes" && (
            <AdminSection key="disputes">
              <AdminCard title="Disputes & complaints">
                {complaints.length === 0 ? (
                  <EmptyState text="No disputes or complaints found." />
                ) : (
                  <div className="divide-y divide-[#211000]/6">
                    {complaints
                      .filter((c) => searchable(c, search))
                      .map((complaint, index) => (
                        <div key={index} className="py-4">
                          <div className="flex flex-col lg:flex-row justify-between gap-4">
                            <div>
                              <p className="font-bold">
                                {complaint.reason || "Complaint"}
                              </p>
                              <p className="text-xs text-[#211000]/55 font-medium mt-1 max-w-xl">
                                {complaint.details}
                              </p>
                              <p className="text-[10px] text-[#211000]/35 mt-1">
                                Order: {complaint.orderId || "N/A"} ·{" "}
                                {complaint.createdAt?.split("T")[0]}
                              </p>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              <StatusBadge status={complaint.status || "open"} />
                              <ActionButton
                                label="Reviewing"
                                onClick={() =>
                                  updateComplaint(index, {
                                    status: "reviewing",
                                  })
                                }
                              />
                              <ActionButton
                                label="Resolve"
                                tone="success"
                                onClick={() =>
                                  updateComplaint(index, {
                                    status: "resolved",
                                  })
                                }
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </AdminCard>
            </AdminSection>
          )}

          {activeTab === "users" && (
            <AdminSection key="users">
              <AdminCard title="Users">
                {!user ? (
                  <EmptyState text="No local user found." />
                ) : (
                  <div className="rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 p-5 flex flex-col lg:flex-row lg:items-center justify-between gap-5">
                    <div>
                      <p className="font-serif text-2xl font-medium">
                        {user.name}
                      </p>
                      <p className="text-sm text-[#211000]/55 font-medium mt-1">
                        {user.email}
                      </p>
                      <p className="text-xs text-[#211000]/40 font-medium mt-1">
                        Phone: {user.phone || "N/A"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <StatusBadge
                        status={
                          user.idVerified || profile?.idVerified
                            ? "verified"
                            : "unverified"
                        }
                      />
                      <ActionButton
                        label="Suspend"
                        tone="danger"
                        onClick={() => setToast("User suspension saved")}
                      />
                    </div>
                  </div>
                )}
              </AdminCard>
            </AdminSection>
          )}

          {activeTab === "support" && (
            <AdminSection key="support">
              <AdminCard title="Support inbox">
                {contactMessages.length === 0 && !supportTicket ? (
                  <EmptyState text="No support messages found." />
                ) : (
                  <div className="space-y-4">
                    {supportTicket && (
                      <div className="rounded-2xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#B66B44]">
                          Live chat ticket
                        </p>
                        <p className="font-bold mt-1">{supportTicket.id}</p>
                        <p className="text-xs text-[#211000]/55 mt-1">
                          {supportTicket.topic} · {supportTicket.status}
                        </p>
                      </div>
                    )}

                    {contactMessages
                      .filter((m) => searchable(m, search))
                      .map((msg) => (
                        <div
                          key={msg.id}
                          className="rounded-2xl bg-[#FAF4EC] border border-[#211000]/8 p-4"
                        >
                          <p className="font-bold">{msg.subject}</p>
                          <p className="text-sm text-[#211000]/55 mt-1">
                            {msg.message}
                          </p>
                          <p className="text-[10px] text-[#211000]/35 mt-2">
                            {msg.email} · {msg.ticketId}
                          </p>
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
      <p className="text-xs text-[#211000]/50 font-medium mt-0.5">
        {label}
      </p>
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

  const color =
    ["active", "paid", "completed", "released", "verified", "resolved"].includes(
      normalized
    )
      ? "bg-[#5F7161]/10 text-[#5F7161]"
      : ["pending", "processing", "reviewing"].includes(normalized)
      ? "bg-yellow-50 text-yellow-700"
      : ["rejected", "refunded", "disputed", "unverified"].includes(normalized)
      ? "bg-red-50 text-red-600"
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