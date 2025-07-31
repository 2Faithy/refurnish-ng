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
  FaPlusCircle
} from "react-icons/fa";

export default function Navbar() {
  const router = useRouter();
  const [mobileDashboardAccordionOpen, setMobileDashboardAccordionOpen] = useState(false);
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
    if (prevPathnameRef.current !== null && prevPathnameRef.current !== pathname) {
      setSearchOverlayOpen(false);
      setMobileMenuOpen(false);
      setShopDropdownOpen(false);
      setProfileDropdownOpen(false);
      setMobileShopAccordionOpen(false);
      setMobileDashboardAccordionOpen(false);
    }
    prevPathnameRef.current = pathname;

    // Clear any pending timeouts
    [shopLeaveTimeoutRef, profileLeaveTimeoutRef].forEach(timeoutRef => {
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
      if (shopDropdownRef.current && !shopDropdownRef.current.contains(target)) {
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
    }
  });

  const shopHandlers = createMouseHandlers(setShopDropdownOpen, shopLeaveTimeoutRef);
  const profileHandlers = createMouseHandlers(setProfileDropdownOpen, profileLeaveTimeoutRef);

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
    router.push('/login')
  };

  const shopCategories = [
    {
      title: "Collections",
      items: [
        { name: "Shop", href: "/shop" },
        { name: "Kids fashion", href: "/shop/kids-fashion" },
        { name: "Popular products", href: "/shop/popular" },
        { name: "Women fashion", href: "/shop/women-fashion" },
        { name: "Dresses", href: "/shop/dresses" },
        { name: "Jackets", href: "/shop/jackets" },
        { name: "Classic", href: "/shop/classic" },
        { name: "On sale", href: "/shop/on-sale" },
      ],
    },
    {
      title: "Accessories",
      items: [
        { name: "Dresses", href: "/shop/accessories/dresses" },
        { name: "Pants", href: "/shop/accessories/pants" },
        { name: "Tops", href: "/shop/accessories/tops" },
        { name: "Jackets", href: "/shop/accessories/jackets" },
        { name: "Skirts", href: "/shop/accessories/skirts" },
        { name: "Bottoms", href: "/shop/accessories/bottoms" },
        { name: "Shop all", href: "/shop/accessories" },
      ],
    },
    {
      title: "On Sale",
      items: [
        { name: "Sweaters", href: "/shop/on-sale/sweaters" },
        { name: "Jackets", href: "/shop/on-sale/jackets" },
        { name: "Underwear", href: "/shop/on-sale/underwear" },
        { name: "Short sleeve", href: "/shop/on-sale/short-sleeve" },
        { name: "Sleeveless", href: "/shop/on-sale/sleeveless" },
        { name: "Maxi dresses", href: "/shop/on-sale/maxi-dresses" },
        { name: "All products", href: "/shop/on-sale/all-products" },
      ],
    },
    {
      title: "New Arrivals",
      items: [
        { name: "All Bottoms", href: "/shop/new-arrivals/bottoms" },
        { name: "Shorts", href: "/shop/new-arrivals/shorts" },
        { name: "Blazer", href: "/shop/new-arrivals/blazer" },
        { name: "Dresses & Skirts", href: "/shop/new-arrivals/dresses-skirts" },
        { name: "Footwear", href: "/shop/new-arrivals/footwear" },
        { name: "Sale", href: "/shop/new-arrivals/sale" },
        { name: "Glasses", href: "/shop/new-arrivals/glasses" },
      ],
    },
  ];

  // Profile dropdown items based on the AptDeco design
  const profileMenuItems = [
    { name: "Create an account", href: "/register", icon: FaUserPlus, color: "text-orange-500" },
    { name: "Saved items", href: "/saved-items", icon: FaBookmark },
    { name: "Saved searches", href: "/saved-searches", icon: FaSearch },
    { name: "Messages", href: "/messages", icon: FaEnvelope },
    { name: "Listings", href: "/my-listings", icon: FaClipboardList },
    { name: "Purchases", href: "/purchases", icon: FaShoppingCart, color: "text-orange-500" },
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
      <header className="w-full bg-[#ECDFCC] shadow-md fixed top-0 left-0 z-50 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4 relative">
          {/* Mobile: Hamburger Menu (Left) */}
          <div className="md:hidden flex-shrink-0">
            <button
              onClick={() => {
                setMobileMenuOpen(!mobileMenuOpen);
              }}
              className="text-3xl text-[#775522] hover:scale-110 transition-transform duration-200 p-1"
              aria-label="Toggle mobile menu"
              aria-expanded={mobileMenuOpen}
              aria-haspopup="true"
            >
              <div className="flex flex-col items-end space-y-1">
                <span className="block h-0.5 bg-[#775522] w-7"></span>
                <span className="block h-0.5 bg-[#775522] w-5"></span>
                <span className="block h-0.5 bg-[#775522] w-3"></span>
              </div>
            </button>
          </div>

          {/* Logo */}
          <Link href="/" className="flex-grow flex justify-start md:justify-center order-2 md:order-none ml-4 md:ml-0">
            <img
              src="/logo.png"
              alt="ReFurnish NG Logo"
              className="h-12 w-auto object-contain hover:scale-105 transition-transform duration-200"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8 lg:space-x-12 flex-grow justify-center">
            <Link
              href="/"
              className={`text-lg font-medium ${
                pathname === "/" ? "text-[#775522]" : "text-gray-700"
              } hover:text-[#775522] transition-colors duration-200`}
            >
              Home
            </Link>

            {/* Shop Dropdown */}
            <div
              className="relative"
              {...shopHandlers}
              ref={shopDropdownRef}
            >
              <button
                className={`text-lg font-medium flex items-center gap-1 ${
                  pathname.startsWith("/shop") ? "text-[#775522]" : "text-gray-700"
                } hover:text-[#775522] transition-colors duration-200`}
                aria-expanded={shopDropdownOpen}
                aria-haspopup="menu"
              >
                Shop
                <svg
                  className={`w-3 h-3 ml-1 transition-transform duration-200 ${
                    shopDropdownOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              {shopDropdownOpen && (
                <div className="fixed left-0 right-0 top-16 w-full bg-white border-t border-b border-gray-100 shadow-xl overflow-hidden z-40 animate-fade-in-scale grid grid-cols-5 gap-6 p-6 pt-8 pb-8">
                  {shopCategories.map((category, index) => (
                    <div key={index} className="flex flex-col space-y-2">
                      <h3 className="font-semibold text-gray-900 mb-2">{category.title}</h3>
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
                  {/* Sale Section */}
                  <div className="col-span-1 flex flex-col items-center justify-center p-4 bg-pink-100 rounded-lg">
                    <img
                      src="/hero-bg-modal-mobile.png"
                      alt="Up to 75% sale"
                      className="w-full h-auto object-cover rounded-md mb-3"
                    />
                    <p className="text-center text-xl font-bold text-pink-700">Up to 75% sale</p>
                    <p className="text-center text-sm text-pink-600">Hurry up!</p>
                  </div>
                </div>
              )}
            </div>

            {/* Start Selling Button */}
            <Link
              href="/dashboard/sell"
              className="bg-[#775522] text-white px-4 py-2 rounded-full font-medium text-sm hover:bg-[#5E441B] transition-colors duration-200"
            >
              Start Selling
            </Link>
          </nav>

          {/* Right Side Icons (Mobile) */}
          <div className="md:hidden flex items-center space-x-3 flex-shrink-0 order-3">
            {/* Cart Icon */}
            <Link
              href="/cart"
              className="text-2xl text-gray-600 hover:text-[#775522] hover:scale-110 transition-transform duration-200"
              aria-label="View shopping cart"
            >
              <FaShoppingCart />
            </Link>

            {/* Wishlist Icon */}
            <Link
              href="/wishlist"
              className="text-2xl text-gray-600 hover:text-[#775522] hover:scale-110 transition-transform duration-200"
              aria-label="Wishlist"
            >
              <FaHeart />
            </Link>

            {/* User Profile */}
            <div className="relative" ref={profileDropdownRef}>
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="text-2xl text-gray-600 hover:text-[#775522] hover:scale-110 transition-transform duration-200"
                aria-label="User Profile"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="menu"
              >
                <FaUserCircle />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-gradient-to-br from-[#F5EBDC] to-white border-2 border-[#D4B896] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-scale">
                  {!isLoggedIn && (
                    <div className="p-4 bg-gradient-to-r from-[#775522] to-[#8B6635] text-white text-center">
                      <button
                        onClick={() => {
                          router.push('/login');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full bg-white text-[#775522] px-4 py-3 rounded-lg font-bold hover:bg-[#F5EBDC] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        LOG IN TO ACCOUNT <span className="text-lg">→</span>
                      </button>
                      <Link
                        href="/register"
                        className="block w-full text-center mt-3 text-[#F5EBDC] hover:text-white transition-colors duration-200 underline text-sm"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Create an account →
                      </Link>
                    </div>
                  )}
                  <div className="py-2">
                    {profileMenuItems.map((item, index) => {
                      if (item.name === "Create an account" && !isLoggedIn) return null;
                      if (item.name === "Create an account" && isLoggedIn) return null;
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={index}
                          href={item.href}
                          className={`flex items-center gap-3 px-5 py-3 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-[#F5EBDC] hover:to-[#E8D5C4] border-l-4 border-transparent hover:border-[#775522] group ${
                            item.color || "text-gray-700 hover:text-[#775522]"
                          }`}
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          {IconComponent && <IconComponent className="text-lg group-hover:scale-110 transition-transform duration-200" />}
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                  {isLoggedIn && (
                    <>
                      <div className="border-t-2 border-[#D4B896] mx-4"></div>
                      <div className="p-2">
                        <Link
                          href="/sell-item"
                          className="flex items-center gap-3 px-5 py-3 text-sm bg-gradient-to-r from-[#775522] to-[#8B6635] text-white rounded-lg mx-2 mb-2 hover:from-[#8B6635] hover:to-[#775522] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <FaPlusCircle className="text-lg" />
                          <span className="font-bold">Ready to start selling?</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
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
          </div>

          {/* Right Side Icons (Desktop) */}
          <div className="hidden md:flex items-center space-x-4 lg:space-x-6 flex-shrink-0">
            {/* Search Icon */}
            <button
              onClick={() => {
                setSearchOverlayOpen(!searchOverlayOpen);
                setProfileDropdownOpen(false);
              }}
              className="text-2xl text-gray-600 hover:text-[#775522] hover:scale-110 transition-transform duration-200"
              aria-label="Toggle search bar"
              aria-expanded={searchOverlayOpen}
              aria-controls="search-overlay"
            >
              <FaSearch />
            </button>

            {/* Cart Icon */}
            <Link
              href="/cart"
              className="relative text-2xl text-gray-600 hover:text-[#775522] hover:scale-110 transition-transform duration-200"
              aria-label="View shopping cart"
            >
              <FaShoppingCart />
            </Link>

            {/* User Profile Dropdown (Desktop) */}
            <div
              className="relative"
              {...profileHandlers}
              ref={profileDropdownRef}
            >
              <button
                onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                className="text-2xl text-gray-600 hover:text-[#775522] hover:scale-110 transition-transform duration-200"
                aria-label="User Profile"
                aria-expanded={profileDropdownOpen}
                aria-haspopup="menu"
              >
                <FaUserCircle />
              </button>
              {profileDropdownOpen && (
                <div className="absolute right-0 mt-4 w-72 bg-gradient-to-br from-[#F5EBDC] to-white border-2 border-[#D4B896] rounded-xl shadow-2xl overflow-hidden z-50 animate-fade-in-scale">
                  {!isLoggedIn && (
                    <div className="p-4 bg-gradient-to-r from-[#775522] to-[#8B6635] text-white text-center">
                      <button
                        onClick={() => {
                          router.push('/login');
                          setProfileDropdownOpen(false);
                        }}
                        className="w-full bg-white text-[#775522] px-4 py-3 rounded-lg font-bold hover:bg-[#F5EBDC] transition-all duration-200 flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                      >
                        LOG IN TO ACCOUNT <span className="text-lg">→</span>
                      </button>
                      <Link
                        href="/register"
                        className="block w-full text-center mt-3 text-[#F5EBDC] hover:text-white transition-colors duration-200 underline text-sm"
                        onClick={() => setProfileDropdownOpen(false)}
                      >
                        Create an account →
                      </Link>
                    </div>
                  )}
                  <div className="py-2">
                    {profileMenuItems.map((item, index) => {
                      if (item.name === "Create an account" && !isLoggedIn) return null;
                      if (item.name === "Create an account" && isLoggedIn) return null;
                      const IconComponent = item.icon;
                      return (
                        <Link
                          key={index}
                          href={item.href}
                          className={`flex items-center gap-3 px-5 py-3 text-sm transition-all duration-200 hover:bg-gradient-to-r hover:from-[#F5EBDC] hover:to-[#E8D5C4] border-l-4 border-transparent hover:border-[#775522] group ${
                            item.color || "text-gray-700 hover:text-[#775522]"
                          }`}
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          {IconComponent && <IconComponent className="text-lg group-hover:scale-110 transition-transform duration-200" />}
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                  {isLoggedIn && (
                    <>
                      <div className="border-t-2 border-[#D4B896] mx-4"></div>
                      <div className="p-2">
                        <Link
                          href="/sell-item"
                          className="flex items-center gap-3 px-5 py-3 text-sm bg-gradient-to-r from-[#775522] to-[#8B6635] text-white rounded-lg mx-2 mb-2 hover:from-[#8B6635] hover:to-[#775522] transition-all duration-200 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                          onClick={() => setProfileDropdownOpen(false)}
                        >
                          <FaPlusCircle className="text-lg" />
                          <span className="font-bold">Ready to start selling?</span>
                        </Link>
                        <button
                          onClick={handleLogout}
                          className="flex items-center gap-3 w-full text-left px-5 py-3 text-sm text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 rounded-lg mx-2"
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

            {/* Wishlist Icon (Desktop Only) */}
            <Link
              href="/wishlist"
              className="text-2xl text-gray-600 hover:text-[#775522] hover:scale-110 transition-transform duration-200"
              aria-label="Wishlist"
            >
              <FaHeart />
            </Link>
          </div>
        </div>

        {/* Desktop Search Bar */}
        <div
          ref={searchOverlayRef}
          id="search-overlay"
          className={`hidden md:block w-full bg-white transition-all duration-300 ease-in-out overflow-hidden ${
            searchOverlayOpen
              ? "max-h-screen opacity-100 py-4 border-t border-gray-100 pointer-events-auto"
              : "max-h-0 opacity-0 pointer-events-none"
          }`}
        >
          <div className="max-w-7xl mx-auto px-4">
            <form
              onSubmit={handleSearchSubmit}
              className="w-full flex border-b-2 border-gray-300 focus-within:border-[#775522] transition-colors duration-200"
            >
              <input
                type="text"
                placeholder="Search our store"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-grow py-3 px-2 text-gray-800 placeholder-gray-500 text-xl focus:outline-none bg-transparent"
                aria-label="Search for products"
              />
              <button
                type="submit"
                className="text-gray-600 hover:text-[#775522] text-2xl px-3"
                aria-label="Submit search"
              >
                <FaSearch />
              </button>
              <button
                onClick={() => setSearchOverlayOpen(false)}
                className="text-gray-600 hover:text-red-500 text-2xl px-3"
                aria-label="Close search"
                type="button"
              >
                <FaTimes />
              </button>
            </form>
          </div>
        </div>

        {/* Mobile Search Bar (Below header on small screens) */}
        <div className="md:hidden w-full bg-white border-t border-gray-100 px-4 py-3">
          <form onSubmit={handleSearchSubmit} className="w-full">
            <div className="relative">
              <input
                type="text"
                placeholder="Search our store..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full py-2 px-4 pr-10 border border-gray-300 rounded-full focus:outline-none focus:border-[#775522] text-gray-800 placeholder-gray-500"
                aria-label="Search for products"
              />
              <button
                type="submit"
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-600 hover:text-[#775522]"
                aria-label="Submit search"
              >
                <FaSearch />
              </button>
            </div>
          </form>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 w-full h-full z-[1000] flex flex-col transform transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
        style={{
          backgroundColor: mobileMenuOpen ? "#F5EBDC" : "transparent",
          backdropFilter: mobileMenuOpen ? "blur(10px)" : "none",
          WebkitBackdropFilter: mobileMenuOpen ? "blur(10px)" : "none",
        }}
      >
        {/* Mobile Menu Content */}
        <div
          className={`relative w-3/4 max-w-sm h-full bg-[#F5EBDC] shadow-lg overflow-y-auto transform transition-transform duration-500 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-4 border-b border-[#E5D5C8] sticky top-0 bg-[#F5EBDC] z-10">
            <Link href="/" onClick={closeMobileMenu}>
              <img src="/logo.png" alt="ReFurnish NG Logo" className="h-10 w-auto object-contain" />
            </Link>
            <button
              onClick={closeMobileMenu}
              className="text-[#775522] hover:text-red-500 text-4xl focus:outline-none transition-colors duration-200"
              aria-label="Close Mobile Menu"
            >
              <FaTimes />
            </button>
          </div>

          {/* Mobile Menu Navigation */}
          <nav className="flex flex-col p-4">
            {/* Home Link */}
            <Link
              href="/"
              className={`block text-xl font-semibold py-3 px-4 rounded-lg mb-2 transition-all duration-200 ${
                pathname === "/"
                  ? "bg-[#E5D5C8] text-[#775522]"
                  : "text-gray-700 hover:bg-[#E5D5C8] hover:text-[#775522]"
              }`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            {/* Shop Accordion */}
            <div className="border-b border-[#E5D5C8] mb-2 last:border-b-0">
              <button
                onClick={() => setMobileShopAccordionOpen(!mobileShopAccordionOpen)}
                className={`flex justify-between items-center w-full text-left text-xl font-semibold py-3 px-4 rounded-lg transition-all duration-200 ${
                  mobileShopAccordionOpen || pathname.startsWith("/shop")
                    ? "bg-[#E5D5C8] text-[#775522]"
                    : "text-gray-700 hover:bg-[#E5D5C8] hover:text-[#775522]"
                }`}
                aria-expanded={mobileShopAccordionOpen}
              >
                Shop
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    mobileShopAccordionOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  mobileShopAccordionOpen ? "max-h-screen opacity-100 py-2" : "max-h-0 opacity-0"
                }`}
              >
                {/* Scrollable container for shop categories */}
                <div className="pl-4 pr-4 py-1 bg-[#F5EBDC] max-h-80 overflow-y-auto">
                  <div className="space-y-4">
                    {shopCategories.map((category, catIndex) => (
                      <div key={catIndex} className="mb-4">
                        <h4 className="font-bold text-gray-800 text-lg mb-2 px-2 py-1 bg-[#E5D5C8] rounded-md sticky top-0 z-10">
                          {category.title}
                        </h4>
                        <ul className="list-none space-y-1 pl-2">
                          {category.items.map((item, itemIndex) => (
                            <li key={itemIndex}>
                              <Link
                                href={item.href}
                                className={`block text-md py-2 px-3 rounded-md transition-all duration-200 ${
                                  pathname === item.href
                                    ? "text-[#775522] font-medium bg-[#E8D5C4]"
                                    : "text-gray-600 hover:text-[#775522] hover:bg-[#E8D5C4]"
                                }`}
                                onClick={closeMobileMenu}
                              >
                                {item.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                 
                </div>
              </div>
            </div>

            {/* Start Selling Link */}
            <Link
              href="/dashboard/sell"
              className="block text-xl font-bold py-3 px-4 mt-4 bg-[#775522] text-white rounded-lg text-center hover:bg-[#5E441B] transition-colors duration-200 shadow-md"
              onClick={closeMobileMenu}
            >
              Start Selling
            </Link>

            {/* Social Media Icons (Mobile) */}
            <div className="mt-8 flex justify-center space-x-6">
              <a
                href="https://wa.me/yourwhatsappnumber"
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl text-[#25D366] hover:scale-110 transition-transform duration-200"
                aria-label="WhatsApp"
              >
                <FaWhatsapp />
              </a>
              <a
                href="https://www.instagram.com/yourinstagram"
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl text-[#C13584] hover:scale-110 transition-transform duration-200"
                aria-label="Instagram"
              >
                <FaInstagram />
              </a>
              <a
                href="https://x.com/yourtwitter"
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl text-[#000000] dark:text-black hover:scale-110 transition-transform duration-200"
                aria-label="X (Twitter)"
              >
                <FaTwitter />
              </a>
              <a
                href="https://www.facebook.com/yourfacebook"
                target="_blank"
                rel="noopener noreferrer"
                className="text-4xl text-[#1877F2] hover:scale-110 transition-transform duration-200"
                aria-label="Facebook"
              >
                <FaFacebook />
              </a>
            </div>
          </nav>
        </div>

        {/* Clickable overlay to close menu */}
        {mobileMenuOpen && (
          <div
            className="flex-grow bg-transparent"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        )}
      </div>
    </>
  );
}