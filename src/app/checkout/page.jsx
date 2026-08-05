"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  CheckCircle2,
  CreditCard,
  ShieldCheck,
  Lock,
  MapPin,
  Phone,
  Mail,
  User,
  AlertCircle,
  Info,
  MessageCircle,
  Truck,
  Package,
  Home,
  Banknote,
  Loader2,
  Headphones,
  Timer,
  RefreshCcw,
  X,
  Upload,
  Calendar,
  Map,
  Copy,
  ExternalLink,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

const CART_KEY = "refurnish_cart";
const QTY_KEY = "refurnish_cart_quantities";
const PENDING_CHECKOUT_KEY = "refurnish_pending_checkout";
const NEGOTIATED_PRICES_KEY = "refurnish_negotiated_prices";

const REFUND_WINDOW_DAYS = 3;
const DELIVERY_ENABLED = false; // flip to true once a logistics API is wired up

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const CONDITION_LABELS = {
  "brand-new": "Brand New",
  "like-new": "Like New",
  "very-good": "Very Good",
  good: "Good",
  fair: "Fair",
  "needs-repair": "Needs Repair",
};

function mapListingToProduct(listing) {
  return {
    id: listing.id,
    title: listing.itemTitle,
    brand: listing.brand || listing.category,
    images: listing.photos?.length ? listing.photos : [],
    condition: CONDITION_LABELS[listing.condition] || listing.condition,
    price: Number(listing.sellingPrice) || 0,
    state: listing.state || "",
  };
}

export default function CheckoutPage() {
  const router = useRouter();
  const fileInputRef = useRef(null);

  const [step, setStep] = useState("delivery");
  const [processing, setProcessing] = useState(false);
  const [paymentModal, setPaymentModal] = useState(null);
  const [paymentError, setPaymentError] = useState("");
  const [orderReference, setOrderReference] = useState("");

  // Delivery info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [landmark, setLandmark] = useState("");
  const [deliveryType, setDeliveryType] = useState("pickup");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [showMap, setShowMap] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState("paystack");
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Bank transfer receipt
  const [receiptUrl, setReceiptUrl] = useState(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);
  const [receiptError, setReceiptError] = useState("");

  // Cart data
  const [cartIds, setCartIds] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [negotiatedPrices, setNegotiatedPrices] = useState({});
  const [allProducts, setAllProducts] = useState([]);
  const [productsLoading, setProductsLoading] = useState(true);

  // Load cart ids/quantities
  useEffect(() => {
    try {
      const cart = localStorage.getItem(CART_KEY);
      const qty = localStorage.getItem(QTY_KEY);

      if (!cart || JSON.parse(cart).length === 0) {
        router.push("/cart");
        return;
      }

      setCartIds(JSON.parse(cart));
      if (qty) setQuantities(JSON.parse(qty));

      const negotiated = localStorage.getItem(NEGOTIATED_PRICES_KEY);
      if (negotiated) setNegotiatedPrices(JSON.parse(negotiated));

      const user = JSON.parse(localStorage.getItem("refurnish_user") || "null");
      if (user) {
        if (user.name) setFullName(user.name);
        if (user.email) setEmail(user.email);
        if (user.phone) setPhone(user.phone);
      }

      // Restore a checkout draft saved before being sent to log in
      const pending = localStorage.getItem(PENDING_CHECKOUT_KEY);
      if (pending) {
        const draft = JSON.parse(pending);
        setFullName(draft.fullName || "");
        setPhone(draft.phone || "");
        setEmail(draft.email || "");
        setAddress(draft.address || "");
        setState(draft.state || "");
        setLga(draft.lga || "");
        setLandmark(draft.landmark || "");
        setDeliveryType(draft.deliveryType || "pickup");
        setDeliveryDate(draft.deliveryDate || "");
        setDeliveryNotes(draft.deliveryNotes || "");
        setPaymentMethod(draft.paymentMethod || "paystack");
        localStorage.removeItem(PENDING_CHECKOUT_KEY);
      }
    } catch {
      router.push("/cart");
    }
  }, [router]);

  // Fetch real listings for everything currently in the cart
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

  const cartProducts = useMemo(() => {
    return cartIds
      .map((id) => allProducts.find((p) => p.id === id))
      .filter(Boolean)
      .map((p) => {
        const negotiated = negotiatedPrices[String(p.id)];
        return negotiated ? { ...p, price: Number(negotiated), negotiated: true } : p;
      });
  }, [cartIds, allProducts, negotiatedPrices]);

  const subtotal = useMemo(() => {
    return cartProducts.reduce((sum, product) => {
      const qty = quantities[String(product.id)] || 1;
      return sum + product.price * qty;
    }, 0);
  }, [cartProducts, quantities]);

  const total = subtotal;

  const canProceed = () => {
    const baseInfoValid = fullName && phone && email && agreeTerms;
    if (!baseInfoValid) return false;

    if (deliveryType === "delivery") {
      const deliveryValid = address && state && lga;
      if (!deliveryValid) return false;
    }

    if (step === "payment" || step === "confirm") {
      if (paymentMethod === "transfer" && !receiptUrl) return false;
    }

    return true;
  };

  const uploadReceiptToCloudinary = async (file) => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/auto/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();
    if (!res.ok) throw new Error(data?.error?.message || "Failed to upload receipt.");
    return data.secure_url;
  };

  const handleReceiptUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      setReceiptError("Please upload a JPG, PNG, or PDF receipt.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setReceiptError("File size must be less than 5MB.");
      return;
    }

    setReceiptError("");
    setUploadingReceipt(true);
    try {
      const url = await uploadReceiptToCloudinary(file);
      setReceiptUrl(url);
    } catch (err) {
      setReceiptError(err.message || "Failed to upload receipt.");
    } finally {
      setUploadingReceipt(false);
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePlaceOrder = async () => {
    const user = JSON.parse(localStorage.getItem("refurnish_user") || "null");

    if (!user?.token) {
      localStorage.setItem(
        PENDING_CHECKOUT_KEY,
        JSON.stringify({
          fullName, phone, email, address, state, lga, landmark,
          deliveryType, deliveryDate, deliveryNotes, paymentMethod,
        })
      );
      router.push("/login?mode=login&next=/checkout");
      return;
    }

    setProcessing(true);
    setPaymentError("");

    try {
      const cartItems = cartProducts.map((p) => ({
        listingId: p.id,
        quantity: quantities[String(p.id)] || 1,
        ...(p.negotiated ? { negotiatedPrice: p.price } : {}),
      }));

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify({
          cartItems,
          deliveryType,
          fullName,
          phone,
          email,
          address,
          state,
          lga,
          landmark,
          deliveryDate,
          deliveryNotes,
          paymentMethod,
          receiptUrl,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || "Failed to place order.");
      }

      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(QTY_KEY);
      localStorage.removeItem(NEGOTIATED_PRICES_KEY);

      if (paymentMethod === "paystack" && data.authorizationUrl) {
        window.location.href = data.authorizationUrl;
        return;
      }

      setOrderReference(data.order.reference);
      setPaymentModal("success");
    } catch (err) {
      console.error(err);
      setPaymentError(
        err.message || "We could not process your order. Please try again."
      );
      setPaymentModal("error");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased pt-28 sm:pt-32 lg:pt-40 pb-24 px-4 sm:px-8 lg:px-16">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-10">
          <Link
            href="/cart"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/50 hover:text-[#B66B44] transition-colors mb-5"
          >
            <ArrowLeft className="size-4" />
            Back to cart
          </Link>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
                Secure Checkout
              </p>
              <h1 className="font-serif text-3xl sm:text-5xl font-medium tracking-tight mt-2 leading-tight">
                Complete your order.
              </h1>
              <p className="text-sm text-[#211000]/55 font-medium mt-2 max-w-xl">
                Your payment is protected. Funds are only released to the seller after your payment is confirmed.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#5F7161]/10 border border-[#5F7161]/20 px-4 py-2">
              <ShieldCheck className="size-4 text-[#5F7161]" />
              <span className="text-xs font-bold text-[#5F7161]">Protected checkout</span>
            </div>
          </div>
        </div>

        {/* Progress Steps */}
        <div className="mb-10">
          <div className="flex items-center justify-center gap-2 sm:gap-4">
            {[
              { id: "delivery", label: "Delivery", icon: Truck },
              { id: "payment", label: "Payment", icon: CreditCard },
              { id: "confirm", label: "Review & Pay", icon: Lock },
            ].map((s, i) => {
              const Icon = s.icon;
              const isActive = step === s.id;
              const isDone =
                (step === "payment" && i === 0) ||
                (step === "confirm" && i < 2);

              return (
                <div key={s.id} className="flex items-center">
                  <div
                    className={`flex items-center gap-2 px-3 py-2 rounded-full text-xs font-bold transition-all ${
                      isActive
                        ? "bg-[#211000] text-[#E8CEB0]"
                        : isDone
                        ? "bg-[#5F7161] text-white"
                        : "bg-white text-[#211000]/40 border border-[#211000]/10"
                    }`}
                  >
                    {isDone ? <Check className="size-3" /> : <Icon className="size-3" />}
                    <span className="hidden sm:inline">{s.label}</span>
                    <span className="sm:hidden">{i + 1}</span>
                  </div>
                  {i < 2 && (
                    <div
                      className={`w-8 sm:w-16 h-[2px] mx-2 ${
                        isDone ? "bg-[#5F7161]" : "bg-[#211000]/10"
                      }`}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {productsLoading ? (
          <div className="py-24 flex justify-center">
            <Loader2 className="size-8 animate-spin text-[#B66B44]" />
          </div>
        ) : (
        <div className="grid lg:grid-cols-12 gap-8 lg:gap-10">
          {/* Main Form */}
          <div className="lg:col-span-7 space-y-6">
            <AnimatePresence mode="wait">
              {/* Step 1: Delivery */}
              {step === "delivery" && (
                <motion.div
                  key="delivery"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SectionTitle
                    icon={<Truck className="size-5" />}
                    title="Delivery Options"
                    subtitle="Choose how you'd like to receive your order"
                  />

                  <div className="rounded-2xl bg-white border border-[#211000]/8 shadow-sm p-6 space-y-6">
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-3">
                        How would you like to receive your order?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <motion.button
                          disabled={!DELIVERY_ENABLED}
                          whileTap={DELIVERY_ENABLED ? { scale: 0.98 } : undefined}
                          onClick={() => {
                            if (!DELIVERY_ENABLED) return;
                            setDeliveryType("delivery");
                            setShowMap(false);
                          }}
                          className={`relative p-5 rounded-xl border text-left transition-all ${
                            !DELIVERY_ENABLED
                              ? "bg-[#211000]/5 border-[#211000]/8 cursor-not-allowed opacity-60"
                              : deliveryType === "delivery"
                              ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                              : "bg-[#FAF4EC] border-[#211000]/10 hover:border-[#B66B44]/30"
                          }`}
                        >
                          {deliveryType === "delivery" && DELIVERY_ENABLED && (
                            <div className="absolute top-4 right-4 size-6 rounded-full bg-[#E8CEB0] flex items-center justify-center">
                              <Check className="size-3.5 text-[#211000]" />
                            </div>
                          )}
                          <Truck className="size-6 mb-3" />
                          <p className="text-sm font-bold">Home Delivery</p>
                          <p className="text-[11px] mt-1 text-[#211000]/45">
                            Logistics partner delivers to your address
                          </p>
                          <p className="text-xs font-bold mt-2 text-[#B66B44]">
                            Feature coming soon
                          </p>
                        </motion.button>

                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setDeliveryType("pickup");
                            setShowMap(false);
                          }}
                          className={`relative p-5 rounded-xl border text-left transition-all ${
                            deliveryType === "pickup"
                              ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                              : "bg-[#FAF4EC] border-[#211000]/10 hover:border-[#B66B44]/30"
                          }`}
                        >
                          {deliveryType === "pickup" && (
                            <div className="absolute top-4 right-4 size-6 rounded-full bg-[#E8CEB0] flex items-center justify-center">
                              <Check className="size-3.5 text-[#211000]" />
                            </div>
                          )}
                          <Package className="size-6 mb-3" />
                          <p className="text-sm font-bold">Pickup from Seller</p>
                          <p
                            className={`text-[11px] mt-1 ${
                              deliveryType === "pickup" ? "text-[#E8CEB0]/70" : "text-[#211000]/45"
                            }`}
                          >
                            Collect directly from seller's location
                          </p>
                          <p className="text-xs font-bold mt-2 text-[#5F7161]">Free</p>
                        </motion.button>
                      </div>
                    </div>

                    {deliveryType === "pickup" && cartProducts.length > 0 && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-5 space-y-3"
                      >
                        <div className="flex items-center gap-2 text-[#B66B44]">
                          <MapPin className="size-4" />
                          <p className="text-sm font-bold">Pickup Location(s)</p>
                        </div>
                        <div className="space-y-2">
                          {cartProducts.map((product) => (
                            <div key={product.id} className="text-xs text-[#211000]/70">
                              <p className="font-bold text-[#211000]">{product.title}</p>
                              <p>{product.state}</p>
                            </div>
                          ))}
                        </div>
                        <p className="text-[11px] text-[#211000]/50 flex items-center gap-1">
                          <Info className="size-3" />
                          Exact seller location will be shared after payment is confirmed
                        </p>
                      </motion.div>
                    )}

                    <div className="pt-4 border-t border-[#211000]/8">
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#211000]/60 mb-4">
                        Contact Information
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <IconInput
                          icon={<User className="size-4" />}
                          label="Full Name *"
                          placeholder="Your full name"
                          value={fullName}
                          onChange={setFullName}
                          required
                        />
                        <IconInput
                          icon={<Phone className="size-4" />}
                          label="Phone Number *"
                          placeholder="08012345678"
                          value={phone}
                          onChange={setPhone}
                          type="tel"
                          required
                        />
                        <IconInput
                          icon={<Mail className="size-4" />}
                          label="Email Address *"
                          placeholder="your.email@example.com"
                          value={email}
                          onChange={setEmail}
                          type="email"
                          required
                        />
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                            Preferred Delivery/Pickup Date
                          </label>
                          <input
                            type="date"
                            value={deliveryDate}
                            onChange={(e) => setDeliveryDate(e.target.value)}
                            min={new Date().toISOString().split("T")[0]}
                            className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 px-4 py-3.5 text-sm font-medium text-[#211000] focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                          />
                        </div>
                      </div>
                    </div>

                    {deliveryType === "delivery" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="pt-4 border-t border-[#211000]/8 space-y-4"
                      >
                        <h3 className="text-sm font-bold uppercase tracking-wider text-[#211000]/60 mb-4">
                          Delivery Address
                        </h3>

                        <IconInput
                          icon={<Home className="size-4" />}
                          label="Street Address *"
                          placeholder="15 Palm Avenue, Ikeja"
                          value={address}
                          onChange={(val) => {
                            setAddress(val);
                            setShowMap(true);
                          }}
                          required
                        />

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                          <SelectField
                            label="State *"
                            value={state}
                            onChange={(val) => {
                              setState(val);
                              setShowMap(true);
                            }}
                            options={NIGERIAN_STATES}
                            placeholder="Select state"
                          />
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                              LGA / Area *
                            </label>
                            <input
                              type="text"
                              placeholder="e.g. Ikeja, Lekki"
                              value={lga}
                              onChange={(e) => {
                                setLga(e.target.value);
                                setShowMap(true);
                              }}
                              className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                            />
                          </div>
                        </div>

                        <IconInput
                          icon={<MapPin className="size-4" />}
                          label="Landmark (Optional)"
                          placeholder="Near Shoprite, opposite GTBank"
                          value={landmark}
                          onChange={setLandmark}
                        />

                        {showMap && address && state && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.98 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="rounded-xl overflow-hidden border border-[#211000]/10"
                          >
                            <div className="bg-[#E8CEB0]/30 px-4 py-2 flex items-center justify-between">
                              <p className="text-xs font-bold text-[#211000]/60 flex items-center gap-1">
                                <Map className="size-3" />
                                Delivery Location Preview
                              </p>
                              <button
                                onClick={() => {
                                  const query = encodeURIComponent(`${address}, ${lga}, ${state}, Nigeria`);
                                  window.open(`https://www.google.com/maps/search/?api=1&query=${query}`, "_blank");
                                }}
                                className="text-xs font-bold text-[#B66B44] hover:underline flex items-center gap-1"
                              >
                                Open in Google Maps
                                <ExternalLink className="size-3" />
                              </button>
                            </div>
                            <iframe
                              src={`https://maps.google.com/maps?q=${encodeURIComponent(
                                `${address}, ${lga}, ${state}, Nigeria`
                              )}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                              className="w-full h-64 border-0"
                              loading="lazy"
                              allowFullScreen
                            />
                          </motion.div>
                        )}

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                            Delivery Notes (Optional)
                          </label>
                          <textarea
                            placeholder="Gate code, floor number, special instructions..."
                            value={deliveryNotes}
                            onChange={(e) => setDeliveryNotes(e.target.value)}
                            className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all resize-none"
                          />
                        </div>
                      </motion.div>
                    )}

                    <div className="pt-4 border-t border-[#211000]/8">
                      <label className="flex items-start gap-3 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={agreeTerms}
                          onChange={(e) => setAgreeTerms(e.target.checked)}
                          className="mt-0.5 size-4 rounded border-[#211000]/20 text-[#B66B44] focus:ring-[#B66B44]"
                        />
                        <span className="text-xs text-[#211000]/60 leading-relaxed">
                          I agree to the{" "}
                          <Link href="/terms" className="text-[#B66B44] font-bold hover:underline">
                            Terms of Service
                          </Link>{" "}
                          and{" "}
                          <Link href="/privacy" className="text-[#B66B44] font-bold hover:underline">
                            Privacy Policy
                          </Link>
                          .
                        </span>
                      </label>
                    </div>
                  </div>

                  <div className="flex justify-end mt-6">
                    <button
                      onClick={() => setStep("payment")}
                      disabled={!canProceed()}
                      className="inline-flex items-center gap-2 bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm px-8 py-4 rounded-full transition-all shadow-md shadow-[#B66B44]/15"
                    >
                      Continue to Payment
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Payment */}
              {step === "payment" && (
                <motion.div
                  key="payment"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SectionTitle
                    icon={<CreditCard className="size-5" />}
                    title="Payment Method"
                    subtitle="Choose how you'd like to pay"
                  />

                  <div className="rounded-2xl bg-white border border-[#211000]/8 shadow-sm p-6 space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {[
                        {
                          id: "paystack",
                          label: "Pay with Paystack",
                          desc: "Card, bank, or USSD — instant confirmation",
                          icon: CreditCard,
                        },
                        {
                          id: "transfer",
                          label: "Direct Bank Transfer",
                          desc: "Upload receipt for verification",
                          icon: Banknote,
                        },
                      ].map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = paymentMethod === opt.id;
                        return (
                          <motion.button
                            key={opt.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPaymentMethod(opt.id)}
                            className={`p-4 rounded-xl border text-center transition-all ${
                              isSelected
                                ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                                : "bg-[#FAF4EC] border-[#211000]/10 hover:border-[#B66B44]/30"
                            }`}
                          >
                            <Icon className="size-6 mx-auto mb-2" />
                            <p className="text-sm font-bold">{opt.label}</p>
                            <p
                              className={`text-[10px] mt-0.5 ${
                                isSelected ? "text-[#E8CEB0]/70" : "text-[#211000]/45"
                              }`}
                            >
                              {opt.desc}
                            </p>
                          </motion.button>
                        );
                      })}
                    </div>

                    {paymentMethod === "transfer" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-5 pt-4 border-t border-[#211000]/8"
                      >
                        <div className="rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-5 space-y-3">
                          <div className="flex items-center gap-2 text-[#B66B44]">
                            <Banknote className="size-4" />
                            <p className="text-sm font-bold">Bank Transfer Details</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="text-[#211000]/50 font-medium">Bank</p>
                              <p className="font-bold text-[#211000]">First Bank</p>
                            </div>
                            <div>
                              <p className="text-[#211000]/50 font-medium">Account Number</p>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-[#211000] font-mono">0018689465</p>
                                <button
                                  onClick={() => navigator.clipboard.writeText("0018689465")}
                                  className="text-[#B66B44] hover:underline"
                                >
                                  <Copy className="size-3" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <p className="text-[#211000]/50 font-medium">Account Name</p>
                              <p className="font-bold text-[#211000]">Refurnish NG</p>
                            </div>
                          </div>
                          <div className="rounded-lg bg-red-50 border border-red-200 p-3">
                            <p className="text-[11px] text-red-700 leading-relaxed font-medium">
                              A unique payment reference will be generated once you place this order —
                              you must use it as your transfer narration so we can match your payment.
                            </p>
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-3">
                            Upload Payment Receipt *
                          </label>
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-[#211000]/15 rounded-xl p-6 text-center cursor-pointer hover:border-[#B66B44]/40 hover:bg-[#E8CEB0]/10 transition-all"
                          >
                            {receiptUrl ? (
                              <div className="space-y-3">
                                <div className="relative inline-block">
                                  <img
                                    src={receiptUrl}
                                    alt="Receipt preview"
                                    className="max-h-48 rounded-lg border border-[#211000]/10"
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setReceiptUrl(null);
                                    }}
                                    className="absolute -top-2 -right-2 size-6 rounded-full bg-[#211000] text-white flex items-center justify-center hover:bg-red-500 transition-colors"
                                  >
                                    <X className="size-3" />
                                  </button>
                                </div>
                                <p className="text-xs text-[#5F7161] font-bold flex items-center justify-center gap-1">
                                  <Check className="size-3" />
                                  Receipt uploaded successfully
                                </p>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                {uploadingReceipt ? (
                                  <Loader2 className="size-8 text-[#B66B44] animate-spin mx-auto" />
                                ) : (
                                  <Upload className="size-8 text-[#211000]/35 mx-auto" />
                                )}
                                <p className="text-sm font-bold text-[#211000]">
                                  {uploadingReceipt ? "Uploading..." : "Click to upload receipt"}
                                </p>
                                <p className="text-xs text-[#211000]/45">JPG, PNG or PDF (max 5MB)</p>
                              </div>
                            )}
                          </div>
                          <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*,application/pdf"
                            onChange={handleReceiptUpload}
                            className="hidden"
                          />
                          {receiptError && (
                            <p className="text-[11px] text-red-600 font-bold mt-2">{receiptError}</p>
                          )}
                          <p className="text-[11px] text-[#211000]/50 mt-2 flex items-center gap-1">
                            <AlertCircle className="size-3" />
                            We'll confirm your payment and get back to you — usually within a few hours.
                          </p>
                        </div>
                      </motion.div>
                    )}

                    <div className="rounded-xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-4 flex gap-3">
                      <ShieldCheck className="size-5 text-[#5F7161] shrink-0 mt-0.5" />
                      <div className="text-xs text-[#211000]/65 leading-relaxed">
                        <p className="font-bold text-[#211000] mb-1">Buyer Protection Active</p>
                        <p>
                          You have {REFUND_WINDOW_DAYS} days to report any issues after receiving your order.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setStep("delivery")}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/60 hover:text-[#211000] transition-colors"
                    >
                      <ArrowLeft className="size-4" />
                      Back
                    </button>
                    <button
                      onClick={() => setStep("confirm")}
                      disabled={!canProceed()}
                      className="inline-flex items-center gap-2 bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm px-8 py-4 rounded-full transition-all shadow-md shadow-[#B66B44]/15"
                    >
                      Review Order
                      <ArrowRight className="size-4" />
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Review & Pay */}
              {step === "confirm" && (
                <motion.div
                  key="confirm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <SectionTitle
                    icon={<Lock className="size-5" />}
                    title="Review & Confirm"
                    subtitle="Double-check your order before paying"
                  />

                  <div className="rounded-2xl bg-white border border-[#211000]/8 shadow-sm p-6 space-y-6">
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#211000]/60 mb-4">
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {cartProducts.map((product) => (
                          <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#FAF4EC]">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                              {product.images[0] && (
                                <img
                                  src={product.images[0]}
                                  alt={product.title}
                                  className="w-full h-full object-cover"
                                />
                              )}
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/45">
                                {product.brand}
                              </p>
                              <h4 className="font-serif text-sm font-medium truncate">{product.title}</h4>
                              <p className="text-[11px] text-[#211000]/45 mt-0.5 flex items-center gap-1.5">
                                Qty: {quantities[String(product.id)] || 1}
                                {product.negotiated && (
                                  <span className="text-[#5F7161] font-bold">· Negotiated price</span>
                                )}
                              </p>
                            </div>
                            <p className="text-sm font-bold shrink-0">
                              {formatNaira(product.price * (quantities[String(product.id)] || 1))}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#211000]/60 mb-4">
                        Delivery Information
                      </h3>
                      <div className="rounded-xl bg-[#FAF4EC] border border-[#211000]/8 p-4 text-sm space-y-2">
                        <InfoRow icon={<Truck className="size-4" />} label="Method" value={deliveryType === "delivery" ? "Home Delivery" : "Pickup from Seller"} />
                        {deliveryType === "delivery" && (
                          <>
                            <InfoRow icon={<Home className="size-4" />} label="Address" value={`${address}, ${lga}, ${state}`} />
                            {landmark && <InfoRow icon={<MapPin className="size-4" />} label="Landmark" value={landmark} />}
                          </>
                        )}
                        {deliveryType === "pickup" && (
                          <div className="text-[11px] text-[#211000]/50 flex items-center gap-1">
                            <Info className="size-3" />
                            Exact seller location will be shared after payment is confirmed
                          </div>
                        )}
                        <InfoRow icon={<User className="size-4" />} label="Name" value={fullName} />
                        <InfoRow icon={<Phone className="size-4" />} label="Phone" value={phone} />
                        <InfoRow icon={<Mail className="size-4" />} label="Email" value={email} />
                        {deliveryDate && <InfoRow icon={<Calendar className="size-4" />} label="Date" value={deliveryDate} />}
                      </div>
                    </div>

                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#211000]/60 mb-4">
                        Payment Method
                      </h3>
                      <div className="rounded-xl bg-[#FAF4EC] border border-[#211000]/8 p-4">
                        <div className="flex items-center gap-3">
                          {paymentMethod === "paystack" ? (
                            <CreditCard className="size-5 text-[#B66B44]" />
                          ) : (
                            <Banknote className="size-5 text-[#B66B44]" />
                          )}
                          <div>
                            <p className="text-sm font-bold">
                              {paymentMethod === "paystack" ? "Paystack" : "Bank Transfer"}
                            </p>
                            <p className="text-[11px] text-[#211000]/45">
                              {paymentMethod === "paystack"
                                ? "You'll be redirected to Paystack to complete payment"
                                : "Receipt uploaded and ready for verification"}
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="rounded-xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-5 space-y-3">
                      <div className="flex items-center gap-2 text-[#5F7161]">
                        <ShieldCheck className="size-5" />
                        <p className="text-sm font-bold">Your Order is Protected</p>
                      </div>
                      <ul className="text-xs text-[#211000]/65 space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="size-3.5 text-[#5F7161] shrink-0 mt-0.5" />
                          <span>{REFUND_WINDOW_DAYS}-day window to report issues after receiving your order</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="size-3.5 text-[#5F7161] shrink-0 mt-0.5" />
                          <span>Seller location and contact shared only after payment is confirmed</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="size-3.5 text-[#5F7161] shrink-0 mt-0.5" />
                          <span>24/7 support for any issues or disputes</span>
                        </li>
                      </ul>
                    </div>

                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 size-4 rounded border-[#211000]/20 text-[#B66B44] focus:ring-[#B66B44]"
                      />
                      <span className="text-xs text-[#211000]/60 leading-relaxed">
                        I confirm all information is correct and authorize Refurnish to process my payment.
                      </span>
                    </label>
                  </div>

                  <div className="flex justify-between mt-6">
                    <button
                      onClick={() => setStep("payment")}
                      className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/60 hover:text-[#211000] transition-colors"
                    >
                      <ArrowLeft className="size-4" />
                      Back
                    </button>
                    <button
                      onClick={handlePlaceOrder}
                      disabled={!canProceed() || processing}
                      className="inline-flex items-center gap-2 bg-[#5F7161] hover:bg-[#4d5e50] disabled:opacity-60 text-white font-bold text-sm px-8 py-4 rounded-full transition-all shadow-md shadow-[#5F7161]/15"
                    >
                      {processing ? (
                        <>
                          <Loader2 className="size-4 animate-spin" />
                          Processing...
                        </>
                      ) : (
                        <>
                          <Lock className="size-4" />
                          {paymentMethod === "paystack" ? "Pay with Paystack" : "Submit Order"}
                        </>
                      )}
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary Sidebar */}
          <aside className="lg:col-span-5">
            <div className="sticky top-28 rounded-3xl bg-white border border-[#211000]/8 shadow-sm overflow-hidden">
              <div className="p-6 border-b border-[#211000]/8">
                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44] mb-2">
                  Order Summary
                </p>
                <h2 className="font-serif text-2xl font-medium">
                  {cartProducts.length} {cartProducts.length === 1 ? "piece" : "pieces"}
                </h2>
              </div>

              <div className="p-6 space-y-5">
                <div className="space-y-3">
                  {cartProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#E8CEB0]/30 shrink-0">
                        {product.images[0] && (
                          <img
                            src={product.images[0]}
                            alt={product.title}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/45 truncate">
                          {product.brand}
                        </p>
                        <p className="text-xs font-medium truncate">{product.title}</p>
                        <p className="text-[10px] text-[#211000]/40">
                          Qty: {quantities[String(product.id)] || 1}
                        </p>
                      </div>
                      <p className="text-xs font-bold shrink-0">
                        {formatNaira(product.price * (quantities[String(product.id)] || 1))}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t border-[#211000]/10 pt-5 space-y-3 text-sm">
                  <SummaryRow label="Subtotal" value={formatNaira(subtotal)} />
                </div>

                <div className="border-t border-[#211000]/10 pt-5 flex items-center justify-between">
                  <span className="font-serif text-xl font-medium">Total</span>
                  <span className="text-2xl font-bold">{formatNaira(total)}</span>
                </div>

                <div className="grid gap-3 pt-4">
                  <TrustBadge
                    icon={<ShieldCheck className="size-4 text-[#5F7161]" />}
                    title="Buyer Protection"
                    text="Report issues within 3 days of receiving"
                  />
                  <TrustBadge
                    icon={<Timer className="size-4 text-[#B66B44]" />}
                    title="Fast confirmation"
                    text="We confirm payments within a few hours"
                  />
                  <TrustBadge
                    icon={<Headphones className="size-4 text-[#5F7161]" />}
                    title="24/7 Support"
                    text="Reach out any time for help"
                  />
                </div>

                <div className="rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-4 text-center">
                  <MessageCircle className="size-5 text-[#B66B44] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#211000] mb-1">Have questions?</p>
                  <p className="text-[11px] text-[#211000]/55 mb-3">Our support team is here to help</p>
                  <Link
                    href="/support"
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-[#B66B44] hover:underline"
                  >
                    Start live chat
                    <ArrowRight className="size-3" />
                  </Link>
                </div>
              </div>
            </div>
          </aside>
        </div>
        )}
      </div>

      <PaymentResultModal
        status={paymentModal}
        orderReference={orderReference}
        total={total}
        paymentMethod={paymentMethod}
        email={email}
        errorMessage={paymentError}
        onRetry={() => setPaymentModal(null)}
      />
    </main>
  );
}

/* ==== Helper components ==== */

function SectionTitle({ icon, title, subtitle }) {
  return (
    <div className="mb-6">
      <div className="flex items-center gap-2 text-[#B66B44] mb-2">
        {icon}
        <span className="text-[11px] font-bold uppercase tracking-[0.25em]">Step</span>
      </div>
      <h2 className="font-serif text-2xl font-medium tracking-tight">{title}</h2>
      <p className="text-sm text-[#211000]/50 font-medium mt-1">{subtitle}</p>
    </div>
  );
}

function IconInput({ icon, label, value, onChange, placeholder, type = "text", required = false }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#211000]/40">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          required={required}
          className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 pl-11 pr-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
        />
      </div>
    </div>
  );
}

function SelectField({ label, value, onChange, options, placeholder }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 px-4 py-3.5 text-sm font-medium text-[#211000] focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23211000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m2 4 4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
        }}
      >
        <option value="" disabled>{placeholder}</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>
    </div>
  );
}

function InfoRow({ icon, label, value }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-[#211000]/40">{icon}</span>
      <div>
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/40">{label}</p>
        <p className="text-sm font-medium">{value}</p>
      </div>
    </div>
  );
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#211000]/55 font-medium">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function TrustBadge({ icon, title, text }) {
  return (
    <div className="flex items-start gap-3 rounded-xl bg-[#FAF4EC] border border-[#211000]/6 p-3">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-xs font-bold">{title}</p>
        <p className="text-[11px] text-[#211000]/50 font-medium leading-relaxed">{text}</p>
      </div>
    </div>
  );
}

function PaymentResultModal({ status, orderReference, total, paymentMethod, email, errorMessage, onRetry }) {
  return (
    <AnimatePresence>
      {status && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center px-4"
        >
          <div className="absolute inset-0 bg-[#211000]/60 backdrop-blur-sm" />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            transition={{ type: "spring", stiffness: 280, damping: 28 }}
            className="relative w-full max-w-lg rounded-3xl bg-[#FAF4EC] border border-[#211000]/10 shadow-2xl overflow-hidden"
          >
            {status === "success" ? (
              <div className="p-7 sm:p-9 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-[#5F7161]/10 flex items-center justify-center mx-auto mb-5"
                >
                  <CheckCircle2 className="size-10 text-[#5F7161]" />
                </motion.div>

                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
                  Order submitted
                </p>

                <h2 className="font-serif text-3xl font-medium tracking-tight mt-2 mb-3">
                  We're confirming your payment.
                </h2>

                <p className="text-sm text-[#211000]/60 font-medium leading-relaxed max-w-sm mx-auto">
                  Your receipt has been submitted for order <strong>{orderReference}</strong>. We'll confirm
                  your payment and send an update to <strong>{email}</strong> — usually within a few hours.
                </p>

                <div className="mt-6 rounded-2xl bg-white border border-[#211000]/8 p-4 text-left space-y-3">
                  <InfoLine label="Order reference" value={orderReference} mono />
                  <InfoLine label="Amount" value={formatNaira(total)} />
                </div>

                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <Link
                    href="/dashboard/orders"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-[#B66B44]/15"
                  >
                    View orders
                    <ArrowRight className="size-4" />
                  </Link>
                  <Link
                    href="/shop"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-[#E8CEB0]/25 border border-[#211000]/12 text-[#211000] px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Continue shopping
                  </Link>
                </div>
              </div>
            ) : (
              <div className="p-7 sm:p-9 text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 220, delay: 0.1 }}
                  className="w-20 h-20 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-5"
                >
                  <AlertCircle className="size-10 text-red-500" />
                </motion.div>

                <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-red-500">
                  Order issue
                </p>

                <h2 className="font-serif text-3xl font-medium tracking-tight mt-2 mb-3">
                  We couldn't place your order.
                </h2>

                <p className="text-sm text-[#211000]/60 font-medium leading-relaxed max-w-sm mx-auto">
                  {errorMessage || "Something went wrong. Please try again or contact support."}
                </p>

                <div className="mt-7 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <button
                    onClick={onRetry}
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors shadow-md shadow-[#B66B44]/15"
                  >
                    Try again
                    <RefreshCcw className="size-4" />
                  </button>
                  <Link
                    href="/support"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-white hover:bg-[#E8CEB0]/25 border border-[#211000]/12 text-[#211000] px-5 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                  >
                    Contact support
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoLine({ label, value, mono = false }) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-[#211000]/45 font-medium">{label}</span>
      <span className={`font-bold text-right text-[#211000] ${mono ? "font-mono text-xs" : ""}`}>
        {value}
      </span>
    </div>
  );
}