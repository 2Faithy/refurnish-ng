"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Sidebar from "@/components/Sidebar";

// ── Icons ─────────────────────────────────────────────────────
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
const IcArrowLeft = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
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
const IcTruck = () => (
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
    <rect x="1" y="3" width="15" height="13" />
    <polygon points="16 8 20 8 23 11 23 16 16 16 16 8" />
    <circle cx="5.5" cy="18.5" r="2.5" />
    <circle cx="18.5" cy="18.5" r="2.5" />
  </svg>
);
const IcCheck = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcClock = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);
const IcX = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcSearch = () => (
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
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);
const IcShield = () => (
  <svg
    width="14"
    height="14"
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
const IcShop = () => (
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
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const IcStar = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="currentColor">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const IcClose = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
);
const IcMap = () => (
  <svg
    width="14"
    height="14"
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
const IcWhatsApp = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12.004 0C5.374 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.83L.057 23.882l6.204-1.626A11.947 11.947 0 0012.004 24C18.63 24 24 18.626 24 12S18.63 0 12.004 0zm0 21.818a9.818 9.818 0 01-5.003-1.373l-.359-.214-3.724.976.993-3.631-.234-.374a9.818 9.818 0 1114.317-8.2c0 5.42-4.4 9.816-9.99 9.816z" />
  </svg>
);

// ── Types ─────────────────────────────────────────────────────
type OrderStatus =
  | "Pending"
  | "Processing"
  | "Shipped"
  | "Delivered"
  | "Cancelled";

interface OrderItem {
  id: string;
  name: string;
  date: string;
  status: OrderStatus;
  items: number;
  total: number;
  img: string;
  seller: string;
  location: string;
  escrow: boolean;
  trackingSteps: { label: string; done: boolean; date?: string }[];
}

// ── Order data ────────────────────────────────────────────────
const ORDERS: OrderItem[] = [
  {
    id: "111",
    name: "Minimalist Rack",
    date: "2024-07-14",
    status: "Pending",
    items: 1,
    total: 12000,
    img: "/modern-table.png",
    seller: "Tunde Furniture Co.",
    location: "Ikeja, Lagos",
    escrow: true,
    trackingSteps: [
      { label: "Order Placed", done: true, date: "Jul 14" },
      { label: "Seller Confirmed", done: true, date: "Jul 14" },
      { label: "Ready for Pickup", done: false },
      { label: "Out for Delivery", done: false },
      { label: "Delivered", done: false },
    ],
  },
  {
    id: "106",
    name: "Cozy Armchair",
    date: "2024-07-12",
    status: "Pending",
    items: 1,
    total: 28000,
    img: "/vintage-chair.png",
    seller: "Kemi's Home Store",
    location: "Lekki, Lagos",
    escrow: true,
    trackingSteps: [
      { label: "Order Placed", done: true, date: "Jul 12" },
      { label: "Seller Confirmed", done: true, date: "Jul 12" },
      { label: "Ready for Pickup", done: false },
      { label: "Out for Delivery", done: false },
      { label: "Delivered", done: false },
    ],
  },
  {
    id: "102",
    name: "Rustic Shelf",
    date: "2024-07-05",
    status: "Processing",
    items: 1,
    total: 32000,
    img: "/stylish-sofa.png",
    seller: "Ade Wood Works",
    location: "Surulere, Lagos",
    escrow: true,
    trackingSteps: [
      { label: "Order Placed", done: true, date: "Jul 5" },
      { label: "Seller Confirmed", done: true, date: "Jul 5" },
      { label: "Ready for Pickup", done: true, date: "Jul 7" },
      { label: "Out for Delivery", done: false },
      { label: "Delivered", done: false },
    ],
  },
  {
    id: "098",
    name: "Dining Table Set",
    date: "2024-06-28",
    status: "Delivered",
    items: 2,
    total: 85000,
    img: "/dining.jpg",
    seller: "Lagos Luxury Furniture",
    location: "VI, Lagos",
    escrow: false,
    trackingSteps: [
      { label: "Order Placed", done: true, date: "Jun 28" },
      { label: "Seller Confirmed", done: true, date: "Jun 28" },
      { label: "Ready for Pickup", done: true, date: "Jun 29" },
      { label: "Out for Delivery", done: true, date: "Jun 30" },
      { label: "Delivered", done: true, date: "Jul 1" },
    ],
  },
  {
    id: "089",
    name: "Bedroom Wardrobe",
    date: "2024-06-15",
    status: "Cancelled",
    items: 1,
    total: 45000,
    img: "/bedroom.jpg",
    seller: "ChiChi Interiors",
    location: "Yaba, Lagos",
    escrow: false,
    trackingSteps: [
      { label: "Order Placed", done: true, date: "Jun 15" },
      { label: "Seller Confirmed", done: false },
      { label: "Ready for Pickup", done: false },
      { label: "Out for Delivery", done: false },
      { label: "Delivered", done: false },
    ],
  },
];

// ── Status config ─────────────────────────────────────────────
const STATUS_CFG: Record<
  OrderStatus,
  { pill: string; icon: () => React.ReactElement; label: string; color: string }
> = {
  Pending: {
    pill: "bg-amber-50  text-amber-700  border border-amber-200",
    icon: IcClock,
    label: "Pending",
    color: "#D97706",
  },
  Processing: {
    pill: "bg-blue-50   text-blue-700   border border-blue-200",
    icon: IcPackage,
    label: "Processing",
    color: "#2563EB",
  },
  Shipped: {
    pill: "bg-indigo-50 text-indigo-700 border border-indigo-200",
    icon: IcTruck,
    label: "Shipped",
    color: "#4F46E5",
  },
  Delivered: {
    pill: "bg-green-50  text-green-700  border border-green-200",
    icon: IcCheck,
    label: "Delivered",
    color: "#16A34A",
  },
  Cancelled: {
    pill: "bg-red-50    text-red-700    border border-red-200",
    icon: IcX,
    label: "Cancelled",
    color: "#DC2626",
  },
};

const FILTER_TABS: { label: string; value: OrderStatus | "All" }[] = [
  { label: "All", value: "All" },
  { label: "Pending", value: "Pending" },
  { label: "Processing", value: "Processing" },
  { label: "Shipped", value: "Shipped" },
  { label: "Delivered", value: "Delivered" },
  { label: "Cancelled", value: "Cancelled" },
];

// ── Mobile bottom tabs ────────────────────────────────────────
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

const MOB_TABS = [
  { label: "Home", icon: IcGrid, href: "/dashboard" },
  { label: "Orders", icon: IcPackageMob, href: "/dashboard/orders" },
  { label: "Sell", icon: IcPlusMob, href: "/create-listing", special: true },
  { label: "Saved", icon: IcHeartMob, href: "/dashboard/saved" },
  { label: "Profile", icon: IcUserMob, href: "/dashboard/profile" },
];

// ── Order Detail Modal ────────────────────────────────────────
function OrderModal({
  order,
  onClose,
}: {
  order: OrderItem;
  onClose: () => void;
}) {
  const cfg = STATUS_CFG[order.status];
  const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");
  const doneSteps = order.trackingSteps.filter((s) => s.done).length;
  const progress = Math.round((doneSteps / order.trackingSteps.length) * 100);

  return (
    <div
      className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full sm:max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col z-10">
        {/* drag handle (mobile) */}
        <div className="sm:hidden flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 rounded-full bg-[#E5D5C0]" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#F4EBE0]">
          <div>
            <p className="text-[10px] text-[#B8A898] uppercase tracking-widest font-semibold">
              Order #{order.id}
            </p>
            <h2 className="font-serif text-lg font-semibold text-[#2C1F0E] mt-0.5">
              {order.name}
            </h2>
          </div>
          <div className="flex items-center gap-3">
            <span
              className={`text-[10.5px] font-semibold px-2.5 py-1 rounded-full ${cfg.pill}`}
            >
              {order.status}
            </span>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-[#F4EBE0] flex items-center justify-center text-[#755210] hover:bg-[#E8CEB0] transition-colors"
            >
              <IcClose />
            </button>
          </div>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto flex-1">
          {/* Product image + info */}
          <div className="flex items-center gap-4 px-5 py-4 bg-[#FDFAF6]">
            <div className="w-16 h-16 rounded-2xl overflow-hidden bg-[#F4E8D8] flex-shrink-0">
              <Image
                src={order.img}
                alt={order.name}
                width={64}
                height={64}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-[#2C1F0E]">
                {order.name}
              </p>
              <p className="text-xs text-[#8C7A6B] mt-0.5 flex items-center gap-1">
                <IcMap /> {order.seller} · {order.location}
              </p>
              <p className="font-serif text-base font-semibold text-[#755210] mt-1">
                {fmt(order.total)}
              </p>
            </div>
          </div>

          {/* Tracking timeline */}
          <div className="px-5 py-4 border-b border-[#F4EBE0]">
            <p className="text-xs font-bold text-[#2C1F0E] uppercase tracking-wide mb-1">
              Tracking
            </p>

            {/* Progress bar */}
            <div className="flex items-center gap-2 mb-4">
              <div className="flex-1 h-1.5 bg-[#F4E8D8] rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#33B64B] rounded-full transition-all duration-700"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span className="text-[10px] font-bold text-[#5F7161]">
                {progress}%
              </span>
            </div>

            <div className="flex flex-col gap-0">
              {order.trackingSteps.map((s, i) => {
                const isLast = i === order.trackingSteps.length - 1;
                const isActive =
                  s.done && (isLast || !order.trackingSteps[i + 1]?.done);
                return (
                  <div key={i} className="flex gap-3 items-start">
                    {/* Line + dot column */}
                    <div className="flex flex-col items-center w-6 flex-shrink-0">
                      <div
                        className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 z-10 transition-all ${
                          s.done
                            ? isActive
                              ? "bg-[#5F7161] text-white ring-4 ring-[#5F7161]/20"
                              : "bg-[#33B64B] text-white"
                            : "bg-[#F4E8D8] text-[#C4B09A] border border-[#E5D5C0]"
                        }`}
                      >
                        {s.done ? (
                          <IcCheck />
                        ) : (
                          <span className="text-[9px] font-bold">{i + 1}</span>
                        )}
                      </div>
                      {!isLast && (
                        <div
                          className={`w-px flex-1 min-h-[24px] my-0.5 ${
                            s.done ? "bg-[#33B64B]/40" : "bg-[#E5D5C0]"
                          }`}
                        />
                      )}
                    </div>
                    {/* Label */}
                    <div className="pb-4 pt-0.5 flex-1">
                      <p
                        className={`text-sm font-medium ${
                          s.done ? "text-[#2C1F0E]" : "text-[#B8A898]"
                        }`}
                      >
                        {s.label}
                      </p>
                      {s.date && (
                        <p className="text-[10.5px] text-[#8C7A6B] mt-0.5">
                          {s.date}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Order details grid */}
          <div className="px-5 py-4 border-b border-[#F4EBE0]">
            <p className="text-xs font-bold text-[#2C1F0E] uppercase tracking-wide mb-3">
              Order Details
            </p>
            <div className="grid grid-cols-2 gap-y-3 gap-x-4">
              {[
                { k: "Order ID", v: `#${order.id}` },
                { k: "Date", v: order.date },
                { k: "Items", v: `${order.items}` },
                { k: "Total", v: fmt(order.total) },
                { k: "Seller", v: order.seller },
                { k: "Location", v: order.location },
              ].map(({ k, v }) => (
                <div key={k}>
                  <p className="text-[10px] text-[#B8A898] uppercase tracking-wide font-semibold">
                    {k}
                  </p>
                  <p className="text-sm text-[#2C1F0E] font-medium mt-0.5">
                    {v}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Escrow notice */}
          {order.escrow && (
            <div className="mx-5 my-4 flex items-start gap-3 bg-[#EDF7EF] border border-[#C3E6CB] rounded-xl px-4 py-3">
              <span className="text-[#2D6A4F] mt-0.5 flex-shrink-0">
                <IcShield />
              </span>
              <div>
                <p className="text-xs font-bold text-[#2D6A4F]">
                  Escrow Protected
                </p>
                <p className="text-[11px] text-[#3D8A5E] mt-0.5 leading-relaxed">
                  Your ₦{order.total.toLocaleString("en-NG")} is held securely.
                  It's only released to the seller after you confirm delivery.
                </p>
              </div>
            </div>
          )}

          {/* Leave review (delivered only) */}
          {order.status === "Delivered" && (
            <div className="mx-5 mb-4 bg-[#FFFBF0] border border-amber-200 rounded-xl px-4 py-3">
              <p className="text-xs font-bold text-amber-800 mb-2 flex items-center gap-1.5">
                <IcStar /> Rate your experience
              </p>
              <div className="flex items-center gap-1 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <button
                    key={s}
                    className="text-amber-400 hover:text-amber-500 transition-colors"
                  >
                    <IcStar />
                  </button>
                ))}
              </div>
              <textarea
                placeholder="Share how it went with this seller..."
                rows={2}
                className="w-full text-xs px-3 py-2 bg-white border border-amber-200 rounded-lg text-[#2C1F0E] placeholder-[#C4B09A] outline-none focus:border-amber-400 resize-none"
              />
              <button className="mt-2 text-xs font-bold text-amber-800 bg-amber-100 hover:bg-amber-200 px-4 py-1.5 rounded-lg transition-colors">
                Submit Review
              </button>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-5 py-4 border-t border-[#F4EBE0] bg-white flex items-center gap-2.5">
          {order.status !== "Cancelled" && order.status !== "Delivered" && (
            <button className="flex items-center gap-1.5 flex-1 justify-center py-2.5 border-[1.5px] border-[#5F7161] text-[#5F7161] hover:bg-[#5F7161]/5 text-xs font-bold rounded-xl transition-all">
              <IcWhatsApp /> Message Seller
            </button>
          )}
          {order.status === "Delivered" && (
            <button className="flex items-center gap-1.5 flex-1 justify-center py-2.5 bg-[#5F7161] hover:bg-[#4A5A4C] text-white text-xs font-bold rounded-xl transition-all">
              <IcCheck /> Confirmed Delivered
            </button>
          )}
          {order.status === "Pending" && (
            <button className="flex items-center gap-1.5 flex-1 justify-center py-2.5 bg-[#755210] hover:bg-[#9A7235] text-white text-xs font-bold rounded-xl transition-all">
              <IcShield /> Release Payment
            </button>
          )}
          {order.status === "Cancelled" && (
            <Link
              href="/shop"
              className="flex items-center gap-1.5 flex-1 justify-center py-2.5 bg-[#755210] hover:bg-[#9A7235] text-white text-xs font-bold rounded-xl transition-all"
            >
              <IcShop /> Shop Again
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────
export default function OrdersPage() {
  const pathname = usePathname();
  const [filter, setFilter] = useState<OrderStatus | "All">("All");
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState<OrderItem | null>(null);

  const fmt = (n: number) => "₦" + n.toLocaleString("en-NG");

  const filtered = ORDERS.filter((o) => {
    const matchStatus = filter === "All" || o.status === filter;
    const matchSearch =
      o.name.toLowerCase().includes(search.toLowerCase()) ||
      o.id.includes(search) ||
      o.seller.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  const counts = FILTER_TABS.map((tab) => ({
    ...tab,
    count:
      tab.value === "All"
        ? ORDERS.length
        : ORDERS.filter((o) => o.status === tab.value).length,
  }));

  // Summary stats
  const totalSpent = ORDERS.filter((o) => o.status === "Delivered").reduce(
    (a, o) => a + o.total,
    0
  );
  const pendingCount = ORDERS.filter(
    (o) => o.status === "Pending" || o.status === "Processing"
  ).length;

  return (
    <div className="min-h-screen flex bg-[#FDF8F3] pt-26 pb-20 lg:pb-0 lg:pl-60 font-sans">
      <Sidebar />

      <main className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto px-4 py-6 sm:px-6 lg:px-8 lg:pt-10 lg:pb-8">
          {/* ── HEADER ── */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Link
                href="/dashboard"
                className="w-9 h-9 rounded-xl bg-white border border-[#EDE0CF] flex items-center justify-center text-[#755210] hover:bg-[#F4E8D8] transition-colors"
              >
                <IcArrowLeft />
              </Link>
              <div>
                <p className="text-[10px] text-[#B8A898] uppercase tracking-widest font-semibold">
                  Dashboard
                </p>
                <h1 className="font-serif text-xl sm:text-2xl font-semibold text-[#2C1F0E]">
                  My Orders
                </h1>
              </div>
            </div>
            <Link
              href="/shop"
              className="hidden sm:flex items-center gap-1.5 px-4 py-2 bg-[#755210] hover:bg-[#9A7235] text-white text-xs font-bold rounded-xl transition-all shadow-sm"
            >
              <IcShop /> Continue Shopping
            </Link>
          </div>

          {/* ── SUMMARY CARDS ── */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-6">
            {[
              {
                label: "Total Orders",
                value: ORDERS.length.toString(),
                bg: "bg-[#F4E8D8]",
                tc: "text-[#755210]",
                icon: IcPackage,
              },
              {
                label: "Active Orders",
                value: pendingCount.toString(),
                bg: "bg-[#EEF2FF]",
                tc: "text-[#6366F1]",
                icon: IcClock,
              },
              {
                label: "Delivered",
                value: ORDERS.filter(
                  (o) => o.status === "Delivered"
                ).length.toString(),
                bg: "bg-[#EDF7EF]",
                tc: "text-[#2D6A4F]",
                icon: IcCheck,
              },
              {
                label: "Total Spent",
                value: fmt(totalSpent),
                bg: "bg-[#FFFBF0]",
                tc: "text-amber-700",
                icon: IcStar,
              },
            ].map(({ label, value, bg, tc, icon: Icon }) => (
              <div
                key={label}
                className="bg-white border border-[#EDE0CF] rounded-2xl p-3.5 sm:p-4 flex items-center gap-3 hover:shadow-sm transition-shadow"
              >
                <div
                  className={`w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0 ${bg} ${tc}`}
                >
                  <Icon />
                </div>
                <div className="min-w-0">
                  <p className="font-serif text-base sm:text-lg font-semibold text-[#2C1F0E] leading-none truncate">
                    {value}
                  </p>
                  <p className="text-[10px] text-[#8C7A6B] font-medium mt-0.5 leading-snug">
                    {label}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* ── FILTER + SEARCH ── */}
          <div className="bg-white border border-[#EDE0CF] rounded-2xl overflow-hidden mb-4">
            {/* Search bar */}
            <div className="px-4 pt-4 pb-3 border-b border-[#F4EBE0]">
              <div className="relative">
                <span className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#B8A898] pointer-events-none">
                  <IcSearch />
                </span>
                <input
                  type="text"
                  placeholder="Search by name, order ID or seller..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-[#FDFAF6] border border-[#EDE0CF] rounded-xl text-sm text-[#2C1F0E] placeholder-[#C4B09A] outline-none focus:border-[#755210] focus:ring-2 focus:ring-[#755210]/10 transition-all"
                />
              </div>
            </div>

            {/* Filter tabs — horizontal scroll */}
            <div className="flex gap-1.5 px-4 py-3 overflow-x-auto no-scrollbar">
              {counts.map(({ label, value, count }) => (
                <button
                  key={value}
                  onClick={() => setFilter(value)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap flex-shrink-0 transition-all ${
                    filter === value
                      ? "bg-[#755210] text-white shadow-sm"
                      : "bg-[#F4EBE0] text-[#8C7A6B] hover:bg-[#E8CEB0] hover:text-[#755210]"
                  }`}
                >
                  {label}
                  {count > 0 && (
                    <span
                      className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                        filter === value
                          ? "bg-white/25 text-white"
                          : "bg-white text-[#755210]"
                      }`}
                    >
                      {count}
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* ── ORDER LIST ── */}
          {filtered.length === 0 ? (
            <div className="bg-white border border-[#EDE0CF] rounded-2xl px-6 py-16 text-center">
              <div className="w-14 h-14 rounded-2xl bg-[#F4E8D8] flex items-center justify-center text-[#755210] mx-auto mb-4">
                <IcPackage />
              </div>
              <p className="font-serif text-lg text-[#2C1F0E] mb-1">
                No orders found
              </p>
              <p className="text-sm text-[#8C7A6B] mb-5">
                {search
                  ? `No results for "${search}"`
                  : `You have no ${filter.toLowerCase()} orders yet.`}
              </p>
              <Link
                href="/shop"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#755210] text-white text-sm font-bold rounded-xl hover:bg-[#9A7235] transition-all"
              >
                <IcShop /> Browse the Shop
              </Link>
            </div>
          ) : (
            <div className="flex flex-col gap-3">
              {filtered.map((order) => {
                const cfg = STATUS_CFG[order.status];
                const doneSteps = order.trackingSteps.filter(
                  (s) => s.done
                ).length;
                const progress = Math.round(
                  (doneSteps / order.trackingSteps.length) * 100
                );
                return (
                  <div
                    key={order.id}
                    className="bg-white border border-[#EDE0CF] rounded-2xl overflow-hidden hover:shadow-md hover:border-[#E8CEB0] transition-all group"
                  >
                    <div className="flex items-center gap-4 p-4 sm:p-5">
                      {/* Thumbnail */}
                      <div className="relative w-16 h-16 sm:w-20 sm:h-20 rounded-2xl overflow-hidden bg-[#F4E8D8] flex-shrink-0">
                        <Image
                          src={order.img}
                          alt={order.name}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                      </div>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2 mb-1">
                          <p className="text-sm sm:text-base font-semibold text-[#2C1F0E] truncate">
                            {order.name}
                          </p>
                          <span
                            className={`text-[10px] font-semibold px-2.5 py-1 rounded-full flex-shrink-0 ${cfg.pill}`}
                          >
                            {order.status}
                          </span>
                        </div>

                        <div className="flex items-center flex-wrap gap-x-3 gap-y-0.5 mb-2">
                          <p className="text-[11px] text-[#8C7A6B]">
                            <span className="font-semibold text-[#6B5A4E]">
                              #{order.id}
                            </span>
                          </p>
                          <span className="text-[#D5C4B0] text-xs">·</span>
                          <p className="text-[11px] text-[#8C7A6B]">
                            {order.date}
                          </p>
                          <span className="text-[#D5C4B0] text-xs">·</span>
                          <p className="text-[11px] text-[#8C7A6B]">
                            {order.items} item{order.items > 1 ? "s" : ""}
                          </p>
                        </div>

                        {/* Progress bar */}
                        {order.status !== "Cancelled" && (
                          <div className="flex items-center gap-2 mb-2">
                            <div className="flex-1 h-1 bg-[#F4E8D8] rounded-full overflow-hidden">
                              <div
                                className="h-full rounded-full transition-all duration-700"
                                style={{
                                  width: `${progress}%`,
                                  background:
                                    order.status === "Delivered"
                                      ? "#33B64B"
                                      : order.status === "Processing"
                                      ? "#2563EB"
                                      : "#755210",
                                }}
                              />
                            </div>
                            <span className="text-[9.5px] font-bold text-[#8C7A6B] flex-shrink-0">
                              {progress}%
                            </span>
                          </div>
                        )}

                        <div className="flex items-center justify-between flex-wrap gap-2">
                          <div className="flex items-center gap-2">
                            <p className="font-serif text-base font-semibold text-[#755210]">
                              {fmt(order.total)}
                            </p>
                            {order.escrow && (
                              <span className="flex items-center gap-1 text-[9.5px] font-semibold text-[#2D6A4F] bg-[#EDF7EF] border border-[#C3E6CB] px-2 py-0.5 rounded-full">
                                <IcShield /> Escrow
                              </span>
                            )}
                          </div>
                          <button
                            onClick={() => setSelected(order)}
                            className="flex items-center gap-1.5 text-xs font-bold text-[#755210] bg-[#F4E8D8] hover:bg-[#E8CEB0] px-3.5 py-1.5 rounded-xl transition-all"
                          >
                            View Details <IcArrow />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Bottom accent strip by status */}
                    <div
                      className="h-0.5"
                      style={{ background: cfg.color, opacity: 0.3 }}
                    />
                  </div>
                );
              })}
            </div>
          )}

          {/* ── FOOTER ── */}
          {filtered.length > 0 && (
            <div className="mt-5 flex items-center justify-between text-xs text-[#B8A898]">
              <p>
                Showing {filtered.length} of {ORDERS.length} orders
              </p>
              <Link
                href="/shop"
                className="flex items-center gap-1 text-[#755210] font-semibold hover:text-[#9A7235] transition-colors"
              >
                Continue Shopping <IcArrow />
              </Link>
            </div>
          )}
        </div>
      </main>

      {/* ── MOBILE BOTTOM TABS ── */}
      <nav
        className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-[#EDE0CF] flex items-stretch"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        {MOB_TABS.map(({ label, icon: Icon, href, special }) => {
          const active = pathname === href;
          if (special)
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
          return (
            <Link
              key={label}
              href={href}
              className={`flex-1 flex flex-col items-center justify-center py-3 gap-1 transition-colors ${
                active ? "text-[#755210]" : "text-[#B8A898]"
              }`}
            >
              <Icon />
              <span className="text-[9px] font-semibold">{label}</span>
              {active && <div className="w-1 h-1 rounded-full bg-[#755210]" />}
            </Link>
          );
        })}
      </nav>

      {/* ── ORDER DETAIL MODAL ── */}
      {selected && (
        <OrderModal order={selected} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}
