"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Heart,
  Package,
  Search,
  ShoppingBag,
  Trash2,
  X,
  Check,
  Sparkles,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

const SAVED_KEY = "refurnish_saved";
const CART_KEY = "refurnish_cart";

const CONDITION_LABELS: Record<string, string> = {
  "brand-new": "Brand New",
  "like-new": "Like New",
  "very-good": "Very Good",
  good: "Good",
  fair: "Fair",
  "needs-repair": "Needs Repair",
};

type Product = {
  id: string;
  slug: string;
  title: string;
  brand: string;
  images: string[];
  condition: string;
  price: number;
  originalPrice?: number;
  location: string;
};

function mapListingToProduct(listing: any): Product {
  return {
    id: listing.id,
    slug: listing.id,
    title: listing.itemTitle,
    brand: listing.brand || listing.category,
    images: listing.photos?.length ? listing.photos : [],
    condition: CONDITION_LABELS[listing.condition] || listing.condition,
    price: Number(listing.sellingPrice) || 0,
    originalPrice: listing.originalPrice ? Number(listing.originalPrice) : undefined,
    location: listing.state || "",
  };
}

export default function SavedPage() {
  const [savedIds, setSavedIds] = useState<string[]>([]);
  const [cartIds, setCartIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState("");

  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [productsLoading, setProductsLoading] = useState(true);

  useEffect(() => {
    try {
      const saved = localStorage.getItem(SAVED_KEY);
      const cart = localStorage.getItem(CART_KEY);

      if (saved) setSavedIds(JSON.parse(saved));
      if (cart) setCartIds(JSON.parse(cart));
    } catch {
      setSavedIds([]);
      setCartIds([]);
    }
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setProductsLoading(true);
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/listings`);
        const data = await res.json();
        if (res.ok) {
          setAllProducts((data.listings || []).map(mapListingToProduct));
        }
      } catch (err) {
        console.error(err);
      } finally {
        setProductsLoading(false);
      }
    };
    fetchProducts();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const savedProducts = useMemo(() => {
    const list = savedIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter(Boolean);

    if (!search.trim()) return list;

    const q = search.toLowerCase();
    return list
  .filter((p): p is Product => Boolean(p))
  .filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q) ||
      p.location?.toLowerCase().includes(q)
  );
  }, [savedIds, allProducts, search]);

  const persistSaved = (next: string[]) => {
    setSavedIds(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  };

  const persistCart = (next: string[]) => {
    setCartIds(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  };

  const removeSaved = (id: string) => {
    const next = savedIds.filter((x) => x !== id);
    persistSaved(next);
    setToast("Removed from saved items");
  };

  const clearSaved = () => {
    persistSaved([]);
    setToast("Saved list cleared");
  };

  const addToCart = (product: Product) => {
    if (cartIds.includes(product.id)) {
      setToast("Already in cart");
      return;
    }

    const next = [...cartIds, product.id];
    persistCart(next);
    setToast(`Added "${shorten(product.title)}" to cart`);
  };

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased pt-28 sm:pt-32 lg:pt-40 pb-24 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/50 hover:text-[#B66B44] transition-colors mb-5"
          >
            <ArrowLeft className="size-4" />
            Back to shop
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
                Your Edit
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight mt-2 leading-tight">
                Saved pieces.
              </h1>
              <p className="text-sm text-[#211000]/55 font-medium mt-2 max-w-xl">
                Keep track of furniture you love, compare pieces, and move your favorites into cart when you’re ready.
              </p>
            </div>

            {savedIds.length > 0 && (
              <button
                onClick={clearSaved}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#211000]/12 bg-white hover:bg-[#E8CEB0]/25 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Trash2 className="size-3.5" />
                Clear all
              </button>
            )}
          </div>
        </div>

        {/* Toolbar */}
        {savedIds.length > 0 && (
          <div className="sticky top-20 z-20 mb-8 rounded-2xl bg-white/75 backdrop-blur-xl border border-[#211000]/8 shadow-sm p-3">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="relative flex-1">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#211000]/35" />
                <input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search saved pieces..."
                  className="w-full rounded-full bg-[#FAF4EC] border border-[#211000]/8 pl-11 pr-10 py-3 text-sm font-medium placeholder:text-[#211000]/35 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-full hover:bg-[#211000]/5"
                  >
                    <X className="size-4 text-[#211000]/40" />
                  </button>
                )}
              </div>

              <p className="text-xs font-bold text-[#211000]/45 px-2">
                {savedProducts.length} {savedProducts.length === 1 ? "piece" : "pieces"}
              </p>
            </div>
          </div>
        )}

        {/* Empty state */}
        {savedIds.length === 0 ? (
          <EmptySaved />
        ) : savedProducts.length === 0 ? (
          <div className="text-center py-24 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-full bg-[#E8CEB0]/40 flex items-center justify-center mx-auto mb-5">
              <Search className="size-7 text-[#B66B44]" />
            </div>
            <h2 className="font-serif text-2xl font-medium mb-2">
              No saved pieces match your search.
            </h2>
            <p className="text-sm text-[#211000]/55 font-medium mb-6">
              Try another keyword or clear your search.
            </p>
            <button
              onClick={() => setSearch("")}
              className="inline-flex items-center gap-2 bg-[#B66B44] hover:bg-[#a05934] text-white font-bold text-xs px-5 py-3 rounded-full transition-colors"
            >
              Clear search
            </button>
          </div>
        ) : (
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-14"
          >
            <AnimatePresence mode="popLayout">
  {savedProducts
    .filter((product): product is Product => Boolean(product)) // or product !== undefined
    .map((product) => (
      <SavedProductCard
        key={product.id}
        product={product}
        inCart={cartIds.includes(product.id)}
        onRemove={() => removeSaved(product.id)}
        onAddToCart={() => addToCart(product)}
      />
    ))}
</AnimatePresence>
          </motion.div>
        )}
      </div>

      <Toast message={toast} />
    </main>
  );
}

function SavedProductCard({
  product,
  inCart,
  onRemove,
  onAddToCart,
}: {
  product: Product;
  inCart: boolean;
  onRemove: () => void;
  onAddToCart: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="group"
    >
      <Link href={`/product/${product.slug}`} className="block">
        <div className="relative aspect-[2/3] sm:aspect-[3/4] overflow-hidden rounded-2xl bg-white border border-[#211000]/5 shadow-sm">
          <img
            src={product.images[0]}
            alt={product.title}
            className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          />

          <button
            onClick={(e) => {
              e.preventDefault();
              onRemove();
            }}
            className="absolute top-3 right-3 size-9 rounded-full bg-white/90 backdrop-blur grid place-items-center text-red-500 shadow-sm hover:bg-red-50 transition-colors"
            aria-label="Remove from saved"
          >
            <Heart className="size-4 fill-red-500" />
          </button>

          <span className="absolute bottom-3 left-3 bg-[#E8CEB0] text-[#211000] text-[10px] font-bold px-2 py-1 rounded-md shadow-sm">
            {product.condition}
          </span>
        </div>

        <div className="mt-3 flex items-start justify-between gap-3">
          <div className="min-w-0">
            <p className="text-[10px] font-bold tracking-[0.18em] text-[#211000]/50 uppercase mb-0.5 truncate">
              {product.brand}
            </p>
            <h3 className="font-serif text-lg sm:text-base font-medium leading-tight truncate">
              {product.title}
            </h3>
            <p className="text-[11px] text-[#211000]/45 font-medium mt-1 flex items-center gap-1">
              <BadgeCheck className="size-3 text-[#5F7161]" />
              <span className="truncate">Verified · {product.location}</span>
            </p>
          </div>

          <div className="text-right shrink-0">
            <p className="text-sm font-bold">{formatNaira(product.price)}</p>
            {product.originalPrice && (
              <p className="text-[10px] text-[#211000]/40 line-through font-medium">
                {formatNaira(product.originalPrice)}
              </p>
            )}
          </div>
        </div>
      </Link>

      <div className="mt-4 grid grid-cols-[1fr_auto] gap-2">
        <button
          onClick={onAddToCart}
          className={`inline-flex items-center justify-center gap-2 rounded-full py-3 text-xs font-bold transition-colors ${
            inCart
              ? "bg-[#5F7161] text-white"
              : "bg-[#211000] text-[#E8CEB0] hover:bg-[#211000]/90"
          }`}
        >
          {inCart ? (
            <>
              <Check className="size-3.5" />
              In cart
            </>
          ) : (
            <>
              <ShoppingBag className="size-3.5" />
              Add to cart
            </>
          )}
        </button>

        <button
          onClick={onRemove}
          className="size-11 rounded-full border border-[#211000]/10 bg-white hover:bg-red-50 hover:text-red-500 transition-colors grid place-items-center"
          aria-label="Remove"
        >
          <Trash2 className="size-4" />
        </button>
      </div>
    </motion.div>
  );
}

function EmptySaved() {
  return (
    <div className="text-center py-24 max-w-lg mx-auto">
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 rounded-full bg-[#E8CEB0]/40 flex items-center justify-center mx-auto mb-6"
      >
        <Heart className="size-9 text-[#B66B44]" />
      </motion.div>

      <h2 className="font-serif text-3xl font-medium tracking-tight mb-3">
        No saved pieces yet.
      </h2>
      <p className="text-sm text-[#211000]/55 font-medium leading-relaxed mb-8">
        Save pieces you love while browsing. They’ll appear here so you can revisit them later.
      </p>

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-[#B66B44] hover:bg-[#a05934] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-colors shadow-md shadow-[#B66B44]/15"
      >
        Explore shop
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

function Toast({ message }: { message: string }) {
  return (
    <AnimatePresence>
      {message && (
        <motion.div
          initial={{ opacity: 0, y: 20, x: "-50%" }}
          animate={{ opacity: 1, y: 0, x: "-50%" }}
          exit={{ opacity: 0, y: 20, x: "-50%" }}
          className="fixed bottom-6 left-1/2 z-50 inline-flex items-center gap-2 bg-[#211000] text-[#FAF4EC] px-5 py-3 rounded-full shadow-2xl"
        >
          <Check className="size-4 text-[#5F7161]" />
          <span className="text-xs font-bold">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function shorten(text: string) {
  return text.length > 28 ? `${text.slice(0, 28)}…` : text;
}