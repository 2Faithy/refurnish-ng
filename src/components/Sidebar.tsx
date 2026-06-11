"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  LayoutDashboard,
  Package,
  Sofa,
  MessageCircle,
  ShoppingBag,
  Heart,
  User,
  Settings,
  HelpCircle,
  LogOut,
  Menu,
  X,
  Store,
  Bell,
  PlusCircle,
  Wallet,
} from "lucide-react";

type SidebarProps = { children?: React.ReactNode };
type UserData = { name?: string; email?: string; profileImage?: string };

const primaryLinks = [
  { label: "Overview", href: "/dashboard", icon: LayoutDashboard },
  { label: "Orders", href: "/dashboard/orders", icon: Package },
  { label: "Listings", href: "/dashboard/listings", icon: Sofa },
  { label: "Messages", href: "/dashboard/messages", icon: MessageCircle },
];

const marketplaceLinks = [
  { label: "Shop", href: "/shop", icon: Store },
  { label: "Saved", href: "/saved", icon: Heart },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
  { label: "Sell", href: "/sell", icon: PlusCircle },
];

const accountLinks = [
  { label: "Profile", href: "/dashboard/profile", icon: User },
  { label: "Payments", href: "/dashboard/payments", icon: Wallet },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help", href: "/support", icon: HelpCircle },
];

export default function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [showSignOut, setShowSignOut] = useState(false);

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
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  const initials = useMemo(() => {
    const name = user?.name || "Guest";
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  }, [user]);

  const confirmLogout = async () => {
    try {
      await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include",
      });
      localStorage.removeItem("refurnish_user");
    } catch {}
    setShowSignOut(false);
    router.push("/login");
  };

  return (
    <div className="min-h-screen bg-[#FAF4EC] text-[#211000]">
      {/* Mobile top bar */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-[#FAF4EC]/95 backdrop-blur-sm border-b border-[#211000]/8 px-4 flex items-center justify-between">
        <Link href="/dashboard" className="flex items-center gap-2.5">
          <Image src="/logo.png" alt="Refurnish" width={30} height={30} />
          <span className="font-serif text-lg font-medium tracking-tight">
            Refurnish
          </span>
        </Link>
        <div className="flex items-center gap-2">
          <button className="relative size-10 rounded-full bg-white border border-[#211000]/8 grid place-items-center">
            <Bell className="size-4 text-[#211000]/60" />
            <span className="absolute top-2.5 right-2.5 size-1.5 rounded-full bg-[#B66B44]" />
          </button>
          <button
            onClick={() => setMobileOpen(true)}
            className="size-10 rounded-full bg-white border border-[#211000]/8 grid place-items-center"
            aria-label="Open menu"
          >
            <Menu className="size-5 text-[#211000]/80" />
          </button>
        </div>
      </header>

      {/* Desktop sidebar */}
      <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-[272px] bg-[#FAF4EC] border-r border-[#211000]/6 flex-col">
        <SidebarContent
          pathname={pathname}
          user={user}
          initials={initials}
          onLogout={() => setShowSignOut(true)}
        />
      </aside>

      {/* Mobile drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileOpen(false)}
              className="fixed inset-0 z-[70] bg-[#211000]/40 backdrop-blur-sm lg:hidden"
            />
            <motion.aside
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed inset-y-0 left-0 z-[80] w-[85vw] max-w-[320px] bg-[#FAF4EC] border-r border-[#211000]/6 shadow-xl lg:hidden flex flex-col"
            >
              <div className="absolute top-4 right-4">
                <button
                  onClick={() => setMobileOpen(false)}
                  className="size-8 rounded-full bg-white border border-[#211000]/8 grid place-items-center"
                >
                  <X className="size-4 text-[#211000]/60" />
                </button>
              </div>
              <SidebarContent
                pathname={pathname}
                user={user}
                initials={initials}
                onLogout={() => setShowSignOut(true)}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:pl-[272px] pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>

      {/* Sign out confirmation modal */}
      <AnimatePresence>
        {showSignOut && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center px-4 bg-[#211000]/40 backdrop-blur-sm"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", stiffness: 280, damping: 28 }}
              className="w-full max-w-sm rounded-3xl bg-[#FAF4EC] border border-[#211000]/10 shadow-2xl p-7 text-center"
            >
              <div className="w-14 h-14 rounded-full bg-[#E8CEB0]/40 flex items-center justify-center mx-auto mb-4">
                <LogOut className="size-6 text-[#B66B44]" />
              </div>
              <h3 className="font-serif text-2xl font-medium tracking-tight mb-2">
                Sign out?
              </h3>
              <p className="text-sm text-[#211000]/60 font-medium mb-7">
                Are you sure you want to sign out of your Refurnish account?
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowSignOut(false)}
                  className="rounded-full border border-[#211000]/10 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#E8CEB0]/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmLogout}
                  className="rounded-full bg-[#211000] hover:bg-[#211000]/90 text-[#FAF4EC] py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Sign out
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SidebarContent({ pathname, user, initials, onLogout }: any) {
  return (
    <div className="flex flex-col h-full">
      <div className="h-20 px-6 flex items-center">
        <Link href="/dashboard" className="flex items-center gap-3">
          <Image src="/logo.png" alt="Refurnish" width={32} height={32} />
          <div>
            <p className="font-serif text-lg font-medium tracking-tight leading-none">
              Refurnish
            </p>
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44] mt-1">
              Dashboard
            </p>
          </div>
        </Link>
      </div>

      <div className="px-4 mb-6">
        <div className="rounded-2xl bg-white/60 border border-[#211000]/6 p-3.5">
          <div className="flex items-center gap-3">
            {user?.profileImage ? (
              <img
                src={user.profileImage}
                alt="Profile"
                className="size-10 rounded-full object-cover"
              />
            ) : (
              <div className="size-10 rounded-full bg-[#E8CEB0] text-[#211000] flex items-center justify-center font-bold text-xs">
                {initials}
              </div>
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold truncate">
                {user?.name || "Guest User"}
              </p>
              <p className="text-[11px] text-[#211000]/45 truncate">
                {user?.email || "Welcome to Refurnish"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-3 space-y-6">
        <NavGroup title="Main">
          {primaryLinks.map((link) => (
            <SidebarLink key={link.href} link={link} pathname={pathname} />
          ))}
        </NavGroup>
        <NavGroup title="Marketplace">
          {marketplaceLinks.map((link) => (
            <SidebarLink key={link.href} link={link} pathname={pathname} />
          ))}
        </NavGroup>
        <NavGroup title="Account">
          {accountLinks.map((link) => (
            <SidebarLink key={link.href} link={link} pathname={pathname} />
          ))}
        </NavGroup>
      </nav>

      <div className="px-3 pb-6">
        <button
          onClick={onLogout}
          className="w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-[#211000]/60 hover:text-[#b91c1c] hover:bg-white transition-colors"
        >
          <LogOut className="size-4" />
          Sign out
        </button>
      </div>
    </div>
  );
}

function NavGroup({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div>
      <p className="px-3 mb-2 text-[10px] font-bold uppercase tracking-[0.2em] text-[#211000]/30">
        {title}
      </p>
      <div className="space-y-0.5">{children}</div>
    </div>
  );
}

function SidebarLink({ link, pathname }: { link: any; pathname: string }) {
  const Icon = link.icon;
  const active =
    link.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === link.href || pathname.startsWith(`${link.href}/`);
  return (
    <Link
      href={link.href}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all ${
        active
          ? "bg-[#211000] text-[#FAF4EC]"
          : "text-[#211000]/70 hover:bg-white hover:text-[#211000]"
      }`}
    >
      <span
        className={`size-8 rounded-lg flex items-center justify-center transition-colors ${
          active
            ? "bg-[#B66B44]/20 text-[#B66B44]"
            : "bg-transparent text-[#211000]/50 group-hover:text-[#211000]"
        }`}
      >
        <Icon className="size-4" />
      </span>
      <span>{link.label}</span>
    </Link>
  );
}
