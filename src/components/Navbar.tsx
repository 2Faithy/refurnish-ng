"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaShoppingCart,
  FaUserCircle,
  FaBars,
  FaTimes,
} from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
    setMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Login", href: "/login#login" },
    { name: "Signup", href: "/login#signup" },
  ];

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="ReFurnish NG Logo"
            className="h-12 w-auto object-contain hover:scale-105 transition-transform"
          />
        </Link>

        {/* Right Side */}
        <div className="flex items-center space-x-4">
          {/* Desktop Start Selling */}
          <Link
            href="/dashboard/sell"
            className="hidden md:inline-block bg-[#775522] text-white px-4 py-2 rounded-full hover:bg-[#5E441B] transition"
          >
            Start Selling
          </Link>

          {/* Cart */}
<Link href="/cart" className="relative text-2xl text-[#775522] hover:scale-110 transition">
  <FaShoppingCart />
  <span className="absolute -top-2 -right-2 bg-[#775522] text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold animate-bounce-once">
    0
  </span>
</Link>

          {/* Profile Dropdown - desktop only */}
          <div className="relative hidden md:block">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="text-3xl text-[#5F7161] focus:outline-none hover:scale-110 transition"
            >
              <FaUserCircle />
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-xl z-50">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-4 py-3 ${
                      pathname === link.href
                        ? "text-[#775522] font-semibold bg-[#F7F1E5]"
                        : "text-gray-700 hover:bg-[#F7F1E5]"
                    }`}
                    onClick={() => setMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
                <button
                  onClick={() => setMenuOpen(false)}
                  className="w-full text-left px-4 py-3 text-[#775522] hover:bg-red-50"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Mobile Menu Icon */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-3xl text-[#775522] hover:scale-110 transition"
            >
              {mobileMenuOpen ? <FaTimes className="text-white" /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 z-[9999] transition-all duration-300 ease-in-out ${
          mobileMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        } bg-white/30 backdrop-blur-md`}
        style={{
          transform: mobileMenuOpen ? "translateY(0%)" : "translateY(-100%)",
        }}
      >
        <div className="flex justify-end p-4">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-black text-4xl focus:outline-none"
            aria-label="Close Mobile Menu"
          >
            <FaTimes />
          </button>
        </div>
        <nav className="flex flex-col items-center justify-center h-full space-y-6">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-2xl font-bold ${
                pathname === link.href ? "text-[#775522]" : "text-grey-300"
              } hover:text-[#FFD580] transition`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/dashboard/sell"
            className="bg-[#775522] text-white text-xl px-6 py-3 rounded-full hover:bg-[#5E441B] transition"
            onClick={() => setMobileMenuOpen(false)}
          >
            Start Selling
          </Link>
        </nav>
      </div>
    </header>
  );
}
