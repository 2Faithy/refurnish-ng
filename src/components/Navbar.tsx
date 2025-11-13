"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import {
  FaBars,
  FaTimes,
  FaHeart,
  FaSearch,
  FaWhatsapp,
  FaInstagram,
  FaTwitter,
  FaFacebook,
  FaUserPlus,
  FaSignOutAlt,
  FaChartBar,
  FaEnvelope,
  FaBookmark,
  FaClipboardList,
  FaCog,
  FaPlusCircle,
  FaShoppingCart,
} from "react-icons/fa";

// Define the structure for a navigation item
interface NavItem {
  name: string;
  href: string;
}

// --- Custom Icons (from previous code) ---
const UserIconSVG = ({ className }: { className?: string }) => (
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
      strokeWidth={2}
      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
    />
  </svg>
);

const CartIconSVG = ({ className }: { className?: string }) => (
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
      strokeWidth={2}
      d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
    />
  </svg>
);
// --- END Custom Icons ---

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeNavItem, setActiveNavItem] = useState("BEDROOM"); // Default to 'BEDROOM'
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const profileLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (profileLeaveTimeoutRef.current) {
      clearTimeout(profileLeaveTimeoutRef.current);
      profileLeaveTimeoutRef.current = null;
    }

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
        !target.closest('[aria-label="User Profile"]')
      ) {
        setProfileDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
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
    if (e.key === "Enter") {
      handleSearchSubmit();
    }
  };

  const profileHandlers = {
    onMouseEnter: () => {
      if (window.innerWidth < 768) return;
      if (profileLeaveTimeoutRef.current) {
        clearTimeout(profileLeaveTimeoutRef.current);
        profileLeaveTimeoutRef.current = null;
      }
      setProfileDropdownOpen(true);
    },
    onMouseLeave: () => {
      if (window.innerWidth < 768) return;
      profileLeaveTimeoutRef.current = setTimeout(() => {
        setProfileDropdownOpen(false);
      }, 200);
    },
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    console.log("User logged out");
  };

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  const BRAND_COLOR = "text-[#775522]";
  const BRAND_TEXT_COLOR = "text-[#5F7161]";
  const BRAND_BUTTON_BG = "bg-[#5F7161]";
  const BRAND_BUTTON_HOVER = "hover:bg-[#4d5c4e]";

  const profileMenuItems = [
    { name: "Create an account", href: "/login", icon: FaUserPlus, color: BRAND_COLOR },
    { name: "Saved items", href: "/account/saved-items", icon: FaBookmark },
    { name: "Saved searches", href: "/account/saved-searches", icon: FaSearch },
    { name: "Messages", href: "/account/messages", icon: FaEnvelope },
    { name: "Listings", href: "/account/my-listings", icon: FaClipboardList },
    { name: "Purchases", href: "/account/purchases", icon: FaShoppingCart, color: BRAND_COLOR },
    { name: "Sales", href: "/account/sales", icon: FaChartBar },
    { name: "Offers", href: "/account/offers", icon: FaHeart },
    { name: "Account Settings", href: "/account/settings", icon: FaCog },
  ];

  const navItems: NavItem[] = [
    { name: "JUST ADDED", href: "/category/just-added" },
    { name: "LIVING", href: "/category/living" },
    { name: "DINING", href: "/category/dining" },
    { name: "BEDROOM", href: "/category/bedroom" },
    { name: "BATH", href: "/category/bath" },
    { name: "LIGHTNING", href: "/category/lighting" },
    { name: "DECOR", href: "/category/decor" },
    { name: "OUTDOOR", href: "/category/outdoor" },
    { name: "SALE", href: "/sale" },
  ];

  return (
    <>
      <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50">
        {/* Top Header Section */}
        <div className="bg-white border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center relative">
            {/* Mobile: Hamburger Menu */}
            <div className="lg:hidden flex-shrink-0">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className={`text-2xl ${BRAND_TEXT_COLOR} p-2 -ml-2 rounded-md hover:bg-gray-100 transition-colors`}
                aria-label="Toggle mobile menu"
              >
                <FaBars />
              </button>
            </div>

            {/* Logo - UPDATED SIZE HERE */}
            <Link href="/" className="flex-shrink-0 mr-4">
              <img
                src="/logo.png"
                alt="refurnish logo"
                className="h-10 w-auto" // Changed from h-7 to h-10
              />
            </Link>

            {/* Desktop Search Bar */}
            <div className="hidden lg:flex flex-grow max-w-lg mx-8">
              <div className="w-full relative">
                <FaSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <input
                  type="text"
                  placeholder="Search trusted furniture & decor deals, no mago-mago"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full bg-gray-100 border border-gray-200 rounded-lg py-2 pl-12 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-[#91B5B3] focus:border-[#91B5B3] text-gray-700 placeholder-gray-500"
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

              {/* User Profile - Using Custom SVG */}
              <div
                className="relative hidden md:block"
                {...profileHandlers}
                ref={profileDropdownRef}
              >
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className={`w-6 h-6 ${BRAND_TEXT_COLOR} hover:${BRAND_COLOR} transition-colors duration-200`}
                  aria-label="User Profile"
                >
                  <UserIconSVG className="w-full h-full" />
                </button>
                {/* Profile Dropdown Content (unchanged logic) */}
                {profileDropdownOpen && (
                  <div
                    className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-2xl overflow-hidden z-50"
                    onMouseEnter={profileHandlers.onMouseEnter}
                    onMouseLeave={profileHandlers.onMouseLeave}
                  >
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
                          <Link href={item.href} key={index} passHref legacyBehavior>
                            <a
                              className={`flex items-center gap-3 w-full px-4 py-3 text-sm transition-colors duration-200 hover:bg-gray-50 text-left ${
                                item.color || "text-gray-700"
                              }`}
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
                  <CartIconSVG className="w-full h-full" />
                </a>
              </Link>
            </div>
          </div>

          {/* Mobile Search Bar Overlay (unchanged logic) */}
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
                  onKeyPress={handleKeyPress}
                  className="flex-grow py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:border-gray-500 text-gray-800"
                  aria-label="Search for products"
                  autoFocus
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
        </div>

        {/* Navigation Bar - Desktop Only (Updated colors/styles) */}
        <div className="hidden lg:block bg-white border-b border-gray-200 shadow-inner">
          <div className="max-w-7xl mx-auto px-4 sm:px-6">
            <nav className="flex items-center justify-start space-x-8 py-3 overflow-x-auto whitespace-nowrap">
              {navItems.map((item, index) => (
                <Link href={item.href} key={index} passHref legacyBehavior>
                  <a
                    onClick={() => setActiveNavItem(item.name)}
                    className={`text-sm font-medium transition-colors duration-200 relative uppercase py-1 ${
                      activeNavItem === item.name
                        ? `border-b-2 border-[#5F7161] ${BRAND_TEXT_COLOR}`
                        : `text-gray-700 hover:${BRAND_COLOR}`
                    } ${item.name === "SALE" ? `${BRAND_COLOR} font-bold` : ""}`}
                  >
                    {item.name}
                  </a>
                </Link>
              ))}
            </nav>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay (unchanged logic) */}
      <div
        className={`lg:hidden fixed inset-0 z-[1000] transition-opacity duration-300 ${
          mobileMenuOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
      >
        {/* Backdrop */}
        <div
          className="absolute inset-0 bg-black bg-opacity-50"
          onClick={closeMobileMenu}
        ></div>

        {/* Menu Panel */}
        <div
          className={`absolute left-0 top-0 h-full w-full max-w-xs bg-white shadow-xl transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <img
              src="/logo.png"
              alt="refurnish logo"
              className="h-10 w-auto" // Changed from h-8 to h-10
            />
            <button
              onClick={closeMobileMenu}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close Mobile Menu"
            >
              <FaTimes className="text-xl" />
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
                  {/* Show a select few logged-in links */}
                  {profileMenuItems
                    .filter((item) => item.name !== "Create an account")
                    .slice(0, 4)
                    .map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <Link href={item.href} key={index} passHref legacyBehavior>
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
                    className="flex items-center gap-3 w-full text-left py-3 px-4 text-red-600 rounded-md hover:bg-red-50 transition-colors"
                  >
                    <FaSignOutAlt className="text-xl" />
                    <span className="font-medium">Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="mt-auto pt-8 pb-4 border-t border-gray-200">
              <p className="px-4 text-sm text-gray-500 font-semibold mb-3 text-center">
                Follow us
              </p>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://wa.me/yourwhatsappnumber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl text-[#25D366] hover:text-green-700 transition-colors"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href="https://www.instagram.com/yourinstagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl text-[#C13584] hover:text-pink-700 transition-colors"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://x.com/yourtwitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl text-black hover:text-gray-700 transition-colors"
                  aria-label="X (Twitter)"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://www.facebook.com/yourfacebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-3xl text-[#1877F2] hover:text-blue-700 transition-colors"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>

      <div className="h-[5.5rem] hidden lg:block"></div>
      <div className="h-[4rem] lg:hidden"></div>
    </>
  );
}