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
} from "lucide-react";

type SidebarProps = {
  children?: React.ReactNode;
};

type UserData = {
  name?: string;
  email?: string;
  profileImage?: string;
};

// Clean, minimal navigation links (no badges, no clutter)
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
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
  { label: "Help", href: "/support", icon: HelpCircle },
];

export default function Sidebar({ children }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<UserData | null>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("refurnish_user");
      if (stored) setUser(JSON.parse(stored));
    } catch {}
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

  const handleLogout = () => {
    localStorage.removeItem("refurnish_user");
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
          onLogout={handleLogout}
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
                  aria-label="Close menu"
                >
                  <X className="size-4 text-[#211000]/60" />
                </button>
              </div>
              <SidebarContent
                pathname={pathname}
                user={user}
                initials={initials}
                onLogout={handleLogout}
              />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <main className="lg:pl-[272px] pt-16 lg:pt-0 min-h-screen">
        {children}
      </main>
    </div>
  );
}

function SidebarContent({
  pathname,
  user,
  initials,
  onLogout,
}: {
  pathname: string;
  user: UserData | null;
  initials: string;
  onLogout: () => void;
}) {
  return (
    <div className="flex flex-col h-full">
      {/* Logo */}
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

      {/* Minimal user card */}
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

      {/* Navigation */}
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

      {/* Minimal logout */}
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

function SidebarLink({
  link,
  pathname,
}: {
  link: { label: string; href: string; icon: React.ElementType };
  pathname: string;
}) {
  const Icon = link.icon;

  const active =
    link.href === "/dashboard"
      ? pathname === "/dashboard"
      : pathname === link.href || pathname.startsWith(`${link.href}/`);

  return (
    <Link
      href={link.href}
      className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
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
