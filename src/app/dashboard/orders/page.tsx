"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function OrdersPage() {
  return (
    <DashboardLayout totalUnreadMessages={0}>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="border-b border-[#EDE0CF] pb-5 mb-6">
          <h1 className="text-2xl font-bold text-[#2C1F0E] tracking-tight">
            Your Orders
          </h1>
          <p className="text-sm text-[#5F7161] mt-1">
            Manage your purchases, tracking details, and order history.
          </p>
        </div>

        {/* Empty State Card */}
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-[#EDE0CF] bg-white p-12 text-center shadow-sm">
          <div className="rounded-full bg-[#FAF4EC] p-4 text-[#755210] mb-4">
            <svg
              className="h-8 w-8"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007z"
              />
            </svg>
          </div>
          <h3 className="text-md font-semibold text-[#2C1F0E]">No orders found</h3>
          <p className="text-sm text-[#8C7A6B] mt-1 max-w-sm">
            Looks like you haven't bought anything yet. Once you place an order, it will show up right here!
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}