// src/app/shop/page.tsx
'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaChevronDown,
  FaChevronUp, // Added FaChevronUp for toggling
  FaChevronLeft,
  FaChevronRight,
  FaThLarge,
  FaList,
  FaSearch,
  FaSlidersH,
  FaTimes,
  FaHeart,
  FaShoppingCart,
} from 'react-icons/fa';
import productsData from '@/data/products.json';

interface Product {
  id: number;
  name: string;
  image: string;
  price: number;
  oldPrice?: number;
  category: string;
  location: string;
  condition: string;
  date: string;
}

const ITEMS_PER_PAGE = 12;

// Static filter options (can be fetched from an API in a real app)
const categories = ['Chairs', 'Beds', 'Sofa', 'Kids Furniture', 'Home Deco', 'Office Furniture', 'Tables'];
const locations = ["Ikeja",
  "Lekki",
  "Victoria Island",
  "Ajah",
  "Yaba",
  "Surulere",
  "Ikoyi",
  "Maryland",
  "Ojota",
  "Oshodi",
  "Gbagada",
  "Ikorodu",
  "Festac Town",
  "Agege",
  "Alimosho",
  "Ojuelegba",
  "Badagry",
  "Ojo",
  "Amuwo Odofin",
  "Chevron",
  "Sangotedo",
  "VGC",
  "Epe",
  "Ogudu",
  "Isolo",
  "Apapa",
  "Ilupeju",
  "Iyana Ipaja",
  "Magodo",
  "Mile 2",
  "Ketu",
  "Okokomaiko",
  "Aguda",
  "Egbeda",
  "Bariga",
  "Ajegunle",
  "Ijesha",
  "Oregun",
  "Ayobo",
  "Abule Egba"];
const conditions = ['Brand New', 'Tokunbo', 'Fairly Used'];

export default function ShopPage() {
  // State for filters and pagination
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [activeCategory, setActiveCategory] = useState('');
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [searchQuery, setSearchQuery] = useState('');
  // New state for mobile sidebar visibility
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // States for collapsible sections
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(true);
  const [isLocationsOpen, setIsLocationsOpen] = useState(true);
  const [isConditionsOpen, setIsConditionsOpen] = useState(true);
  const [isPriceOpen, setIsPriceOpen] = useState(true);


  // Calculate min/max price from actual product data
  const prices = productsData.map((p: Product) => p.price);
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000000; // Default max if no products

  // Initialize price range on component mount (or when min/max prices change)
  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]); // Depend on min/max price from data

  // Helper functions for toggling filter selections
  const toggleLocation = (location: string) => {
    setSelectedLocations((prev) =>
      prev.includes(location) ? prev.filter((l) => l !== location) : [...prev, location]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const toggleCondition = (condition: string) => {
    setSelectedConditions((prev) =>
      prev.includes(condition) ? prev.filter((c) => c !== condition) : [...prev, condition]
    );
    setCurrentPage(1); // Reset to first page on filter change
  };

  const handlePriceChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    type: 'min' | 'max'
  ) => {
    const value = Number(e.target.value);
    setPriceRange((prev) => {
      let newMin = type === 'min' ? value : prev[0];
      let newMax = type === 'max' ? value : prev[1];

      // Ensure min is not greater than max, and max is not less than min
      if (newMin > newMax) {
        if (type === 'min') newMax = newMin;
        else newMin = newMax;
      }

      return [newMin, newMax];
    });
    setCurrentPage(1); // Reset to first page on filter change
  };

  // Filter and sort products
  const filteredAndSortedProducts = productsData
    .filter((p: Product) => {
      const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = activeCategory ? p.category === activeCategory : true;
      const matchesLocation = selectedLocations.length ? selectedLocations.includes(p.location) : true;
      const matchesCondition = selectedConditions.length ? selectedConditions.includes(p.condition) : true;
      const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

      return matchesSearch && matchesCategory && matchesLocation && matchesCondition && matchesPrice;
    })
    .sort((a: Product, b: Product) => {
      if (sortBy === 'date') {
        // Sort by date: newest first
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      }
      // Sort by name: A-Z
      return a.name.localeCompare(b.name);
    });

  // Pagination logic
  const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
  const currentItems = filteredAndSortedProducts.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  return (
    <div className="relative top-[60px] flex flex-col md:flex-row min-h-screen bg-white text-[#5F7161]">
      {/* Mobile Sidebar Toggle Button */}
      <button
        className="md:hidden fixed top-100 left-4 z-50 p-3 bg-[#775522] text-white rounded-full shadow-lg transition-all duration-300 hover:scale-110"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        aria-label="Toggle filters"
      >
        {isSidebarOpen ? <FaTimes className="text-xl" /> : <FaSlidersH className="text-xl" />}
      </button>

      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        ></div>
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-5 left-0 h-full w-64 bg-white p-6 md:p-8 border-r border-gray-200 flex-shrink-0 z-50 transform transition-transform duration-300 ease-in-out
          ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          md:relative md:translate-x-0 md:block md:w-64 md:border-b-0 md:border-r animate-fade-in-left
          overflow-y-auto`}
      >
        {/* Close button for mobile sidebar */}
        <button
          className="absolute top-4 right-4 md:hidden text-gray-600 hover:text-[#775522] text-2xl"
          onClick={() => setIsSidebarOpen(false)}
          aria-label="Close filters"
        >
          <FaTimes />
        </button>

        {/* Categories */}
        <div className="mb-8">
          <button
            className="flex justify-between items-center w-full text-xl font-bold text-gray-800 pb-2 border-b mb-6 focus:outline-none"
            onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
          >
            Categories
            {isCategoriesOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isCategoriesOpen && (
            <ul className="space-y-2 animate-accordion-down">
              {categories.map((category) => (
                <li key={category}>
                  <button
                    onClick={() => {
                      setActiveCategory(category);
                      setCurrentPage(1); // Reset page when category changes
                      // setIsSidebarOpen(false); // Consider whether to close sidebar on category select
                    }}
                    className={`w-full text-left py-2 px-3 rounded-md transition-all duration-200
                      ${activeCategory === category
                        ? 'bg-[#E8CEB0] text-[#775522] font-semibold shadow-sm'
                        : 'text-gray-600 hover:bg-gray-100 hover:text-gray-800'
                      }`}
                  >
                    {category}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Location */}
        <div className="mb-8">
          <button
            className="flex justify-between items-center w-full text-xl font-bold text-gray-800 pb-2 border-b mb-6 focus:outline-none"
            onClick={() => setIsLocationsOpen(!isLocationsOpen)}
          >
            Location
            {isLocationsOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isLocationsOpen && (
            <div className="space-y-2 animate-accordion-down">
              {locations.map((location) => (
                <div key={location} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`location-${location}`}
                    checked={selectedLocations.includes(location)}
                    onChange={() => toggleLocation(location)}
                    className="form-checkbox h-4 w-4 text-[#775522] rounded border-gray-300 focus:ring-[#775522] transition-colors duration-200 cursor-pointer"
                  />
                  <label htmlFor={`location-${location}`} className="ml-2 text-gray-700 cursor-pointer">
                    {location}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Condition */}
        <div className="mb-8">
          <button
            className="flex justify-between items-center w-full text-xl font-bold text-gray-800 pb-2 border-b mb-6 focus:outline-none"
            onClick={() => setIsConditionsOpen(!isConditionsOpen)}
          >
            Condition
            {isConditionsOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isConditionsOpen && (
            <div className="space-y-2 animate-accordion-down">
              {conditions.map((condition) => (
                <div key={condition} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`condition-${condition}`}
                    checked={selectedConditions.includes(condition)}
                    onChange={() => toggleCondition(condition)}
                    className="form-checkbox h-4 w-4 text-[#775522] rounded border-gray-300 focus:ring-[#775522] transition-colors duration-200 cursor-pointer"
                  />
                  <label htmlFor={`condition-${condition}`} className="ml-2 text-gray-700 cursor-pointer">
                    {condition}
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Price Filter */}
        <div className="mb-8">
          <button
            className="flex justify-between items-center w-full text-xl font-bold text-gray-800 pb-2 border-b mb-6 focus:outline-none"
            onClick={() => setIsPriceOpen(!isPriceOpen)}
          >
            Price
            {isPriceOpen ? <FaChevronUp /> : <FaChevronDown />}
          </button>
          {isPriceOpen && (
            <div className="animate-accordion-down">
              <div className="relative h-2 bg-gray-200 rounded-full mb-4">
                {/* Filled track for the range */}
                <div
                  className="absolute h-full bg-[#E8CEB0] rounded-full"
                  style={{
                    left: `${((priceRange[0] - minPrice) / (maxPrice - minPrice)) * 100}%`,
                    width: `${((priceRange[1] - priceRange[0]) / (maxPrice - minPrice)) * 100}%`,
                  }}
                ></div>
                {/* Min Price Slider */}
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[0]}
                  onChange={(e) => handlePriceChange(e, 'min')}
                  className="absolute w-full h-full bg-transparent appearance-none pointer-events-auto z-20 slider-thumb-custom"
                />
                {/* Max Price Slider */}
                <input
                  type="range"
                  min={minPrice}
                  max={maxPrice}
                  value={priceRange[1]}
                  onChange={(e) => handlePriceChange(e, 'max')}
                  className="absolute w-full h-full bg-transparent appearance-none pointer-events-auto z-20 slider-thumb-custom"
                />
              </div>
              <p className="text-lg font-medium text-gray-700">
                ₦{priceRange[0].toLocaleString()} - ₦{priceRange[1].toLocaleString()}
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Shop Grid */}
      <main className="flex-1 p-6 md:p-8 lg:p-10 bg-[#FDFBF7]">
        {/* Top Bar: Search, View Mode, Sort By */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 mb-6 pb-4 border-b border-gray-200 animate-fade-in-down">
          <h1 className="text-3xl sm:text-4xl font-bold text-[#775522] drop-shadow-sm">Shop Furniture</h1>

          <div className="flex flex-col sm:flex-row gap-4 items-center w-full sm:w-auto">
            {/* Search Input */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1); // Reset to first page on search
                }}
                className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-[#775522] transition-all duration-200 text-gray-700"
              />
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>

            {/* View Mode Buttons */}
            <div className="flex border border-gray-300 rounded-md overflow-hidden shadow-sm">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-3 transition-all duration-200 ${
                  viewMode === 'grid' ? 'bg-[#775522] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="Grid view"
                title="Grid View"
              >
                <FaThLarge className="text-lg" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-3 transition-all duration-200 ${
                  viewMode === 'list' ? 'bg-[#775522] text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
                aria-label="List view"
                title="List View"
              >
                <FaList className="text-lg" />
              </button>
            </div>

            {/* Sort By Dropdown */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => {
                  setSortBy(e.target.value as 'date' | 'name');
                  setCurrentPage(1); // Reset to first page on sort change
                }}
                className="block appearance-none w-full bg-gray-100 border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded-md leading-tight focus:outline-none focus:bg-white focus:border-[#775522] shadow-sm transition-all duration-200 cursor-pointer"
              >
                <option value="date">Sort by: Newest</option>
                <option value="name">Sort by: Name (A-Z)</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                <FaChevronDown className="text-sm" />
              </div>
            </div>
          </div>
        </div>

        {/* Display "No products found" if filtered list is empty */}
        {currentItems.length === 0 ? (
          <div className="text-center py-20 text-gray-600">
            <p className="text-2xl font-medium mb-4">😔 No products found matching your criteria.</p>
            <p className="text-lg">Try adjusting your filters or search query.</p>
          </div>
        ) : (
          <>
            {/* Products Grid */}
            <div className={`grid gap-8 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
              {currentItems.map((product, index) => (
                <div
                  key={product.id}
                  className={`relative bg-white rounded-lg shadow-lg overflow-hidden transform transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl animate-fade-in-up-staggered ${
                    viewMode === 'list' ? 'flex flex-col sm:flex-row' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {/* Icons: Add to Cart & Wishlist */}
                  <div className="absolute top-3 right-3 flex gap-2 z-10">
                    <button
                      onClick={() => console.log('Add to wishlist:', product.name)}
                      className="p-2 rounded-full bg-white text-gray-600 hover:text-red-500 hover:bg-gray-100 shadow transition"
                      title="Save item"
                    >
                      <FaHeart />
                    </button>
                    <button
                      onClick={() => console.log('Add to cart:', product.name)}
                      className="p-2 rounded-full bg-white text-gray-600 hover:text-green-600 hover:bg-gray-100 shadow transition"
                      title="Add to cart"
                    >
                      <FaShoppingCart />
                    </button>
                  </div>
                  <div className={`${viewMode === 'list' ? 'w-full sm:w-1/3 flex-shrink-0' : 'w-full h-48'} relative`}>
                    <Image
                      src={product.image}
                      alt={product.name}
                      layout="fill"
                      objectFit="cover"
                      className="transition-transform duration-300 hover:scale-110"
                      priority={index < 4} // Prioritize first few images
                    />
                  </div>
                  <div className="p-5 flex flex-col justify-between flex-grow">
                    <h3 className="text-xl font-semibold text-gray-800 mb-2 truncate" title={product.name}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500 mb-1">Category: {product.category}</p>
                    <p className="text-sm text-gray-500 mb-3">Location: {product.location}</p>
                    <p className="text-2xl font-bold text-[#775522] mb-3">
                      ₦{product.price.toLocaleString()}
                      {product.oldPrice && (
                        <span className="text-base line-through text-gray-400 ml-3">
                          ₦{product.oldPrice.toLocaleString()}
                        </span>
                      )}
                    </p>
                    <Link
                      href={`/shop/${product.id}`}
                      className="inline-block w-full text-center bg-[#E8CEB0] text-[#775522] px-6 py-3 rounded-full text-md font-semibold hover:bg-[#775522] hover:text-white transition-colors duration-300 shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                    >
                      View Details
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center items-center gap-4 mt-12 animate-fade-in-up">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
                  className="flex items-center gap-2 px-5 py-3 text-md font-medium border border-gray-300 rounded-full text-gray-700
                             disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 hover:border-[#775522] transition-all duration-300
                             shadow-sm hover:shadow-md"
                >
                  <FaChevronLeft className="text-sm" /> Previous
                </button>

                <span className="text-md font-medium text-gray-700">
                  Page <span className="font-semibold text-[#775522]">{currentPage}</span> of <span className="font-semibold text-[#775522]">{totalPages}</span>
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
                  className="flex items-center gap-2 px-5 py-3 text-md font-medium border border-gray-300 rounded-full text-gray-700
                             disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100 hover:border-[#775522] transition-all duration-300
                             shadow-sm hover:shadow-md"
                >
                  Next <FaChevronRight className="text-sm" />
                </button>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}