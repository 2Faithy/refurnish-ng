// src/components/DashboardLayout.tsx
"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";

interface DashboardLayoutProps {
  children: React.ReactNode; // <-- Make sure this is here!
  totalUnreadMessages: number;
}

// Ensure the default export is DashboardLayout
export default function DashboardLayout({
  children,
  totalUnreadMessages,
}: DashboardLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex min-h-screen">
      <Sidebar
        totalUnreadMessages={totalUnreadMessages}
        isOpen={isOpen}
        setIsOpen={setIsOpen}
      />
      <main className="flex-1 p-6 bg-[#F9F9F9]">{children}</main>
    </div>
  );
}
