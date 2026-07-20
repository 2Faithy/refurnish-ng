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
  { id: "listings", label: "Listings", icon: Package },
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
  const [listingTab, setListingTab] = useState<"pending" | "approved" | "rejected">("pending");
  const [selectedListing, setSelectedListing] = useState<any | null>(null);
  const [rejectReason, setRejectReason] = useState("");
  const [showRejectBox, setShowRejectBox] = useState(false);

  const getAdminToken = () => {
    const session = JSON.parse(localStorage.getItem(ADMIN_SESSION_KEY) || "null");
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

  useEffect(() => {
    try {
      const session = localStorage.getItem(ADMIN_SESSION_KEY);

      if (!session) {
        router.push("/admin/login");
        return;
      }

      setAdmin(JSON.parse(session));
      fetchListings();
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
    await updateListingStatus(selectedListing.id, "rejected", rejectReason.trim());
    closeListingModal();
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
        {(
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

                        {listing.status === "rejected" && listing.rejectionReason && (
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
                                  if (window.confirm(`Delete "${listing.itemTitle}"? This can't be undone.`)) {
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
        </AnimatePresence>
      </div>

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
                  {selectedListing.photos.slice(1).map((p: string, i: number) => (
                    <div
                      key={i}
                      className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#211000]/8"
                    >
                      <img src={p} alt="" className="w-full h-full object-cover" />
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
                      {formatNaira(Number(selectedListing.originalPrice) || 0)}
                    </span>
                  )}
                  {selectedListing.negotiable && (
                    <span className="text-[10px] font-bold bg-[#E8CEB0]/40 px-2 py-0.5 rounded-full">
                      Negotiable
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-3 text-sm">
                  <InfoBlock label="Condition" value={selectedListing.condition || "—"} />
                  <InfoBlock label="Age" value={selectedListing.age || "—"} />
                  <InfoBlock label="Color" value={selectedListing.color || "—"} />
                  <InfoBlock label="Material" value={selectedListing.material || "—"} />
                  <InfoBlock
                    label="Dimensions"
                    value={
                      selectedListing.dimLength || selectedListing.dimWidth || selectedListing.dimHeight
                        ? `${selectedListing.dimLength || "—"} × ${selectedListing.dimWidth || "—"} × ${selectedListing.dimHeight || "—"} cm`
                        : "—"
                    }
                  />
                  <InfoBlock label="Weight" value={selectedListing.dimWeight ? `${selectedListing.dimWeight} kg` : "—"} />
                  <InfoBlock label="Seller" value={`${selectedListing.sellerName} · ${selectedListing.phone}`} />
                  <InfoBlock label="Email" value={selectedListing.email || "—"} />
                  <InfoBlock
                    label="Location"
                    value={`${selectedListing.address || "—"}${selectedListing.lga ? `, ${selectedListing.lga}` : ""}, ${selectedListing.state || "—"}`}
                  />
                  <InfoBlock label="Sell reason" value={selectedListing.sellReason || "—"} />
                  <InfoBlock label="Availability" value={selectedListing.availability || "—"} />
                  <InfoBlock label="Urgency" value={selectedListing.urgency || "—"} />
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
                      <p className="text-xs font-bold text-[#211000]/50 mb-1">Condition notes:</p>
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

                {selectedListing.warranty && selectedListing.warranty !== "None" && (
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