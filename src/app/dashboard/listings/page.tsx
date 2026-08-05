"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  X,
  Eye,
  Trash2,
  MoreVertical,
  Sofa,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Copy,
  BadgeCheck,
  Pencil,
  Clock,
  AlertCircle,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending" },
  { id: "rejected", label: "Rejected" },
  { id: "sold", label: "Sold" },
];

function getStatusConfig(status: string) {
  switch (status) {
    case "active":
      return {
        label: "Active",
        color: "bg-[#5F7161]/10 text-[#5F7161]",
        dot: "bg-[#5F7161]",
      };
    case "pending":
      return {
        label: "Under review",
        color: "bg-yellow-50 text-yellow-700",
        dot: "bg-yellow-500",
      };
    case "rejected":
      return {
        label: "Rejected",
        color: "bg-red-50 text-red-600",
        dot: "bg-red-500",
      };
    case "sold":
      return {
        label: "Sold",
        color: "bg-[#B66B44]/10 text-[#B66B44]",
        dot: "bg-[#B66B44]",
      };
    default:
      return {
        label: status,
        color: "bg-[#211000]/8 text-[#211000]/60",
        dot: "bg-[#211000]/30",
      };
  }
}

function getAuthedUser() {
  try {
    return JSON.parse(localStorage.getItem("refurnish_user") || "null");
  } catch {
    return null;
  }
}

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState("");
  const [busyId, setBusyId] = useState<string | null>(null);

  const fetchListings = async () => {
    const user = getAuthedUser();
    if (!user?.token) {
      setError("You need to be logged in to view your listings.");
      setLoading(false);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings/mine`, {
        headers: { Authorization: `Bearer ${user.token}` },
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Couldn't load your listings.");
        return;
      }
      setListings(data.listings || []);
      setError("");
    } catch (err) {
      console.error(err);
      setError("Couldn't reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchListings();
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(""), 2500);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const authedFetch = (path: string, options: RequestInit = {}) => {
    const user = getAuthedUser();
    return fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...options,
      headers: {
        ...(options.headers || {}),
        Authorization: `Bearer ${user?.token}`,
      },
    });
  };

  const markSold = async (id: string) => {
    setBusyId(id);
    setOpenMenuId(null);
    try {
      const res = await authedFetch(`/api/listings/${id}/sold`, { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setToastMsg(data.message || "Couldn't mark as sold.");
        return;
      }
      setListings((prev) => prev.map((l) => (l.id === id ? data.listing : l)));
      setToastMsg("Listing marked as sold");
    } catch (err) {
      console.error(err);
      setToastMsg("Something went wrong.");
    } finally {
      setBusyId(null);
    }
  };

  const deleteListing = async (id: string) => {
    setBusyId(id);
    try {
      const res = await authedFetch(`/api/listings/mine/${id}`, { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setToastMsg(data.message || "Couldn't delete listing.");
        return;
      }
      setListings((prev) => prev.filter((l) => l.id !== id));
      setToastMsg("Listing deleted");
    } catch (err) {
      console.error(err);
      setToastMsg("Something went wrong.");
    } finally {
      setBusyId(null);
      setDeleteTarget(null);
    }
  };

  const copyLink = (id: string) => {
    const url = `${window.location.origin}/product/${id}`;
    navigator.clipboard.writeText(url);
    setToastMsg("Link copied");
    setOpenMenuId(null);
  };

  const filtered = useMemo(() => {
    let list = [...listings];

    if (filter !== "all") {
      list = list.filter((l) => l.status === filter);
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (l) =>
          l.itemTitle?.toLowerCase().includes(q) ||
          l.category?.toLowerCase().includes(q) ||
          l.state?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [listings, filter, search]);

  const stats = useMemo(() => {
    const active = listings.filter((l) => l.status === "active").length;
    const sold = listings.filter((l) => l.status === "sold").length;
    const pending = listings.filter((l) => l.status === "pending").length;
    const totalValue = listings
      .filter((l) => l.status === "active")
      .reduce((sum, l) => sum + (Number(l.sellingPrice) || 0), 0);

    return { active, sold, pending, totalValue };
  }, [listings]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
              Your listings
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mt-1">
              Manage listings
            </h1>
            <p className="text-sm text-[#211000]/55 font-medium mt-1">
              View performance, mark items sold, or delete your listed pieces.
            </p>
          </div>

          <Link
            href="/sell"
            className="inline-flex items-center gap-2 rounded-full bg-[#211000] hover:bg-[#211000]/90 text-[#FAF4EC] px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="size-4" />
            New listing
          </Link>
        </div>
      </div>

      {error ? (
        <div className="rounded-2xl bg-red-50 border border-red-200 p-6 flex items-start gap-3">
          <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
          <div>
            <p className="text-sm font-bold text-red-700">{error}</p>
            {getAuthedUser()?.token && (
              <button
                onClick={() => {
                  setLoading(true);
                  setError("");
                  fetchListings();
                }}
                className="text-xs font-bold text-red-600 underline mt-1"
              >
                Try again
              </button>
            )}
          </div>
        </div>
      ) : loading ? (
        <div className="rounded-2xl bg-white border border-[#211000]/6 py-20 text-center text-sm text-[#211000]/50 font-medium">
          Loading your listings…
        </div>
      ) : (
        <>
          {/* Stats */}
          <motion.div
            initial="hidden"
            animate="show"
            variants={{ show: { transition: { staggerChildren: 0.07 } } }}
            className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8"
          >
            {[
              { label: "Active", value: stats.active, color: "#5F7161" },
              { label: "Sold", value: stats.sold, color: "#B66B44" },
              { label: "Pending", value: stats.pending, color: "#211000" },
              { label: "Active value", value: formatNaira(stats.totalValue), color: "#211000" },
            ].map((stat) => (
              <motion.div
                key={stat.label}
                variants={{
                  hidden: { opacity: 0, y: 10 },
                  show: { opacity: 1, y: 0 },
                }}
                className="rounded-2xl bg-white border border-[#211000]/6 p-4"
              >
                <p className="text-xl sm:text-2xl font-bold" style={{ color: stat.color }}>
                  {stat.value}
                </p>
                <p className="text-xs text-[#211000]/50 font-medium mt-0.5">{stat.label}</p>
              </motion.div>
            ))}
          </motion.div>

          {/* Pending notice */}
          {stats.pending > 0 && (
            <div className="mb-6 rounded-2xl bg-yellow-50 border border-yellow-200 p-4 flex items-start gap-3">
              <Clock className="size-5 text-yellow-600 shrink-0 mt-0.5" />
              <div>
                <p className="text-sm font-bold text-yellow-800">
                  {stats.pending} listing{stats.pending > 1 ? "s are" : " is"} under review
                </p>
                <p className="text-xs text-yellow-700 font-medium mt-0.5">
                  Our team reviews new listings within 24 hours before they go live.
                </p>
              </div>
            </div>
          )}

          {/* Search */}
          <div className="relative mb-5">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#211000]/35" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your listings..."
              className="w-full rounded-full bg-white border border-[#211000]/8 pl-11 pr-10 py-3 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44] transition-colors"
            />
            {search && (
              <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2">
                <X className="size-4 text-[#211000]/35" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 mb-6">
            {STATUS_FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                className={`shrink-0 px-4 py-2 rounded-full text-xs font-bold border transition-all ${
                  filter === f.id
                    ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                    : "bg-white text-[#211000]/60 border-[#211000]/10 hover:border-[#211000]/25"
                }`}
              >
                {f.label}
                {f.id !== "all" && (
                  <span className="ml-1.5 opacity-60">
                    {listings.filter((l) => l.status === f.id).length}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Listings grid */}
          {filtered.length === 0 ? (
            <EmptyListings
              hasListings={listings.length > 0}
              onClear={() => {
                setSearch("");
                setFilter("all");
              }}
            />
          ) : (
            <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              <AnimatePresence mode="popLayout">
                {filtered.map((listing) => {
                  const config = getStatusConfig(listing.status);
                  const menuOpen = openMenuId === listing.id;
                  const isBusy = busyId === listing.id;
                  const canView = listing.status === "active";

                  return (
                    <motion.div
                      key={listing.id}
                      layout
                      initial={{ opacity: 0, y: 12 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className="group relative rounded-2xl bg-white border border-[#211000]/6 overflow-hidden hover:border-[#211000]/15 hover:shadow-sm transition-all"
                    >
                      {/* Image */}
                      <div className="block relative aspect-[4/3] overflow-hidden bg-[#E8CEB0]/30">
                        {canView ? (
                          <Link href={`/product/${listing.id}`}>
                            <img
                              src={listing.photos?.[0]}
                              alt={listing.itemTitle}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                            />
                          </Link>
                        ) : (
                          <img
                            src={listing.photos?.[0]}
                            alt={listing.itemTitle}
                            className="w-full h-full object-cover"
                          />
                        )}

                        {/* Status badge */}
                        <div className="absolute top-3 left-3">
                          <span
                            className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${config.color}`}
                          >
                            <span className={`size-1.5 rounded-full ${config.dot}`} />
                            {config.label}
                          </span>
                        </div>

                        {/* Menu button */}
                        <div className="absolute top-3 right-3">
                          <button
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                              setOpenMenuId(menuOpen ? null : listing.id);
                            }}
                            disabled={isBusy}
                            className="size-8 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow-sm hover:bg-white transition-colors disabled:opacity-50"
                          >
                            <MoreVertical className="size-4 text-[#211000]" />
                          </button>

                          <AnimatePresence>
                            {menuOpen && (
                              <>
                                <div className="fixed inset-0 z-10" onClick={() => setOpenMenuId(null)} />
                                <motion.div
                                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                                  animate={{ opacity: 1, scale: 1, y: 0 }}
                                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                                  transition={{ duration: 0.15 }}
                                  className="absolute right-0 top-full mt-1.5 w-48 rounded-2xl bg-white border border-[#211000]/8 shadow-xl overflow-hidden z-20"
                                >
                                  {canView && (
                                    <>
                                      <Link
                                        href={`/product/${listing.id}`}
                                        onClick={() => setOpenMenuId(null)}
                                        className="flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#FAF4EC] transition-colors"
                                      >
                                        <Eye className="size-4 text-[#211000]/60" />
                                        View listing
                                      </Link>

                                      <button
                                        onClick={() => copyLink(listing.id)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#FAF4EC] transition-colors"
                                      >
                                        <Copy className="size-4 text-[#211000]/60" />
                                        Copy link
                                      </button>

                                      <button
                                        onClick={() => markSold(listing.id)}
                                        className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#FAF4EC] transition-colors"
                                      >
                                        <BadgeCheck className="size-4 text-[#5F7161]" />
                                        Mark as sold
                                      </button>
                                    </>
                                  )}

                                  {listing.status === "rejected" && (
                                    <Link
                                      href={`/sell/create?edit=${listing.id}`}
                                      onClick={() => setOpenMenuId(null)}
                                      className="flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#FAF4EC] transition-colors"
                                    >
                                      <Pencil className="size-4 text-[#211000]/60" />
                                      Edit &amp; resubmit
                                    </Link>
                                  )}

                                  {listing.status !== "sold" && (
                                    <button
                                      onClick={() => {
                                        setDeleteTarget(listing);
                                        setOpenMenuId(null);
                                      }}
                                      className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-red-500 hover:bg-red-50 transition-colors border-t border-[#211000]/6"
                                    >
                                      <Trash2 className="size-4" />
                                      Delete listing
                                    </button>
                                  )}
                                </motion.div>
                              </>
                            )}
                          </AnimatePresence>
                        </div>
                      </div>

                      {/* Info */}
                      <div className="block p-4">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/45 mb-1">
                          {listing.brand || listing.category}
                        </p>
                        <h3 className="font-serif text-base font-medium leading-tight truncate">
                          {listing.itemTitle}
                        </h3>

                        <div className="mt-2 flex items-center justify-between">
                          <span className="text-sm font-bold">
                            {formatNaira(Number(listing.sellingPrice) || 0)}
                          </span>
                          {listing.originalPrice && (
                            <span className="text-[11px] text-[#211000]/40 line-through font-medium">
                              {formatNaira(Number(listing.originalPrice))}
                            </span>
                          )}
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[11px] text-[#211000]/45 font-medium">
                          <span>{listing.condition}</span>
                          <span className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            {listing.state}
                          </span>
                        </div>

                        {listing.status === "rejected" && listing.rejectionReason && (
                          <p className="mt-2 text-[11px] text-red-600 font-medium line-clamp-2">
                            {listing.rejectionReason}
                          </p>
                        )}

                        <div className="mt-3 pt-3 border-t border-[#211000]/6 text-[11px] text-[#211000]/40 font-medium">
                          Listed {new Date(listing.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </motion.div>
          )}
        </>
      )}

      {/* Delete confirmation */}
      <AnimatePresence>
        {deleteTarget && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center px-4 bg-[#211000]/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF4EC] border border-[#211000]/10 shadow-2xl p-7 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5">
                <Trash2 className="size-7 text-red-500" />
              </div>

              <h3 className="font-serif text-2xl font-medium tracking-tight mb-2">
                Delete listing?
              </h3>
              <p className="text-sm text-[#211000]/60 font-medium mb-1">
                "{deleteTarget.itemTitle}"
              </p>
              <p className="text-xs text-[#211000]/45 font-medium mb-7">
                This action cannot be undone.
              </p>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeleteTarget(null)}
                  className="rounded-full border border-[#211000]/10 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#E8CEB0]/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => deleteListing(deleteTarget.id)}
                  disabled={busyId === deleteTarget.id}
                  className="rounded-full bg-red-500 hover:bg-red-600 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors disabled:opacity-60"
                >
                  {busyId === deleteTarget.id ? "Deleting…" : "Delete"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toastMsg && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
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

function EmptyListings({
  hasListings,
  onClear,
}: {
  hasListings: boolean;
  onClear: () => void;
}) {
  return (
    <div className="rounded-2xl bg-white border border-[#211000]/6 py-20 text-center">
      <div className="size-16 rounded-full bg-[#E8CEB0]/40 mx-auto grid place-items-center mb-5">
        <Sofa className="size-7 text-[#B66B44]" />
      </div>

      <h3 className="font-serif text-2xl font-medium mb-2">
        {hasListings ? "No listings match your filter" : "No listings yet"}
      </h3>

      <p className="text-sm text-[#211000]/50 font-medium mb-8 max-w-sm mx-auto">
        {hasListings
          ? "Try a different filter or search term."
          : "Start selling by listing your first pre-loved piece."}
      </p>

      {hasListings ? (
        <button
          onClick={onClear}
          className="inline-flex items-center gap-2 rounded-full border border-[#211000]/10 bg-white hover:bg-[#E8CEB0]/20 px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
        >
          Clear filters
        </button>
      ) : (
        <Link
          href="/sell"
          className="inline-flex items-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
        >
          <Plus className="size-4" />
          Create first listing
          <ArrowRight className="size-3.5" />
        </Link>
      )}
    </div>
  );
}