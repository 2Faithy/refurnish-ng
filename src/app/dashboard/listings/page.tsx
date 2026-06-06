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
  Package,
  Sofa,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Copy,
  ToggleLeft,
  ToggleRight,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

const LISTINGS_KEY = "refurnish_listings";

const MOCK_LISTINGS = [
  {
    id: "lst-001",
    slug: "beni-linen-three-seater-sofa",
    title: "Beni Linen Three-Seater Sofa",
    brand: "REFURNISH ATELIER",
    price: 285000,
    originalPrice: 420000,
    condition: "Excellent",
    category: "Living Room",
    status: "active",
    views: 342,
    saves: 18,
    location: "Lekki, Lagos",
    createdAt: "2024-11-01T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "lst-002",
    slug: "oak-round-dining-set",
    title: "Oak Round Dining Set with Rattan Chairs",
    brand: "MAKER'S CO.",
    price: 195000,
    originalPrice: null,
    condition: "Very Good",
    category: "Dining",
    status: "active",
    views: 218,
    saves: 11,
    location: "Yaba, Lagos",
    createdAt: "2024-11-10T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1615066390971-03e4e1c36ddf?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "lst-003",
    slug: "handwoven-striped-jute-rug",
    title: "Handwoven Striped Jute Rug 160×230cm",
    brand: "REFURNISH ATELIER",
    price: 64000,
    originalPrice: null,
    condition: "Excellent",
    category: "Decor",
    status: "pending",
    views: 0,
    saves: 0,
    location: "Lekki, Lagos",
    createdAt: "2024-12-01T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1600166898405-da9535204843?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "lst-004",
    slug: "walnut-brass-low-coffee-table",
    title: "Walnut & Brass Low Coffee Table",
    brand: "STUDIO ÒKÀ",
    price: 132000,
    originalPrice: null,
    condition: "Very Good",
    category: "Living Room",
    status: "sold",
    views: 501,
    saves: 29,
    location: "Surulere, Lagos",
    createdAt: "2024-10-15T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "lst-005",
    slug: "japandi-platform-bed-frame",
    title: "Japandi Platform Bed Frame Queen",
    brand: "MAKER'S CO.",
    price: 240000,
    originalPrice: 310000,
    condition: "Very Good",
    category: "Bedroom",
    status: "paused",
    views: 97,
    saves: 6,
    location: "Ikeja, Lagos",
    createdAt: "2024-11-20T10:00:00.000Z",
    image:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=800&q=80",
  },
];

const STATUS_FILTERS = [
  { id: "all", label: "All" },
  { id: "active", label: "Active" },
  { id: "pending", label: "Pending" },
  { id: "paused", label: "Paused" },
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
    case "paused":
      return {
        label: "Paused",
        color: "bg-[#211000]/8 text-[#211000]/60",
        dot: "bg-[#211000]/40",
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

export default function ListingsPage() {
  const [listings, setListings] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");
  const [openMenuId, setOpenMenuId] = useState<string | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<any | null>(null);
  const [toastMsg, setToastMsg] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(LISTINGS_KEY);
      if (stored) {
        setListings(JSON.parse(stored));
      } else {
        setListings(MOCK_LISTINGS);
        localStorage.setItem(LISTINGS_KEY, JSON.stringify(MOCK_LISTINGS));
      }
    } catch {
      setListings(MOCK_LISTINGS);
    }
  }, []);

  useEffect(() => {
    if (!toastMsg) return;
    const t = setTimeout(() => setToastMsg(""), 2500);
    return () => clearTimeout(t);
  }, [toastMsg]);

  const persistListings = (next: any[]) => {
    setListings(next);
    localStorage.setItem(LISTINGS_KEY, JSON.stringify(next));
  };

  const togglePause = (id: string) => {
    const updated = listings.map((l) => {
      if (l.id !== id) return l;
      const newStatus = l.status === "paused" ? "active" : "paused";
      return { ...l, status: newStatus };
    });
    persistListings(updated);
    const item = listings.find((l) => l.id === id);
    setToastMsg(
      item?.status === "paused" ? "Listing reactivated" : "Listing paused"
    );
    setOpenMenuId(null);
  };

  const deleteListing = (id: string) => {
    const updated = listings.filter((l) => l.id !== id);
    persistListings(updated);
    setDeleteTarget(null);
    setToastMsg("Listing deleted");
  };

  const copyLink = (slug: string) => {
    const url = `${window.location.origin}/product/${slug}`;
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
          l.title?.toLowerCase().includes(q) ||
          l.category?.toLowerCase().includes(q) ||
          l.location?.toLowerCase().includes(q)
      );
    }

    return list;
  }, [listings, filter, search]);

  const stats = useMemo(() => {
    const active = listings.filter((l) => l.status === "active").length;
    const sold = listings.filter((l) => l.status === "sold").length;
    const pending = listings.filter((l) => l.status === "pending").length;
    const totalViews = listings.reduce((sum, l) => sum + (l.views || 0), 0);
    const totalValue = listings
      .filter((l) => l.status === "active")
      .reduce((sum, l) => sum + (l.price || 0), 0);

    return { active, sold, pending, totalViews, totalValue };
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
              View performance, pause, or delete your listed pieces.
            </p>
          </div>

          <Link
            href="/sell/create"
            className="inline-flex items-center gap-2 rounded-full bg-[#211000] hover:bg-[#211000]/90 text-[#FAF4EC] px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors shadow-sm"
          >
            <Plus className="size-4" />
            New listing
          </Link>
        </div>
      </div>

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
          { label: "Total views", value: stats.totalViews.toLocaleString(), color: "#211000" },
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

              return (
                <motion.div
                  key={listing.id}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="group relative rounded-2xl bg-white border border-[#211000]/6 overflow-hidden hover:border-[#211000]/15 hover:shadow-sm transition-all"
                >
                  {/* Image — links to public product page */}
                  <Link href={`/product/${listing.slug}`} className="block relative aspect-[4/3] overflow-hidden bg-[#E8CEB0]/30">
                    <img
                      src={listing.image}
                      alt={listing.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />

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
                        className="size-8 rounded-full bg-white/90 backdrop-blur grid place-items-center shadow-sm hover:bg-white transition-colors"
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
                              <Link
                                href={`/product/${listing.slug}`}
                                onClick={() => setOpenMenuId(null)}
                                className="flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#FAF4EC] transition-colors"
                              >
                                <Eye className="size-4 text-[#211000]/60" />
                                View listing
                              </Link>

                              {listing.status !== "sold" && (
                                <button
                                  onClick={() => togglePause(listing.id)}
                                  className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#FAF4EC] transition-colors"
                                >
                                  {listing.status === "paused" ? (
                                    <>
                                      <ToggleRight className="size-4 text-[#5F7161]" />
                                      Reactivate
                                    </>
                                  ) : (
                                    <>
                                      <ToggleLeft className="size-4 text-[#211000]/60" />
                                      Pause listing
                                    </>
                                  )}
                                </button>
                              )}

                              <button
                                onClick={() => copyLink(listing.slug)}
                                className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold hover:bg-[#FAF4EC] transition-colors"
                              >
                                <Copy className="size-4 text-[#211000]/60" />
                                Copy link
                              </button>

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
                  </Link>

                  {/* Info — also links to product page */}
                  <Link href={`/product/${listing.slug}`} className="block p-4">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/45 mb-1">
                      {listing.category}
                    </p>
                    <h3 className="font-serif text-base font-medium leading-tight truncate">
                      {listing.title}
                    </h3>

                    <div className="mt-2 flex items-center justify-between">
                      <span className="text-sm font-bold">{formatNaira(listing.price)}</span>
                      {listing.originalPrice && (
                        <span className="text-[11px] text-[#211000]/40 line-through font-medium">
                          {formatNaira(listing.originalPrice)}
                        </span>
                      )}
                    </div>

                    <div className="mt-3 flex items-center justify-between text-[11px] text-[#211000]/45 font-medium">
                      <span className="flex items-center gap-1">
                        <Eye className="size-3.5" />
                        {listing.views?.toLocaleString() || 0} views
                      </span>
                      <span className="flex items-center gap-1">
                        <MapPin className="size-3" />
                        {listing.location}
                      </span>
                    </div>

                    <div className="mt-3 pt-3 border-t border-[#211000]/6 text-[11px] text-[#211000]/40 font-medium">
                      Listed {new Date(listing.createdAt).toLocaleDateString()}
                    </div>
                  </Link>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
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
                "{deleteTarget.title}"
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
                  className="rounded-full bg-red-500 hover:bg-red-600 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Delete
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
          href="/sell/create"
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