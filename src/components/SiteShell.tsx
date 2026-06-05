"use client";

import { usePathname } from "next/navigation";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// Routes that should NOT show the main Navbar/Footer
const BARE_ROUTES = [
  "/dashboard",
  "/login",
  "/email-verification",
];

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isBare = BARE_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(`${route}/`)
  );

  // Bare layout — dashboard manages its own sidebar
  if (isBare) {
    return <>{children}</>;
  }

  // Normal site layout with Navbar + Footer
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