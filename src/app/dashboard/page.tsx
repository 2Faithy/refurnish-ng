"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// ── Icons ─────────────────────────────────────────────────────
const IcPackage = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
    <line x1="12" y1="22.08" x2="12" y2="12" />
  </svg>
);
const IcHeart = ({ filled }: { filled?: boolean }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill={filled ? "currentColor" : "none"}
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const IcMessage = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z" />
  </svg>
);
const IcTag = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const IcShield = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcPlus = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IcArrow = () => (
  <svg
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const IcStar = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IcPin = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IcBell = () => (
  <svg
    width="17"
    height="17"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9" />
    <path d="M13.73 21a2 2 0 01-3.46 0" />
  </svg>
);
const IcCheck = () => (
  <svg
    width="9"
    height="9"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcTrend = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);
const IcUser = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IcSettings = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="3" />
    <path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z" />
  </svg>
);

// ── Mobile bottom tab icons ───────────────────────────────────
const IcGrid = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <rect x="3" y="3" width="7" height="7" />
    <rect x="14" y="3" width="7" height="7" />
    <rect x="14" y="14" width="7" height="7" />
    <rect x="3" y="14" width="7" height="7" />
  </svg>
);
const IcPackageMob = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M21 16V8a2 2 0 00-1-1.73l-7-4a2 2 0 00-2 0l-7 4A2 2 0 003 8v8a2 2 0 001 1.73l7 4a2 2 0 002 0l7-4A2 2 0 0021 16z" />
    <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
  </svg>
);
const IcPlusMob = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);
const IcHeartMob = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
  </svg>
);
const IcUserMob = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);

// ── Data ──────────────────────────────────────────────────────
const ORDERS = [
  {
    id: "111",
    name: "Minimalist Rack",
    date: "2024-07-14",
    status: "Pending",
    img: "/modern-table.png",
  },
  {
    id: "106",
    name: "Cozy Armchair",
    date: "2024-07-12",
    status: "Pending",
    img: "/vintage-chair.png",
  },
  {
    id: "102",
    name: "Rustic Shelf",
    date: "2024-07-05",
    status: "Processing",
    img: "/stylish-sofa.png",
  },
];

const SUGGESTIONS = [
  {
    id: 1,
    name: "Office Cabinet",
    price: 46000,
    old: null,
    img: "/modern-table.png",
    loc: "Ikeja, Lagos",
    rating: 4.5,
  },
  {
    id: 2,
    name: "Hammock Stand",
    price: 25000,
    old: 30000,
    img: "/stylish-sofa.png",
    loc: "Lekki, Lagos",
    rating: 4.8,
  },
  {
    id: 3,
    name: "Foldable Table",
    price: 15000,
    old: null,
    img: "/vintage-chair.png",
    loc: "Surulere, Lagos",
    rating: 4.2,
  },
];

const STATS = [
  {
    label: "Active Listings",
    value: "3",
    icon: IcTag,
    bg: "bg-[#F4E8D8]",
    tc: "text-[#755210]",
  },
  {
    label: "Total Orders",
    value: "12",
    icon: IcPackage,
    bg: "bg-[#EDF7EF]",
    tc: "text-[#2D6A4F]",
  },
  {
    label: "Saved Items",
    value: "7",
    icon: IcHeart,
    bg: "bg-[#FEF2F2]",
    tc: "text-[#C0392B]",
  },
  {
    label: "Messages",
    value: "4",
    icon: IcMessage,
    bg: "bg-[#EEF2FF]",
    tc: "text-[#6366F1]",
  },
];

const STATUS: Record<string, string> = {
  Pending: "bg-amber-50 text-amber-700 border border-amber-200",
  Processing: "bg-blue-50  text-blue-700  border border-blue-200",
  Delivered: "bg-green-50 text-green-700 border border-green-200",
  Cancelled: "bg-red-50   text-red-700   border border-red-200",
};

const RECENT_ACTIVITY = [
  {
    text: "Your order #111 is awaiting pickup",
    time: "2h ago",
    dot: "bg-amber-400",
  },
  {
    text: "New message from Seller on Armchair",
    time: "5h ago",
    dot: "bg-[#6366F1]",
  },
  { text: "Rustic Shelf order confirmed", time: "2d ago", dot: "bg-[#33B64B]" },
  {
    text: "Profile verified successfully",
    time: "3d ago",
    dot: "bg-[#755210]",
  },
];

const MOB_TABS = [
  { label: "Home", icon: IcGrid, href: "/dashboard" },
  { label: "Orders", icon: IcPackageMob, href: "/dashboard/orders" },
  { label: "Sell", icon: IcPlusMob, href: "/create-listing", special: true },
  { label: "Saved", icon: IcHeartMob, href: "/dashboard/saved" },
  { label: "Profile", icon: IcUserMob, href: "/dashboard/profile" },
];

// ── Page ──────────────────────────────────────────────────────
export default function DashboardPage() {
  const pathname = usePathname();
  const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

  return (
    // pt-16 = navbar height; pb-20 on mobile for bottom tab bar
    <div className="min-h-screen flex bg-[#FDF8F3] pt-26 pb-10 lg:pb-0 lg:pl-60 font-sans">
      {/* Sidebar renders fixed — outside flex flow, imported globally or here */}
      <Sidebar />

      {/* ── Main ── */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          {/* ── TOPBAR ── */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-[10px] text-[#B8A898] font-semibold uppercase tracking-widest mb-0.5">
                Dashboard
              </p>
              <h1 className="font-serif text-xl sm:text-2xl font-semibold text-[#2C1F0E]">
                Welcome back, Ada Obi 👋
              </h1>
            </div>
            <div className="flex items-center gap-2">
              {/* Notification bell */}
              <button className="relative w-9 h-9 rounded-xl bg-white border border-[#EDE0CF] flex items-center justify-center text-[#755210] hover:bg-[#F4E8D8] transition-colors">
                <IcBell />
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-[#33B64B] border border-white" />
              </button>
              {/* Avatar (mobile only — sidebar hidden) */}
              <div className="lg:hidden w-9 h-9 rounded-xl overflow-hidden ring-2 ring-[#E8CEB0]">
                <Image
                  src="/john-doe.png"
                  alt="Ada Obi"
                  width={36}
                  height={36}
                  className="object-cover w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* ── PROFILE HERO ── */}
          <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden mb-5 bg-[#755210]">
            <div className="absolute inset-0">
              <Image
                src="/bedroom.jpg"
                alt=""
                fill
                className="object-cover opacity-[0.18]"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-[#2C1A07]/85 via-[#755210]/60 to-transparent" />
            </div>
            <div className="relative z-10 flex items-center gap-4 sm:gap-6 px-5 py-5 sm:px-7 sm:py-6">
              {/* Avatar */}
              <div className="relative flex-shrink-0">
                <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-xl sm:rounded-2xl overflow-hidden ring-[3px] ring-[#E8CEB0]/50">
                  <Image
                    src="/john-doe.png"
                    alt="Ada Obi"
                    width={80}
                    height={80}
                    className="object-cover w-full h-full"
                  />
                </div>
                <div className="absolute -bottom-1 -right-1 w-5 h-5 sm:w-6 sm:h-6 rounded-full bg-[#33B64B] border-2 border-white flex items-center justify-center text-white">
                  <IcCheck />
                </div>
              </div>
              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap mb-0.5">
                  <h2 className="font-serif text-lg sm:text-xl text-white font-semibold">
                    Ada Obi
                  </h2>
                  <span className="text-[9px] sm:text-[10px] font-bold bg-[#33B64B] text-white px-2 py-0.5 rounded-full tracking-wide">
                    Verified
                  </span>
                </div>
                <p className="text-white/55 text-xs sm:text-sm mb-3">
                  ada@example.com
                </p>
                <div className="flex items-center gap-2 flex-wrap">
                  <Link
                    href="/dashboard/profile"
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/15 hover:bg-white/25 border border-white/25 text-white text-[11px] sm:text-xs font-semibold rounded-xl transition-all"
                  >
                    <IcUser /> Update Profile
                  </Link>
                  <Link
                    href="/dashboard/settings"
                    className="flex items-center gap-1.5 px-3 sm:px-4 py-1.5 sm:py-2 bg-white/10 hover:bg-white/20 border border-white/15 text-white/80 text-[11px] sm:text-xs font-medium rounded-xl transition-all"
                  >
                    <IcSettings /> Settings
                  </Link>
                </div>
              </div>
              {/* Escrow badge — hidden on small mobile */}
              <div className="hidden sm:flex flex-col items-center gap-1 pr-1">
                <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center text-[#E8CEB0]">
                  <IcShield />
                </div>
                <p className="text-[9px] text-white/45 text-center leading-tight">
                  Escrow
                  <br />
                  Protected
                </p>
              </div>
            </div>
          </div>

          {/* ── STAT CARDS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-5">
            {STATS.map(({ label, value, icon: Icon, bg, tc }) => (
              <div
                key={label}
                className="bg-white border border-[#EDE0CF] rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
              >
                <div
                  className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} ${tc}`}
                >
                  <Icon />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-lg sm:text-xl font-semibold text-[#2C1F0E] leading-none">
                    {value}
                  </p>
                  <p className="text-[10px] text-[#8C7A6B] font-medium leading-snug mt-0.5 truncate">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── MAIN GRID ── */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-5 mb-5">
            {/* Recent Orders — 2/3 */}
            <div className="lg:col-span-2 bg-white border border-[#EDE0CF] rounded-2xl overflow-hidden">
              <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[#F4EBE0]">
                <div className="flex items-center gap-2 text-[#2C1F0E]">
                  <IcPackage />
                  <h2 className="font-semibold text-sm">Recent Orders</h2>
                </div>
                <Link
                  href="/dashboard/orders"
                  className="flex items-center gap-1 text-xs text-[#755210] font-semibold hover:text-[#9A7235] transition-colors"
                >
                  View all <IcArrow />
                </Link>
              </div>
              <div className="divide-y divide-[#F8F1E9]">
                {ORDERS.map((o) => (
                  <div
                    key={o.id}
                    className="flex items-center gap-3 sm:gap-4 px-4 sm:px-5 py-3.5 hover:bg-[#FDFAF6] transition-colors"
                  >
                    <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-xl overflow-hidden bg-[#F4E8D8] flex-shrink-0">
                      <Image
                        src={o.img}
                        alt={o.name}
                        width={48}
                        height={48}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-[#2C1F0E] truncate">
                        {o.name}
                      </p>
                      <p className="text-[10.5px] text-[#8C7A6B] mt-0.5">
                        <span className="font-medium text-[#6B5A4E]">
                          #{o.id}
                        </span>
                        <span className="mx-1 text-[#D5C4B0]">·</span>
                        {o.date}
                      </p>
                    </div>
                    <span
                      className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 whitespace-nowrap ${
                        STATUS[o.status]
                      }`}
                    >
                      {o.status}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right column — 1/3 */}
            <div className="flex flex-col gap-3 sm:gap-4">
              {/* Sell CTA */}
              <div className="relative bg-[#755210] rounded-2xl overflow-hidden p-5">
                <div className="absolute inset-0 pointer-events-none">
                  <Image
                    src="/living.jpg"
                    alt=""
                    fill
                    className="object-cover opacity-[0.14]"
                  />
                </div>
                <div className="relative z-10">
                  <div className="w-8 h-8 rounded-xl bg-white/15 border border-white/25 flex items-center justify-center text-[#E8CEB0] mb-3">
                    <IcTag />
                  </div>
                  <p className="font-serif text-white text-base font-semibold mb-1">
                    Sell an Item
                  </p>
                  <p className="text-white/55 text-xs leading-relaxed mb-4">
                    Turn furniture you no longer need into cash.
                  </p>
                  <Link
                    href="/create-listing"
                    className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-[#E8CEB0] hover:bg-white text-[#755210] text-xs font-bold rounded-xl transition-all"
                  >
                    <IcPlus /> Create Listing
                  </Link>
                </div>
              </div>

              {/* Activity feed */}
              <div className="bg-white border border-[#EDE0CF] rounded-2xl overflow-hidden">
                <div className="flex items-center gap-2 px-4 py-3.5 border-b border-[#F4EBE0] text-[#2C1F0E]">
                  <IcTrend />
                  <h2 className="font-semibold text-sm">Recent Activity</h2>
                </div>
                <div className="px-4 py-3 flex flex-col gap-3">
                  {RECENT_ACTIVITY.map((a, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <div
                        className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${a.dot}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs text-[#2C1F0E] leading-snug">
                          {a.text}
                        </p>
                        <p className="text-[10px] text-[#B8A898] mt-0.5">
                          {a.time}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* ── THINGS YOU MIGHT LIKE ── */}
          <div className="bg-white border border-[#EDE0CF] rounded-2xl overflow-hidden mb-5">
            <div className="flex items-center justify-between px-4 sm:px-5 py-3.5 border-b border-[#F4EBE0]">
              <div>
                <h2 className="font-semibold text-sm text-[#2C1F0E]">
                  Things You Might Like
                </h2>
                <p className="text-[10.5px] text-[#8C7A6B] mt-0.5">
                  Curated picks near you in Lagos
                </p>
              </div>
              <Link
                href="/shop"
                className="flex items-center gap-1 text-xs text-[#755210] font-semibold hover:text-[#9A7235] whitespace-nowrap"
              >
                Shop more <IcArrow />
              </Link>
            </div>
            {/* Horizontal scroll on mobile, grid on sm+ */}
            <div className="flex sm:grid sm:grid-cols-3 gap-0 overflow-x-auto sm:overflow-visible divide-x divide-[#F4EBE0] sm:divide-y-0">
              {SUGGESTIONS.map((item) => (
                <div
                  key={item.id}
                  className="min-w-[220px] sm:min-w-0 p-4 flex flex-col hover:bg-[#FDFAF6] transition-colors group flex-shrink-0"
                >
                  <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden bg-[#F4E8D8] mb-3">
                    <Image
                      src={item.img}
                      alt={item.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    {item.old && (
                      <span className="absolute top-2 left-2 bg-[#C0392B] text-white text-[9px] font-bold px-2 py-0.5 rounded-full">
                        SALE
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-1 mb-1 text-[#8C7A6B]">
                    <IcPin />
                    <span className="text-[10px]">{item.loc}</span>
                  </div>
                  <p className="text-sm font-semibold text-[#2C1F0E] mb-1.5 leading-snug">
                    {item.name}
                  </p>
                  <div className="flex items-center gap-0.5 mb-2">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <span
                        key={s}
                        className={
                          s <= Math.floor(item.rating)
                            ? "text-[#755210]"
                            : "text-[#E5D5C0]"
                        }
                      >
                        <IcStar />
                      </span>
                    ))}
                    <span className="text-[10px] text-[#8C7A6B] ml-1">
                      {item.rating}
                    </span>
                  </div>
                  <div className="flex items-baseline gap-1.5 mb-3 mt-auto">
                    <span className="font-serif text-base font-semibold text-[#755210]">
                      {fmt(item.price)}
                    </span>
                    {item.old && (
                      <span className="text-xs text-[#B8A898] line-through">
                        {fmt(item.old)}
                      </span>
                    )}
                  </div>
                  <Link
                    href="/product"
                    className="flex items-center justify-center gap-1 w-full py-2 border-[1.5px] border-[#E5D5C0] hover:border-[#755210] hover:bg-[#F4E8D8] text-[#755210] text-xs font-bold rounded-xl transition-all"
                  >
                    View Product <IcArrow />
                  </Link>
                </div>
              ))}
            </div>
          </div>

          {/* ── ESCROW BANNER ── */}
          <div className="flex items-center gap-4 bg-[#EDF7EF] border border-[#C3E6CB] rounded-2xl px-5 py-4">
            <div className="w-9 h-9 rounded-xl bg-[#33B64B]/15 flex items-center justify-center text-[#2D6A4F] flex-shrink-0">
              <IcShield />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#2D6A4F]">
                Your money is always protected
              </p>
              <p className="text-xs text-[#3D8A5E] leading-relaxed mt-0.5">
                Every purchase on Fûrnit uses escrow — your payment is held
                securely until you confirm delivery.
              </p>
            </div>
            <Link
              href="/help"
              className="hidden sm:flex items-center gap-1 text-xs text-[#2D6A4F] font-semibold hover:underline flex-shrink-0"
            >
              Learn more <IcArrow />
            </Link>
          </div>
        </div>
      </main>

      {/* ══ MOBILE BOTTOM TAB BAR ══════════════════════════════ */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#EDE0CF] flex items-stretch"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {MOB_TABS.map(({ label, icon: Icon, href, special }) => {
          const active =
            pathname === href ||
            (href !== "/dashboard" &&
              href !== "/create-listing" &&
              pathname.startsWith(href));
          if (special) {
            return (
              <Link
                key={label}
                href={href}
                className="flex-1 flex flex-col items-center justify-center py-2 -mt-5"
              >
                <div className="w-12 h-12 rounded-2xl bg-[#755210] flex items-center justify-center text-white shadow-lg shadow-[#755210]/30">
                  <Icon />
                </div>
                <span className="text-[9px] font-semibold text-[#755210] mt-1">
                  {label}
                </span>
              </Link>
            );
          }
          return (
            <Link
              key={label}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                active
                  ? "text-[#755210]"
                  : "text-[#B8A898] hover:text-[#755210]"
              }`}
            >
              <Icon />
              <span className="text-[9px] font-semibold">{label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-[#755210]" />}
            </Link>
          );
        })}
      </nav>
    </div>
  );
}
