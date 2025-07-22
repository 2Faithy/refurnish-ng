// File: src/components/DashboardLayout.tsx
'use client'; // Ensure this is at the very top

import { useState } from 'react'; // <--- Make sure useState is imported!
import Sidebar from './Sidebar';

// Define the props interface for DashboardLayout
interface DashboardLayoutProps {
  children: React.ReactNode;
  totalUnreadMessages: number; // Prop to pass to Sidebar
}

// Update the function signature to accept totalUnreadMessages
export default function DashboardLayout({ children, totalUnreadMessages }: DashboardLayoutProps) {
  // Define the isOpen state and its setter here
  const [isOpen, setIsOpen] = useState(false); // <--- This line is crucial!

  return (
    <div className="flex min-h-screen">
      {/* Pass totalUnreadMessages, isOpen, and setIsOpen to Sidebar */}
      <Sidebar
        totalUnreadMessages={totalUnreadMessages}
        isOpen={isOpen}      // <--- Pass isOpen state
        setIsOpen={setIsOpen} // <--- Pass setIsOpen setter
      />
      <main className="flex-1 p-6 bg-[#F9F9F9]">{children}</main>
    </div>
  );
}