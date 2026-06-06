"use client";

import { useEffect, useState, useMemo, useRef, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  BadgeCheck,
  Check,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  Shield,
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
  Wallet,
  Banknote,
  Smartphone,
  Loader2,
  Sparkles,
  AlertTriangle,
  Headphones,
  FileText,
  Scale,
  Timer,
  RefreshCcw,
  X,
  Upload,
  Eye,
  Calendar,
  Clock,
  Map,
  Navigation,
  Send,
  Download,
  Copy,
  ExternalLink,
} from "lucide-react";
import { products, formatNaira, type Product } from "@/lib/data";

const CART_KEY = "refurnish_cart";
const QTY_KEY = "refurnish_cart_quantities";
const ORDERS_KEY = "refurnish_orders";

// Escrow configuration
const ESCROW_RELEASE_DAYS = 7;
const REFUND_WINDOW_DAYS = 3;
const DELIVERY_FEE = 8500;

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

export default function CheckoutPage() {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [step, setStep] = useState<"delivery" | "payment" | "confirm">("delivery");
  const [processing, setProcessing] = useState(false);
const [orderId, setOrderId] = useState("");
const [paymentReference, setPaymentReference] = useState("");

const [paymentModal, setPaymentModal] = useState<"success" | "error" | null>(null);
const [paymentError, setPaymentError] = useState("");

  // Delivery info
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [landmark, setLandmark] = useState("");
  const [deliveryType, setDeliveryType] = useState<"delivery" | "pickup">("delivery");
  const [deliveryDate, setDeliveryDate] = useState("");
  const [deliveryNotes, setDeliveryNotes] = useState("");
  const [showMap, setShowMap] = useState(false);

  // Payment
  const [paymentMethod, setPaymentMethod] = useState<"card" | "transfer" | "ussd">("card");
  const [cardNumber, setCardNumber] = useState("");
  const [cardExpiry, setCardExpiry] = useState("");
  const [cardCvv, setCardCvv] = useState("");
  const [cardName, setCardName] = useState("");
  const [saveCard, setSaveCard] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Bank transfer
  const [receiptFile, setReceiptFile] = useState<File | null>(null);
  const [receiptPreview, setReceiptPreview] = useState<string | null>(null);
  const [uploadingReceipt, setUploadingReceipt] = useState(false);

  // Cart data
  const [cartIds, setCartIds] = useState<number[]>([]);
  const [quantities, setQuantities] = useState<Record<string, number>>({});
  const [sellerLocations, setSellerLocations] = useState<Record<number, { address: string; state: string; lga: string }>>({});

  // Load cart and user data
  useEffect(() => {
    try {
      const cart = localStorage.getItem(CART_KEY);
      const qty = localStorage.getItem(QTY_KEY);
      if (cart) {
        const parsed = JSON.parse(cart);
        if (parsed.length === 0) {
          router.push("/cart");
          return;
        }
        setCartIds(parsed);

        // Mock seller locations (in production, fetch from product data)
        const locations: Record<number, { address: string; state: string; lga: string }> = {};
        parsed.forEach((id: number) => {
          const product = products.find((p) => p.id === id);
          if (product) {
            locations[id] = {
              address: `${product.location}`,
              state: "Lagos",
              lga: product.location.split(",")[0] || "Lagos",
            };
          }
        });
        setSellerLocations(locations);
      }
      if (qty) setQuantities(JSON.parse(qty));

      // Load saved user info
      const user = localStorage.getItem("refurnish_user");
      if (user) {
        const userData = JSON.parse(user);
        if (userData.name) setFullName(userData.name);
        if (userData.email) setEmail(userData.email);
        if (userData.phone) setPhone(userData.phone);
      }
    } catch {
      router.push("/cart");
    }
  }, [router]);

  // Generate unique payment reference
  const generatePaymentReference = useCallback(() => {
    const timestamp = Date.now().toString(36).toUpperCase();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `RF-PAY-${timestamp}-${random}`;
  }, []);

  useEffect(() => {
    setPaymentReference(generatePaymentReference());
  }, [generatePaymentReference]);

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

  const discount = 0;
  const deliveryFee = deliveryType === "delivery" ? DELIVERY_FEE : 0;
  const buyerProtection = Math.round(subtotal * 0.01);
  const total = subtotal - discount + deliveryFee + buyerProtection;

  const canProceed = () => {
    // 1. Base contact info & terms checkbox must always be present
    const baseInfoValid = fullName && phone && email && agreeTerms;
    if (!baseInfoValid) return false;
  
    // 2. Validate delivery address (always required for home delivery)
    if (deliveryType === "delivery") {
      const deliveryValid = address && state && lga;
      if (!deliveryValid) return false;
    }
  
    // 3. Only validate payment details when on payment or confirm step
    if (step === "payment" || step === "confirm") {
      if (paymentMethod === "card") {
        const cardValid = cardNumber && cardExpiry && cardCvv && cardName;
        if (!cardValid) return false;
      }
  
      if (paymentMethod === "transfer") {
        const transferValid = receiptFile !== null;
        if (!transferValid) return false;
      }
    }
  
    return true;
  };

  const handleReceiptUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    const validTypes = ["image/jpeg", "image/png", "image/jpg", "application/pdf"];
    if (!validTypes.includes(file.type)) {
      alert("Please upload a JPG, PNG, or PDF receipt");
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setUploadingReceipt(true);

    // Create preview
    const reader = new FileReader();
    reader.onload = (ev) => {
      setReceiptPreview(ev.target?.result as string);
      setReceiptFile(file);
      setUploadingReceipt(false);
    };
    reader.readAsDataURL(file);

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handlePlaceOrder = async () => {
    setProcessing(true);
    setPaymentError("");
  
    try {
      // Simulate payment processing / receipt verification request
      await new Promise((r) =>
        setTimeout(r, paymentMethod === "transfer" ? 1500 : 2500)
      );
  
      const newOrderId = `RF-ORD-${Date.now().toString(36).toUpperCase()}`;
      setOrderId(newOrderId);
  
      const newOrder = {
        id: newOrderId,
        paymentReference,
        items: cartProducts.map((p) => ({
          id: p.id,
          title: p.title,
          price: p.price,
          image: p.images[0],
          seller: p.brand,
          sellerLocation: sellerLocations[p.id],
        })),
        subtotal,
        deliveryFee,
        buyerProtection,
        total,
        status:
          paymentMethod === "transfer"
            ? "pending_payment_confirmation"
            : "escrow_active",
        escrowStatus:
          paymentMethod === "transfer"
            ? "awaiting_verification"
            : "funds_held",
        deliveryInfo: {
          type: deliveryType,
          name: fullName,
          phone,
          email,
          address: deliveryType === "delivery" ? address : null,
          state: deliveryType === "delivery" ? state : null,
          lga: deliveryType === "delivery" ? lga : null,
          landmark: deliveryType === "delivery" ? landmark : null,
          date: deliveryDate,
          notes: deliveryNotes,
        },
        paymentMethod,
        paymentDetails: {
          cardLast4: paymentMethod === "card" ? cardNumber.slice(-4) : null,
          transferReceipt: paymentMethod === "transfer" ? true : null,
        },
        createdAt: new Date().toISOString(),
        escrowReleaseDate: new Date(
          Date.now() + ESCROW_RELEASE_DAYS * 24 * 60 * 60 * 1000
        ).toISOString(),
        refundWindowEnds: new Date(
          Date.now() + REFUND_WINDOW_DAYS * 24 * 60 * 60 * 1000
        ).toISOString(),
        paymentConfirmedAt:
          paymentMethod === "transfer" ? null : new Date().toISOString(),
      };
  
      const existing = localStorage.getItem(ORDERS_KEY);
      const orders = existing ? JSON.parse(existing) : [];
      orders.push(newOrder);
      localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  
      // Clear cart only after successful order creation
      localStorage.removeItem(CART_KEY);
      localStorage.removeItem(QTY_KEY);
  
      // Mock email send
      console.log("Order confirmation sent to:", email);
      console.log("Payment reference:", paymentReference);
  
      setPaymentModal("success");
    } catch (error) {
      console.error(error);
      setPaymentError(
        "We could not confirm your payment at this moment. Your cart has not been cleared, so you can safely try again."
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
                Your payment is protected by Refurnish Escrow. Funds are only released after you confirm delivery.
              </p>
            </div>

            <div className="inline-flex items-center gap-2 rounded-full bg-[#5F7161]/10 border border-[#5F7161]/20 px-4 py-2">
              <ShieldCheck className="size-4 text-[#5F7161]" />
              <span className="text-xs font-bold text-[#5F7161]">Escrow Protected</span>
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
                (step === "confirm" && i < 2) ||
                (step === "delivery" && i === 0);

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
                    {/* Delivery Type */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-3">
                        How would you like to receive your order?
                      </label>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Home Delivery */}
                        <motion.button
                          whileTap={{ scale: 0.98 }}
                          onClick={() => {
                            setDeliveryType("delivery");
                            setShowMap(false);
                          }}
                          className={`relative p-5 rounded-xl border text-left transition-all ${
                            deliveryType === "delivery"
                              ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                              : "bg-[#FAF4EC] border-[#211000]/10 hover:border-[#B66B44]/30"
                          }`}
                        >
                          {deliveryType === "delivery" && (
                            <div className="absolute top-4 right-4 size-6 rounded-full bg-[#E8CEB0] flex items-center justify-center">
                              <Check className="size-3.5 text-[#211000]" />
                            </div>
                          )}
                          <Truck className="size-6 mb-3" />
                          <p className="text-sm font-bold">Home Delivery</p>
                          <p
                            className={`text-[11px] mt-1 ${
                              deliveryType === "delivery" ? "text-[#E8CEB0]/70" : "text-[#211000]/45"
                            }`}
                          >
                            Logistics partner delivers to your address
                          </p>
                          <p className="text-xs font-bold mt-2 text-[#B66B44]">
                            + {formatNaira(DELIVERY_FEE)}
                          </p>
                        </motion.button>

                        {/* Pickup from Seller */}
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
                          <p className="text-xs font-bold mt-2 text-[#5F7161]">
                            Free
                          </p>
                        </motion.button>
                      </div>
                    </div>

                    {/* Pickup Location Info */}
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
                          {cartProducts.map((product) => {
                            const location = sellerLocations[product.id];
                            return (
                              <div key={product.id} className="text-xs text-[#211000]/70">
                                <p className="font-bold text-[#211000]">{product.title}</p>
                                <p>{location?.address || product.location}</p>
                              </div>
                            );
                          })}
                        </div>
                        <p className="text-[11px] text-[#211000]/50 flex items-center gap-1">
                          <Info className="size-3" />
                          Seller location will be shared after payment confirmation
                        </p>
                      </motion.div>
                    )}

                    {/* Contact Info */}
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

                    {/* Delivery Address (only for home delivery) */}
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
    // Safe-guard in case state is still holding an old object:
    value={typeof lga === 'object' ? '' : lga} 
    onChange={(e) => {
      setLga(e.target.value); // 👈 CHANGE THIS: Gets the string text instead of the event object
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

                        {/* Google Map Preview */}
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
  // Change this line:
  onChange={(e) => setDeliveryNotes(e.target.value)} 
  className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all resize-none"
/>
                        </div>
                      </motion.div>
                    )}

                    {/* Terms */}
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
                          . I understand that my payment will be held in escrow and released to the seller after I confirm delivery.
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
                    {/* Payment Reference */}
                    <div className="rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-4">
                      <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/50 mb-1">
                        Payment Reference ID
                      </p>
                      <div className="flex items-center justify-between">
                        <p className="font-mono text-sm font-bold text-[#211000]">{paymentReference}</p>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(paymentReference);
                          }}
                          className="text-[#B66B44] hover:underline text-xs font-bold flex items-center gap-1"
                        >
                          <Copy className="size-3" />
                          Copy
                        </button>
                      </div>
                      <p className="text-[11px] text-[#211000]/50 mt-2">
                        Keep this reference for your records and payment confirmation
                      </p>
                    </div>

                    {/* Payment Options */}
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {[
                        {
                          id: "card",
                          label: "Card",
                          desc: "Instant confirmation",
                          icon: CreditCard,
                        },
                        {
                          id: "transfer",
                          label: "Bank Transfer",
                          desc: "Upload receipt for verification",
                          icon: Banknote,
                        },
                        {
                          id: "ussd",
                          label: "USSD",
                          desc: "Pay with USSD code",
                          icon: Smartphone,
                        },
                      ].map((opt) => {
                        const Icon = opt.icon;
                        const isSelected = paymentMethod === opt.id;
                        return (
                          <motion.button
                            key={opt.id}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setPaymentMethod(opt.id as "card" | "transfer" | "ussd")}
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

                    {/* Card Details */}
                    {paymentMethod === "card" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-4 pt-4 border-t border-[#211000]/8"
                      >
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                            Card Number
                          </label>
                          <div className="relative">
                            <CreditCard className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-[#211000]/40" />
                            <input
                              type="text"
                              placeholder="0000 0000 0000 0000"
                              value={cardNumber}
                              onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, "").slice(0, 16))}
                              maxLength={16}
                              className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 pl-11 pr-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                              Expiry Date
                            </label>
                            <input
                              type="text"
                              placeholder="MM/YY"
                              value={cardExpiry}
                              onChange={(e) => setCardExpiry(e.target.value)}
                              maxLength={5}
                              className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                            />
                          </div>
                          <div>
                            <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                              CVV
                            </label>
                            <input
                              type="text"
                              placeholder="123"
                              value={cardCvv}
                              onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, "").slice(0, 3))}
                              maxLength={3}
                              className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                            Cardholder Name
                          </label>
                          <input
                            type="text"
                            placeholder="Name on card"
                            value={cardName}
                            onChange={(e) => setCardName(e.target.value)}
                            className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                          />
                        </div>

                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={saveCard}
                            onChange={(e) => setSaveCard(e.target.checked)}
                            className="size-4 rounded border-[#211000]/20 text-[#B66B44] focus:ring-[#B66B44]"
                          />
                          <span className="text-xs text-[#211000]/60 font-medium">
                            Save card for future purchases
                          </span>
                        </label>
                      </motion.div>
                    )}

                    {/* Bank Transfer */}
                    {paymentMethod === "transfer" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="space-y-5 pt-4 border-t border-[#211000]/8"
                      >
                        {/* Account Details */}
                        <div className="rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-5 space-y-3">
                          <div className="flex items-center gap-2 text-[#B66B44]">
                            <Banknote className="size-4" />
                            <p className="text-sm font-bold">Bank Transfer Details</p>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                            <div>
                              <p className="text-[#211000]/50 font-medium">Bank</p>
                              <p className="font-bold text-[#211000]">Refurnish Escrow Account</p>
                            </div>
                            <div>
                              <p className="text-[#211000]/50 font-medium">Account Number</p>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-[#211000] font-mono">1234567890</p>
                                <button
                                  onClick={() => navigator.clipboard.writeText("1234567890")}
                                  className="text-[#B66B44] hover:underline"
                                >
                                  <Copy className="size-3" />
                                </button>
                              </div>
                            </div>
                            <div>
                              <p className="text-[#211000]/50 font-medium">Account Name</p>
                              <p className="font-bold text-[#211000]">Refurnish NG Ltd</p>
                            </div>
                            <div>
                              <p className="text-[#211000]/50 font-medium">Payment Reference</p>
                              <p className="font-bold text-[#211000] font-mono text-[10px]">{paymentReference}</p>
                            </div>
                          </div>
                          <div className="rounded-lg bg-white/50 border border-[#211000]/8 p-3">
                            <p className="text-[11px] text-[#211000]/60 leading-relaxed">
                              <strong className="text-[#211000]">Important:</strong> Use the payment reference above as your transfer narration/reference. This helps us match your payment to your order.
                            </p>
                          </div>
                        </div>

                        {/* Receipt Upload */}
                        <div>
                          <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-3">
                            Upload Payment Receipt *
                          </label>
                          <div
                            onClick={() => fileInputRef.current?.click()}
                            className="border-2 border-dashed border-[#211000]/15 rounded-xl p-6 text-center cursor-pointer hover:border-[#B66B44]/40 hover:bg-[#E8CEB0]/10 transition-all"
                          >
                            {receiptPreview ? (
                              <div className="space-y-3">
                                <div className="relative inline-block">
                                  <img
                                    src={receiptPreview}
                                    alt="Receipt preview"
                                    className="max-h-48 rounded-lg border border-[#211000]/10"
                                  />
                                  <button
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setReceiptFile(null);
                                      setReceiptPreview(null);
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
                                <p className="text-xs text-[#211000]/45">
                                  JPG, PNG or PDF (max 5MB)
                                </p>
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
                          <p className="text-[11px] text-[#211000]/50 mt-2 flex items-center gap-1">
                            <AlertCircle className="size-3" />
                            Your order will be confirmed once we verify your payment receipt (usually within 1-2 hours)
                          </p>
                        </div>
                      </motion.div>
                    )}

                    {/* USSD */}
                    {paymentMethod === "ussd" && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-5 space-y-3"
                      >
                        <div className="flex items-center gap-2 text-[#B66B44]">
                          <Smartphone className="size-4" />
                          <p className="text-sm font-bold">USSD Payment</p>
                        </div>
                        <div className="rounded-lg bg-white/50 border border-[#211000]/8 p-4 space-y-2 text-xs">
                          <p className="text-[#211000]/70">
                            Dial <strong className="text-[#211000] font-mono">*770*1234567890#</strong> from your registered phone number
                          </p>
                          <p className="text-[#211000]/70">
                            Enter amount: <strong className="text-[#211000]">{formatNaira(total)}</strong>
                          </p>
                          <p className="text-[#211000]/70">
                            Use reference: <strong className="text-[#211000] font-mono">{paymentReference}</strong>
                          </p>
                        </div>
                        <p className="text-[11px] text-[#211000]/50">
                          Supported banks: GTBank, Zenith, Access, UBA, First Bank
                        </p>
                      </motion.div>
                    )}

                    {/* Escrow Notice */}
                    <div className="rounded-xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-4 flex gap-3">
                      <ShieldCheck className="size-5 text-[#5F7161] shrink-0 mt-0.5" />
                      <div className="text-xs text-[#211000]/65 leading-relaxed">
                        <p className="font-bold text-[#211000] mb-1">Escrow Protection Active</p>
                        <p>
                          Your payment is held securely until you confirm delivery. You have {REFUND_WINDOW_DAYS} days to report any issues. Funds auto-release after {ESCROW_RELEASE_DAYS} days if no dispute is raised.
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
                    {/* Order Items */}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#211000]/60 mb-4">
                        Order Items
                      </h3>
                      <div className="space-y-3">
                        {cartProducts.map((product) => (
                          <div key={product.id} className="flex items-center gap-4 p-3 rounded-xl bg-[#FAF4EC]">
                            <div className="w-16 h-16 rounded-lg overflow-hidden bg-white shrink-0">
                              <img
                                src={product.images[0]}
                                alt={product.title}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/45">
                                {product.brand}
                              </p>
                              <h4 className="font-serif text-sm font-medium truncate">{product.title}</h4>
                              <p className="text-[11px] text-[#211000]/45 mt-0.5">
                                Qty: {quantities[String(product.id)] || 1}
                              </p>
                            </div>
                            <p className="text-sm font-bold shrink-0">
                              {formatNaira(product.price * (quantities[String(product.id)] || 1))}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delivery Info */}
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
                            Seller location will be shared after payment confirmation
                          </div>
                        )}
                        <InfoRow icon={<User className="size-4" />} label="Name" value={fullName} />
                        <InfoRow icon={<Phone className="size-4" />} label="Phone" value={phone} />
                        <InfoRow icon={<Mail className="size-4" />} label="Email" value={email} />
                        {deliveryDate && <InfoRow icon={<Calendar className="size-4" />} label="Date" value={deliveryDate} />}
                      </div>
                    </div>

                    {/* Payment Info */}
                    <div>
                      <h3 className="text-sm font-bold uppercase tracking-wider text-[#211000]/60 mb-4">
                        Payment Method
                      </h3>
                      <div className="rounded-xl bg-[#FAF4EC] border border-[#211000]/8 p-4">
                        <div className="flex items-center gap-3 mb-3">
                          {paymentMethod === "card" && <CreditCard className="size-5 text-[#B66B44]" />}
                          {paymentMethod === "transfer" && <Banknote className="size-5 text-[#B66B44]" />}
                          {paymentMethod === "ussd" && <Smartphone className="size-5 text-[#B66B44]" />}
                          <div>
                            <p className="text-sm font-bold capitalize">{paymentMethod}</p>
                            <p className="text-[11px] text-[#211000]/45">
                              {paymentMethod === "card" ? `Card ending in ****${cardNumber.slice(-4)}` : "Secure payment"}
                            </p>
                          </div>
                        </div>
                        {paymentMethod === "transfer" && receiptFile && (
                          <div className="flex items-center gap-2 text-xs text-[#5F7161] font-bold">
                            <CheckCircle2 className="size-4" />
                            Receipt uploaded and ready for verification
                          </div>
                        )}
                        <div className="mt-3 pt-3 border-t border-[#211000]/8">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/45 mb-1">
                            Payment Reference
                          </p>
                          <p className="font-mono text-sm font-bold text-[#211000]">{paymentReference}</p>
                        </div>
                      </div>
                    </div>

                    {/* Protection Notice */}
                    <div className="rounded-xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-5 space-y-3">
                      <div className="flex items-center gap-2 text-[#5F7161]">
                        <ShieldCheck className="size-5" />
                        <p className="text-sm font-bold">Your Order is Protected</p>
                      </div>
                      <ul className="text-xs text-[#211000]/65 space-y-2">
                        <li className="flex items-start gap-2">
                          <Check className="size-3.5 text-[#5F7161] shrink-0 mt-0.5" />
                          <span>Funds held in escrow until you confirm delivery</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="size-3.5 text-[#5F7161] shrink-0 mt-0.5" />
                          <span>{REFUND_WINDOW_DAYS}-day refund window if item not as described</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="size-3.5 text-[#5F7161] shrink-0 mt-0.5" />
                          <span>Auto-release after {ESCROW_RELEASE_DAYS} days if no dispute</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <Check className="size-3.5 text-[#5F7161] shrink-0 mt-0.5" />
                          <span>24/7 support for any issues or disputes</span>
                        </li>
                      </ul>
                    </div>

                    {/* Terms */}
                    <label className="flex items-start gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={agreeTerms}
                        onChange={(e) => setAgreeTerms(e.target.checked)}
                        className="mt-0.5 size-4 rounded border-[#211000]/20 text-[#B66B44] focus:ring-[#B66B44]"
                      />
                      <span className="text-xs text-[#211000]/60 leading-relaxed">
                        I confirm all information is correct and authorize Refurnish to process my payment. I understand the escrow terms and protection policy.
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
      Confirm Payment
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
                {/* Items */}
                <div className="space-y-3">
                  {cartProducts.map((product) => (
                    <div key={product.id} className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-lg overflow-hidden bg-[#E8CEB0]/30 shrink-0">
                        <img
                          src={product.images[0]}
                          alt={product.title}
                          className="w-full h-full object-cover"
                        />
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

                {/* Totals */}
                <div className="border-t border-[#211000]/10 pt-5 space-y-3 text-sm">
                  <SummaryRow label="Subtotal" value={formatNaira(subtotal)} />
                  <SummaryRow label="Delivery" value={deliveryType === "delivery" ? formatNaira(deliveryFee) : "Free"} />
                  <SummaryRow label="Buyer Protection (1%)" value={formatNaira(buyerProtection)} />
                </div>

                <div className="border-t border-[#211000]/10 pt-5 flex items-center justify-between">
                  <span className="font-serif text-xl font-medium">Total</span>
                  <span className="text-2xl font-bold">{formatNaira(total)}</span>
                </div>

                {/* Trust Badges */}
                <div className="grid gap-3 pt-4">
                  <TrustBadge
                    icon={<ShieldCheck className="size-4 text-[#5F7161]" />}
                    title="Escrow Protection"
                    text="Funds held until delivery confirmed"
                  />
                  <TrustBadge
                    icon={<Timer className="size-4 text-[#B66B44]" />}
                    title={`${REFUND_WINDOW_DAYS}-Day Refund`}
                    text="Report issues within 3 days"
                  />
                  <TrustBadge
                    icon={<Headphones className="size-4 text-[#5F7161]" />}
                    title="24/7 Support"
                    text="Live chat for any disputes"
                  />
                </div>

                {/* Support CTA */}
                <div className="rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-4 text-center">
                  <MessageCircle className="size-5 text-[#B66B44] mx-auto mb-2" />
                  <p className="text-xs font-bold text-[#211000] mb-1">
                    Have questions?
                  </p>
                  <p className="text-[11px] text-[#211000]/55 mb-3">
                    Our support team is here to help
                  </p>
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
      </div>
      <PaymentResultModal
  status={paymentModal}
  orderId={orderId}
  paymentReference={paymentReference}
  total={total}
  paymentMethod={paymentMethod}
  deliveryType={deliveryType}
  email={email}
  errorMessage={paymentError}
  onRetry={() => {
    setPaymentModal(null);
    setStep("payment");
  }}
/>
    </main>
  );
}

/* =========================================
   ORDER SUCCESS PAGE
   ========================================= */
function OrderSuccess({
  orderId,
  paymentReference,
  total,
  paymentMethod,
  deliveryType,
  email,
}: {
  orderId: string;
  paymentReference: string;
  total: number;
  paymentMethod: string;
  deliveryType: string;
  email: string;
}) {
  const isTransfer = paymentMethod === "transfer";

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased pt-28 sm:pt-32 lg:pt-40 pb-24 px-4 sm:px-8 lg:px-16">
      <div className="max-w-2xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
          className="w-24 h-24 rounded-full bg-[#5F7161]/10 flex items-center justify-center mx-auto mb-6"
        >
          <CheckCircle2 className="size-12 text-[#5F7161]" />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-3"
        >
          {isTransfer ? "Order Submitted!" : "Order Confirmed!"}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-sm text-[#211000]/55 font-medium mb-2"
        >
          Order ID: <strong className="text-[#211000]">{orderId}</strong>
        </motion.p>

        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="text-sm text-[#211000]/55 font-medium mb-8"
        >
          Total: <strong className="text-[#211000]">{formatNaira(total)}</strong>
        </motion.p>

        {/* Payment Reference */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="rounded-2xl bg-white border border-[#211000]/8 shadow-sm p-6 mb-8 text-left"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#B66B44]/10 flex items-center justify-center">
              <FileText className="size-5 text-[#B66B44]" />
            </div>
            <div>
              <p className="text-sm font-bold">Payment Reference</p>
              <p className="text-xs text-[#211000]/50">Keep this for your records</p>
            </div>
          </div>
          <div className="rounded-xl bg-[#FAF4EC] border border-[#211000]/8 p-4 flex items-center justify-between">
            <p className="font-mono text-sm font-bold text-[#211000]">{paymentReference}</p>
            <button
              onClick={() => navigator.clipboard.writeText(paymentReference)}
              className="text-[#B66B44] hover:underline text-xs font-bold flex items-center gap-1"
            >
              <Copy className="size-3" />
              Copy
            </button>
          </div>
        </motion.div>

        {/* Escrow Status Card */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="rounded-2xl bg-white border border-[#211000]/8 shadow-sm p-6 mb-8 text-left"
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-full bg-[#5F7161]/10 flex items-center justify-center">
              <ShieldCheck className="size-5 text-[#5F7161]" />
            </div>
            <div>
              <p className="text-sm font-bold">
                {isTransfer ? "Payment Pending Verification" : "Payment Held in Escrow"}
              </p>
              <p className="text-xs text-[#211000]/50">
                {isTransfer ? "We're verifying your receipt" : "Your funds are secure until delivery"}
              </p>
            </div>
          </div>

          <div className="space-y-3 text-xs text-[#211000]/65">
            {isTransfer ? (
              <>
                <div className="flex items-start gap-2">
                  <Check className="size-3.5 text-[#5F7161] shrink-0 mt-0.5" />
                  <span>Order submitted successfully</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-3.5 rounded-full border-2 border-[#B66B44] shrink-0 mt-0.5" />
                  <span>Receipt verification in progress (1-2 hours)</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-3.5 rounded-full border-2 border-[#211000]/20 shrink-0 mt-0.5" />
                  <span>Confirmation email will be sent to <strong>{email}</strong></span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-3.5 rounded-full border-2 border-[#211000]/20 shrink-0 mt-0.5" />
                  <span>Seller will be notified to prepare your order</span>
                </div>
              </>
            ) : (
              <>
                <div className="flex items-start gap-2">
                  <Check className="size-3.5 text-[#5F7161] shrink-0 mt-0.5" />
                  <span>Payment received and held securely</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-3.5 rounded-full border-2 border-[#B66B44] shrink-0 mt-0.5" />
                  <span>Seller will be notified to {deliveryType === "delivery" ? "ship" : "prepare"} your order</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-3.5 rounded-full border-2 border-[#211000]/20 shrink-0 mt-0.5" />
                  <span>Confirm {deliveryType === "delivery" ? "delivery" : "pickup"} to release payment</span>
                </div>
                <div className="flex items-start gap-2">
                  <div className="size-3.5 rounded-full border-2 border-[#211000]/20 shrink-0 mt-0.5" />
                  <span>{ESCROW_RELEASE_DAYS}-day window to report issues</span>
                </div>
              </>
            )}
          </div>
        </motion.div>

        {/* Email Confirmation Notice */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="rounded-2xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-6 mb-8"
        >
          <div className="flex items-center gap-2 text-[#B66B44] mb-3 justify-center">
            <Mail className="size-5" />
            <p className="text-sm font-bold">Confirmation Email Sent</p>
          </div>
          <p className="text-xs text-[#211000]/65 text-center">
            We've sent all order details and payment reference to <strong>{email}</strong>. Please check your inbox (and spam folder).
          </p>
        </motion.div>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="rounded-2xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-6 mb-8"
        >
          <h3 className="font-serif text-lg font-medium mb-3">What happens next?</h3>
          <ol className="text-xs text-[#211000]/65 space-y-2 text-left">
            <li><strong>1.</strong> {isTransfer ? "We verify your payment receipt (1-2 hours)" : "You'll receive an email confirmation shortly"}</li>
            <li><strong>2.</strong> Seller prepares your order for {deliveryType === "delivery" ? "delivery" : "pickup"}</li>
            <li><strong>3.</strong> Track your order in your dashboard</li>
            <li><strong>4.</strong> Confirm {deliveryType === "delivery" ? "delivery" : "pickup"} to release payment to seller</li>
            <li><strong>5.</strong> Enjoy your new piece!</li>
          </ol>
        </motion.div>

        {/* Actions */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex flex-col sm:flex-row gap-3 justify-center"
        >
          <Link
            href="/dashboard/orders"
            className="inline-flex items-center justify-center gap-2 bg-[#B66B44] hover:bg-[#a05934] text-white font-bold text-xs px-6 py-3.5 rounded-full transition-all shadow-md shadow-[#B66B44]/15"
          >
            Track Order
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/shop"
            className="inline-flex items-center justify-center gap-2 border border-[#211000]/15 bg-white hover:bg-[#E8CEB0]/20 text-[#211000] font-bold text-xs px-6 py-3.5 rounded-full transition-colors"
          >
            Continue Shopping
          </Link>
        </motion.div>

        {/* Support */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="text-xs text-[#211000]/45 font-medium mt-8"
        >
          Need help?{" "}
          <Link href="/support" className="text-[#B66B44] font-bold hover:underline">
            Contact support
          </Link>
        </motion.p>
      </div>
    </main>
  );
}

/* =========================================
   HELPER COMPONENTS
   ========================================= */
function SectionTitle({ icon, title, subtitle }: { icon: React.ReactNode; title: string; subtitle: string }) {
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

function IconInput({
  icon,
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
        {label}
      </label>
      <div className="relative">
        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#211000]/40">
          {icon}
        </span>
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

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
}) {
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

function InfoRow({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
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

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-[#211000]/55 font-medium">{label}</span>
      <span className="font-bold">{value}</span>
    </div>
  );
}

function TrustBadge({ icon, title, text }: { icon: React.ReactNode; title: string; text: string }) {
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

function PaymentResultModal({
  status,
  orderId,
  paymentReference,
  total,
  paymentMethod,
  deliveryType,
  email,
  errorMessage,
  onRetry,
}: {
  status: "success" | "error" | null;
  orderId: string;
  paymentReference: string;
  total: number;
  paymentMethod: string;
  deliveryType: string;
  email: string;
  errorMessage: string;
  onRetry: () => void;
}) {
  const isTransfer = paymentMethod === "transfer";

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
                  {isTransfer ? "Receipt submitted" : "Payment confirmed"}
                </p>

                <h2 className="font-serif text-3xl font-medium tracking-tight mt-2 mb-3">
                  {isTransfer
                    ? "We’re verifying your transfer."
                    : "Your order is protected."}
                </h2>

                <p className="text-sm text-[#211000]/60 font-medium leading-relaxed max-w-sm mx-auto">
                  {isTransfer
                    ? `Your receipt has been submitted. Once payment is confirmed, we’ll send the confirmation to ${email} and notify the seller.`
                    : "Your funds are now held safely in Refurnish Escrow. The seller only receives payment after you confirm delivery or pickup."}
                </p>

                <div className="mt-6 rounded-2xl bg-white border border-[#211000]/8 p-4 text-left space-y-3">
                  <InfoLine label="Order ID" value={orderId} />
                  <InfoLine label="Payment reference" value={paymentReference} mono />
                  <InfoLine label="Amount" value={formatNaira(total)} />
                  <InfoLine
                    label="Fulfilment"
                    value={
                      deliveryType === "delivery"
                        ? "Home delivery by logistics partner"
                        : "Pickup from seller"
                    }
                  />
                </div>

                <div className="mt-5 rounded-2xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-4 text-left">
                  <div className="flex items-start gap-3">
                    <ShieldCheck className="size-5 text-[#5F7161] shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-[#211000]">
                        Escrow protection is active
                      </p>
                      <p className="text-xs text-[#211000]/60 font-medium leading-relaxed mt-1">
                        You can request support or a refund if the item is not as described.
                        If no dispute is raised, payment is automatically released after the protection window.
                      </p>
                    </div>
                  </div>
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

                <p className="mt-5 text-[11px] text-[#211000]/45 font-medium">
                  Need help?{" "}
                  <Link
                    href="/support"
                    className="text-[#B66B44] font-bold hover:underline"
                  >
                    Contact support
                  </Link>
                </p>
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
                  Payment issue
                </p>

                <h2 className="font-serif text-3xl font-medium tracking-tight mt-2 mb-3">
                  We couldn’t confirm payment.
                </h2>

                <p className="text-sm text-[#211000]/60 font-medium leading-relaxed max-w-sm mx-auto">
                  {errorMessage ||
                    "Something went wrong while confirming your payment. Please try again or contact support."}
                </p>

                <div className="mt-6 rounded-2xl bg-white border border-[#211000]/8 p-4 text-left">
                  <InfoLine label="Payment reference" value={paymentReference} mono />
                  <InfoLine label="Amount" value={formatNaira(total)} />
                </div>

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

                <Link
                  href="/shop"
                  className="mt-5 inline-flex text-xs font-bold text-[#B66B44] hover:underline"
                >
                  Continue shopping
                </Link>
              </div>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function InfoLine({
  label,
  value,
  mono = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="text-[#211000]/45 font-medium">{label}</span>
      <span
        className={`font-bold text-right text-[#211000] ${
          mono ? "font-mono text-xs" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}