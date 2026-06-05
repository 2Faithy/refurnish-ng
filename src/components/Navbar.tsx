"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  FaBars,
  FaTimes,
  FaRegHeart,
  FaRegUser,
  FaSearch,
  FaSignOutAlt,
  FaChartBar,
  FaEnvelope,
  FaBookmark,
  FaClipboardList,
  FaCog,
  FaShoppingCart,
  FaChevronDown,
  FaPlusCircle,
} from "react-icons/fa";

// Global Brand Constants
const BRAND_COLOR = "text-[#A84420]";
const BRAND_TEXT_COLOR = "text-gray-800";
const BRAND_BUTTON_BG = "bg-[#A84420]";
const BRAND_BUTTON_HOVER = "hover:bg-[#8c3516]";

interface NavItem {
  name: string;
  href: string;
}

const BagIconSVG = ({ className }: { className?: string }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className={className}
    fill="none"
    viewBox="0 0 24 24"
    stroke="currentColor"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
    />
  </svg>
);

export default function Navbar() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNavItem, setActiveNavItem] = useState("Furniture");

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayedName, setDisplayedName] = useState("");

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const activeUser = localStorage.getItem("currentUser");
    if (activeUser) {
      try {
        const userObj = JSON.parse(activeUser);
        if (userObj && userObj.name) {
          setIsLoggedIn(true);
          const firstName = userObj.name.split(" ")[0];
          setDisplayedName(firstName);
        }
      } catch (error) {
        console.error("Failed to parse user session storage context:", error);
      }
    }
  }, []);

  useEffect(() => {
    if (mobileMenuOpen || (searchOverlayOpen && window.innerWidth >= 768)) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [mobileMenuOpen, searchOverlayOpen]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(target) &&
        !target.closest('[aria-label="User Menu"]')
      ) {
        setProfileDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearchSubmit = () => {
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery("");
    }
    setSearchOverlayOpen(false);
    setMobileMenuOpen(false);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearchSubmit();
  };

  const handleLogout = () => {
    localStorage.removeItem("currentUser");
    setIsLoggedIn(false);
    setDisplayedName("");
    setProfileDropdownOpen(false);
    router.refresh();
  };

  const closeMobileMenu = () => setMobileMenuOpen(false);

  const profileMenuItems = [
    { name: "Saved items", href: "/account/saved-items", icon: FaBookmark },
    { name: "Saved searches", href: "/account/saved-searches", icon: FaSearch },
    { name: "Messages", href: "/account/messages", icon: FaEnvelope },
    { name: "Listings", href: "/account/my-listings", icon: FaClipboardList },
    { name: "Purchases", href: "/account/purchases", icon: FaShoppingCart },
    { name: "Sales", href: "/account/sales", icon: FaChartBar },
    { name: "Account Settings", href: "/account/settings", icon: FaCog },
  ];

  const navItems: NavItem[] = [
    { name: "Furniture", href: "/shop" },
    { name: "Rooms", href: "/shop" },
    { name: "Style", href: "/style" },
    { name: "Lighting", href: "/shop" },
    { name: "Rugs", href: "/shop" },
    { name: "Art", href: "/shop" },
    { name: "Décor", href: "/shop" },
    { name: "New Arrivals", href: "/shop" },
    { name: "Sale", href: "/shop" },
  ];

  return (
    <>
      <header className="w-full bg-[#FAF6F0] fixed top-0 left-0 z-50 font-sans border-b border-gray-200/40 shadow-sm">
        {/* Main Upper Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-4">
          {/* Mobile Menu Icon */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 p-1 rounded-md focus:outline-none"
              aria-label="Toggle mobile menu"
            >
              <FaBars className="text-xl" />
            </button>
          </div>

          {/* Logo Brand Container */}
          <Link
            href="/"
            className="flex items-center flex-shrink-0 transition-transform active:scale-95"
          >
            <img
              src="/logo.png"
              alt="Refurnish Logo"
              className="h-9 w-auto object-contain"
            />
          </Link>

          {/* Pill Search Field */}
          <div className="hidden lg:flex flex-grow max-w-2xl mx-6">
            <div className="w-full relative">
              <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Search Refurnish"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="w-full bg-white/50 border border-gray-300 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-[#A84420]/20 focus:border-[#A84420] focus:bg-white text-gray-800 placeholder-gray-400 transition-all"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-5 text-gray-600 flex-shrink-0">
            {/* Start Selling Button */}
            <Link
              href="/sell"
              className={`hidden sm:inline-block ${BRAND_BUTTON_BG} ${BRAND_BUTTON_HOVER} text-white px-5 py-2.5 rounded-lg font-semibold text-sm transition-all duration-200 hover:shadow-lg active:scale-95 shadow-md`}
            >
              START SELLING
            </Link>

            {/* Mobile Search Icon */}
            <button
              onClick={() => {
                setSearchOverlayOpen(!searchOverlayOpen);
                setProfileDropdownOpen(false);
              }}
              className={`lg:hidden text-xl ${BRAND_TEXT_COLOR} hover:${BRAND_COLOR} p-2 rounded-md transition-colors duration-200`}
              aria-label="Toggle search bar"
            >
              <FaSearch />
            </button>

            {/* Wishlist Outlined Icon */}
            <Link
              href="/wishlist"
              className={`w-6 h-6 flex items-center justify-center ${BRAND_TEXT_COLOR} hover:${BRAND_COLOR} transition-all duration-200 hover:scale-105 active:scale-95`}
              aria-label="Wishlist"
            >
              <FaRegHeart className="w-[22px] h-[22px] stroke-[1.5]" />
            </Link>

            {/* Shopping Bag Icon */}
            <Link
              href="/cart"
              className={`w-6 h-6 flex items-center justify-center ${BRAND_TEXT_COLOR} hover:${BRAND_COLOR} transition-all duration-200 hover:scale-105 active:scale-95`}
              aria-label="Shopping Cart"
            >
              <BagIconSVG className="w-[22px] h-[22px] stroke-current" />
            </Link>

            {/* Managed Dynamic Authentication Block */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className={`flex items-center space-x-1 sm:space-x-2 font-semibold ${BRAND_TEXT_COLOR} hover:${BRAND_COLOR} transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none text-sm p-1`}
                aria-label="User Menu"
              >
                <FaRegUser className="w-[20px] h-[20px] sm:w-[18px] sm:h-[18px] stroke-[1.5]" />
                
                {/* Changed className below to hide text on mobile screens */}
                <span className="hidden sm:inline-block tracking-wide uppercase">
                  {isLoggedIn ? `Hi, ${displayedName}` : "MY ACCOUNT"}
                </span>

                <motion.div
                  animate={{ rotate: profileDropdownOpen ? 180 : 0 }}
                  transition={{ duration: 0.2 }}
                  className="flex items-center"
                >
                  <FaChevronDown className="text-[10px] opacity-70" />
                </motion.div>
              </button>

              {/* Profile Dropdown Content */}
              <AnimatePresence>
                {profileDropdownOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.15, ease: "easeOut" }}
                    className="absolute right-0 mt-3 w-72 bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden z-50 origin-top-right"
                  >
                    {!isLoggedIn ? (
                      <div className="p-4 bg-gray-50/70 border-b border-gray-100">
                        <p className="text-sm text-gray-500 mb-3">
                          Sign in to access your account
                        </p>
                        <div className="flex space-x-2">
                          <Link
                            href="/login"
                            onClick={() => setProfileDropdownOpen(false)}
                            className={`flex-1 text-center ${BRAND_BUTTON_BG} text-white px-3 py-2 rounded-lg text-sm font-semibold ${BRAND_BUTTON_HOVER} transition-colors shadow-sm`}
                          >
                            Log In
                          </Link>
                          <Link
                            href="/login"
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex-1 text-center border border-gray-300 text-gray-700 px-3 py-2 rounded-lg text-sm font-semibold hover:bg-gray-50 transition-colors"
                          >
                            Sign Up
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="p-4 border-b border-gray-100 bg-gray-50/40">
                        <p className="font-semibold text-gray-800">
                          Welcome back!
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          Manage and track your marketplace info
                        </p>
                      </div>
                    )}

                    <div className="py-1.5 max-h-80 overflow-y-auto">
                      {profileMenuItems.map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            href={item.href}
                            key={index}
                            className="flex items-center gap-3 w-full px-4 py-2.5 text-sm transition-colors duration-150 hover:bg-gray-50 text-left text-gray-700"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            {IconComponent && (
                              <IconComponent className="text-lg text-gray-400 flex-shrink-0" />
                            )}
                            <span className="font-medium">{item.name}</span>
                          </Link>
                        );
                      })}
                    </div>

                    {isLoggedIn && (
                      <>
                        <div className="border-t border-gray-100"></div>
                        <div className="p-3 bg-gray-50/30">
                          <Link
                            href="/sell"
                            className={`flex items-center justify-center gap-2 w-full px-4 py-2 text-sm ${BRAND_BUTTON_BG} text-white rounded-lg font-semibold ${BRAND_BUTTON_HOVER} transition-colors mb-2 shadow-sm`}
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <FaPlusCircle className="text-base" />
                            <span>Start Selling</span>
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50/60 transition-colors rounded-lg font-medium"
                          >
                            <FaSignOutAlt className="text-base text-gray-400" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Lower Navigation Row */}
        <div className="hidden lg:block border-t border-gray-200/60 bg-[#FAF6F0]">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-1">
            <nav className="flex items-center space-x-7">
              {navItems.map((item, index) => (
                <Link
                  href={item.href}
                  key={index}
                  onClick={() => setActiveNavItem(item.name)}
                  className={`text-xs font-semibold tracking-wider transition-colors duration-200 relative uppercase py-2.5 block ${
                    activeNavItem === item.name
                      ? BRAND_TEXT_COLOR
                      : `text-gray-500 hover:${BRAND_COLOR}`
                  } ${item.name === "Sale" ? `${BRAND_COLOR} font-bold` : ""}`}
                >
                  {item.name}
                  {activeNavItem === item.name && (
                    <motion.div
                      layoutId="activeUnderline"
                      className="absolute bottom-0 left-0 right-0 h-[2px] bg-[#A84420]"
                      transition={{
                        type: "spring",
                        stiffness: 380,
                        damping: 30,
                      }}
                    />
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-6 text-[13px] font-medium">
              <Link
                href="/contact"
                className="text-gray-500 hover:text-black transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/custom-furniture"
                className="border border-black rounded px-4 py-1.5 hover:bg-black hover:text-white transition-all text-black text-xs uppercase tracking-wider font-semibold"
              >
                Custom Furniture
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Input Field Drawer */}
        <AnimatePresence>
          {searchOverlayOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="lg:hidden w-full bg-[#FAF6F0] border-t border-gray-200 overflow-hidden"
            >
              <div className="p-3">
                <div className="w-full flex items-center relative">
                  <input
                    type="text"
                    placeholder="Search Refurnish..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={handleKeyPress}
                    className="w-full bg-white py-2 pl-4 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-[#A84420] text-sm"
                  />
                  <button
                    onClick={handleSearchSubmit}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-[#A84420] transition-colors"
                  >
                    <FaSearch />
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Mobile Side Drawer Overlay Menu */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-[1000]">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-black/40 backdrop-blur-[1px]"
              onClick={closeMobileMenu}
            />

            <motion.div
              initial={{ x: "-100%" }}
              animate={{ x: 0 }}
              exit={{ x: "-100%" }}
              transition={{ type: "tween", duration: 0.25, ease: "easeOut" }}
              className="absolute left-0 top-0 h-full w-full max-w-xs bg-white shadow-2xl flex flex-col"
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-100 bg-[#FAF6F0]">
                <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
                <button
                  onClick={closeMobileMenu}
                  className="p-2 text-gray-500 hover:bg-gray-100 rounded-full focus:outline-none"
                >
                  <FaTimes className="text-lg" />
                </button>
              </div>

              <nav className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto pb-8">
                <div className="p-4 space-y-0.5 border-b border-gray-100">
                  {navItems.map((item, index) => (
                    <Link
                      href={item.href}
                      key={index}
                      onClick={() => {
                        setActiveNavItem(item.name);
                        closeMobileMenu();
                      }}
                      className={`block w-full text-left py-2.5 px-4 rounded-lg font-semibold text-sm tracking-wider uppercase transition-colors duration-150 ${
                        activeNavItem === item.name
                          ? `bg-gray-100 ${BRAND_TEXT_COLOR}`
                          : "text-gray-600 hover:bg-gray-50"
                      }`}
                    >
                      {item.name}
                    </Link>
                  ))}

                  <Link
                    href="/sell"
                    className={`block w-full text-center py-3 px-4 mt-4 ${BRAND_BUTTON_BG} text-white rounded-lg font-semibold text-sm ${BRAND_BUTTON_HOVER} transition-colors uppercase shadow-sm`}
                    onClick={closeMobileMenu}
                  >
                    START SELLING
                  </Link>
                </div>

                <div className="p-4">
                  <p className="px-4 py-1 text-xs font-bold uppercase tracking-wider text-gray-400 mb-1">
                    Account Marketplace
                  </p>
                  {!isLoggedIn ? (
                    <div className="space-y-2.5 px-4 mt-3">
                      <Link
                        href="/login"
                        onClick={closeMobileMenu}
                        className={`block text-center w-full py-2.5 px-4 ${BRAND_BUTTON_BG} text-white rounded-lg font-semibold text-sm ${BRAND_BUTTON_HOVER} transition-colors`}
                      >
                        Log In
                      </Link>
                      <Link
                        href="/login"
                        onClick={closeMobileMenu}
                        className="block text-center w-full py-2.5 px-4 border border-gray-300 text-gray-700 rounded-lg font-semibold text-sm hover:bg-gray-50 transition-colors"
                      >
                        Create Account
                      </Link>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {profileMenuItems.slice(0, 4).map((item, index) => {
                        const IconComponent = item.icon;
                        return (
                          <Link
                            href={item.href}
                            key={index}
                            className="flex items-center gap-3 w-full text-left py-2.5 px-4 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                            onClick={closeMobileMenu}
                          >
                            {IconComponent && (
                              <IconComponent className="text-lg text-gray-400" />
                            )}
                            <span>{item.name}</span>
                          </Link>
                        );
                      })}
                      <Link
                        href="/account/settings"
                        className="flex items-center gap-3 w-full text-left py-2.5 px-4 text-gray-600 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                        onClick={closeMobileMenu}
                      >
                        <FaCog className="text-lg text-gray-400" />
                        <span>Account Settings</span>
                      </Link>
                      <button
                        onClick={() => {
                          handleLogout();
                          closeMobileMenu();
                        }}
                        className="w-full text-left py-2.5 px-4 text-sm text-red-600 font-semibold mt-4 border-t border-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  )}
                </div>
              </nav>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Structured Height Spacers */}
      <div className="h-[5.5rem] hidden lg:block"></div>
      <div className="h-[4.25rem] lg:hidden"></div>
    </>
  );
}