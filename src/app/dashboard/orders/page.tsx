"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Package,
  ArrowRight,
  ShieldCheck,
  Clock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Search,
  Filter,
  ChevronRight,
  Truck,
  RefreshCcw,
  Eye,
  X,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

const ORDERS_KEY = "refurnish_orders";

const STATUS_FILTERS = [
  { id: "all", label: "All orders" },
  { id: "escrow_active", label: "In escrow" },
  { id: "pending_payment_confirmation", label: "Pending" },
  { id: "delivered", label: "Delivered" },
  { id: "completed", label: "Completed" },
];

function getStatusConfig(order: any) {
  const escrow = order.escrowStatus;
  const status = order.status;

  if (escrow === "funds_held" || status === "escrow_active") {
    return {
      label: "In escrow",
      color: "bg-[#B66B44]/10 text-[#B66B44]",
      icon: ShieldCheck,
    };
  }
  if (status === "pending_payment_confirmation" || escrow === "awaiting_verification") {
    return {
      label: "Pending payment",
      color: "bg-yellow-50 text-yellow-700",
      icon: Clock,
    };
  }
  if (status === "delivered") {
    return {
      label: "Delivered",
      color: "bg-[#5F7161]/10 text-[#5F7161]",
      icon: Truck,
    };
  }
  if (escrow === "released" || status === "completed") {
    return {
      label: "Completed",
      color: "bg-[#5F7161]/10 text-[#5F7161]",
      icon: CheckCircle2,
    };
  }
  if (escrow === "refunded") {
    return {
      label: "Refunded",
      color: "bg-red-50 text-red-600",
      icon: RefreshCcw,
    };
  }

  return {
    label: "Processing",
    color: "bg-[#211000]/8 text-[#211000]",
    icon: Clock,
  };
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([]);
  const [filter, setFilter] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem(ORDERS_KEY);
      if (stored) setOrders(JSON.parse(stored).reverse());
    } catch {}
  }, []);

  const filtered = useMemo(() => {
    let list = [...orders];

    if (filter !== "all") {
      list = list.filter(
        (o) => o.status === filter || o.escrowStatus === filter
      );
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(
        (o) =>
          o.id?.toLowerCase().includes(q) ||
          o.paymentReference?.toLowerCase().includes(q) ||
          o.items?.some((i: any) => i.title?.toLowerCase().includes(q))
      );
    }

    return list;
  }, [orders, filter, search]);

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
          Your orders
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mt-1">
          Orders & escrow
        </h1>
        <p className="text-sm text-[#211000]/55 font-medium mt-1">
          Track your purchases, confirm deliveries, and manage escrow.
        </p>
      </div>

      {/* Escrow reminder banner */}
      <div className="mb-6 rounded-2xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-4 flex items-start gap-3">
        <ShieldCheck className="size-5 text-[#5F7161] shrink-0 mt-0.5" />
        <div className="text-xs text-[#211000]/70 leading-relaxed">
          <strong className="text-[#211000] font-bold">Escrow protection is active.</strong>
          {" "}Your payment is held safely until you confirm delivery. Only confirm receipt when you physically have the item in your hands.
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#211000]/35" />
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, product..."
            className="w-full rounded-full bg-white border border-[#211000]/8 pl-11 pr-4 py-3 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44] transition-colors"
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
      </div>

      {/* Filter pills */}
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
          </button>
        ))}
      </div>

      {/* Orders list */}
      {filtered.length === 0 ? (
        <div className="rounded-2xl bg-white border border-[#211000]/6 py-16 text-center">
          <div className="size-14 rounded-full bg-[#E8CEB0]/40 mx-auto grid place-items-center mb-4">
            <Package className="size-6 text-[#B66B44]" />
          </div>
          <p className="font-serif text-xl font-medium mb-2">No orders found</p>
          <p className="text-sm text-[#211000]/50 font-medium mb-6">
            {search ? "Try a different search term." : "You haven't placed any orders yet."}
          </p>
          {!search && (
            <Link
              href="/shop"
              className="inline-flex items-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Browse shop
              <ArrowRight className="size-3.5" />
            </Link>
          )}
        </div>
      ) : (
        <motion.div
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.06 } } }}
          className="space-y-3"
        >
          {filtered.map((order) => {
            const config = getStatusConfig(order);
            const StatusIcon = config.icon;

            return (
              <motion.div
                key={order.id}
                variants={{ hidden: { opacity: 0, y: 10 }, show: { opacity: 1, y: 0 } }}
              >
                <Link
                  href={`/dashboard/orders/${order.id}`}
                  className="group block rounded-2xl bg-white border border-[#211000]/6 hover:border-[#B66B44]/25 hover:shadow-sm transition-all overflow-hidden"
                >
                  <div className="flex items-start gap-4 p-4 sm:p-5">
                    {/* Image */}
                    <div className="size-16 sm:size-20 rounded-xl overflow-hidden bg-[#E8CEB0]/30 shrink-0">
                      {order.items?.[0]?.image ? (
                        <img
                          src={order.items[0].image}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full grid place-items-center">
                          <Package className="size-6 text-[#211000]/25" />
                        </div>
                      )}
                    </div>

                    {/* Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-sm font-bold truncate">
                            {order.items?.[0]?.title || "Order"}
                            {order.items?.length > 1 && (
                              <span className="text-[#211000]/45 font-medium">
                                {" "}+{order.items.length - 1} more
                              </span>
                            )}
                          </p>

                          <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-0.5 text-[11px] text-[#211000]/45 font-medium">
                            <span>{order.id}</span>
                            <span>·</span>
                            <span>{order.createdAt?.split("T")[0]}</span>
                            {order.paymentMethod && (
                              <>
                                <span>·</span>
                                <span className="capitalize">{order.paymentMethod}</span>
                              </>
                            )}
                          </div>
                        </div>

                        <ChevronRight className="size-4 text-[#211000]/20 group-hover:text-[#B66B44] shrink-0 transition-colors" />
                      </div>

                      <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                        <span
                          className={`inline-flex items-center gap-1.5 text-[10px] font-bold px-2.5 py-1 rounded-full ${config.color}`}
                        >
                          <StatusIcon className="size-3" />
                          {config.label}
                        </span>

                        <span className="text-sm font-bold">
                          {formatNaira(order.total)}
                        </span>
                      </div>

                      {/* Delivery info */}
                      {order.deliveryInfo?.type && (
                        <p className="mt-2 text-[11px] text-[#211000]/45 font-medium flex items-center gap-1">
                          <Truck className="size-3" />
                          {order.deliveryInfo.type === "delivery"
                            ? `Delivery to ${order.deliveryInfo.lga || ""}, ${order.deliveryInfo.state || ""}`
                            : "Seller pickup"}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Escrow bar */}
                  {order.escrowStatus === "funds_held" && (
                    <div className="px-4 sm:px-5 pb-4">
                      <div className="rounded-xl bg-[#B66B44]/8 border border-[#B66B44]/15 px-3.5 py-2.5 flex items-center gap-2">
                        <ShieldCheck className="size-4 text-[#B66B44] shrink-0" />
                        <p className="text-[11px] text-[#B66B44] font-bold">
                          Payment is held in escrow — confirm receipt to release funds.
                        </p>
                      </div>
                    </div>
                  )}
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}