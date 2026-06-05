"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  SlidersHorizontal,
  Heart,
  ShoppingBag,
  BadgeCheck,
  ChevronDown,
  ArrowUpDown,
  Check,
  Grid3x3,
  LayoutGrid,
  Sparkles,
  ArrowRight,
  Sofa,
  BedDouble,
  UtensilsCrossed,
  Briefcase,
  ChefHat,
  TreePine,
  Lamp,
  ImageIcon,
  Package,
  Loader2,
} from "lucide-react";
import { products, formatNaira, type Product } from "@/lib/data";

const CATEGORIES = [
  { id: "all", label: "All Pieces", icon: Sparkles },
  { id: "Living Room", label: "Living Room", icon: Sofa },
  { id: "Bedroom", label: "Bedroom", icon: BedDouble },
  { id: "Dining", label: "Dining", icon: UtensilsCrossed },
  { id: "Office", label: "Office", icon: Briefcase },
  { id: "Kitchen", label: "Kitchen", icon: ChefHat },
  { id: "Outdoor", label: "Outdoor", icon: TreePine },
  { id: "Lighting", label: "Lighting", icon: Lamp },
  { id: "Decor", label: "Decor", icon: ImageIcon },
];

const SORT_OPTIONS = [
  { id: "newest", label: "Newest first" },
  { id: "price-low", label: "Price: Low to High" },
  { id: "price-high", label: "Price: High to Low" },
  { id: "name-az", label: "Name: A to Z" },
];

const CONDITIONS = ["Brand New", "Like New", "Excellent", "Very Good", "Good", "Fair"];
const STYLES = [
  "Afro-minimal",
  "Japandi",
  "Modern luxury",
  "Cozy neutral",
  "Contemporary African",
  "Scandinavian warm",
];
const MATERIALS = ["Wood", "Metal", "Fabric", "Leather", "Glass", "Rattan", "Stone"];
const LOCATIONS = ["Lekki", "Ikoyi", "Yaba", "Surulere", "Ikeja", "Ajah", "Lagos Island"];

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

export default function ShopPage() {
  const [searchOpen, setSearchOpen] = useState(false);
  const [filterOpen, setFilterOpen] = useState(false);
  const [sortOpen, setSortOpen] = useState(false);
  // Default to comfortable (large cards) — this is now the default everywhere
  const [viewMode, setViewMode] = useState<"grid" | "comfortable">("comfortable");

  const [category, setCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [sort, setSort] = useState("newest");
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 500000]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
  const [selectedMaterials, setSelectedMaterials] = useState<string[]>([]);
  const [selectedLocations, setSelectedLocations] = useState<string[]>([]);

  const [cart, setCart] = useState<number[]>([]);
  const [saved, setSaved] = useState<number[]>([]);
  const [addedToast, setAddedToast] = useState<string | null>(null);

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    try {
      const s = localStorage.getItem("refurnish_saved");
      const c = localStorage.getItem("refurnish_cart");
      if (s) setSaved(JSON.parse(s));
      if (c) setCart(JSON.parse(c));
    } catch {}
  }, []);

  useEffect(() => {
    if (searchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [searchOpen]);

  useEffect(() => {
    if (!addedToast) return;
    const t = setTimeout(() => setAddedToast(null), 2200);
    return () => clearTimeout(t);
  }, [addedToast]);

  const filteredProducts = useMemo(() => {
    let list = [...products];

    if (category !== "all") {
      list = list.filter(
        (p) => p.room?.toLowerCase() === category.toLowerCase()
      );
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      list = list.filter(
        (p) =>
          p.title.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.style?.toLowerCase().includes(q) ||
          p.material?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }

    list = list.filter(
      (p) => p.price >= priceRange[0] && p.price <= priceRange[1]
    );

    if (selectedConditions.length > 0) {
      list = list.filter((p) => selectedConditions.includes(p.condition));
    }

    if (selectedStyles.length > 0) {
      list = list.filter((p) => selectedStyles.includes(p.style));
    }

    if (selectedMaterials.length > 0) {
      list = list.filter((p) =>
        selectedMaterials.some((m) =>
          p.material?.toLowerCase().includes(m.toLowerCase())
        )
      );
    }

    if (selectedLocations.length > 0) {
      list = list.filter((p) =>
        selectedLocations.some((loc) =>
          p.location?.toLowerCase().includes(loc.toLowerCase())
        )
      );
    }

    switch (sort) {
      case "price-low":
        list.sort((a, b) => a.price - b.price);
        break;
      case "price-high":
        list.sort((a, b) => b.price - a.price);
        break;
      case "name-az":
        list.sort((a, b) => a.title.localeCompare(b.title));
        break;
      default:
        break;
    }

    return list;
  }, [category, searchQuery, sort, priceRange, selectedConditions, selectedStyles, selectedMaterials, selectedLocations]);

  const activeFilterCount =
    selectedConditions.length +
    selectedStyles.length +
    selectedMaterials.length +
    selectedLocations.length +
    (priceRange[0] > 0 || priceRange[1] < 500000 ? 1 : 0);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(searchInput);
    setSearchOpen(false);
  };

  const toggleSaved = (id: number) => {
    setSaved((prev) => {
      const next = prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id];
      localStorage.setItem("refurnish_saved", JSON.stringify(next));
      return next;
    });
  };

  const addToCart = (product: Product) => {
    setCart((prev) => {
      if (prev.includes(product.id)) {
        setAddedToast(`Already in cart`);
        return prev;
      }
      const next = [...prev, product.id];
      localStorage.setItem("refurnish_cart", JSON.stringify(next));
      setAddedToast(`Added "${product.title.slice(0, 28)}${product.title.length > 28 ? "…" : ""}" to cart`);
      return next;
    });
  };

  const resetFilters = () => {
    setSelectedConditions([]);
    setSelectedStyles([]);
    setSelectedMaterials([]);
    setSelectedLocations([]);
    setPriceRange([0, 500000]);
  };

  const toggleArrayValue = (arr: string[], setter: (v: string[]) => void, val: string) => {
    setter(arr.includes(val) ? arr.filter((x) => x !== val) : [...arr, val]);
  };

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased pt-28 sm:pt-36 lg:pt-40">
      {/* ============ HEADER ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-6">
        <div className="flex items-end justify-between gap-6 mb-8">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
              The Shop
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mt-1 leading-tight">
              A space for every story.
            </h1>
          </div>

          <div className="hidden sm:flex items-center gap-2">
            <Link
              href="/saved"
              className="relative p-2.5 rounded-full bg-white border border-[#211000]/8 hover:border-[#B66B44]/30 transition-colors"
            >
              <Heart className="size-4 text-[#211000]" />
              {saved.length > 0 && (
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#B66B44] text-white text-[9px] font-bold flex items-center justify-center">
                  {saved.length}
                </span>
              )}
            </Link>
            <Link
              href="/cart"
              className="relative p-2.5 rounded-full bg-white border border-[#211000]/8 hover:border-[#B66B44]/30 transition-colors"
            >
              <ShoppingBag className="size-4 text-[#211000]" />
              {cart.length > 0 && (
                <span className="absolute -top-1 -right-1 size-4 rounded-full bg-[#B66B44] text-white text-[9px] font-bold flex items-center justify-center">
                  {cart.length}
                </span>
              )}
            </Link>
          </div>
        </div>

        {/* ============ CATEGORY NAV ============ */}
        <div className="relative">
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4 sm:mx-0 sm:px-0">
            {CATEGORIES.map((cat) => {
              const Icon = cat.icon;
              const isActive = category === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setCategory(cat.id)}
                  className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all duration-200 border ${
                    isActive
                      ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                      : "bg-white text-[#211000]/70 border-[#211000]/10 hover:border-[#211000]/30"
                  }`}
                >
                  <Icon className="size-3.5" />
                  <span>{cat.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ============ TOOLBAR ============ */}
      <section className="sticky top-16 sm:top-20 z-30 bg-[#FAF4EC]/85 backdrop-blur-xl border-y border-[#211000]/8">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setSearchOpen(true)}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#211000]/10 hover:border-[#B66B44]/30 transition-colors group"
            >
              <Search className="size-4 text-[#211000]/60 group-hover:text-[#B66B44] transition-colors" />
              <span className="text-xs font-bold text-[#211000]/60 hidden sm:inline">Search</span>
            </button>

            <button
              onClick={() => setFilterOpen(true)}
              className="relative inline-flex items-center gap-2 px-4 py-2.5 rounded-full bg-white border border-[#211000]/10 hover:border-[#B66B44]/30 transition-colors"
            >
              <SlidersHorizontal className="size-4 text-[#211000]/60" />
              <span className="text-xs font-bold text-[#211000]/60 hidden sm:inline">Filter</span>
              {activeFilterCount > 0 && (
                <span className="size-4 rounded-full bg-[#B66B44] text-white text-[9px] font-bold flex items-center justify-center">
                  {activeFilterCount}
                </span>
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <p className="text-[11px] font-bold text-[#211000]/40 hidden md:inline">
              {filteredProducts.length} {filteredProducts.length === 1 ? "piece" : "pieces"}
            </p>

            <div className="relative">
              <button
                onClick={() => setSortOpen(!sortOpen)}
                className="inline-flex items-center gap-1.5 px-3 py-2 rounded-full bg-white border border-[#211000]/10 hover:border-[#B66B44]/30 text-xs font-bold transition-colors"
              >
                <ArrowUpDown className="size-3.5 text-[#211000]/60" />
                <span className="hidden sm:inline">
                  {SORT_OPTIONS.find((s) => s.id === sort)?.label}
                </span>
                <ChevronDown className={`size-3 transition-transform ${sortOpen ? "rotate-180" : ""}`} />
              </button>

              <AnimatePresence>
                {sortOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setSortOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -8 }}
                      transition={{ duration: 0.15 }}
                      className="absolute right-0 top-full mt-2 w-52 rounded-2xl bg-white border border-[#211000]/8 shadow-lg overflow-hidden z-20"
                    >
                      {SORT_OPTIONS.map((opt) => (
                        <button
                          key={opt.id}
                          onClick={() => {
                            setSort(opt.id);
                            setSortOpen(false);
                          }}
                          className={`w-full flex items-center justify-between gap-2 px-4 py-2.5 text-xs font-bold text-left hover:bg-[#E8CEB0]/30 transition-colors ${
                            sort === opt.id ? "text-[#B66B44]" : "text-[#211000]/70"
                          }`}
                        >
                          {opt.label}
                          {sort === opt.id && <Check className="size-3.5" />}
                        </button>
                      ))}
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* View toggle — only shows on larger screens */}
            <div className="hidden lg:flex items-center gap-1 p-1 rounded-full bg-white border border-[#211000]/10">
              <button
                onClick={() => setViewMode("grid")}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === "grid" ? "bg-[#211000] text-[#E8CEB0]" : "text-[#211000]/40 hover:text-[#211000]"
                }`}
                aria-label="Compact grid"
              >
                <Grid3x3 className="size-3.5" />
              </button>
              <button
                onClick={() => setViewMode("comfortable")}
                className={`p-1.5 rounded-full transition-colors ${
                  viewMode === "comfortable" ? "bg-[#211000] text-[#E8CEB0]" : "text-[#211000]/40 hover:text-[#211000]"
                }`}
                aria-label="Comfortable grid"
              >
                <LayoutGrid className="size-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Active filter chips */}
        {(activeFilterCount > 0 || searchQuery) && (
          <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pb-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            {searchQuery && (
              <FilterChip
                label={`"${searchQuery}"`}
                onRemove={() => setSearchQuery("")}
              />
            )}
            {selectedConditions.map((c) => (
              <FilterChip
                key={c}
                label={c}
                onRemove={() => setSelectedConditions(selectedConditions.filter((x) => x !== c))}
              />
            ))}
            {selectedStyles.map((s) => (
              <FilterChip
                key={s}
                label={s}
                onRemove={() => setSelectedStyles(selectedStyles.filter((x) => x !== s))}
              />
            ))}
            {selectedMaterials.map((m) => (
              <FilterChip
                key={m}
                label={m}
                onRemove={() => setSelectedMaterials(selectedMaterials.filter((x) => x !== m))}
              />
            ))}
            {selectedLocations.map((l) => (
              <FilterChip
                key={l}
                label={l}
                onRemove={() => setSelectedLocations(selectedLocations.filter((x) => x !== l))}
              />
            ))}
            {(activeFilterCount > 0 || searchQuery) && (
              <button
                onClick={() => {
                  resetFilters();
                  setSearchQuery("");
                }}
                className="shrink-0 text-[11px] font-bold text-[#B66B44] hover:underline whitespace-nowrap"
              >
                Clear all
              </button>
            )}
          </div>
        )}
      </section>

      {/* ============ PRODUCT GRID ============ */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 py-8 pb-24">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-24 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#E8CEB0]/40 flex items-center justify-center mx-auto mb-5">
              <Package className="size-7 text-[#B66B44]" />
            </div>
            <h3 className="font-serif text-2xl font-medium mb-2">
              No pieces match your search
            </h3>
            <p className="text-sm text-[#211000]/55 font-medium mb-6">
              Try adjusting your filters or browse a different category.
            </p>
            <button
              onClick={() => {
                resetFilters();
                setSearchQuery("");
                setCategory("all");
              }}
              className="inline-flex items-center gap-2 bg-[#B66B44] hover:bg-[#a05934] text-white font-bold text-xs px-5 py-3 rounded-full transition-colors"
            >
              Reset everything
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className={`grid gap-x-4 gap-y-10 sm:gap-x-6 sm:gap-y-14 ${
              viewMode === "grid"
                ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                : "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3"
            }`}
          >
            <AnimatePresence mode="popLayout">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  isSaved={saved.includes(product.id)}
                  isInCart={cart.includes(product.id)}
                  onToggleSaved={() => toggleSaved(product.id)}
                  onAddToCart={() => addToCart(product)}
                />
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </section>

      {/* ============ SEARCH OVERLAY ============ */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[60] bg-white/95 backdrop-blur-md"
          >
            <motion.div
              initial={{ y: -30, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -30, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeOut" }}
              className="w-full"
            >
              <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-16 pt-8 flex justify-end">
                <button
                  onClick={() => setSearchOpen(false)}
                  className="p-2.5 rounded-full hover:bg-[#211000]/5 transition-colors"
                >
                  <X className="size-5 text-[#211000]/70" />
                </button>
              </div>

              <form
                onSubmit={handleSearchSubmit}
                className="max-w-3xl mx-auto px-4 sm:px-8 pt-12 sm:pt-20"
              >
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44] mb-3">
                  Search Refurnish
                </p>
                <div className="relative">
                  <Search className="absolute left-0 top-1/2 -translate-y-1/2 size-6 text-[#211000]/40" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    placeholder="What are you looking for?"
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    className="w-full bg-transparent border-0 border-b-2 border-[#211000]/15 focus:border-[#B66B44] pl-9 pr-12 py-4 text-2xl sm:text-3xl font-serif text-[#211000] placeholder:text-[#211000]/25 focus:outline-none transition-colors"
                  />
                  {searchInput && (
                    <button
                      type="button"
                      onClick={() => setSearchInput("")}
                      className="absolute right-0 top-1/2 -translate-y-1/2 p-2 text-[#211000]/40 hover:text-[#211000] transition-colors"
                    >
                      <X className="size-5" />
                    </button>
                  )}
                </div>
                <p className="text-xs text-[#211000]/40 font-medium mt-3">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-[#E8CEB0]/40 text-[10px] font-bold">Enter</kbd> to search
                </p>

                <div className="mt-12">
                  <p className="text-[11px] font-bold uppercase tracking-widest text-[#211000]/40 mb-4">
                    Popular searches
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {["Rattan chair", "Oak dining table", "Linen sofa", "Japandi", "Walnut", "Vintage"].map(
                      (term) => (
                        <button
                          key={term}
                          type="button"
                          onClick={() => {
                            setSearchInput(term);
                            setSearchQuery(term);
                            setSearchOpen(false);
                          }}
                          className="px-4 py-2 rounded-full bg-[#E8CEB0]/30 hover:bg-[#E8CEB0]/60 border border-[#E8CEB0] text-xs font-bold transition-colors"
                        >
                          {term}
                        </button>
                      )
                    )}
                  </div>
                </div>

                {searchInput.trim().length > 1 && (
                  <div className="mt-10">
                    <p className="text-[11px] font-bold uppercase tracking-widest text-[#211000]/40 mb-4">
                      Quick matches
                    </p>
                    <div className="space-y-2">
                      {products
                        .filter((p) =>
                          p.title.toLowerCase().includes(searchInput.toLowerCase()) ||
                          p.brand.toLowerCase().includes(searchInput.toLowerCase())
                        )
                        .slice(0, 4)
                        .map((p) => (
                          <Link
                            key={p.id}
                            href={`/product/${p.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-center gap-4 p-3 rounded-xl hover:bg-[#E8CEB0]/30 transition-colors group"
                          >
                            <div className="w-14 h-14 rounded-lg overflow-hidden bg-[#E8CEB0]/30 shrink-0">
                              <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/50">
                                {p.brand}
                              </p>
                              <h4 className="font-serif text-base truncate">{p.title}</h4>
                            </div>
                            <span className="text-sm font-bold shrink-0">{formatNaira(p.price)}</span>
                            <ArrowRight className="size-4 text-[#211000]/30 group-hover:text-[#B66B44] transition-colors" />
                          </Link>
                        ))}
                    </div>
                  </div>
                )}
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============ FILTER DRAWER ============ */}
      <AnimatePresence>
        {filterOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setFilterOpen(false)}
              className="fixed inset-0 z-50 bg-[#211000]/40 backdrop-blur-sm"
            />
            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 32 }}
              className="fixed top-0 right-0 z-50 h-full w-full sm:w-[420px] bg-[#FAF4EC] shadow-2xl flex flex-col"
            >
              <div className="flex items-center justify-between p-6 border-b border-[#211000]/8">
                <div>
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
                    Refine
                  </p>
                  <h3 className="font-serif text-2xl font-medium mt-0.5">Filters</h3>
                </div>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="p-2 rounded-full hover:bg-[#211000]/5 transition-colors"
                >
                  <X className="size-5" />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto px-6 py-5 space-y-8">
                <FilterSection title="Price Range">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold">
                      <span>{formatNaira(priceRange[0])}</span>
                      <span>{formatNaira(priceRange[1])}</span>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={500000}
                      step={5000}
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value)])}
                      className="w-full accent-[#B66B44]"
                    />
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/50">
                          Min
                        </label>
                        <input
                          type="number"
                          value={priceRange[0]}
                          onChange={(e) => setPriceRange([Number(e.target.value) || 0, priceRange[1]])}
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-white border border-[#211000]/10 text-xs font-bold focus:outline-none focus:border-[#B66B44]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/50">
                          Max
                        </label>
                        <input
                          type="number"
                          value={priceRange[1]}
                          onChange={(e) => setPriceRange([priceRange[0], Number(e.target.value) || 500000])}
                          className="w-full mt-1 px-3 py-2 rounded-lg bg-white border border-[#211000]/10 text-xs font-bold focus:outline-none focus:border-[#B66B44]"
                        />
                      </div>
                    </div>
                  </div>
                </FilterSection>

                <FilterSection title="Condition">
                  <div className="space-y-2">
                    {CONDITIONS.map((c) => (
                      <CheckboxRow
                        key={c}
                        label={c}
                        checked={selectedConditions.includes(c)}
                        onChange={() => toggleArrayValue(selectedConditions, setSelectedConditions, c)}
                      />
                    ))}
                  </div>
                </FilterSection>

                <FilterSection title="Style">
                  <div className="flex flex-wrap gap-2">
                    {STYLES.map((s) => {
                      const isActive = selectedStyles.includes(s);
                      return (
                        <button
                          key={s}
                          onClick={() => toggleArrayValue(selectedStyles, setSelectedStyles, s)}
                          className={`px-3 py-2 rounded-full text-xs font-bold border transition-all ${
                            isActive
                              ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                              : "bg-white text-[#211000]/70 border-[#211000]/10 hover:border-[#211000]/30"
                          }`}
                        >
                          {s}
                        </button>
                      );
                    })}
                  </div>
                </FilterSection>

                <FilterSection title="Material">
                  <div className="flex flex-wrap gap-2">
                    {MATERIALS.map((m) => {
                      const isActive = selectedMaterials.includes(m);
                      return (
                        <button
                          key={m}
                          onClick={() => toggleArrayValue(selectedMaterials, setSelectedMaterials, m)}
                          className={`px-3 py-2 rounded-full text-xs font-bold border transition-all ${
                            isActive
                              ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                              : "bg-white text-[#211000]/70 border-[#211000]/10 hover:border-[#211000]/30"
                          }`}
                        >
                          {m}
                        </button>
                      );
                    })}
                  </div>
                </FilterSection>

                <FilterSection title="Pickup Location">
                  <div className="space-y-2">
                    {LOCATIONS.map((l) => (
                      <CheckboxRow
                        key={l}
                        label={l}
                        checked={selectedLocations.includes(l)}
                        onChange={() => toggleArrayValue(selectedLocations, setSelectedLocations, l)}
                      />
                    ))}
                  </div>
                </FilterSection>
              </div>

              <div className="border-t border-[#211000]/8 p-5 flex gap-3 bg-[#FAF4EC]">
                <button
                  onClick={resetFilters}
                  className="flex-1 py-3 rounded-full border border-[#211000]/15 bg-white hover:bg-[#E8CEB0]/20 text-xs font-bold transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={() => setFilterOpen(false)}
                  className="flex-[2] py-3 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white text-xs font-bold transition-colors shadow-md shadow-[#B66B44]/15"
                >
                  Show {filteredProducts.length} {filteredProducts.length === 1 ? "result" : "results"}
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ============ TOAST ============ */}
      <AnimatePresence>
        {addedToast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className="fixed bottom-6 left-1/2 z-50 inline-flex items-center gap-2.5 bg-[#211000] text-[#FAF4EC] px-5 py-3 rounded-full shadow-2xl"
          >
            <Check className="size-4 text-[#5F7161]" />
            <span className="text-xs font-bold">{addedToast}</span>
            <Link
              href="/cart"
              className="text-xs font-bold text-[#E8CEB0] hover:underline ml-2"
            >
              View cart →
            </Link>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}

/* =========================================
   PRODUCT CARD
   ========================================= */
function ProductCard({
  product,
  isSaved,
  isInCart,
  onToggleSaved,
  onAddToCart,
}: {
  product: Product;
  isSaved: boolean;
  isInCart: boolean;
  onToggleSaved: () => void;
  onAddToCart: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      className="group flex flex-col"
    >
      <Link href={`/product/${product.slug}`} className="block">
        {/* Tall image — big on mobile, still generous on desktop */}
        <div className="relative aspect-[3/4] w-full overflow-hidden rounded-2xl bg-white border border-[#211000]/5 shadow-sm">
          <img
            src={product.images[0]}
            alt={product.title}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              onToggleSaved();
            }}
            aria-label="Save"
            className="absolute top-3 right-3 size-9 rounded-full bg-white/90 backdrop-blur grid place-items-center text-[#211000]/60 hover:text-red-500 transition-colors shadow-sm"
          >
            <Heart className={`size-4 ${isSaved ? "fill-red-500 text-red-500" : ""}`} />
          </button>

          <span className="absolute bottom-3 left-3 bg-[#E8CEB0] text-[#211000] text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
            {product.condition}
          </span>

          <button
            onClick={(e) => {
              e.preventDefault();
              onAddToCart();
            }}
            className={`absolute bottom-3 right-3 size-9 rounded-full grid place-items-center shadow-sm transition-all duration-200 ${
              isInCart
                ? "bg-[#5F7161] text-white"
                : "bg-[#B66B44] text-white opacity-0 group-hover:opacity-100"
            }`}
            style={{
              opacity: isInCart ? 1 : undefined,
            }}
            aria-label="Add to cart"
          >
            {isInCart ? <Check className="size-4" /> : <ShoppingBag className="size-4" />}
          </button>
        </div>

        <div className="mt-3 flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#211000]/50 uppercase mb-0.5 truncate">
              {product.brand}
            </p>
            <h3 className="font-serif text-sm sm:text-base font-medium text-[#211000] tracking-tight leading-tight truncate">
              {product.title}
            </h3>
            <p className="text-[11px] text-[#211000]/45 font-medium mt-1 flex items-center gap-1">
              <BadgeCheck className="size-3 text-[#5F7161]" />
              <span className="truncate">{product.location}</span>
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-xs sm:text-sm font-bold text-[#211000]">
              {formatNaira(product.price)}
            </p>
            {product.originalPrice && (
              <p className="text-[10px] text-[#211000]/40 line-through font-medium">
                {formatNaira(product.originalPrice)}
              </p>
            )}
          </div>
        </div>
      </Link>

      {/* Mobile-only quick add button */}
      <button
        onClick={onAddToCart}
        className={`sm:hidden mt-2.5 w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-full text-xs font-bold transition-colors ${
          isInCart
            ? "bg-[#5F7161] text-white"
            : "bg-[#211000] text-[#E8CEB0] hover:bg-[#211000]/90"
        }`}
      >
        {isInCart ? (
          <>
            <Check className="size-3" /> In cart
          </>
        ) : (
          <>
            <ShoppingBag className="size-3" /> Quick add
          </>
        )}
      </button>
    </motion.div>
  );
}

/* =========================================
   HELPER COMPONENTS
   ========================================= */
function FilterSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[11px] font-bold uppercase tracking-[0.2em] text-[#211000]/60 mb-3">
        {title}
      </h4>
      {children}
    </div>
  );
}

function CheckboxRow({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      onClick={onChange}
      className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-white/60 transition-colors text-left"
    >
      <div
        className={`size-4 rounded border-2 flex items-center justify-center transition-all ${
          checked ? "bg-[#B66B44] border-[#B66B44]" : "bg-white border-[#211000]/20"
        }`}
      >
        {checked && <Check className="size-2.5 text-white" strokeWidth={3} />}
      </div>
      <span className="text-xs font-bold text-[#211000]">{label}</span>
    </button>
  );
}

function FilterChip({ label, onRemove }: { label: string; onRemove: () => void }) {
  return (
    <motion.span
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="shrink-0 inline-flex items-center gap-1.5 bg-[#211000] text-[#E8CEB0] px-2.5 py-1 rounded-full text-[11px] font-bold"
    >
      {label}
      <button onClick={onRemove} className="hover:text-white transition-colors">
        <X className="size-3" />
      </button>
    </motion.span>
  );
}