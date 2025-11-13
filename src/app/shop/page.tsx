// src/app/shop/page.tsx

'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  FaChevronDown,
  FaChevronUp,
  FaChevronLeft,
  FaChevronRight,
  FaThLarge,
  FaList,
  FaSearch,
  FaSlidersH,
  FaTimes,
  FaHeart,
  FaShoppingCart,
  FaTag,
  FaMapMarkerAlt,
  FaStar,
  FaFilter,
  FaFire,
  FaPaperPlane,
  FaPlus,
} from 'react-icons/fa';
import productsData from '@/data/products.json';

// --- INTERFACES & CONSTANTS ---
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
  rating?: number;
  isFeatured?: boolean;
}

const ITEMS_PER_PAGE = 12;

// Custom Color Palette
const PRIMARY_COLOR = '#775522'; // Rich Brown
const SECONDARY_ACCENT = '#9933BB'; // Vibrant Purple
const ACTION_COLOR = '#66BB44'; // Fresh Green
const BACKGROUND_LIGHT = '#FDFBF7';
const SURFACE_COLOR = '#E8CEB0'; // Warm Beige
const TEXT_COLOR = '#5F7161'; // Muted Green/Slate
const TEXT_DARK = '#2D3748';

// Expanded Static filter options
const mainCategories = ['Living Room', 'Bedroom', 'Dining Room', 'Home Office', 'Kids Furniture', 'Outdoor'];
const conditions = ['Brand New', 'Tokunbo', 'Fairly Used'];
const deliveryOptions = ['Free Shipping', 'Local Pickup Only', 'Seller Delivers'];
const sellerTypes = ['Individual', 'Business'];
const handlingTimes = ['1 Day', '2 Days', '3-5 Days'];
const locations = [
  "Ikeja", "Lekki", "Victoria Island", "Ajah", "Yaba", "Surulere", "Ikoyi", "Maryland"
];
const ratings = [5, 4, 3, 2, 1];

// ADVANCED SEARCH CONSTANTS
const listingTypes = ['Any type', 'Auction', 'Buy now', 'Make an offer', 'Classified'];
const shippingOptions = ['Standard shipping', 'Allows collection', 'Digital delivery', 'Pickup point', 'Free shipping'];
const conditionOptions = ['Any', 'New', 'Secondhand', 'Refurbished'];
const sellerLocations = ['All Locations', 'Lagos Island', 'Lagos Mainland', 'Abuja']; // Mock locations
// --- HELPER COMPONENTS (Color scheme adjusted) ---

interface FilterSectionProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
  children: React.ReactNode;
}

const FilterSection: React.FC<FilterSectionProps> = ({ title, isOpen, onToggle, children }) => (
  <div className={`border border-[${SURFACE_COLOR}] rounded-xl bg-white`}>
    <button
      onClick={onToggle}
      className={`flex justify-between items-center w-full p-4 text-left font-semibold text-[${TEXT_DARK}] hover:text-[${PRIMARY_COLOR}] transition-colors`}
    >
      {title}
      {isOpen ? <FaChevronUp className={`text-[${PRIMARY_COLOR}]`} /> : <FaChevronDown className={`text-[${TEXT_COLOR}]`} />}
    </button>
    {isOpen && <div className="px-4 pb-4">{children}</div>}
  </div>
);

interface FilterCheckboxProps {
  label: React.ReactNode;
  checked: boolean;
  onChange: () => void;
  count?: number;
}

const FilterCheckbox: React.FC<FilterCheckboxProps> = ({ label, checked, onChange, count }) => (
  <label className="flex items-center justify-between group cursor-pointer">
    <div className="flex items-center gap-3">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className={`w-4 h-4 text-[${ACTION_COLOR}] border-[${SURFACE_COLOR}] rounded focus:ring-[${ACTION_COLOR}]`}
      />
      <span className={`text-[${TEXT_COLOR}] group-hover:text-[${PRIMARY_COLOR}] transition-colors`}>{label}</span>
    </div>
    {count !== undefined && (
      <span className={`text-sm text-[${TEXT_COLOR}] bg-[${SURFACE_COLOR}]/50 px-2 py-1 rounded`}>
        {count}
      </span>
    )}
  </label>
);

interface FilterChipProps {
  label: string;
  onRemove: () => void;
}

const FilterChip: React.FC<FilterChipProps> = ({ label, onRemove }) => (
  <div className={`flex items-center gap-2 bg-[${ACTION_COLOR}]/10 text-[${ACTION_COLOR}] px-3 py-1 rounded-full text-sm font-medium`}>
    {label}
    <button onClick={onRemove} className={`hover:text-[${TEXT_DARK}] transition-colors`}>
      <FaTimes className="text-xs" />
    </button>
  </div>
);

// --- PRODUCT CARDS (Omitted for brevity, kept for context) ---
const GridProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => (
  <div className={`group relative flex flex-col h-full bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-300 hover:-translate-y-1 border border-[${SURFACE_COLOR}] overflow-hidden`}>
    <div className="absolute top-3 left-3 z-10 flex gap-2">
      {product.isFeatured && (
        <span className={`bg-[${SECONDARY_ACCENT}] text-white px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1`}>
          <FaFire className="text-xs" /> Featured
        </span>
      )}
      {product.oldPrice && (
        <span className={`bg-[${ACTION_COLOR}] text-white px-2 py-1 rounded-full text-xs font-bold`}>
          -{Math.round((1 - product.price / product.oldPrice) * 100)}%
        </span>
      )}
    </div>
    <button
      onClick={(e) => { e.preventDefault(); console.log('Wishlist:', product.name); }}
      className="absolute top-3 right-3 z-10 p-2 bg-white/90 rounded-full shadow-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-red-500 hover:text-white"
    >
      <FaHeart />
    </button>
    <Link href={`/shop/${product.id}`} className="flex flex-col h-full">
      <div className="relative w-full aspect-square bg-gray-50 overflow-hidden">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          priority={index < 4}
        />
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <div className="mb-3">
          <span className={`text-xs font-medium text-[${SECONDARY_ACCENT}] bg-[${SECONDARY_ACCENT}]/10 px-2 py-1 rounded`}>
            {product.category}
          </span>
        </div>
        <h3 className={`font-semibold text-[${TEXT_DARK}] mb-2 line-clamp-2 group-hover:text-[${PRIMARY_COLOR}] transition-colors`}>
          {product.name}
        </h3>
        <div className="flex items-center gap-1 mb-3">
          {product.rating && (
            <>
              {[...Array(5)].map((_, i) => (
                <FaStar
                  key={i}
                  className={`text-sm ${
                    i < product.rating! ? 'text-yellow-400' : 'text-gray-300'
                  }`}
                />
              ))}
              <span className={`text-xs text-[${TEXT_COLOR}]/70 ml-1`}>({product.rating})</span>
            </>
          )}
        </div>
        <div className={`flex items-center gap-1 text-xs text-[${TEXT_COLOR}] mb-3`}>
          <FaMapMarkerAlt className="text-xs" />
          <span>{product.location}</span>
          <span className="mx-1">•</span>
          <span className={`bg-[${SURFACE_COLOR}]/50 px-2 py-1 rounded text-xs`}>{product.condition}</span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2 border-t border-gray-100">
          <div className="flex items-baseline gap-2">
            <span className={`text-2xl font-bold text-[${PRIMARY_COLOR}]`}>₦{product.price.toLocaleString()}</span>
            {product.oldPrice && (
              <span className={`text-sm text-[${TEXT_COLOR}]/50 line-through`}>
                ₦{product.oldPrice.toLocaleString()}
              </span>
            )}
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              console.log('Add to cart:', product.name);
            }}
            className={`p-2 bg-[${ACTION_COLOR}] text-white rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-green-600`}
          >
            <FaShoppingCart />
          </button>
        </div>
      </div>
    </Link>
  </div>
);

const ListProductCard: React.FC<{ product: Product; index: number }> = ({ product, index }) => (
    <div className={`group bg-white rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-[${SURFACE_COLOR}] overflow-hidden`}>
      <Link href={`/shop/${product.id}`} className="flex flex-col sm:flex-row">
        <div className="relative w-full sm:w-64 h-48 sm:h-auto bg-gray-50 overflow-hidden">
          <Image
            src={product.image}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
          {product.isFeatured && (
            <div className={`absolute top-3 left-3 bg-[${SECONDARY_ACCENT}] text-white px-2 py-1 rounded-full text-xs font-bold`}>
              Featured
            </div>
          )}
        </div>
        <div className="flex-1 p-6">
          <div className="flex flex-col h-full">
            <div className="mb-4">
              <div className="flex items-center gap-3 mb-3">
                <span className={`text-[${SECONDARY_ACCENT}] bg-[${SECONDARY_ACCENT}]/10 px-3 py-1 rounded-full text-sm font-medium`}>
                  {product.category}
                </span>
                <span className={`text-xs text-[${TEXT_COLOR}] bg-[${SURFACE_COLOR}]/50 px-2 py-1 rounded`}>
                  {product.condition}
                </span>
              </div>
              <h3 className={`text-xl font-bold text-[${TEXT_DARK}] mb-3 group-hover:text-[${PRIMARY_COLOR}] transition-colors`}>
                {product.name}
              </h3>
              <div className="flex items-center gap-4 text-sm text-gray-600">
                <span className="flex items-center gap-1">
                  <FaMapMarkerAlt className="text-xs" />
                  {product.location}
                </span>
                {product.rating && (
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-400" />
                    {product.rating}/5
                  </span>
                )}
              </div>
            </div>
            <div className="flex items-center justify-between mt-auto pt-4 border-t border-gray-100">
              <div className="flex items-baseline gap-3">
                <span className={`text-3xl font-bold text-[${PRIMARY_COLOR}]`}>
                  ₦{product.price.toLocaleString()}
                </span>
                {product.oldPrice && (
                  <span className={`text-lg text-[${TEXT_COLOR}]/50 line-through`}>
                    ₦{product.oldPrice.toLocaleString()}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-3">
                  <button
                      onClick={(e) => { e.preventDefault(); console.log('Wishlist:', product.name); }}
                      className={`p-3 border border-[${SURFACE_COLOR}] rounded-xl hover:border-red-500 hover:text-red-500 transition-colors`}
                  >
                      <FaHeart />
                  </button>
                  <button
                      onClick={(e) => { e.preventDefault(); console.log('Add to cart:', product.name); }}
                      className={`flex items-center gap-2 px-6 py-3 bg-[${ACTION_COLOR}] text-white rounded-xl font-semibold hover:bg-green-600 transition-colors`}
                  >
                      <FaShoppingCart /> Add to Cart
                  </button>
              </div>
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
// -----------------------------------------------------------------


// --- NEW COMPONENT: ADVANCED SEARCH MODAL ---
const AdvancedSearchModal: React.FC<{ onClose: () => void }> = ({ onClose }) => {
    // This is a simplified state for demonstration purposes
    const [pageTitle, setPageTitle] = useState('');

    return (
        <div className="fixed inset-0 z-[60] bg-black bg-opacity-50 backdrop-blur-sm flex justify-center items-start pt-10 pb-10 overflow-y-auto">
            <div className={`w-full max-w-4xl bg-[${BACKGROUND_LIGHT}] rounded-xl shadow-2xl p-8 transform transition-all duration-300`}>
                
                {/* Modal Header */}
                <div className="flex justify-between items-center mb-6 border-b pb-4">
                    <h2 className={`text-3xl font-bold text-[${PRIMARY_COLOR}]`}>Advanced Search</h2>
                    <button onClick={onClose} className={`p-2 rounded-full text-[${TEXT_DARK}] hover:bg-[${SURFACE_COLOR}]`}>
                        <FaTimes className="text-2xl" />
                    </button>
                </div>

                {/* --- Section: Advanced Search --- */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
                    <h3 className={`text-xl font-semibold mb-4 text-[${TEXT_DARK}]`}>Words to Find</h3>
                    <div className="flex gap-4 mb-4">
                        <input type="text" placeholder="Words" className={`flex-1 p-3 border border-[${SURFACE_COLOR}] rounded-lg focus:ring-[${ACTION_COLOR}]`} />
                        <input type="text" placeholder="Exclude" className={`flex-1 p-3 border border-[${SURFACE_COLOR}] rounded-lg focus:ring-[${ACTION_COLOR}]`} />
                    </div>
                    <div className={`space-y-2 text-[${TEXT_COLOR}]`}>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className={`text-[${ACTION_COLOR}] rounded`} />
                            All of these keywords
                        </label>
                        <label className="flex items-center gap-2">
                            <input type="checkbox" defaultChecked className={`text-[${ACTION_COLOR}] rounded`} />
                            Search the title only
                        </label>
                    </div>
                </div>

                {/* --- Section: Refine --- */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
                    <h3 className={`text-xl font-semibold mb-4 text-[${TEXT_DARK}]`}>Refine</h3>

                    {/* Listing Type */}
                    <div className="mb-4">
                        <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Listing type</p>
                        <div className="flex flex-wrap gap-4">
                            {listingTypes.map(type => (
                                <label key={type} className={`flex items-center gap-2 text-[${TEXT_COLOR}]`}>
                                    <input type="radio" name="listing-type" defaultChecked={type === 'Any type'} className={`text-[${ACTION_COLOR}]`} />
                                    {type}
                                </label>
                            ))}
                        </div>
                    </div>
                    
                    {/* Item Location & Shipping */}
                    <div className="flex flex-col md:flex-row gap-6 mb-4">
                        <div className="md:w-1/2">
                            <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Item location</p>
                            <div className={`flex gap-4 text-[${TEXT_COLOR}]`}>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className={`text-[${ACTION_COLOR}] rounded`} />
                                    Nigeria
                                </label>
                                <label className="flex items-center gap-2">
                                    <input type="checkbox" className={`text-[${ACTION_COLOR}] rounded`} />
                                    International
                                </label>
                            </div>
                        </div>
                        <div className="md:w-1/2">
                            <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Condition</p>
                            <div className="flex flex-wrap gap-4">
                                {conditionOptions.map(cond => (
                                    <label key={cond} className={`flex items-center gap-2 text-[${TEXT_COLOR}]`}>
                                        <input type="radio" name="condition-type" defaultChecked={cond === 'Any'} className={`text-[${ACTION_COLOR}]`} />
                                        {cond}
                                    </label>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Shipping */}
                    <div className="mb-4">
                        <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Shipping</p>
                        <div className="flex flex-wrap gap-4">
                            {shippingOptions.map(option => (
                                <label key={option} className={`flex items-center gap-2 text-[${TEXT_COLOR}]`}>
                                    <input type="checkbox" className={`text-[${ACTION_COLOR}] rounded`} />
                                    {option}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Category & Price */}
                    <div className="flex flex-col sm:flex-row gap-6">
                        <div className="flex-1">
                            <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Category</p>
                            <div className="flex gap-2">
                                <select className={`flex-1 p-3 border border-[${SURFACE_COLOR}] rounded-lg focus:ring-[${ACTION_COLOR}]`}>
                                    <option>All categories</option>
                                    {mainCategories.map(cat => <option key={cat}>{cat}</option>)}
                                </select>
                                <button className={`px-4 py-3 bg-[${ACTION_COLOR}] text-white rounded-lg hover:bg-green-600`}>Include</button>
                                <button className={`px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600`}>Exclude</button>
                            </div>
                        </div>
                        <div className="w-full sm:w-48">
                            <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Price</p>
                            <div className="flex gap-2">
                                <input type="number" placeholder="Min" className={`w-1/2 p-3 border border-[${SURFACE_COLOR}] rounded-lg`} />
                                <input type="number" placeholder="Max" className={`w-1/2 p-3 border border-[${SURFACE_COLOR}] rounded-lg`} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* --- Section: Sellers --- */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
                    <h3 className={`text-xl font-semibold mb-4 text-[${TEXT_DARK}]`}>Sellers</h3>
                    
                    {/* Type & Location */}
                    <div className="flex flex-col sm:flex-row gap-6 mb-4">
                        <div className="sm:w-1/2">
                            <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Type</p>
                            <div className="flex gap-4">
                                <label className={`flex items-center gap-2 text-[${TEXT_COLOR}]`}>
                                    <input type="checkbox" className={`text-[${ACTION_COLOR}] rounded`} />
                                    Stores
                                </label>
                                <label className={`flex items-center gap-2 text-[${TEXT_COLOR}]`}>
                                    <input type="checkbox" className={`text-[${ACTION_COLOR}] rounded`} />
                                    Verified
                                </label>
                            </div>
                        </div>
                        <div className="sm:w-1/2">
                            <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Location</p>
                            <select className={`w-full p-3 border border-[${SURFACE_COLOR}] rounded-lg focus:ring-[${ACTION_COLOR}]`}>
                                {sellerLocations.map(loc => <option key={loc}>{loc}</option>)}
                            </select>
                        </div>
                    </div>

                    {/* Include / Exclude Seller */}
                    <div className="mb-4">
                        <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Include / exclude</p>
                        <div className="flex gap-2 items-center">
                            <input type="text" placeholder="Seller name" className={`flex-1 p-3 border border-[${SURFACE_COLOR}] rounded-lg focus:ring-[${ACTION_COLOR}]`} />
                            <button className={`px-4 py-3 bg-[${ACTION_COLOR}] text-white rounded-lg hover:bg-green-600 flex items-center gap-1`}><FaPlus /> Include</button>
                            <button className={`px-4 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 flex items-center gap-1`}><FaTimes /> Exclude</button>
                        </div>
                    </div>
                </div>

                {/* --- Section: Results --- */}
                <div className="bg-white p-6 rounded-xl shadow-md mb-6 border border-gray-200">
                    <h3 className={`text-xl font-semibold mb-4 text-[${TEXT_DARK}]`}>Results</h3>

                    {/* Page Title */}
                    <div className="mb-4">
                        <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Page title</p>
                        <input 
                            type="text" 
                            value={pageTitle}
                            onChange={(e) => setPageTitle(e.target.value)}
                            className={`w-full p-3 border border-[${SURFACE_COLOR}] rounded-lg focus:ring-[${ACTION_COLOR}]`} 
                        />
                    </div>
                    
                    {/* Sort by */}
                    <div className="mb-4">
                        <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Sort by</p>
                        <div className="flex flex-wrap gap-4">
                            {['Default', 'Lowest price', 'Highest price', 'Ending soon', "What's new", 'Hot selling'].map(sort => (
                                <label key={sort} className={`flex items-center gap-2 text-[${TEXT_COLOR}]`}>
                                    <input type="radio" name="sort-by" defaultChecked={sort === 'Default'} className={`text-[${ACTION_COLOR}]`} />
                                    {sort}
                                </label>
                            ))}
                        </div>
                    </div>

                    {/* Layout & Hide */}
                    <div className="flex gap-8">
                        <div>
                            <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Layout</p>
                            <div className="flex gap-4">
                                <label className={`flex items-center gap-2 text-[${TEXT_COLOR}]`}>
                                    <input type="radio" name="layout" defaultChecked className={`text-[${ACTION_COLOR}]`} /> List
                                </label>
                                <label className={`flex items-center gap-2 text-[${TEXT_COLOR}]`}>
                                    <input type="radio" name="layout" className={`text-[${ACTION_COLOR}]`} /> Grid
                                </label>
                            </div>
                        </div>
                        <div>
                            <p className={`font-medium mb-2 text-[${TEXT_DARK}]`}>Hide</p>
                            <label className={`flex items-center gap-2 text-[${TEXT_COLOR}]`}>
                                <input type="checkbox" className={`text-[${ACTION_COLOR}] rounded`} /> Search URL
                            </label>
                        </div>
                    </div>
                </div>

                {/* --- Action Buttons --- */}
                <div className="flex justify-end gap-4 pt-4 border-t">
                    <button className={`px-6 py-3 border border-gray-300 rounded-xl text-[${TEXT_DARK}] hover:bg-gray-100`}>Reset</button>
                    <button className={`px-6 py-3 bg-[${SECONDARY_ACCENT}] text-white rounded-xl hover:bg-purple-700`}>Generate links</button>
                    <button className={`px-6 py-3 bg-[${ACTION_COLOR}] text-white rounded-xl hover:bg-green-600 flex items-center gap-2`} onClick={onClose}><FaSearch /> Search</button>
                </div>

            </div>
        </div>
    );
};

// --- MAIN COMPONENT: SHOP PAGE ---
export default function ShopPage() {
  // --- STATE ---
  const [sortBy, setSortBy] = useState<'date' | 'name' | 'price' | 'rating'>('date');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // FILTER STATES
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const [selectedDelivery, setSelectedDelivery] = useState<string[]>([]); 
  const [selectedSellerType, setSelectedSellerType] = useState<string[]>([]);
  const [selectedHandlingTime, setSelectedHandlingTime] = useState<string[]>([]); 

  const [priceRange, setPriceRange] = useState<[number, number]>([0, 0]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAdvancedSearchOpen, setIsAdvancedSearchOpen] = useState(false); // New State

  // States for collapsible sections
  const [openSections, setOpenSections] = useState({
    searchWithin: true,
    newSecondhand: true,
    categories: true,
    price: true,
    deliveryOptions: false,
    typeOfSeller: false,
    handlingTime: false,
    itemLocation: false,
    sellerLocation: false,
    rating: false,
  });

  // --- DERIVED DATA & HANDLERS (Omitted for brevity, kept for context) ---
  const prices = useMemo(() => productsData.map((p: Product) => p.price), []);
  const minPrice = useMemo(() => prices.length > 0 ? Math.floor(Math.min(...prices) / 1000) * 1000 : 0, [prices]);
  const maxPrice = useMemo(() => prices.length > 0 ? Math.ceil(Math.max(...prices) / 1000) * 1000 : 1000000, [prices]);

  useEffect(() => {
    setPriceRange([minPrice, maxPrice]);
  }, [minPrice, maxPrice]);

  const toggleSection = (section: keyof typeof openSections) => {
    setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const toggleFilter = (
    value: string | number,
    selectedState: any[],
    setSelectedState: React.Dispatch<React.SetStateAction<any[]>>
  ) => {
    setSelectedState(prev =>
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    );
    setCurrentPage(1);
  };

  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>, type: 'min' | 'max') => {
    const value = Number(e.target.value);
    setPriceRange(prev => {
      let newMin = type === 'min' ? value : prev[0];
      let newMax = type === 'max' ? value : prev[1];

      newMin = Math.max(minPrice, newMin);
      newMax = Math.min(maxPrice, newMax);
      if (newMin > newMax) {
        if (type === 'min') newMax = newMin;
        else newMin = newMax;
      }
      setCurrentPage(1);
      return [newMin, newMax];
    });
  };


  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedLocations([]);
    setSelectedConditions([]);
    setSelectedRatings([]);
    setSelectedDelivery([]);
    setSelectedSellerType([]);
    setSelectedHandlingTime([]);
    setPriceRange([minPrice, maxPrice]);
    setCurrentPage(1);
  };

  // Filtering/Sorting and Pagination logic remain the same
  const filteredAndSortedProducts = useMemo(() => {
    return productsData
      .filter((p: Product) => {
        const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCategory = selectedCategories.length ? selectedCategories.includes(p.category) : true;
        const matchesLocation = selectedLocations.length ? selectedLocations.includes(p.location) : true;
        const matchesCondition = selectedConditions.length ? selectedConditions.includes(p.condition) : true;
        const matchesRating = selectedRatings.length ? (p.rating && selectedRatings.includes(p.rating)) : true;
        const matchesPrice = p.price >= priceRange[0] && p.price <= priceRange[1];

        return matchesSearch && matchesCategory && matchesLocation && matchesCondition && matchesRating && matchesPrice;
      })
      .sort((a: Product, b: Product) => {
        switch (sortBy) {
          case 'name':
            return a.name.localeCompare(b.name);
          case 'price':
            return a.price - b.price;
          case 'rating':
            return (b.rating || 0) - (a.rating || 0);
          case 'date':
          default:
            return new Date(b.date).getTime() - new Date(a.date).getTime();
        }
      });
  }, [searchQuery, selectedCategories, selectedLocations, selectedConditions, selectedRatings, priceRange, sortBy]);

  const { totalPages, currentItems } = useMemo(() => {
    const totalPages = Math.ceil(filteredAndSortedProducts.length / ITEMS_PER_PAGE);
    const currentItems = filteredAndSortedProducts.slice(
      (currentPage - 1) * ITEMS_PER_PAGE,
      currentPage * ITEMS_PER_PAGE
    );
    return { totalPages, currentItems };
  }, [filteredAndSortedProducts, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(totalPages);
    }
  }, [totalPages, currentPage]);
  // --- END DERIVED DATA & HANDLERS ---

  // --- RENDER START ---
  return (
    <div className={`min-h-screen bg-[${BACKGROUND_LIGHT}] pt-20`}>

      {/* -------------------- ADVANCED SEARCH MODAL -------------------- */}
      {isAdvancedSearchOpen && (
        <AdvancedSearchModal onClose={() => setIsAdvancedSearchOpen(false)} />
      )}
      {/* --------------------------------------------------------------- */}

      {/* PROMOTIONAL BANNER */}
      <div className={`bg-[${PRIMARY_COLOR}] text-white py-12 mb-8 shadow-inner`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="md:w-1/3">
            <Image
              src="/images/promo-banner-furniture.jpg" 
              alt="Get 10% off your first purchase"
              width={250}
              height={150}
              className="rounded-xl object-cover h-full w-full hidden md:block"
              style={{ objectFit: 'cover' }}
            />
          </div>
          <div className="text-center md:text-left md:w-2/3">
            <h2 className="text-3xl sm:text-4xl font-extrabold mb-2">
              Get <span className={`text-[${ACTION_COLOR}]`}>10% Off</span> Your First Purchase!
            </h2>
            <p className={`text-lg font-medium mb-4 text-[${SURFACE_COLOR}]`}>
              Sign up for the latest updates, exclusive products, and special offers.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto md:mx-0">
              <input
                type="email"
                placeholder="Enter email address"
                className={`flex-1 px-4 py-3 rounded-xl border-2 border-white/50 text-gray-900 focus:outline-none focus:ring-2 focus:ring-[${ACTION_COLOR}]`}
              />
              <button
                className={`flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-[${ACTION_COLOR}] text-white font-semibold hover:bg-green-600 transition-colors shadow-lg`}
              >
                Subscribe <FaPaperPlane />
              </button>
            </div>
          </div>
        </div>
      </div>


      {/* Main Content Area */}
      <button
        className={`md:hidden fixed top-24 right-6 z-50 p-3 bg-[${PRIMARY_COLOR}] text-white rounded-full shadow-lg`}
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <FaFilter />
      </button>

      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-12">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* -------------------- SIDEBAR FILTERS -------------------- */}
          <div
            className={`lg:w-80 flex-shrink-0 ${
              isSidebarOpen
                ? `fixed inset-y-0 left-0 z-50 w-80 bg-white p-6 overflow-y-auto shadow-2xl`
                : 'hidden lg:block'
            }`}
          >
            <div className="space-y-4">
              {/* Header and Clear button */}
              <div className="flex items-center justify-between">
                <h2 className={`text-2xl font-bold text-[${PRIMARY_COLOR}]`}>Filters</h2>
                <button
                  onClick={clearFilters}
                  className={`text-sm text-[${SECONDARY_ACCENT}] hover:text-[${PRIMARY_COLOR}] font-medium`}
                >
                  Clear All
                </button>
              </div>

              {/* Search Within Results */}
              <FilterSection
                title="Search within results"
                isOpen={openSections.searchWithin}
                onToggle={() => toggleSection('searchWithin')}
              >
                 <div className="relative">
                  <FaSearch className={`absolute left-3 top-3 text-[${TEXT_COLOR}]`} />
                  <input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className={`w-full pl-10 pr-4 py-2 border border-[${SURFACE_COLOR}] rounded-lg focus:ring-2 focus:ring-[${ACTION_COLOR}] focus:border-transparent text-[${TEXT_DARK}]`}
                  />
                </div>
              </FilterSection>

              {/* New / Secondhand */}
              <FilterSection
                title="New / Secondhand"
                isOpen={openSections.newSecondhand}
                onToggle={() => toggleSection('newSecondhand')}
              >
                <div className="space-y-2">
                  {conditions.map(condition => (
                    <FilterCheckbox
                      key={condition}
                      label={condition}
                      checked={selectedConditions.includes(condition)}
                      onChange={() => toggleFilter(condition, selectedConditions, setSelectedConditions)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Categories */}
              <FilterSection
                title="Categories"
                isOpen={openSections.categories}
                onToggle={() => toggleSection('categories')}
              >
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {mainCategories.map(category => (
                    <FilterCheckbox
                      key={category}
                      label={category}
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleFilter(category, selectedCategories, setSelectedCategories)}
                      count={productsData.filter(p => p.category.includes(category.split(' ')[0])).length}
                    />
                  ))}
                </div>
              </FilterSection>
              
              {/* Price */}
              <FilterSection
                title="Price"
                isOpen={openSections.price}
                onToggle={() => toggleSection('price')}
              >
                <div className="space-y-4">
                  <div className="flex gap-4">
                    <div className="flex-1">
                      <label className={`block text-sm text-[${TEXT_COLOR}] mb-1`}>Min</label>
                      <input
                        type="number"
                        value={priceRange[0]}
                        onChange={(e) => handlePriceChange(e, 'min')}
                        className={`w-full px-3 py-2 border border-[${SURFACE_COLOR}] rounded-lg text-[${TEXT_DARK}]`}
                        min={minPrice} max={maxPrice}
                      />
                    </div>
                    <div className="flex-1">
                      <label className={`block text-sm text-[${TEXT_COLOR}] mb-1`}>Max</label>
                      <input
                        type="number"
                        value={priceRange[1]}
                        onChange={(e) => handlePriceChange(e, 'max')}
                        className={`w-full px-3 py-2 border border-[${SURFACE_COLOR}] rounded-lg text-[${TEXT_DARK}]`}
                        min={minPrice} max={maxPrice}
                      />
                    </div>
                  </div>
                  <div className={`flex justify-between text-sm font-semibold text-[${PRIMARY_COLOR}]`}>
                    <span>₦{priceRange[0].toLocaleString()}</span>
                    <span>₦{priceRange[1].toLocaleString()}</span>
                  </div>
                </div>
              </FilterSection>

              {/* Delivery Options (Placeholder) */}
              <FilterSection
                title="Delivery options"
                isOpen={openSections.deliveryOptions}
                onToggle={() => toggleSection('deliveryOptions')}
              >
                 <div className="space-y-2">
                  {deliveryOptions.map(option => (
                    <FilterCheckbox
                      key={option}
                      label={option}
                      checked={selectedDelivery.includes(option)}
                      onChange={() => toggleFilter(option, selectedDelivery, setSelectedDelivery)}
                    />
                  ))}
                </div>
              </FilterSection>
              
              {/* Type of seller (Placeholder) */}
              <FilterSection
                title="Type of seller"
                isOpen={openSections.typeOfSeller}
                onToggle={() => toggleSection('typeOfSeller')}
              >
                 <div className="space-y-2">
                  {sellerTypes.map(type => (
                    <FilterCheckbox
                      key={type}
                      label={type}
                      checked={selectedSellerType.includes(type)}
                      onChange={() => toggleFilter(type, selectedSellerType, setSelectedSellerType)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Item location */}
              <FilterSection
                title="Item location"
                isOpen={openSections.itemLocation}
                onToggle={() => toggleSection('itemLocation')}
              >
                <div className="space-y-2 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                  {locations.map(location => (
                    <FilterCheckbox
                      key={location}
                      label={location}
                      checked={selectedLocations.includes(location)}
                      onChange={() => toggleFilter(location, selectedLocations, setSelectedLocations)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Rating */}
              <FilterSection
                title="Rating"
                isOpen={openSections.rating}
                onToggle={() => toggleSection('rating')}
              >
                <div className="space-y-2">
                  {ratings.map(rating => (
                    <FilterCheckbox
                      key={rating}
                      label={
                        <div className="flex items-center gap-2">
                          {[...Array(5)].map((_, i) => (
                            <FaStar
                              key={i}
                              className={`text-sm ${
                                i < rating ? 'text-yellow-400' : 'text-gray-300'
                              }`}
                            />
                          ))}
                          <span className={`text-[${TEXT_COLOR}]`}>& up</span>
                        </div>
                      }
                      checked={selectedRatings.includes(rating)}
                      onChange={() => toggleFilter(rating, selectedRatings, setSelectedRatings)}
                    />
                  ))}
                </div>
              </FilterSection>

              {/* Advanced Search Link - NOW A BUTTON TO OPEN MODAL */}
              <div className={`pt-4 border-t border-[${SURFACE_COLOR}]`}>
                <button 
                  onClick={() => setIsAdvancedSearchOpen(true)}
                  className={`flex items-center justify-center w-full gap-2 px-4 py-3 text-sm font-semibold rounded-xl bg-[${SECONDARY_ACCENT}] text-white hover:bg-purple-700 transition-colors shadow-md`}
                >
                  <FaSlidersH /> Advanced Search
                </button>
              </div>

            </div>
          </div>

          {/* -------------------- MAIN CONTENT -------------------- */}
          <div className="flex-1">
             <div className="mb-8">
              <h1 className={`text-4xl font-bold text-[${TEXT_DARK}] mb-2`}>Our Furniture Collection</h1>
              <p className={`text-[${TEXT_COLOR}] mb-6`}>
                Found **{filteredAndSortedProducts.length}** products matching your criteria.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
                {/* View Controls */}
                <div className="flex items-center gap-4">
                  <div className={`flex bg-white rounded-xl border border-[${SURFACE_COLOR}] p-1`}>
                    <button
                      onClick={() => setViewMode('grid')}
                      className={`p-2 rounded-lg ${
                        viewMode === 'grid' ? `bg-[${ACTION_COLOR}] text-white` : `text-[${TEXT_COLOR}]`
                      }`}
                    >
                      <FaThLarge />
                    </button>
                    <button
                      onClick={() => setViewMode('list')}
                      className={`p-2 rounded-lg ${
                        viewMode === 'list' ? `bg-[${ACTION_COLOR}] text-white` : `text-[${TEXT_COLOR}]`
                      }`}
                    >
                      <FaList />
                    </button>
                  </div>

                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value as any)}
                    className={`border border-[${SURFACE_COLOR}] rounded-xl px-4 py-2 focus:ring-2 focus:ring-[${ACTION_COLOR}] text-[${TEXT_DARK}]`}
                  >
                    <option value="date">Newest First</option>
                    <option value="name">Name A-Z</option>
                    <option value="price">Price Low-High</option>
                    <option value="rating">Highest Rated</option>
                  </select>
                </div>

                {/* Active Filters */}
                <div className="flex flex-wrap gap-2">
                  {[...selectedCategories, ...selectedLocations, ...selectedConditions].map(item => (
                    <FilterChip
                      key={item}
                      label={item}
                      onRemove={() => {
                        if (selectedCategories.includes(item)) toggleFilter(item, selectedCategories, setSelectedCategories);
                        else if (selectedLocations.includes(item)) toggleFilter(item, selectedLocations, setSelectedLocations);
                        else if (selectedConditions.includes(item)) toggleFilter(item, selectedConditions, setSelectedConditions);
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Products Grid */}
            {currentItems.length === 0 ? (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">😔</div>
                <h3 className={`text-xl font-semibold text-[${TEXT_DARK}] mb-2`}>No products found</h3>
                <p className={`text-[${TEXT_COLOR}]`}>Try adjusting your search or filters</p>
              </div>
            ) : (
              <>
                <div
                  className={`grid gap-6 ${
                    viewMode === 'grid'
                      ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
                      : 'grid-cols-1'
                  }`}
                >
                  {currentItems.map((product, index) =>
                    viewMode === 'grid' ? (
                      <GridProductCard key={product.id} product={product} index={index} />
                    ) : (
                      <ListProductCard key={product.id} product={product} index={index} />
                    )
                  )}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                   <div className="flex justify-center items-center gap-4 mt-12">
                   <button
                     disabled={currentPage === 1}
                     onClick={() => setCurrentPage(p => p - 1)}
                     className={`flex items-center gap-2 px-4 py-2 border border-[${SURFACE_COLOR}] rounded-xl disabled:opacity-50 hover:bg-gray-50 text-[${TEXT_DARK}]`}
                   >
                     <FaChevronLeft /> Previous
                   </button>
                   
                   <div className="flex gap-2">
                     {[...Array(totalPages)].map((_, i) => (
                       <button
                         key={i + 1}
                         onClick={() => setCurrentPage(i + 1)}
                         className={`w-10 h-10 rounded-lg ${
                           currentPage === i + 1
                             ? `bg-[${ACTION_COLOR}] text-white`
                             : `border border-[${SURFACE_COLOR}] hover:bg-gray-50 text-[${TEXT_DARK}]`
                         }`}
                       >
                         {i + 1}
                       </button>
                     ))}
                   </div>

                   <button
                     disabled={currentPage === totalPages}
                     onClick={() => setCurrentPage(p => p + 1)}
                     className={`flex items-center gap-2 px-4 py-2 border border-[${SURFACE_COLOR}] rounded-xl disabled:opacity-50 hover:bg-gray-50 text-[${TEXT_DARK}]`}
                   >
                     Next <FaChevronRight />
                   </button>
                 </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}