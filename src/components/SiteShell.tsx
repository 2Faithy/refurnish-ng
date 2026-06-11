"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const BARE_ROUTES = ["/dashboard", "/login", "/admin"];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isBare = BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  if (isBare) {
    return <>{children}</>;
  }

  return (
    <div className="flex min-h-screen w-full">
      <Navbar />
      <div className="flex flex-col w-full">
        <main className="flex-grow overflow-y-auto">{children}</main>
        <Footer />
      </div>
    </div>
  );
}
