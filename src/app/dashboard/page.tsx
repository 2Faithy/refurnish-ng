"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowUpRight,
  Package,
  Sofa,
  Heart,
  TrendingUp,
  ShieldCheck,
  Clock,
  Sparkles,
  Plus,
  MessageCircle,
  CheckCircle2,
  AlertCircle,
  Bell,
  BellRing,
  ArrowRight,
  ChevronRight,
  Activity,
  Trash2,
  UserCheck,
} from "lucide-react";
import { products, formatNaira } from "@/lib/data";

const ORDERS_KEY = "refurnish_orders";
const SAVED_KEY = "refurnish_saved";
const CART_KEY = "refurnish_cart";
const NOTIFICATIONS_KEY = "refurnish_notifications";

const NOTIFICATION_ICONS: Record<string, any> = {
  order: CheckCircle2,
  escrow: ShieldCheck,
  message: MessageCircle,
  saved: TrendingUp,
  system: AlertCircle,
};

const NOTIFICATION_COLORS: Record<string, string> = {
  order: "#5F7161",
  escrow: "#B66B44",
  message: "#211000",
  saved: "#B66B44",
  system: "#c0392b",
};

const MOCK_NOTIFICATIONS = [
  {
    id: "notif-1",
    type: "order",
    title: "Order confirmed",
    message:
      "Your order RF-ORD-ABC123 has been confirmed and is being processed.",
    time: "2 min ago",
    read: false,
  },
  {
    id: "notif-2",
    type: "escrow",
    title: "Payment held in escrow",
    message:
      "₦285,000 is now securely held until you confirm delivery of Beni Linen Sofa.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: "notif-3",
    type: "message",
    title: "New message from seller",
    message: "Adaeze (REFURNISH ATELIER) sent you a message about your order.",
    time: "3 hours ago",
    read: true,
  },
];

export default function DashboardOverviewPage() {
  const [user, setUser] = useState<any>(null);
  const [orders, setOrders] = useState<any[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [notifications, setNotifications] = useState<any[]>([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/me`, {
      credentials: "include",
    })
      .then((res) => {
        if (!res.ok) throw new Error("Not authenticated");
        return res.json();
      })
      .then((data) => setUser(data.user))
      .catch(() => setUser(null));

    try {
      const o = localStorage.getItem(ORDERS_KEY);
      if (o) setOrders(JSON.parse(o).reverse());

      const s = localStorage.getItem(SAVED_KEY);
      if (s) setSavedIds(JSON.parse(s));

      const c = localStorage.getItem(CART_KEY);
      if (c) setCartIds(JSON.parse(c));

      const storedNotifs = localStorage.getItem(NOTIFICATIONS_KEY);
      if (storedNotifs) {
        setNotifications(JSON.parse(storedNotifs));
      } else {
        setNotifications(MOCK_NOTIFICATIONS);
        localStorage.setItem(
          NOTIFICATIONS_KEY,
          JSON.stringify(MOCK_NOTIFICATIONS)
        );
      }
    } catch {}
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        notifRef.current &&
        !notifRef.current.contains(event.target as Node)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const markAsRead = (id: string) => {
    const updated = notifications.map((n) =>
      n.id === id ? { ...n, read: true } : n
    );
    setNotifications(updated);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  };

  const markAllAsRead = () => {
    const updated = notifications.map((n) => ({ ...n, read: true }));
    setNotifications(updated);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  };

  const deleteNotification = (id: string) => {
    const updated = notifications.filter((n) => n.id !== id);
    setNotifications(updated);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(updated));
  };

  const stats = useMemo(() => {
    const activeOrders = orders.filter(
      (o) =>
        o.status === "escrow_active" ||
        o.status === "pending_payment_confirmation"
    ).length;
    const totalSpent = orders.reduce((sum, o) => sum + (o.total || 0), 0);
    const escrowHeld = orders
      .filter((o) => o.escrowStatus === "funds_held")
      .reduce((sum, o) => sum + (o.total || 0), 0);

    return [
      {
        label: "Active orders",
        value: activeOrders,
        icon: Package,
        color: "#B66B44",
        href: "/dashboard/orders",
      },
      {
        label: "Total spent",
        value: formatNaira(totalSpent),
        icon: TrendingUp,
        color: "#5F7161",
        href: "/dashboard/orders",
      },
      {
        label: "In escrow",
        value: formatNaira(escrowHeld),
        icon: ShieldCheck,
        color: "#211000",
        href: "/dashboard/orders?filter=escrow",
      },
      {
        label: "Saved items",
        value: savedIds.length,
        icon: Heart,
        color: "#B66B44",
        href: "/saved",
      },
    ];
  }, [orders, savedIds]);

  const recentOrders = useMemo(() => orders.slice(0, 3), [orders]);
  const recommendedListings = useMemo(() => products.slice(0, 4), []);

  return (
    <div className="px-4 md:px-8 py-8 max-w-7xl mx-auto space-y-10 text-[#211000]">
      {/* Dynamic Header Block */}
      <div className="flex items-center justify-between border-b border-[#211000]/10 pb-8">
        <div>
          <h1 className="font-serif text-3xl md:text-4xl font-medium tracking-tight">
            Hello, {user?.name?.split(" ")[0] || "Welcome"} 👋
          </h1>
          <p className="text-sm md:text-base text-[#211000]/60 mt-1.5">
            Overview of your marketplace ecosystem.
          </p>
        </div>

        <div className="flex items-center gap-4">
          {/* Main Notification Bell Component */}
          <div className="relative" ref={notifRef}>
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative size-12 rounded-full bg-white border border-[#211000]/15 flex items-center justify-center hover:bg-neutral-50 transition-colors"
            >
              {unreadCount > 0 ? (
                <BellRing className="size-6 text-[#B66B44]" />
              ) : (
                <Bell className="size-6 text-[#211000]/70" />
              )}
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 size-5 rounded-full bg-[#c0392b] text-white text-[10px] font-bold flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notification Dropdown Portal */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 8, scale: 0.98 }}
                  className="absolute right-0 top-full mt-3 w-[calc(100vw-2rem)] sm:w-[420px] bg-white rounded-xl shadow-xl border border-[#211000]/15 overflow-hidden z-50"
                >
                  <div className="p-4 border-b border-[#211000]/10 flex items-center justify-between bg-neutral-50/50">
                    <span className="font-serif font-medium text-base">
                      Notifications ({unreadCount})
                    </span>
                    {unreadCount > 0 && (
                      <button
                        onClick={markAllAsRead}
                        className="text-sm font-semibold text-[#B66B44] hover:underline"
                      >
                        Mark all read
                      </button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto divide-y divide-[#211000]/10">
                    {notifications.length === 0 ? (
                      <div className="p-10 text-center text-sm text-[#211000]/50">
                        No new alerts
                      </div>
                    ) : (
                      notifications.map((notif) => {
                        const Icon = NOTIFICATION_ICONS[notif.type] || Bell;
                        return (
                          <div
                            key={notif.id}
                            className={`p-4 flex gap-4 text-left transition-colors ${
                              !notif.read ? "bg-[#FAF4EC]/40" : "bg-white"
                            }`}
                          >
                            <div
                              className="size-10 rounded-lg flex items-center justify-center shrink-0"
                              style={{
                                backgroundColor: `${
                                  NOTIFICATION_COLORS[notif.type]
                                }15`,
                                color: NOTIFICATION_COLORS[notif.type],
                              }}
                            >
                              <Icon className="size-5" />
                            </div>
                            <div className="flex-1 min-w-0 text-sm">
                              <div className="flex items-start justify-between gap-3">
                                <p className="font-bold truncate text-[#211000]">
                                  {notif.title}
                                </p>
                                <button
                                  onClick={() => deleteNotification(notif.id)}
                                  className="text-neutral-400 hover:text-red-500 p-0.5"
                                >
                                  <Trash2 className="size-4" />
                                </button>
                              </div>
                              <p className="text-[#211000]/80 mt-1 leading-relaxed">
                                {notif.message}
                              </p>
                              <p className="text-xs text-[#211000]/40 mt-1.5">
                                {notif.time}
                              </p>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <Link
            href="/sell"
            className="inline-flex items-center gap-2 rounded-full bg-[#211000] text-white px-5 py-3 text-sm font-semibold tracking-wide transition-transform active:scale-95 shadow-sm"
          >
            <Plus className="size-5" />
            <span>List Item</span>
          </Link>
        </div>
      </div>

      {/* Responsive Stats Bar - Horizontal Scroll on Mobile, Grid on Desktop */}
      <div className="flex overflow-x-auto pb-3 -mx-4 px-4 md:mx-0 md:px-0 md:grid md:grid-cols-4 gap-5 scrollbar-none snap-x">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="min-w-[200px] flex-1 snap-start bg-white border border-[#211000]/10 rounded-xl p-5 flex flex-col justify-between hover:border-[#B66B44]/30 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between mb-5">
                <span className="text-sm text-[#211000]/60 font-semibold">
                  {stat.label}
                </span>
                <Icon
                  className="size-5 opacity-75"
                  style={{ color: stat.color }}
                />
              </div>
              <p className="text-2xl md:text-3xl font-bold font-mono tracking-tight text-neutral-900">
                {stat.value}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Main Content Blueprint Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Main Operational Left Column */}
        <div className="lg:col-span-2 space-y-8">
          {/* Clean Quick Utilities Grid */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { href: "/dashboard/orders", icon: Package, label: "Orders" },
              { href: "/dashboard/listings", icon: Sofa, label: "Listings" },
              {
                href: "/dashboard/messages",
                icon: MessageCircle,
                label: "Messages",
              },
              { href: "/sell", icon: Plus, label: "New Listing" },
            ].map((act, i) => (
              <Link
                key={i}
                href={act.href}
                className="bg-neutral-50/60 hover:bg-[#FAF4EC]/40 border border-[#211000]/10 py-5 rounded-xl flex flex-col items-center gap-2 transition-colors group"
              >
                <act.icon className="size-5 text-[#211000]/80 group-hover:text-[#B66B44] transition-colors" />
                <span className="text-xs md:text-sm font-semibold tracking-tight">
                  {act.label}
                </span>
              </Link>
            ))}
          </div>

          {/* Active Orders List Frame */}
          <div className="bg-white border border-[#211000]/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#211000]/10">
              <div>
                <h2 className="font-serif font-medium text-base md:text-lg">
                  Recent orders
                </h2>
                <p className="text-xs md:text-sm text-[#211000]/50 mt-0.5">
                  Active lifecycle tracking
                </p>
              </div>
              <Link
                href="/dashboard/orders"
                className="text-sm font-bold text-[#B66B44] hover:underline flex items-center gap-1.5"
              >
                View all <ArrowRight className="size-4" />
              </Link>
            </div>

            {recentOrders.length === 0 ? (
              <div className="p-10 text-center text-sm text-[#211000]/50">
                No orders active
              </div>
            ) : (
              <div className="divide-y divide-[#211000]/10">
                {recentOrders.map((order) => (
                  <OrderRow key={order.id} order={order} />
                ))}
              </div>
            )}
          </div>

          {/* Curation Shelf Grid */}
          <div className="bg-white border border-[#211000]/10 rounded-xl overflow-hidden">
            <div className="flex items-center justify-between px-6 py-5 border-b border-[#211000]/10">
              <h2 className="font-serif font-medium text-base md:text-lg flex items-center gap-2">
                <Sparkles className="size-4.5 text-[#B66B44]" /> For you
              </h2>
              <Link
                href="/shop"
                className="text-sm font-bold text-[#B66B44] hover:underline"
              >
                Browse product hub
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-5 p-5">
              {recommendedListings.map((product) => (
                <Link
                  key={product.id}
                  href={`/product/${product.slug}`}
                  className="group block space-y-2"
                >
                  <div className="aspect-square rounded-lg overflow-hidden bg-neutral-100 border border-neutral-200/40">
                    <img
                      src={product.images[0]}
                      alt={product.title}
                      className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
                    />
                  </div>
                  <div className="text-xs md:text-sm min-w-0">
                    <p className="text-[#211000]/50 uppercase text-[10px] tracking-wider font-bold truncate">
                      {product.brand}
                    </p>
                    <p className="font-semibold text-[#211000]/90 truncate mt-0.5">
                      {product.title}
                    </p>
                    <p className="font-extrabold text-neutral-900 mt-1">
                      {formatNaira(product.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Informational Context Right Column */}
        <div className="space-y-8">
          {/* Identity Context Card */}
          <div className="bg-neutral-50/60 border border-[#211000]/10 rounded-xl p-6">
            <div className="flex items-center gap-4">
              <div className="size-12 rounded-full bg-[#E8CEB0]/50 flex items-center justify-center font-serif font-bold text-base text-[#B66B44]">
                {user?.name ? user.name[0] : "U"}
              </div>
              <div>
                <h3 className="text-base font-bold tracking-tight">
                  {user?.name || "Marketplace Guest"}
                </h3>
                <p className="text-xs md:text-sm text-[#211000]/60 mt-0.5">
                  {user?.email || "Verification Level 1"}
                </p>
              </div>
            </div>
          </div>

          {/* Profile Completion Metrics Widget */}
          <div className="bg-white border border-[#211000]/10 rounded-xl p-6 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <UserCheck className="size-5 text-[#5F7161]" />
                <h3 className="font-serif text-sm font-bold uppercase tracking-wider text-[#211000]/50">
                  Profile Setup
                </h3>
              </div>
              <span className="text-sm font-extrabold text-[#5F7161] bg-[#5F7161]/10 px-2.5 py-0.5 rounded-full">
                75%
              </span>
            </div>

            {/* Native Progress Slider Track */}
            <div className="w-full h-2 bg-neutral-100 rounded-full overflow-hidden">
              <div className="w-[75%] h-full bg-[#5F7161] rounded-full" />
            </div>

            <p className="text-xs md:text-sm text-[#211000]/70 leading-relaxed">
              Complete your profile verification setup layout to instantly
              minimize escrow release timeframes.
            </p>

            <div className="pt-2 border-t border-[#211000]/5 space-y-2.5">
              <div className="flex items-center justify-between text-xs md:text-sm text-[#211000]/50">
                <span className="line-through">Verify Phone Identity</span>
                <CheckCircle2 className="size-4 text-[#5F7161]" />
              </div>
              <div className="flex items-center justify-between text-xs md:text-sm text-[#211000]/50">
                <span className="line-through">Link Financial Node</span>
                <CheckCircle2 className="size-4 text-[#5F7161]" />
              </div>
              <Link
                href="/dashboard/profile"
                className="flex items-center justify-between text-xs md:text-sm text-[#B66B44] font-bold group"
              >
                <span>Add Secondary Address Matrix</span>
                <Plus className="size-4 group-hover:scale-110 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Trust Infrastructure Widget */}
          <div className="bg-[#211000] text-neutral-200 rounded-xl p-6 space-y-4">
            <div className="flex items-center gap-2">
              <ShieldCheck className="size-5 text-[#E8CEB0]" />
              <h3 className="font-serif text-base font-medium text-white">
                Escrow protection
              </h3>
            </div>
            <p className="text-xs md:text-sm text-neutral-400 leading-relaxed">
              Payments remain isolated securely inside our system architecture
              until fulfillment verification is signed off.
            </p>
            <div className="space-y-2.5 text-xs md:text-sm text-neutral-300 border-t border-white/10 pt-4">
              <div className="flex items-center gap-2.5">
                <span className="size-1.5 rounded-full bg-[#E8CEB0]" />
                <span>Locked asset vault system</span>
              </div>
              <div className="flex items-center gap-2.5">
                <span className="size-1.5 rounded-full bg-[#E8CEB0]" />
                <span>3-day automated review window</span>
              </div>
            </div>
          </div>

          {/* Activity Log Audit Timeline */}
          <div className="bg-white border border-[#211000]/10 rounded-xl p-6 space-y-5">
            <h3 className="font-serif text-xs font-bold tracking-wider text-[#211000]/50 uppercase flex items-center gap-2">
              <Activity className="size-4" /> Event Log
            </h3>
            <div className="space-y-4">
              {recentOrders.length > 0 ? (
                recentOrders.map((order) => (
                  <div
                    key={order.id}
                    className="flex items-start justify-between text-xs md:text-sm gap-3"
                  >
                    <div className="min-w-0">
                      <p className="font-semibold text-[#211000] truncate">
                        Order lifecycle tracking initialized
                      </p>
                      <p className="text-xs text-[#211000]/50 truncate mt-0.5">
                        {order.id} • {formatNaira(order.total)}
                      </p>
                    </div>
                    <span className="text-xs text-neutral-400 whitespace-nowrap mt-0.5">
                      {order.createdAt
                        ? new Date(order.createdAt).toLocaleDateString(
                            undefined,
                            { month: "short", day: "numeric" }
                          )
                        : ""}
                    </span>
                  </div>
                ))
              ) : (
                <p className="text-xs md:text-sm text-neutral-400">
                  No transactions recorded
                </p>
              )}
            </div>
          </div>

          {/* Deep Navigation Map */}
          <div className="bg-white border border-[#211000]/10 rounded-xl p-2 divide-y divide-[#211000]/10">
            {[
              { label: "Profile Architecture", href: "/dashboard/profile" },
              { label: "Marketplace Support", href: "/support" },
              { label: "System Preferences", href: "/dashboard/settings" },
            ].map((link, i) => (
              <Link
                key={i}
                href={link.href}
                className="flex items-center justify-between p-3.5 text-xs md:text-sm font-semibold hover:bg-neutral-50 rounded-lg transition-colors group"
              >
                <span>{link.label}</span>
                <ChevronRight className="size-4 text-neutral-300 group-hover:text-[#B66B44] group-hover:translate-x-0.5 transition-all" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function OrderRow({ order }: { order: any }) {
  const isHeld = order.escrowStatus === "funds_held";
  const isReleased = order.escrowStatus === "released";

  return (
    <Link
      href={`/dashboard/orders/${order.id}`}
      className="flex items-center justify-between p-5 hover:bg-neutral-50/60 transition-colors gap-4"
    >
      <div className="flex items-center gap-4 min-w-0">
        <div className="size-12 rounded-lg bg-neutral-100 overflow-hidden shrink-0 border border-neutral-200/60">
          {order.items?.[0]?.image ? (
            <img
              src={order.items[0].image}
              alt=""
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center bg-neutral-50">
              <Package className="size-5 text-neutral-300" />
            </div>
          )}
        </div>
        <div className="min-w-0 text-xs md:text-sm">
          <p className="font-bold text-[#211000] truncate">
            {order.items?.[0]?.title || "Item Order"}
            {order.items?.length > 1 && (
              <span className="text-neutral-400 font-normal">
                {" "}
                +{order.items.length - 1}
              </span>
            )}
          </p>
          <p className="text-xs text-neutral-400 truncate mt-1">{order.id}</p>
        </div>
      </div>

      <div className="text-right text-xs md:text-sm shrink-0 space-y-1.5">
        <p className="font-extrabold tracking-tight text-neutral-900">
          {formatNaira(order.total)}
        </p>
        <span
          className={`inline-block text-[11px] px-2.5 py-0.5 rounded-full font-bold ${
            isHeld
              ? "bg-[#B66B44]/10 text-[#B66B44]"
              : isReleased
              ? "bg-[#5F7161]/10 text-[#5F7161]"
              : "bg-neutral-100 text-neutral-600"
          }`}
        >
          {isHeld ? "Escrow Vaulted" : isReleased ? "Completed" : "Processing"}
        </span>
      </div>
    </Link>
  );
}
