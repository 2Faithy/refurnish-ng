// File: src/components/Sidebar.tsx
import React from "react";

// 1. Explicitly define what props Sidebar accepts
interface SidebarProps {
  totalUnreadMessages: number;
  isOpen: boolean;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

// 2. Add the props to the function argument
export default function Sidebar({
  totalUnreadMessages,
  isOpen,
  setIsOpen,
}: SidebarProps) {
  return (
    <aside
      className={`fixed inset-y-0 left-0 z-50 w-64 bg-white transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 md:relative md:translate-x-0`}
    >
      {/* Your sidebar UI code */}
      <div>Unread Messages: {totalUnreadMessages}</div>
      <button onClick={() => setIsOpen(false)}>Close Menu</button>
    </aside>
  );
}
