"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FaShoppingCart,
  FaUserCircle,
  FaBars,
  FaTimes,
  FaHeart,
  FaSearch,
} from "react-icons/fa";

export default function Navbar() {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setMenuOpen(false); // Close desktop dropdown on path change
    if (!mobileMenuOpen) { // Only reset if not already opening/open
        setMobileMenuOpen(false); // Close mobile menu on path change
    }

    // When mobile menu opens, prevent scrolling on body
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    // Cleanup function to re-enable scroll if component unmounts while menu is open
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [pathname, mobileMenuOpen]);

  const navLinks = [
    { name: "Shop", href: "/shop" },
    { name: "Dashboard", href: "/dashboard" },
    { name: "Login", href: "/login#login" },
    { name: "Signup", href: "/login#signup" },
  ];

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setMobileMenuOpen(false); // Close mobile menu after search
    }
    console.log("Searching for:", searchQuery);
  };

  return (
    <header className="w-full bg-[#FFEBCD] shadow-md fixed top-0 left-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4">
        {/* Logo */}
        <Link href="/" className="flex-shrink-0">
          <img
            src="/logo.png"
            alt="ReFurnish NG Logo"
            className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-200"
          />
        </Link>

        {/* Search Bar (Desktop - Longer, Modern) */}
        <div className="hidden md:flex flex-grow-[2] max-w-2xl mx-auto">
          <form onSubmit={handleSearchSubmit} className="w-full flex border border-gray-200 rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#775522] transition-all duration-200">
            <input
              type="text"
              placeholder="Search for furniture, decor, and more..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="flex-grow py-2 px-4 text-gray-700 placeholder-gray-400 text-sm focus:outline-none bg-white"
              aria-label="Search for products"
            />
            <button
              type="submit"
              className="bg-[#775522] text-white px-4 hover:bg-[#5E441B] transition-colors flex items-center justify-center text-lg"
              aria-label="Submit search"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        {/* Right Side Icons & Mobile Menu Toggle */}
        <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0">
          {/* Desktop Start Selling Button */}
          <Link
            href="/dashboard/sell"
            className="hidden md:inline-block bg-[#775522] text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-[#5E441B] transition-colors duration-200"
          >
            Start Selling
          </Link>

          {/* Wishlist Icon */}
          <Link href="/wishlist" className="text-2xl text-gray-600 hover:text-[#775522] hover:scale-110 transition-transform duration-200">
            <FaHeart />
          </Link>

          {/* User Profile Icon */}
          <div className="relative">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="hidden md:block text-2xl text-gray-600 hover:text-[#775522] focus:outline-none hover:scale-110 transition-transform duration-200"
              aria-label="User Profile Menu"
            >
              <FaUserCircle />
            </button>
            <Link href="/login" className="md:hidden text-2xl text-gray-600 hover:text-[#775522] hover:scale-110 transition-transform duration-200" aria-label="Go to login or profile">
                <FaUserCircle />
            </Link>

            {/* Desktop Profile Dropdown Menu */}
            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in-scale">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-4 py-3 text-sm transition-colors duration-200 ${
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
                  onClick={() => {setMenuOpen(false); /* Add logout logic here */}}
                  className="w-full text-left px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition-colors duration-200"
                >
                  Logout
                </button>
              </div>
            )}
          </div>

          {/* Cart Icon */}
          <Link href="/cart" className="relative text-2xl text-gray-600 hover:text-[#775522] hover:scale-110 transition-transform duration-200">
            <FaShoppingCart />
          </Link>

          {/* Mobile Menu Toggle Icon (Hamburger/Close) */}
          <div className="md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-3xl text-[#775522] hover:scale-110 transition-transform duration-200"
              aria-label="Toggle mobile menu"
            >
              {mobileMenuOpen ? <FaTimes /> : <FaBars />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed top-0 left-0 w-full h-full z-[1000] flex flex-col pt-16
          transition-all duration-300 ease-in-out
          ${mobileMenuOpen ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-full opacity-0 pointer-events-none"}
          bg-white/80 backdrop-blur-md dark:bg-gray-900/80`}
      >
        <div className="flex justify-end p-4 absolute top-0 right-0">
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="text-black text-4xl focus:outline-none dark:text-white"
            aria-label="Close Mobile Menu"
          >
            <FaTimes />
          </button>
        </div>

        {/* Search Bar in Mobile Menu */}
        <div className="px-6 py-4">
          <form onSubmit={handleSearchSubmit} className="w-full flex border border-gray-300 rounded-full overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-[#775522]">
            <input
              type="text"
              placeholder="Search for items..."
              value={searchQuery}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setSearchQuery(e.target.value)}
              className="flex-grow p-3 text-gray-700 placeholder-gray-400 text-base focus:outline-none bg-gray-50 dark:bg-gray-800 dark:text-gray-200 dark:placeholder-gray-500"
              aria-label="Search for products"
            />
            <button
              type="submit"
              className="bg-[#775522] text-white px-4 hover:bg-[#5E441B] transition-colors flex items-center justify-center text-xl"
              aria-label="Submit search"
            >
              <FaSearch />
            </button>
          </form>
        </div>

        <nav className="flex flex-col items-center justify-center flex-grow space-y-6 pb-20">
          {navLinks.map((link) => (
            <Link
              key={link.name}
              href={link.href}
              className={`text-2xl font-bold ${
                pathname === link.href ? "text-[#775522]" : "text-gray-700 dark:text-gray-300"
              } hover:text-[#FFD580] transition-colors duration-200`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </Link>
          ))}
          <Link
            href="/dashboard/sell"
            className="bg-[#775522] text-white text-xl px-6 py-3 rounded-full hover:bg-[#5E441B] transition-colors duration-200 mt-4"
            onClick={() => setMobileMenuOpen(false)}
          >
            Start Selling
          </Link>
        </nav>
      </div>
    </header>
  );
}