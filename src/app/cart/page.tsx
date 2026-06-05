"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  Heart,
  Lock,
  Minus,
  Package,
  Plus,
  ShieldCheck,
  ShoppingBag,
  Sparkles,
  Tag,
  Trash2,
  Truck,
  X,
} from "lucide-react";
import { products, formatNaira, type Product } from "@/lib/data";

const CART_KEY = "refurnish_cart";
const SAVED_KEY = "refurnish_saved";
const QTY_KEY = "refurnish_cart_quantities";

export default function CartPage() {
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [savedIds, setSavedIds] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [promo, setPromo] = useState("");
  const [promoApplied, setPromoApplied] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    try {
      const cart = localStorage.getItem(CART_KEY);
      const saved = localStorage.getItem(SAVED_KEY);
      const qty = localStorage.getItem(QTY_KEY);

      if (cart) {
        const parsedCart = JSON.parse(cart);
        setCartIds(parsedCart);

        if (!qty) {
          const initialQty: Record<string, number> = {};
          parsedCart.forEach((id: number) => {
            initialQty[String(id)] = 1;
          });
          setQuantities(initialQty);
          localStorage.setItem(QTY_KEY, JSON.stringify(initialQty));
        }
      }

      if (saved) setSavedIds(JSON.parse(saved));
      if (qty) setQuantities(JSON.parse(qty));
    } catch {
      setCartIds([]);
      setSavedIds([]);
      setQuantities({});
    }
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2200);
    return () => clearTimeout(t);
  }, [toast]);

  const cartProducts = useMemo(() => {
    return cartIds
      .map((id) => products.find((p) => p.id === id))
      .filter(Boolean) as Product[];
  }, [cartIds]);

  const subtotal = useMemo(() => {
    return cartProducts.reduce((sum, product) => {
      const qty = quantities[String(product.id)] || 1;
      return sum + product.price * qty;
    }, 0);
  }, [cartProducts, quantities]);

  const discount = promoApplied ? Math.round(subtotal * 0.05) : 0;
  const deliveryEstimate = cartProducts.length > 0 ? 8500 : 0;
  const buyerProtection = cartProducts.length > 0 ? 2500 : 0;
  const total = subtotal - discount + deliveryEstimate + buyerProtection;

  const persistCart = (next: number[]) => {
    setCartIds(next);
    localStorage.setItem(CART_KEY, JSON.stringify(next));
  };

  const persistSaved = (next: number[]) => {
    setSavedIds(next);
    localStorage.setItem(SAVED_KEY, JSON.stringify(next));
  };

  const persistQty = (next: Record<string, number>) => {
    setQuantities(next);
    localStorage.setItem(QTY_KEY, JSON.stringify(next));
  };

  const updateQuantity = (id: number, nextQty: number) => {
    if (nextQty < 1) return;
    persistQty({
      ...quantities,
      [String(id)]: nextQty,
    });
  };

  const removeFromCart = (id: number) => {
    const nextCart = cartIds.filter((x) => x !== id);
    const nextQty = { ...quantities };
    delete nextQty[String(id)];

    persistCart(nextCart);
    persistQty(nextQty);
    setToast("Removed from cart");
  };

  const moveToSaved = (product: Product) => {
    const nextCart = cartIds.filter((x) => x !== product.id);
    const nextQty = { ...quantities };
    delete nextQty[String(product.id)];

    persistCart(nextCart);
    persistQty(nextQty);

    if (!savedIds.includes(product.id)) {
      persistSaved([...savedIds, product.id]);
    }

    setToast(`Moved "${shorten(product.title)}" to saved`);
  };

  const clearCart = () => {
    persistCart([]);
    persistQty({});
    setPromoApplied(false);
    setPromo("");
    setToast("Cart cleared");
  };

  const applyPromo = () => {
    if (!promo.trim()) return;

    if (promo.trim().toLowerCase() === "refurnish5") {
      setPromoApplied(true);
      setToast("Promo code applied");
    } else {
      setPromoApplied(false);
      setToast("Invalid promo code");
    }
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
            Continue shopping
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
                Your Cart
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight mt-2 leading-tight">
                Ready when you are.
              </h1>
              <p className="text-sm text-[#211000]/55 font-medium mt-2 max-w-xl">
                Review your selected pieces before moving to secure checkout.
              </p>
            </div>

            {cartProducts.length > 0 && (
              <button
                onClick={clearCart}
                className="inline-flex items-center justify-center gap-2 rounded-full border border-[#211000]/12 bg-white hover:bg-red-50 hover:text-red-500 px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                <Trash2 className="size-3.5" />
                Clear cart
              </button>
            )}
          </div>
        </div>

        {cartProducts.length === 0 ? (
          <EmptyCart />
        ) : (
          <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
            {/* Cart items */}
            <section className="lg:col-span-8 space-y-4">
              <AnimatePresence mode="popLayout">
                {cartProducts.map((product) => (
                  <CartItem
                    key={product.id}
                    product={product}
                    quantity={quantities[String(product.id)] || 1}
                    onIncrease={() =>
                      updateQuantity(
                        product.id,
                        (quantities[String(product.id)] || 1) + 1
                      )
                    }
                    onDecrease={() =>
                      updateQuantity(
                        product.id,
                        (quantities[String(product.id)] || 1) - 1
                      )
                    }
                    onRemove={() => removeFromCart(product.id)}
                    onSave={() => moveToSaved(product)}
                  />
                ))}
              </AnimatePresence>
            </section>

            {/* Summary */}
            <aside className="lg:col-span-4">
              <div className="sticky top-28 rounded-3xl bg-white border border-[#211000]/8 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-[#211000]/8">
                  <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44] mb-2">
                    Order Summary
                  </p>
                  <h2 className="font-serif text-2xl font-medium">
                    {cartProducts.length}{" "}
                    {cartProducts.length === 1 ? "piece" : "pieces"}
                  </h2>
                </div>

                <div className="p-6 space-y-5">
                  {/* Promo */}
                  <div>
                    <label className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/45 block mb-2">
                      Promo code
                    </label>
                    <div className="flex gap-2">
                      <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-[#211000]/35" />
                        <input
                          value={promo}
                          onChange={(e) => {
                            setPromo(e.target.value);
                            setPromoApplied(false);
                          }}
                          placeholder="REFURNISH5"
                          className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/8 pl-9 pr-3 py-3 text-xs font-bold placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44]"
                        />
                      </div>
                      <button
                        onClick={applyPromo}
                        className="rounded-xl bg-[#211000] text-[#E8CEB0] px-4 text-xs font-bold hover:bg-[#211000]/90 transition-colors"
                      >
                        Apply
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="mt-2 text-[11px] text-[#5F7161] font-bold flex items-center gap-1">
                        <Check className="size-3" />
                        5% discount applied
                      </p>
                    )}
                  </div>

                  {/* Totals */}
                  <div className="space-y-3 text-sm">
                    <SummaryRow
                      label="Subtotal"
                      value={formatNaira(subtotal)}
                    />
                    {discount > 0 && (
                      <SummaryRow
                        label="Discount"
                        value={`- ${formatNaira(discount)}`}
                        positive
                      />
                    )}
                    <SummaryRow
                      label="Delivery estimate"
                      value={formatNaira(deliveryEstimate)}
                    />
                    <SummaryRow
                      label="Buyer protection"
                      value={formatNaira(buyerProtection)}
                    />
                  </div>

                  <div className="border-t border-[#211000]/10 pt-5 flex items-center justify-between">
                    <span className="font-serif text-xl font-medium">
                      Total
                    </span>
                    <span className="text-2xl font-bold">
                      {formatNaira(total)}
                    </span>
                  </div>

                  <Link
                    href="/checkout"
                    className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white py-4 text-sm font-bold transition-colors shadow-md shadow-[#B66B44]/15"
                  >
                    <Lock className="size-4" />
                    Continue to checkout
                    <ArrowRight className="size-4" />
                  </Link>

                  <div className="grid gap-3 pt-2">
                    <TrustRow
                      icon={<ShieldCheck className="size-4 text-[#5F7161]" />}
                      title="Protected payment"
                      text="Funds are held until delivery is confirmed."
                    />
                    <TrustRow
                      icon={<Truck className="size-4 text-[#5F7161]" />}
                      title="Delivery support"
                      text="Refurnish-assisted delivery across Lagos."
                    />
                    <TrustRow
                      icon={<Sparkles className="size-4 text-[#B66B44]" />}
                      title="Verified pieces"
                      text="Curated listings with seller verification."
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        )}
      </div>

      <Toast message={toast} />
    </main>
  );
}

function CartItem({
  product,
  quantity,
  onIncrease,
  onDecrease,
  onRemove,
  onSave,
}: {
  product: Product;
  quantity: number;
  onIncrease: () => void;
  onDecrease: () => void;
  onRemove: () => void;
  onSave: () => void;
}) {
  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      className="rounded-3xl bg-white border border-[#211000]/8 shadow-sm overflow-hidden"
    >
      <div className="grid sm:grid-cols-[220px_1fr] gap-0">
        <Link href={`/product/${product.slug}`} className="block">
          <div className="aspect-[3/4] sm:aspect-square bg-[#E8CEB0]/30 overflow-hidden">
            <img
              src={product.images[0]}
              alt={product.title}
              className="size-full object-cover transition-transform duration-700 hover:scale-105"
            />
          </div>
        </Link>

        <div className="p-5 sm:p-6 flex flex-col">
          <div className="flex items-start justify-between gap-4">
            <div className="min-w-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#211000]/45">
                {product.brand}
              </p>
              <Link href={`/product/${product.slug}`}>
                <h2 className="font-serif text-xl sm:text-2xl font-medium leading-tight mt-1 hover:text-[#B66B44] transition-colors">
                  {product.title}
                </h2>
              </Link>
              <p className="text-[11px] text-[#211000]/45 font-medium mt-2 flex items-center gap-1">
                <BadgeCheck className="size-3 text-[#5F7161]" />
                Verified · {product.location}
              </p>
            </div>

            <button
              onClick={onRemove}
              className="size-9 rounded-full border border-[#211000]/10 bg-[#FAF4EC] hover:bg-red-50 hover:text-red-500 transition-colors grid place-items-center shrink-0"
              aria-label="Remove from cart"
            >
              <X className="size-4" />
            </button>
          </div>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-[10px] font-bold bg-[#E8CEB0] px-2 py-1 rounded-md">
              {product.condition}
            </span>
            {product.style && (
              <span className="text-[10px] font-bold bg-[#FAF4EC] border border-[#211000]/8 px-2 py-1 rounded-md">
                {product.style}
              </span>
            )}
          </div>

          <div className="mt-auto pt-6 flex flex-col sm:flex-row sm:items-end justify-between gap-5">
            <div>
              <p className="text-2xl font-bold">{formatNaira(product.price)}</p>
              {product.originalPrice && (
                <p className="text-xs text-[#211000]/40 line-through font-medium">
                  {formatNaira(product.originalPrice)}
                </p>
              )}
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-4">
              <div className="inline-flex items-center rounded-full border border-[#211000]/12 bg-[#FAF4EC] overflow-hidden">
                <button
                  onClick={onDecrease}
                  disabled={quantity <= 1}
                  className="size-10 grid place-items-center hover:bg-[#E8CEB0]/35 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
                  aria-label="Decrease quantity"
                >
                  <Minus className="size-3.5" />
                </button>
                <span className="w-10 text-center text-sm font-bold">
                  {quantity}
                </span>
                <button
                  onClick={onIncrease}
                  className="size-10 grid place-items-center hover:bg-[#E8CEB0]/35 transition-colors"
                  aria-label="Increase quantity"
                >
                  <Plus className="size-3.5" />
                </button>
              </div>

              <button
                onClick={onSave}
                className="inline-flex items-center gap-2 rounded-full border border-[#211000]/12 bg-[#FAF4EC] hover:bg-[#E8CEB0]/25 px-4 py-2.5 text-xs font-bold transition-colors"
              >
                <Heart className="size-3.5" />
                Save
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.article>
  );
}

function EmptyCart() {
  return (
    <div className="text-center py-24 max-w-lg mx-auto">
      <motion.div
        initial={{ scale: 0.88, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-20 h-20 rounded-full bg-[#E8CEB0]/40 flex items-center justify-center mx-auto mb-6"
      >
        <ShoppingBag className="size-9 text-[#B66B44]" />
      </motion.div>

      <h2 className="font-serif text-3xl font-medium tracking-tight mb-3">
        Your cart is empty.
      </h2>
      <p className="text-sm text-[#211000]/55 font-medium leading-relaxed mb-8">
        Add beautiful pre-loved pieces to your cart and review them here before
        checkout.
      </p>

      <Link
        href="/shop"
        className="inline-flex items-center gap-2 bg-[#B66B44] hover:bg-[#a05934] text-white font-bold text-xs uppercase tracking-wider px-6 py-3.5 rounded-full transition-colors shadow-md shadow-[#B66B44]/15"
      >
        Start shopping
        <ArrowRight className="size-4" />
      </Link>
    </div>
  );
}

function SummaryRow({
  label,
  value,
  positive = false,
}: {
  label: string;
  value: string;
  positive?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#211000]/55 font-medium">{label}</span>
      <span className={`font-bold ${positive ? "text-[#5F7161]" : ""}`}>
        {value}
      </span>
    </div>
  );
}

function TrustRow({
  icon,
  title,
  text,
}: {
  icon: React.ReactNode;
  title: string;
  text: string;
}) {
  return (
    <div className="flex items-start gap-3 rounded-2xl bg-[#FAF4EC] border border-[#211000]/6 p-3">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="text-[11px] text-[#211000]/50 font-medium leading-relaxed">
          {text}
        </p>
      </div>
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
