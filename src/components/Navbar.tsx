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
  const [pagesDropdownOpen, setPagesDropdownOpen] = useState(false);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileShopAccordionOpen, setMobileShopAccordionOpen] = useState(false);
  const [mobilePagesAccordionOpen, setMobilePagesAccordionOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const searchOverlayRef = useRef<HTMLDivElement>(null);
  const shopDropdownRef = useRef<HTMLDivElement>(null);
  const pagesDropdownRef = useRef<HTMLDivElement>(null);
  const profileDropdownRef = useRef<HTMLDivElement>(null);
  const shopLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pagesLeaveTimeoutRef = useRef<NodeJS.Timeout | null>(null);
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
      setPagesDropdownOpen(false);
      setProfileDropdownOpen(false);
      setMobileShopAccordionOpen(false);
      setMobilePagesAccordionOpen(false);
      setMobileDashboardAccordionOpen(false); // Added missing accordion close
    }
    prevPathnameRef.current = pathname;

    // Clear any pending timeouts
    [shopLeaveTimeoutRef, pagesLeaveTimeoutRef, profileLeaveTimeoutRef].forEach(timeoutRef => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    });

    // Handle body scroll for mobile menu and search overlay
    const handleBodyScroll = () => {
      if (mobileMenuOpen || (searchOverlayOpen && window.innerWidth < 768)) {
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
      
      // Pages dropdown
      if (pagesDropdownRef.current && !pagesDropdownRef.current.contains(target)) {
        setPagesDropdownOpen(false);
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
      // Use Next.js router instead of window.location for better performance
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
  const pagesHandlers = createMouseHandlers(setPagesDropdownOpen, pagesLeaveTimeoutRef);
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

  const pagesLinks = [
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
    { name: "FAQ", href: "/faq" },
    { name: "Blog Posts", href: "/blog" },
    { name: "Privacy Policy", href: "/privacy-policy" },
    { name: "Terms of Service", href: "/terms-of-service" },
  ];

  // Close mobile menu helper
  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
    document.body.style.overflow = "unset";
  };

  return (
    <header className="w-full bg-white shadow-md fixed top-0 left-0 z-50 transition-all duration-300">
      <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center gap-4 relative">
        {/* Mobile: Hamburger Menu (Left) */}
        <div className="md:hidden flex-shrink-0">
          <button
            onClick={() => {
              setMobileMenuOpen(!mobileMenuOpen);
              setSearchOverlayOpen(false);
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
        <Link href="/" className="flex-grow flex justify-center order-2 md:order-none">
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

          {/* Pages Dropdown */}
          <div
            className="relative"
            {...pagesHandlers}
            ref={pagesDropdownRef}
          >
            <button
              className={`text-lg font-medium flex items-center gap-1 ${
                ["/about", "/contact", "/faq", "/blog", "/privacy-policy", "/terms-of-service"].includes(pathname)
                  ? "text-[#775522]"
                  : "text-gray-700"
              } hover:text-[#775522] transition-colors duration-200`}
              aria-expanded={pagesDropdownOpen}
              aria-haspopup="menu"
            >
              Pages
              <svg
                className={`w-3 h-3 ml-1 transition-transform duration-200 ${
                  pagesDropdownOpen ? "rotate-180" : ""
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {pagesDropdownOpen && (
              <div className="absolute left-1/2 -translate-x-1/2 mt-4 w-48 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in-scale">
                {pagesLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    className={`block px-4 py-3 text-sm transition-colors duration-200 ${
                      pathname === link.href
                        ? "text-[#775522] font-semibold bg-[#F7F1E5]"
                        : "text-gray-700 hover:bg-[#F7F1E5]"
                    }`}
                    onClick={() => setPagesDropdownOpen(false)}
                  >
                    {link.name}
                  </Link>
                ))}
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

        {/* Right Side Icons */}
        <div className="flex items-center space-x-4 md:space-x-6 flex-shrink-0 order-3 md:order-none">
          {/* Search Icon */}
          <button
            onClick={() => {
              setSearchOverlayOpen(!searchOverlayOpen);
              setMobileMenuOpen(false);
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

          {/* User Profile Dropdown (Desktop Only) */}
          <div
            className="relative hidden md:block"
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
              <div className="absolute right-0 mt-4 w-64 bg-white border border-gray-100 rounded-lg shadow-lg overflow-hidden z-50 animate-fade-in-scale">
                {isLoggedIn ? (
                  <>
                    <Link
                      href="/dashboard"
                      className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors duration-200 ${
                        pathname === "/dashboard"
                          ? "text-[#775522] font-semibold bg-[#F7F1E5]"
                          : "text-gray-700 hover:bg-[#F7F1E5]"
                      }`}
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <FaChartBar /> Dashboard
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                      href="/"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#F7F1E5] transition-colors duration-200"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <FaHome /> Home
                    </Link>
                    <Link
                      href="/my-orders"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#F7F1E5] transition-colors duration-200"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <FaShoppingCart /> My Orders
                    </Link>
                    <Link
                      href="/messages"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#F7F1E5] transition-colors duration-200"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <FaEnvelope /> Messages
                    </Link>
                    <Link
                      href="/saved-items"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#F7F1E5] transition-colors duration-200"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <FaBookmark /> Saved Items
                    </Link>
                    <Link
                      href="/my-listings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#F7F1E5] transition-colors duration-200"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <FaClipboardList /> My Listings
                    </Link>
                    <Link
                      href="/settings"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-[#F7F1E5] transition-colors duration-200"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <FaCog /> Settings
                    </Link>
                    <div className="border-t border-gray-100 my-1"></div>
                    <Link
                      href="/sell-item"
                      className="flex items-center gap-2 px-4 py-3 text-sm text-gray-700 hover:bg-[#F7F1E5] transition-colors duration-200"
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <FaPlusCircle /> Sell an Item
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center gap-2 w-full text-left px-4 py-3 text-sm text-gray-700 hover:bg-[#F7F1E5] transition-colors duration-200"
                    >
                      <FaSignOutAlt /> Logout
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      href="/login"
                      className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors duration-200 ${
                        pathname === "/login"
                          ? "text-[#775522] font-semibold bg-[#F7F1E5]"
                          : "text-gray-700 hover:bg-[#F7F1E5]"
                      }`}
                      onClick={() => {
                        setProfileDropdownOpen(false);
                        handleLogin();
                      }}
                    >
                      <FaUserCircle /> Login
                    </Link>
                    <Link
                      href="/register"
                      className={`flex items-center gap-2 px-4 py-3 text-sm transition-colors duration-200 ${
                        pathname === "/register"
                          ? "text-[#775522] font-semibold bg-[#F7F1E5]"
                          : "text-gray-700 hover:bg-[#F7F1E5]"
                      }`}
                      onClick={() => setProfileDropdownOpen(false)}
                    >
                      <FaUserPlus /> Register
                    </Link>
                  </>
                )}
              </div>
            )}
          </div>

          {/* Wishlist Icon (Desktop Only) */}
          <Link
            href="/wishlist"
            className="hidden md:block text-2xl text-gray-600 hover:text-[#775522] hover:scale-110 transition-transform duration-200"
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

      {/* Mobile Search Overlay */}
      <div
        className={`md:hidden fixed inset-0 w-full h-full bg-white/70 backdrop-blur-md z-[1001] flex flex-col justify-center items-center transition-opacity duration-300 ${
          searchOverlayOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
      >
        <div className="absolute top-4 right-4">
          <button
            onClick={() => setSearchOverlayOpen(false)}
            className="text-black text-4xl focus:outline-none"
            aria-label="Close Search Overlay"
          >
            <FaTimes />
          </button>
        </div>
        <div className="w-full px-6">
          <form
            onSubmit={handleSearchSubmit}
            className="w-full flex border-b-2 border-gray-300 focus-within:border-[#775522] transition-colors duration-200"
          >
            <input
              type="text"
              placeholder="Search our store..."
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
          </form>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <div
        className={`md:hidden fixed inset-0 w-full h-full z-[1000] flex flex-col transform transition-all duration-500 ease-in-out ${
          mobileMenuOpen ? "translate-x-0 opacity-100" : "-translate-x-full opacity-0"
        }`}
        style={{
          backgroundColor: mobileMenuOpen ? "rgba(255, 255, 255, 0.7)" : "transparent",
          backdropFilter: mobileMenuOpen ? "blur(10px)" : "none",
          WebkitBackdropFilter: mobileMenuOpen ? "blur(10px)" : "none",
        }}
      >
        {/* Mobile Menu Content */}
        <div
          className={`relative w-3/4 max-w-sm h-full bg-white shadow-lg overflow-y-auto transform transition-transform duration-500 ease-in-out ${
            mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
        >
          {/* Mobile Menu Header */}
          <div className="flex justify-between items-center p-4 border-b border-gray-200 sticky top-0 bg-white z-10">
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
                  ? "bg-[#F7F1E5] text-[#775522]"
                  : "text-gray-700 hover:bg-[#F7F1E5] hover:text-[#775522]"
              }`}
              onClick={closeMobileMenu}
            >
              Home
            </Link>

            {/* Shop Accordion */}
            <div className="border-b border-gray-200 mb-2 last:border-b-0">
              <button
                onClick={() => setMobileShopAccordionOpen(!mobileShopAccordionOpen)}
                className={`flex justify-between items-center w-full text-left text-xl font-semibold py-3 px-4 rounded-lg transition-all duration-200 ${
                  mobileShopAccordionOpen || pathname.startsWith("/shop")
                    ? "bg-[#F7F1E5] text-[#775522]"
                    : "text-gray-700 hover:bg-[#F7F1E5] hover:text-[#775522]"
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
                <div className="pl-8 pr-4 py-1 bg-white">
                  {shopCategories.map((category, catIndex) => (
                    <div key={catIndex} className="mb-4">
                      <h4 className="font-bold text-gray-800 text-md mb-2">{category.title}</h4>
                      <ul className="list-none space-y-1">
                        {category.items.map((item, itemIndex) => (
                          <li key={itemIndex}>
                            <Link
                              href={item.href}
                              className={`block text-md py-1 transition-colors duration-200 ${
                                pathname === item.href
                                  ? "text-[#775522] font-medium"
                                  : "text-gray-600 hover:text-[#775522]"
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

            {/* Pages Accordion */}
            <div className="border-b border-gray-200 mb-2 last:border-b-0">
              <button
                onClick={() => setMobilePagesAccordionOpen(!mobilePagesAccordionOpen)}
                className={`flex justify-between items-center w-full text-left text-xl font-semibold py-3 px-4 rounded-lg transition-all duration-200 ${
                  mobilePagesAccordionOpen ||
                  ["/about", "/contact", "/faq", "/blog", "/privacy-policy", "/terms-of-service"].includes(pathname)
                    ? "bg-[#F7F1E5] text-[#775522]"
                    : "text-gray-700 hover:bg-[#F7F1E5] hover:text-[#775522]"
                }`}
                aria-expanded={mobilePagesAccordionOpen}
              >
                Pages
                <svg
                  className={`w-5 h-5 transition-transform duration-300 ${
                    mobilePagesAccordionOpen ? "rotate-180" : ""
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
                  mobilePagesAccordionOpen ? "max-h-screen opacity-100 py-2" : "max-h-0 opacity-0"
                }`}
              >
                <ul className="pl-8 pr-4 py-1 bg-white space-y-1">
                  {pagesLinks.map((link) => (
                    <li key={link.name}>
                      <Link
                        href={link.href}
                        className={`block text-md py-1 transition-colors duration-200 ${
                          pathname === link.href
                            ? "text-[#775522] font-semibold"
                            : "text-gray-700 hover:text-[#775522]"
                        }`}
                        onClick={closeMobileMenu}
                      >
                        {link.name}
                      </Link>
                    </li>
                  ))}
                </ul>
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

            {/* User and Wishlist Icons (Mobile) */}
            <div className="flex flex-col mt-6 px-4 pt-4 border-t border-gray-200">
              {isLoggedIn ? (
                <>
                  {/* Dashboard Accordion for Mobile */}
                  <div className="border-b border-gray-200 mb-2 last:border-b-0">
                    <button
                      onClick={() => setMobileDashboardAccordionOpen(!mobileDashboardAccordionOpen)}
                      className={`flex justify-between items-center w-full text-left text-xl font-semibold py-3 px-0 rounded-lg transition-all duration-200 ${
                        mobileDashboardAccordionOpen || pathname.startsWith("/dashboard")
                          ? "bg-[#F7F1E5] text-[#775522]"
                          : "text-gray-700 hover:bg-[#F7F1E5] hover:text-[#775522]"
                      }`}
                      aria-expanded={mobileDashboardAccordionOpen}
                    >
                      <div className="flex items-center gap-3">
                        <FaChartBar className="text-3xl text-gray-600" /> Dashboard
                      </div>
                      <svg
                        className={`w-5 h-5 transition-transform duration-300 ${
                          mobileDashboardAccordionOpen ? "rotate-180" : ""
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
                        mobileDashboardAccordionOpen ? "max-h-screen opacity-100 py-2" : "max-h-0 opacity-0"
                      }`}
                    >
                      <ul className="pl-8 pr-4 py-1 bg-white space-y-1">
                        <li>
                          <Link
                            href="/"
                            className={`flex items-center gap-2 text-md py-1 transition-colors duration-200 ${
                              pathname === "/" ? "text-[#775522] font-medium" : "text-gray-600 hover:text-[#775522]"
                            }`}
                            onClick={closeMobileMenu}
                          >
                            <FaHome /> Home
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/my-orders"
                            className={`flex items-center gap-2 text-md py-1 transition-colors duration-200 ${
                              pathname === "/my-orders"
                                ? "text-[#775522] font-medium"
                                : "text-gray-600 hover:text-[#775522]"
                            }`}
                            onClick={closeMobileMenu}
                          >
                            <FaShoppingCart /> My Orders
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/messages"
                            className={`flex items-center gap-2 text-md py-1 transition-colors duration-200 ${
                              pathname === "/messages"
                                ? "text-[#775522] font-medium"
                                : "text-gray-600 hover:text-[#775522]"
                            }`}
                            onClick={closeMobileMenu}
                          >
                            <FaEnvelope /> Messages
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/saved-items"
                            className={`flex items-center gap-2 text-md py-1 transition-colors duration-200 ${
                              pathname === "/saved-items"
                                ? "text-[#775522] font-medium"
                                : "text-gray-600 hover:text-[#775522]"
                            }`}
                            onClick={closeMobileMenu}
                          >
                            <FaBookmark /> Saved Items
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/my-listings"
                            className={`flex items-center gap-2 text-md py-1 transition-colors duration-200 ${
                              pathname === "/my-listings"
                                ? "text-[#775522] font-medium"
                                : "text-gray-600 hover:text-[#775522]"
                            }`}
                            onClick={closeMobileMenu}
                          >
                            <FaClipboardList /> My Listings
                          </Link>
                        </li>
                        <li>
                          <Link
                            href="/settings"
                            className={`flex items-center gap-2 text-md py-1 transition-colors duration-200 ${
                              pathname === "/settings"
                                ? "text-[#775522] font-medium"
                                : "text-gray-600 hover:text-[#775522]"
                            }`}
                            onClick={closeMobileMenu}
                          >
                            <FaCog /> Settings
                          </Link>
                        </li>
                      </ul>
                    </div>
                  </div>

                  {/* Logout Button */}
<button
  onClick={() => {
    handleLogout(); // Your logout function
    closeMobileMenu(); // Close menu if applicable
    router.push("/login"); // Redirect to login page
  }}
  className="flex items-center gap-3 text-xl text-gray-600 hover:text-[#775522] transition-colors duration-200 w-full text-left py-3 px-0 rounded-lg"
>
  <FaSignOutAlt className="text-3xl text-[#775522]" />
  Logout
</button>
                </>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="flex items-center gap-3 text-xl text-gray-700 hover:text-[#775522] transition-colors duration-200 py-3 px-0 rounded-lg"
                    onClick={() => {
                      closeMobileMenu();
                      handleLogin();
                    }}
                  >
                    <FaUserCircle className="text-3xl text-gray-600" />
                    Login
                  </Link>
                  <Link
                    href="/register"
                    className="flex items-center gap-3 text-xl text-gray-700 hover:text-[#775522] transition-colors duration-200 py-3 px-0 rounded-lg"
                    onClick={closeMobileMenu}
                  >
                    <FaUserPlus className="text-3xl text-gray-600" />
                    Register
                  </Link>
                </>
              )}
              <Link
                href="/wishlist"
                className="flex items-center gap-3 text-xl text-gray-700 hover:text-[#775522] transition-colors duration-200 py-3 px-0 rounded-lg"
                onClick={closeMobileMenu}
              >
                <FaHeart className="text-3xl text-gray-600" />
                Wishlist
              </Link>
            </div>

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
    </header>
  );
}