"use client";

import DashboardLayout from "@/components/DashboardLayout";

export default function DashboardOverviewPage() {
  return (
    <DashboardLayout totalUnreadMessages={0}>
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="border-b border-[#EDE0CF] pb-5 mb-6">
          <h1 className="text-2xl font-bold text-[#2C1F0E] tracking-tight">
            Welcome to Dashboard
          </h1>
          <p className="text-sm text-[#5F7161] mt-1">
            Here is an overview of your furniture marketplace activity.
          </p>
        </div>

        {/* Overview Stats Cards Grid */}
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-[#EDE0CF] shadow-sm">
            <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wide">
              Active Listings
            </p>
            <p className="text-3xl font-bold text-[#2C1F0E] mt-2">0</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#EDE0CF] shadow-sm">
            <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wide">
              Total Earnings
            </p>
            <p className="text-3xl font-bold text-[#2C1F0E] mt-2">$0.00</p>
          </div>
          <div className="bg-white p-6 rounded-2xl border border-[#EDE0CF] shadow-sm">
            <p className="text-xs font-semibold text-[#8C7A6B] uppercase tracking-wide">
              Messages
            </p>
            <p className="text-3xl font-bold text-[#2C1F0E] mt-2">0</p>
          </div>
        </div>

        {/* Quick Welcome Prompt */}
        <div className="rounded-2xl border border-dashed border-[#EDE0CF] bg-white p-8 text-center">
          <h3 className="text-md font-semibold text-[#2C1F0E]">
            Getting Started
          </h3>
          <p className="text-sm text-[#8C7A6B] mt-1 max-w-md mx-auto">
            Your marketplace dashboard is ready! Use the sidebar navigation to
            manage your listings, view buyer messages, or update your profile.
          </p>
        </div>
      </div>
    </DashboardLayout>
  );
}
