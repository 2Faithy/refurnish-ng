"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaHeart,
  FaSearch,
  FaSignOutAlt,
  FaChartBar,
  FaEnvelope,
  FaBookmark,
  FaClipboardList,
  FaCog,
  FaShoppingCart,
  FaChevronDown,
  FaPlusCircle, // Fixed: Added missing import
} from "react-icons/fa";

// Global Brand Constants to solve the missing variable errors
const BRAND_COLOR = "text-[#A84420]";
const BRAND_TEXT_COLOR = "text-gray-800";
const BRAND_BUTTON_BG = "bg-[#A84420]";
const BRAND_BUTTON_HOVER = "hover:bg-[#8c3516]";

interface NavItem {
  name: string;
  href: string;
}

// Thin SVG Icons matching the clean screenshot aesthetic
const HeartIconSVG = ({ className }: { className?: string }) => (
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
      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
    />
  </svg>
);

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNavItem, setActiveNavItem] = useState("Furniture");

  // Clean initialization: Starts completely logged out
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [displayedName, setDisplayedName] = useState("");

  const profileDropdownRef = useRef<HTMLDivElement>(null);

  // Sync state with client storage on mount to retrieve user session safely
  useEffect(() => {
    const activeUser = localStorage.getItem("currentUser");
    if (activeUser) {
      try {
        const userObj = JSON.parse(activeUser);
        if (userObj && userObj.name) {
          setIsLoggedIn(true);
          // Split full name string to isolate and extract just the first name
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
      console.log(`Searching for: ${searchQuery}`);
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
    window.location.reload(); // Optional reset trigger
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
    { name: "Furniture", href: "/category/furniture" },
    { name: "Rooms", href: "/category/rooms" },
    { name: "Style", href: "/category/style" },
    { name: "Lighting", href: "/category/lighting" },
    { name: "Rugs", href: "/category/rugs" },
    { name: "Art", href: "/category/art" },
    { name: "Décor", href: "/category/decor" },
    { name: "New Arrivals", href: "/category/new-arrivals" },
    { name: "Sale", href: "/sale" },
  ];

  return (
    <>
      <header className="w-full bg-[#FAF6F0] fixed top-0 left-0 z-50 font-sans">
        {/* Main Upper Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex justify-between items-center gap-4">
          {/* Mobile Menu Icon */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-gray-700 p-1 rounded-md"
              aria-label="Toggle mobile menu"
            >
              <FaBars className="text-xl" />
            </button>
          </div>

          {/* Logo Brand Container */}
          <Link href="/" className="flex items-center flex-shrink-0">
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
                className="w-full bg-transparent border border-gray-300 rounded-full py-2.5 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#A84420] focus:border-[#A84420] text-gray-800 placeholder-gray-400"
              />
            </div>
          </div>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 text-gray-600 flex-shrink-0">
            {/* Start Selling Button */}
            <Link href="/dashboard/sell" passHref legacyBehavior>
              <a
                className={`hidden sm:inline-block ${BRAND_BUTTON_BG} ${BRAND_BUTTON_HOVER} text-white px-5 py-2 rounded-lg font-semibold text-sm transition-colors duration-300 ml-4 shadow-md`}
              >
                START SELLING
              </a>
            </Link>

            {/* Mobile Search Icon */}
            <button
              onClick={() => {
                setSearchOverlayOpen(!searchOverlayOpen);
                setProfileDropdownOpen(false);
              }}
              className={`lg:hidden text-2xl ${BRAND_TEXT_COLOR} hover:${BRAND_COLOR} p-2 rounded-md transition-colors duration-200`}
              aria-label="Toggle search bar"
            >
              <FaSearch />
            </button>

            {/* Wishlist Icon (FaHeart) */}
            <Link href="/wishlist" passHref legacyBehavior>
              <a
                className={`w-6 h-6 ${BRAND_TEXT_COLOR} hover:${BRAND_COLOR} transition-colors duration-200`}
                aria-label="Wishlist"
              >
                <FaHeart className="w-full h-full" />
              </a>
            </Link>

            <Link
              href="/cart"
              aria-label="Shopping Bag"
              className="hover:text-[#A84420] transition-colors"
            >
              <BagIconSVG className="w-6 h-6 text-gray-800" />
            </Link>

            {/* Managed Dynamic Authentication Block */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="flex items-center space-x-1.5 hover:text-[#A84420] transition-colors focus:outline-none"
                aria-label="User Menu"
              >
                <span>
                  {isLoggedIn ? `Hi, ${displayedName}` : "My Account"}
                </span>
                <FaChevronDown className="text-xs opacity-70" />
              </button>

              {/* Profile Dropdown Content */}
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden z-50">
                  {!isLoggedIn ? (
                    <div className="p-4 bg-gray-50 border-b border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">
                        Sign in to access your account
                      </p>
                      <div className="flex space-x-2">
                        <Link href="/login" passHref legacyBehavior>
                          <a
                            onClick={() => setProfileDropdownOpen(false)}
                            className={`flex-1 text-center ${BRAND_BUTTON_BG} text-white px-3 py-2 rounded-md text-sm font-semibold ${BRAND_BUTTON_HOVER} transition-colors`}
                          >
                            Log In
                          </a>
                        </Link>
                        <Link href="/login" passHref legacyBehavior>
                          <a
                            onClick={() => setProfileDropdownOpen(false)}
                            className="flex-1 text-center border border-gray-700 text-gray-700 px-3 py-2 rounded-md text-sm font-semibold hover:bg-gray-50 transition-colors"
                          >
                            Sign Up
                          </a>
                        </Link>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-semibold text-gray-800">
                        Welcome back!
                      </p>
                      <p className="text-sm text-gray-600">Your account</p>
                    </div>
                  )}

                  <div className="py-2 max-h-80 overflow-y-auto">
                    {profileMenuItems.map((item, index) => {
                      if (item.name === "Create an account" && isLoggedIn)
                        return null;
                      const IconComponent = item.icon;
                      return (
                        <Link
                          href={item.href}
                          key={index}
                          passHref
                          legacyBehavior
                        >
                          <a
                            className="flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors duration-200 hover:bg-gray-50 text-left text-gray-700"
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            {IconComponent && (
                              <IconComponent className="text-xl text-gray-500 flex-shrink-0" />
                            )}
                            <span className="font-medium">{item.name}</span>
                          </a>
                        </Link>
                      );
                    })}
                  </div>

                  {isLoggedIn && (
                    <>
                      <div className="border-t border-gray-200"></div>
                      <div className="p-3">
                        <Link href="/dashboard/sell" passHref legacyBehavior>
                          <a
                            className={`flex items-center justify-center gap-2 w-full px-4 py-2 text-sm ${BRAND_BUTTON_BG} text-white rounded-md font-semibold ${BRAND_BUTTON_HOVER} transition-colors mb-2`}
                            onClick={() => setProfileDropdownOpen(false)}
                          >
                            <FaPlusCircle className="text-lg" />
                            <span>Start Selling</span>
                          </a>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors rounded-md"
                        >
                          <FaSignOutAlt className="text-lg" />
                          <span className="font-medium">Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Cart Icon - Using Custom SVG */}
            <Link href="/cart" passHref legacyBehavior>
              <a
                className={`w-6 h-6 ${BRAND_TEXT_COLOR} hover:${BRAND_COLOR} transition-colors duration-200`}
                aria-label="Shopping Cart"
              >
                <BagIconSVG className="w-full h-full" />
              </a>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar Overlay */}
        <div
          className={`lg:hidden w-full bg-white transition-all duration-300 ease-in-out overflow-hidden ${
            searchOverlayOpen
              ? "max-h-20 opacity-100 py-3 border-t border-gray-200 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4">
            <div className="w-full flex items-center shadow-sm">
              <input
                type="text"
                placeholder="Search furniture & decor..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleKeyPress}
                className="flex-grow py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:border-gray-500 text-gray-800"
                aria-label="Search for products"
              />
              <button
                onClick={handleSearchSubmit}
                className={`${BRAND_BUTTON_BG} text-white px-4 py-2 rounded-r-md ${BRAND_BUTTON_HOVER} transition-colors duration-200`}
                aria-label="Submit search"
              >
                <FaSearch />
              </button>
            </div>
          </div>
        </div>

        {/* Lower Navigation Row */}
        <div className="hidden lg:block border-t border-gray-200/60">
          <div className="max-w-7xl mx-auto px-6 flex items-center justify-between py-2">
            <nav className="flex items-center space-x-8">
              {navItems.map((item, index) => (
                <Link href={item.href} key={index} passHref legacyBehavior>
                  <a
                    onClick={() => setActiveNavItem(item.name)}
                    className={`text-sm font-medium transition-colors duration-200 relative uppercase py-1 ${
                      activeNavItem === item.name
                        ? `border-b-2 border-[#5F7161] ${BRAND_TEXT_COLOR}`
                        : `text-gray-700 hover:${BRAND_COLOR}`
                    } ${
                      item.name === "Sale" ? `${BRAND_COLOR} font-bold` : ""
                    }`}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-6 text-[13px]">
              <Link
                href="/contact"
                className="text-gray-600 hover:text-black transition-colors"
              >
                Contact Us
              </Link>
              <Link
                href="/custom-furniture"
                className="border border-black rounded px-4 py-1.5 hover:bg-black hover:text-white transition-all text-black font-medium"
              >
                Custom Furniture
              </Link>
            </div>
          </div>
        </div>

        {/* Mobile Input Field Drawer */}
        <div
          className={`lg:hidden w-full bg-[#FAF6F0] transition-all duration-200 ease-in-out overflow-hidden ${
            searchOverlayOpen
              ? "max-h-16 border-t border-gray-200 p-3 opacity-100"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="w-full flex items-center relative">
            <input
              type="text"
              placeholder="Search Refurnish..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleKeyPress}
              className="w-full bg-white py-2 pl-4 pr-10 border border-gray-300 rounded-md focus:outline-none text-sm"
            />
            <button
              onClick={handleSearchSubmit}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            >
              <FaSearch />
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`lg:hidden fixed inset-0 z-[1000] transition-opacity duration-200 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        <div
          className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
          onClick={closeMobileMenu}
        ></div>
        <div
          className={`absolute left-0 top-0 h-full w-full max-w-xs bg-white shadow-2xl transform transition-transform duration-200 flex flex-col ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          <div className="flex justify-between items-center p-4 border-b border-gray-100">
            <img src="/logo.png" alt="Logo" className="h-8 w-auto" />
            <button
              onClick={closeMobileMenu}
              className="p-2 text-gray-500 hover:bg-gray-50 rounded-full"
            >
              <FaTimes className="text-lg" />
            </button>
          </div>

          {/* Mobile Menu Navigation & Content */}
          <nav className="flex flex-col h-[calc(100%-4rem)] overflow-y-auto">
            {/* Main Nav Links */}
            <div className="p-4 space-y-1 border-b border-gray-100">
              {navItems.map((item, index) => (
                <Link href={item.href} key={index} passHref legacyBehavior>
                  <a
                    onClick={() => {
                      setActiveNavItem(item.name);
                      closeMobileMenu();
                    }}
                    className={`block w-full text-left py-3 px-4 rounded-md font-semibold text-base uppercase transition-colors duration-200 ${
                      activeNavItem === item.name
                        ? `bg-gray-100 ${BRAND_TEXT_COLOR}`
                        : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}

              <Link href="/dashboard/sell" passHref legacyBehavior>
                <a
                  className={`block w-full text-center py-3 px-4 mt-4 ${BRAND_BUTTON_BG} text-white rounded-md font-semibold ${BRAND_BUTTON_HOVER} transition-colors duration-200 uppercase`}
                  onClick={closeMobileMenu}
                >
                  START SELLING
                </a>
              </Link>
            </div>

            {/* User section */}
            <div className="p-4 pt-0">
              <p className="px-4 py-3 text-sm font-semibold text-gray-500">
                Account
              </p>
              {!isLoggedIn ? (
                <div className="space-y-3 px-4">
                  <Link href="/login" passHref legacyBehavior>
                    <a
                      onClick={closeMobileMenu}
                      className={`block text-center w-full py-3 px-4 ${BRAND_BUTTON_BG} text-white rounded-md font-semibold ${BRAND_BUTTON_HOVER} transition-colors`}
                    >
                      Log In
                    </a>
                  </Link>
                  <Link href="/login" passHref legacyBehavior>
                    <a
                      onClick={closeMobileMenu}
                      className="block text-center w-full py-3 px-4 border border-gray-700 text-gray-700 rounded-md font-semibold hover:bg-gray-50 transition-colors"
                    >
                      Create Account
                    </a>
                  </Link>
                </div>
              ) : (
                <div className="space-y-1">
                  {profileMenuItems.slice(0, 4).map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        href={item.href}
                        key={index}
                        passHref
                        legacyBehavior
                      >
                        <a
                          className="flex items-center gap-3 w-full text-left py-3 px-4 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                          onClick={closeMobileMenu}
                        >
                          {IconComponent && (
                            <IconComponent className="text-xl text-gray-500" />
                          )}
                          <span className="font-medium">{item.name}</span>
                        </a>
                      </Link>
                    );
                  })}
                  <Link href="/account/settings" passHref legacyBehavior>
                    <a
                      className="flex items-center gap-3 w-full text-left py-3 px-4 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                      onClick={closeMobileMenu}
                    >
                      <FaCog className="text-xl text-gray-500" />
                      <span className="font-medium">Account Settings</span>
                    </a>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      closeMobileMenu();
                    }}
                    className="w-full text-left py-2 px-4 text-sm text-red-600 font-medium mt-2"
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          </nav>
        </div>
      </div>

      <div className="h-[5.5rem] hidden lg:block"></div>
      <div className="h-[4rem] lg:hidden"></div>
    </>
  );
}
