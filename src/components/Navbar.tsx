"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  FaShoppingCart,
  FaUserCircle,
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
  FaHome,
  FaEnvelope,
  FaBookmark,
  FaClipboardList,
  FaCog,
  FaPlusCircle,
  FaChevronDown,
  FaChevronRight,
} from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const [mobileDashboardAccordionOpen, setMobileDashboardAccordionOpen] =
    useState(false);
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOverlayOpen, setSearchOverlayOpen] = useState(false);
  const [shopDropdownOpen, setShopDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileShopAccordionOpen, setMobileShopAccordionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchOverlayRef = useRef<HTMLDivElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const shopLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const profileLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Authentication state - should be managed by context/Redux in real app
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Store the previous pathname to detect external navigation
  const prevPathnameRef = useRef<string | null>(null);

  // Effect to handle path changes, body scroll, and click outside for dropdowns
  useEffect(() => {
    if (
      prevPathnameRef.current !== null &&
      prevPathnameRef.current !== pathname
    ) {
      setSearchOverlayOpen(false);
      setMobileMenuOpen(false);
      setShopDropdownOpen(false);
      setProfileDropdownOpen(false);
      setMobileShopAccordionOpen(false);
      setMobileDashboardAccordionOpen(false);
    }
    prevPathnameRef.current = pathname;

    // Clear any pending timeouts
    [shopLeaveTimeoutRef, profileLeaveTimeoutRef].forEach((timeoutRef) => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    });

    // Handle body scroll for mobile menu and search overlay
    const handleBodyScroll = () => {
      if (mobileMenuOpen || (searchOverlayOpen && window.innerWidth >= 768)) {
        document.body.style.overflow = "hidden";
      } else {
        document.body.style.overflow = "unset";
      }
    };

    handleBodyScroll();

    // Cleanup function
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [pathname, mobileMenuOpen, searchOverlayOpen]);

  // Effect for closing desktop dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      // Shop dropdown
      if (
        shopDropdownRef.current &&
        !shopDropdownRef.current.contains(target)
      ) {
        setShopDropdownOpen(false);
      }

      // Profile dropdown
      if (
        profileDropdownRef.current &&
        !profileDropdownRef.current.contains(target) &&
        !target.closest('[aria-label="User Profile"]')
      ) {
        setProfileDropdownOpen(false);
      }

      // Search overlay
      if (
        searchOverlayRef.current &&
        !searchOverlayRef.current.contains(target) &&
        !target.closest('[aria-label="Toggle search bar"]')
      ) {
        if (window.innerWidth >= 768) {
          setSearchOverlayOpen(false);
        }
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
      setSearchQuery("");
    }
    setSearchOverlayOpen(false);
    setMobileMenuOpen(false);
  };

  // Helper functions for dropdown management with delay
  const createMouseHandlers = (
    setDropdownOpen: React.Dispatch<React.SetStateAction<boolean>>,
    timeoutRef: React.MutableRefObject<NodeJS.Timeout | null>
  ) => ({
    onMouseEnter: () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      setDropdownOpen(true);
    },
    onMouseLeave: () => {
      timeoutRef.current = setTimeout(() => {
        setDropdownOpen(false);
      }, 200);
    },
  });

  const shopHandlers = createMouseHandlers(
    setShopDropdownOpen,
    shopLeaveTimeoutRef
  );
  const profileHandlers = createMouseHandlers(
    setProfileDropdownOpen,
    profileLeaveTimeoutRef
  );

  // Authentication functions
  const handleLogin = () => {
    setIsLoggedIn(true);
    setProfileDropdownOpen(false);
    console.log("User logged in (dummy)");
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setProfileDropdownOpen(false);
    console.log("User logged out (dummy)");
    router.push("/login");
  };

  const shopCategories = [
    {
      title: "Collections",
      items: [
        { name: "All Furniture", href: "/shop" },
        { name: "New Arrivals", href: "/shop/new-arrivals" },
        { name: "Best Sellers", href: "/shop/best-sellers" },
        { name: "On Sale", href: "/shop/on-sale" },
      ],
    },
    {
      title: "Categories",
      items: [
        { name: "Sofas & Couches", href: "/shop/sofas" },
        { name: "Beds & Bedroom", href: "/shop/beds" },
        { name: "Tables & Desks", href: "/shop/tables" },
        { name: "Chairs", href: "/shop/chairs" },
        { name: "Storage", href: "/shop/storage" },
        { name: "Outdoor", href: "/shop/outdoor" },
        { name: "Decor", href: "/shop/decor" },
      ],
    },
    {
      title: "Rooms",
      items: [
        { name: "Living Room", href: "/shop/living-room" },
        { name: "Bedroom", href: "/shop/bedroom" },
        { name: "Dining Room", href: "/shop/dining-room" },
        { name: "Office", href: "/shop/office" },
        { name: "Outdoor", href: "/shop/outdoor-space" },
        { name: "Kids Room", href: "/shop/kids-room" },
      ],
    },
    {
      title: "Shop By Style",
      items: [
        { name: "Modern", href: "/shop/modern" },
        { name: "Traditional", href: "/shop/traditional" },
        { name: "Minimalist", href: "/shop/minimalist" },
        { name: "Industrial", href: "/shop/industrial" },
        { name: "Scandinavian", href: "/shop/scandinavian" },
        { name: "Vintage", href: "/shop/vintage" },
      ],
    },
  ];

  // Profile dropdown items based on the AptDeco design
  const profileMenuItems = [
    {
      name: "Create an account",
      href: "/register",
      icon: FaUserPlus,
      color: "text-orange-500",
    },
    { name: "Saved items", href: "/saved-items", icon: FaBookmark },
    { name: "Saved searches", href: "/saved-searches", icon: FaSearch },
    { name: "Messages", href: "/messages", icon: FaEnvelope },
    { name: "Listings", href: "/my-listings", icon: FaClipboardList },
    {
      name: "Purchases",
      href: "/purchases",
      icon: FaShoppingCart,
      color: "text-orange-500",
    },
    { name: "Sales", href: "/sales", icon: FaChartBar },
    { name: "Offers", href: "/offers", icon: FaHeart },
    { name: "Payout preferences", href: "/payout-preferences", icon: FaCog },
    { name: "Account Settings", href: "/settings", icon: FaCog },
    { name: "Help center", href: "/help", icon: null },
  ];

  // Close mobile menu helper
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "unset";
  };

  return (
    <>
      <header className="w-full bg-white shadow-sm fixed top-0 left-0 z-50 transition-all duration-300 border-b border-[#E8CEB0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex justify-between items-center gap-4 relative">
          {/* Mobile: Hamburger Menu (Left) */}
          <div className="lg:hidden flex-shrink-0">
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="text-2xl text-[#775522] p-2 rounded-md hover:bg-[#F6F1EB] transition-colors duration-200"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              aria-haspopup="true"
            >
              <FaBars />
            </button>
          </div>

          {/* Logo */}
          <Link
            href="/"
            className="flex-shrink-0 order-2 lg:order-none mx-2 lg:mx-0"
          >
            <div className="flex items-center">
              <img
                src="/logo.png"
                alt="ReFurnish NG Logo"
                className="h-10 w-auto object-contain hover:scale-105 transition-transform duration-200"
              />
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 flex-grow justify-center">
            <Link
              href="/"
              className={`text-base font-medium px-3 py-2 rounded-md transition-colors duration-200 ${
                pathname === "/"
                  ? "bg-[#F6F1EB] text-[#775522]"
                  : "text-gray-700 hover:text-[#775522] hover:bg-[#F6F1EB]"
              }`}
            >
              Home
            </Link>

            {/* Shop Dropdown */}
            <div className="relative" {...shopHandlers} ref={shopDropdownRef}>
              <button
                className={`text-base font-medium flex items-center gap-1 px-3 py-2 rounded-md transition-colors duration-200 ${
                  pathname.startsWith("/shop") || shopDropdownOpen
                    ? "bg-[#F6F1EB] text-[#775522]"
                    : "text-gray-700 hover:text-[#775522] hover:bg-[#F6F1EB]"
                }`}
                aria-expanded={shopDropdownOpen}
                aria-haspopup="menu"
              >
                Shop
                <FaChevronDown
                  className={`w-3 h-3 ml-1 transition-transform duration-200 ${
                    shopDropdownOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {shopDropdownOpen && (
                <div className="absolute left-0 top-full mt-1 w-[800px] bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-40 animate-fade-in-scale grid grid-cols-4 gap-6 p-6">
                  {shopCategories.map((category, index) => (
                    <div key={index} className="flex flex-col space-y-2">
                      <h3 className="font-semibold text-[#5F7161] mb-2 text-sm uppercase tracking-wide">
                        {category.title}
                      </h3>
                      {category.items.map((item, itemIndex) => (
                        <Link
                          key={itemIndex}
                          href={item.href}
                          className={`text-sm py-1 transition-colors duration-200 ${
                            pathname === item.href
                              ? "text-[#775522] font-medium"
                              : "text-gray-600 hover:text-[#775522]"
                          }`}
                          onClick={() => setShopDropdownOpen(false)}
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <Link
              href="/about"
              className={`text-base font-medium px-3 py-2 rounded-md transition-colors duration-200 ${
                pathname === "/about"
                  ? "bg-[#F6F1EB] text-[#775522]"
                  : "text-gray-700 hover:text-[#775522] hover:bg-[#F6F1EB]"
              }`}
            >
              About
            </Link>

            <Link
              href="/contact"
              className={`text-base font-medium px-3 py-2 rounded-md transition-colors duration-200 ${
                pathname === "/contact"
                  ? "bg-[#F6F1EB] text-[#775522]"
                  : "text-gray-700 hover:text-[#775522] hover:bg-[#F6F1EB]"
              }`}
            >
              Contact
            </Link>

            {/* Start Selling Button */}
            <Link
              href="/dashboard/sell"
              className="bg-[#775522] text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-[#5E441B] transition-colors duration-200 ml-4"
            >
              Start Selling
            </Link>
          </nav>

          {/* Right Side Icons */}
          <div className="flex items-center space-x-4 sm:space-x-5 flex-shrink-0 order-3">
            {/* Search Icon */}
            <button
              onClick={() => {
                setSearchOverlayOpen(!searchOverlayOpen);
                setProfileDropdownOpen(false);
              }}
              className="text-xl text-gray-600 hover:text-[#775522] p-2 rounded-md hover:bg-[#F6F1EB] transition-colors duration-200"
              aria-label="Toggle search bar"
              aria-expanded={searchOverlayOpen}
              aria-controls="search-overlay"
            >
              <FaSearch />
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative text-xl text-gray-600 hover:text-[#775522] p-2 rounded-md hover:bg-[#F6F1EB] transition-colors duration-200"
              aria-label="View shopping cart"
            >
              <FaShoppingCart />
              <span className="absolute -top-1 -right-1 bg-[#775522] text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                3
              </span>
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="text-xl text-gray-600 hover:text-[#775522] p-2 rounded-md hover:bg-[#F6F1EB] transition-colors duration-200 hidden sm:block"
              aria-label="Wishlist"
            >
              <FaHeart />
            </Link>

            {/* User Profile Dropdown */}
            <div
              className="relative"
              {...profileHandlers}
              ref={profileDropdownRef}
            >
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="text-xl text-gray-600 hover:text-[#775522] p-2 rounded-md hover:bg-[#F6F1EB] transition-colors duration-200"
                aria-label="User Profile"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="menu"
              >
                <FaUserCircle />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-2 w-72 bg-white border border-gray-200 rounded-lg shadow-xl overflow-hidden z-50 animate-fade-in-scale">
                  {!isLoggedIn ? (
                    <div className="p-4 bg-[#F6F1EB] border-b border-gray-200">
                      <p className="text-sm text-gray-600 mb-3">
                        Sign in to access your account
                      </p>
                      <div className="flex space-x-2">
                        <button
                          onClick={() => {
                            router.push("/login");
                            setProfileDropdownOpen(false);
                          }}
                          className="flex-1 bg-[#775522] text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-[#5E441B] transition-colors duration-200"
                        >
                          Log In
                        </button>
                        <button
                          onClick={() => {
                            router.push("/register");
                            setProfileDropdownOpen(false);
                          }}
                          className="flex-1 border border-[#775522] text-[#775522] px-3 py-2 rounded-md text-sm font-medium hover:bg-[#F6F1EB] transition-colors duration-200"
                        >
                          Sign Up
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 border-b border-gray-200">
                      <p className="font-medium text-gray-800">Welcome back!</p>
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
                          key={index}
                          href={item.href}
                          className={`flex items-center gap-3 px-4 py-3 text-sm transition-colors duration-200 hover:bg-[#F6F1EB] ${
                            item.color || "text-gray-700"
                          }`}
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          {IconComponent && (
                            <IconComponent className="text-gray-500 flex-shrink-0" />
                          )}
                          <span>{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>

                  {isLoggedIn && (
                    <>
                      <div className="border-t border-gray-200"></div>
                      <div className="p-2">
                        <Link
                          href="/sell-item"
                          className="flex items-center justify-center gap-2 px-4 py-2 text-sm bg-[#775522] text-white rounded-md font-medium hover:bg-[#5E441B] transition-colors duration-200 mb-2"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <FaPlusCircle />
                          <span>Start Selling</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors duration-200 rounded-md"
                        >
                          <FaSignOutAlt />
                          <span>Logout</span>
                        </button>
                      </div>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div
          ref={searchOverlayRef}
          id="search-overlay"
          className={`hidden lg:block w-full bg-white transition-all duration-300 ease-in-out overflow-hidden ${
            searchOverlayOpen
              ? "max-h-screen opacity-100 py-4 border-t border-gray-200 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="max-w-3xl mx-auto px-4">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center border-2 border-gray-300 rounded-lg overflow-hidden focus-within:border-[#775522] transition-colors duration-200"
            >
              <div className="pl-4 text-gray-400">
                <FaSearch />
              </div>
              <input
                type="text"
                placeholder="Search for furniture, decor, and more..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow py-3 px-3 text-gray-800 placeholder-gray-500 focus:outline-none bg-transparent"
                aria-label="Search for products"
                autoFocus
              />
              <button
                type="button"
                onClick={() => setSearchOverlayOpen(false)}
                className="text-gray-500 hover:text-gray-700 p-3 transition-colors duration-200"
                aria-label="Close search"
              >
                <FaTimes />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Search Bar (Shown when search is active on mobile) */}
        <div
          className={`lg:hidden w-full bg-white transition-all duration-300 ease-in-out overflow-hidden ${
            searchOverlayOpen
              ? "max-h-16 opacity-100 py-3 border-t border-gray-200 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="px-4">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex items-center"
            >
              <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow py-2 px-4 border border-gray-300 rounded-l-md focus:outline-none focus:border-[#775522] text-gray-800"
                aria-label="Search for products"
                autoFocus
              />
              <button
                type="submit"
                className="bg-[#775522] text-white px-4 py-2 rounded-r-md hover:bg-[#5E441B] transition-colors duration-200"
                aria-label="Submit search"
              >
                <FaSearch />
              </button>
              <button
                type="button"
                onClick={() => setSearchOverlayOpen(false)}
                className="text-gray-500 hover:text-gray-700 ml-2 p-2 transition-colors duration-200"
                aria-label="Close search"
              >
                <FaTimes />
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
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
          className={`absolute left-0 top-0 h-full w-4/5 max-w-sm bg-white shadow-xl transform transition-transform duration-300 ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200">
            <Link
              href="/"
              onClick={closeMobileMenu}
              className="flex items-center"
            >
              <img
                src="/logo.png"
                alt="ReFurnish NG Logo"
                className="h-8 w-auto"
              />
            </Link>
            <button
              onClick={closeMobileMenu}
              className="text-gray-500 hover:text-gray-700 p-1 rounded-md hover:bg-gray-100 transition-colors duration-200"
              aria-label="Close Mobile Menu"
            >
              <FaTimes className="text-xl" />
            </button>
          </div>

          {/* Mobile Menu Navigation */}
          <nav className="flex flex-col p-4 h-[calc(100%-4rem)] overflow-y-auto">
            <div className="space-y-1">
              <Link
                href="/"
                className={`block py-3 px-4 rounded-md text-gray-700 font-medium transition-colors duration-200 ${
                  pathname === "/"
                    ? "bg-[#F6F1EB] text-[#775522]"
                    : "hover:bg-gray-100"
                }`}
                onClick={closeMobileMenu}
              >
                Home
              </Link>

              {/* Shop Accordion */}
              <div className="border-b border-gray-100 pb-2">
                <button
                  onClick={() =>
                    setMobileShopAccordionOpen(!mobileShopAccordionOpen)
                  }
                  className={`flex justify-between items-center w-full py-3 px-4 rounded-md text-left text-gray-700 font-medium transition-colors duration-200 ${
                    mobileShopAccordionOpen || pathname.startsWith("/shop")
                      ? "bg-[#F6F1EB] text-[#775522]"
                      : "hover:bg-gray-100"
                  }`}
                  aria-expanded={mobileShopAccordionOpen}
                >
                  <span>Shop</span>
                  <FaChevronDown
                    className={`transition-transform duration-200 ${
                      mobileShopAccordionOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  className={`overflow-hidden transition-all duration-300 ease-in-out ${
                    mobileShopAccordionOpen
                      ? "max-h-screen opacity-100 py-2"
                      : "max-h-0 opacity-0"
                  }`}
                >
                  <div className="pl-4 pr-2 space-y-3">
                    {shopCategories.map((category, catIndex) => (
                      <div key={catIndex} className="mb-4">
                        <h4 className="font-semibold text-[#5F7161] mb-2 text-sm">
                          {category.title}
                        </h4>
                        <div className="space-y-1">
                          {category.items.map((item, itemIndex) => (
                            <Link
                              key={itemIndex}
                              href={item.href}
                              className={`block py-2 px-3 rounded-md text-sm transition-colors duration-200 ${
                                pathname === item.href
                                  ? "text-[#775522] font-medium bg-[#F6F1EB]"
                                  : "text-gray-600 hover:text-[#775522] hover:bg-gray-100"
                              }`}
                              onClick={closeMobileMenu}
                            >
                              {item.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <Link
                href="/about"
                className={`block py-3 px-4 rounded-md text-gray-700 font-medium transition-colors duration-200 ${
                  pathname === "/about"
                    ? "bg-[#F6F1EB] text-[#775522]"
                    : "hover:bg-gray-100"
                }`}
                onClick={closeMobileMenu}
              >
                About
              </Link>

              <Link
                href="/contact"
                className={`block py-3 px-4 rounded-md text-gray-700 font-medium transition-colors duration-200 ${
                  pathname === "/contact"
                    ? "bg-[#F6F1EB] text-[#775522]"
                    : "hover:bg-gray-100"
                }`}
                onClick={closeMobileMenu}
              >
                Contact
              </Link>

              <Link
                href="/dashboard/sell"
                className="block py-3 px-4 mt-4 bg-[#775522] text-white rounded-md text-center font-medium hover:bg-[#5E441B] transition-colors duration-200"
                onClick={closeMobileMenu}
              >
                Start Selling
              </Link>
            </div>

            {/* User section */}
            <div className="mt-8 pt-4 border-t border-gray-200">
              {!isLoggedIn ? (
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      router.push("/login");
                      closeMobileMenu();
                    }}
                    className="w-full py-3 px-4 bg-[#775522] text-white rounded-md font-medium hover:bg-[#5E441B] transition-colors duration-200"
                  >
                    Log In
                  </button>
                  <button
                    onClick={() => {
                      router.push("/register");
                      closeMobileMenu();
                    }}
                    className="w-full py-3 px-4 border border-[#775522] text-[#775522] rounded-md font-medium hover:bg-[#F6F1EB] transition-colors duration-200"
                  >
                    Create Account
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <p className="px-4 py-2 text-sm text-gray-500">
                    Your Account
                  </p>
                  {profileMenuItems.slice(0, 4).map((item, index) => {
                    const IconComponent = item.icon;
                    return (
                      <Link
                        key={index}
                        href={item.href}
                        className="flex items-center gap-3 py-2 px-4 text-gray-700 rounded-md hover:bg-gray-100 transition-colors duration-200"
                        onClick={closeMobileMenu}
                      >
                        {IconComponent && (
                          <IconComponent className="text-gray-500" />
                        )}
                        <span className="text-sm">{item.name}</span>
                      </Link>
                    );
                  })}
                  <button
                    onClick={handleLogout}
                    className="flex items-center gap-3 w-full text-left py-2 px-4 text-red-600 rounded-md hover:bg-red-50 transition-colors duration-200 mt-4"
                  >
                    <FaSignOutAlt />
                    <span className="text-sm">Logout</span>
                  </button>
                </div>
              )}
            </div>

            {/* Social Media Links */}
            <div className="mt-auto pt-8">
              <p className="px-4 text-sm text-gray-500 mb-3">Follow us</p>
              <div className="flex justify-center space-x-6">
                <a
                  href="https://wa.me/yourwhatsappnumber"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-[#25D366] hover:opacity-80 transition-opacity duration-200"
                  aria-label="WhatsApp"
                >
                  <FaWhatsapp />
                </a>
                <a
                  href="https://www.instagram.com/yourinstagram"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-[#C13584] hover:opacity-80 transition-opacity duration-200"
                  aria-label="Instagram"
                >
                  <FaInstagram />
                </a>
                <a
                  href="https://x.com/yourtwitter"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-black hover:opacity-80 transition-opacity duration-200"
                  aria-label="X (Twitter)"
                >
                  <FaTwitter />
                </a>
                <a
                  href="https://www.facebook.com/yourfacebook"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-2xl text-[#1877F2] hover:opacity-80 transition-opacity duration-200"
                  aria-label="Facebook"
                >
                  <FaFacebook />
                </a>
              </div>
            </div>
          </nav>
        </div>
      </div>
    </>
  );
}
