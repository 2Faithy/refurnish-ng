"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Package,
  ShieldCheck,
  Truck,
  CheckCircle2,
  Clock,
  AlertCircle,
  MapPin,
  Phone,
  Mail,
  User,
  Copy,
  CreditCard,
  Banknote,
  MessageCircle,
  Star,
  AlertTriangle,
  X,
  Loader2,
  ThumbsUp,
  ThumbsDown,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import { formatNaira } from "@/lib/data";

/* ========== Types ========== */
type OrderItem = {
  image?: string;
  itemTitle: string;
  sellerName: string;
  quantity: number;
  price: number;
  listingId?: string;
  sellerAddress?: string;
  sellerState?: string;
};

type SellerConfirmation = {
  availability?: string | null; // null | "available" | "unavailable"
};

type Dispute = {
  status: string;
  resolution?: string;
};

type Review = {
  rating: number;
  comment?: string;
  recommend?: boolean | null;
};

type Order = {
  reference: string;
  createdAt: string;
  status: string;
  deliveryType: "delivery" | "pickup" | string;
  fullName: string;
  phone: string;
  email: string;
  address?: string;
  lga?: string;
  state?: string;
  deliveryDate?: string;
  paymentMethod: "paystack" | "transfer" | string;
  receiptUrl?: string;
  total: number | string;
  rejectionReason?: string;
  items?: OrderItem[];
  reviews?: Review[];
  disputes?: Dispute[];
  sellerConfirmations?: SellerConfirmation[];
};

type ReviewPayload = {
  rating: number;
  comment: string;
  recommend: boolean | null;
};

type ComplaintPayload = {
  reason: string;
  description: string;
};

export default function OrderDetailPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id as string | undefined;

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [toast, setToast] = useState("");

  const [warningModal, setWarningModal] = useState(false);
  const [reviewModal, setReviewModal] = useState(false);
  const [complaintModal, setComplaintModal] = useState(false);
  const [confirmingReceived, setConfirmingReceived] = useState(false);

  const getToken = () => {
    const user = JSON.parse(localStorage.getItem("refurnish_user") || "null");
    return user?.token || "";
  };

  const fetchOrder = async () => {
    setLoading(true);
    setLoadError("");
    const token = getToken();
    if (!token) {
      router.push(`/login?next=${encodeURIComponent(`/dashboard/orders/${orderId}`)}`);
      return;
    }
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Could not load this order.");
      setOrder(data.order);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Could not load this order.";
      setLoadError(message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (orderId) fetchOrder();
  }, [orderId]);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 2500);
    return () => clearTimeout(t);
  }, [toast]);

  const handleConfirmReceived = async () => {
    setConfirmingReceived(true);
    setWarningModal(false);

    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/confirm-received`,
        {
          method: "POST",
          headers: { Authorization: `Bearer ${getToken()}` },
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to confirm.");
      setOrder(data.order);
      setReviewModal(true);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setToast(message);
    } finally {
      setConfirmingReceived(false);
    }
  };

  const handleSkipReview = () => {
    setReviewModal(false);
    setToast("Order completed. You can review later.");
  };

  const handleSubmitReview = async (review: ReviewPayload) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/submit-review`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(review),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to submit review.");
      setToast("Review submitted. Thank you!");
      fetchOrder();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setToast(message);
    } finally {
      setReviewModal(false);
    }
  };

  const handleSubmitComplaint = async (complaint: ComplaintPayload) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/orders/${orderId}/dispute`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getToken()}`,
          },
          body: JSON.stringify(complaint),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data?.message || "Failed to file dispute.");
      setToast("Dispute filed. Our team will review shortly.");
      fetchOrder();
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Something went wrong.";
      setToast(message);
    } finally {
      setComplaintModal(false);
    }
  };

  const copyId = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    setToast(`${label} copied`);
  };

  const messageSeller = async (listingId?: string) => {
    if (!listingId) return;
    const token = getToken();
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/conversations`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ listingId }),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.message || "Couldn't start a chat with the seller.");
        return;
      }
      router.push(`/dashboard/messages?conversationId=${data.conversation.id}`);
    } catch (err) {
      console.error(err);
      setToast("Couldn't reach the server. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="px-4 py-20 max-w-3xl mx-auto text-center">
        <Loader2 className="size-8 animate-spin text-[#B66B44] mx-auto" />
      </div>
    );
  }

  if (loadError || !order) {
    return (
      <div className="px-4 py-20 max-w-3xl mx-auto text-center">
        <Package className="size-12 text-[#211000]/20 mx-auto mb-4" />
        <h1 className="font-serif text-2xl font-medium mb-2">Order not found</h1>
        <p className="text-sm text-[#211000]/55 mb-6">
          {loadError || "We couldn't find an order with that ID."}
        </p>
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-5 py-3 text-xs font-bold uppercase tracking-wider"
        >
          Back to orders
        </Link>
      </div>
    );
  }

  const canConfirmReceived = order.status === "confirmed";
  const isCompleted = order.status === "completed";
  const isDisputed = order.status === "disputed";
  const hasReview = (order.reviews?.length ?? 0) > 0;
  const openDispute = order.disputes?.find((d) => d.status !== "resolved");
  const resolvedDispute = order.disputes?.find((d) => d.status === "resolved");

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-4 sm:py-6 lg:py-8 max-w-5xl mx-auto pb-32">
      {/* Header */}
      <div className="mb-6 lg:mb-8">
        <Link
          href="/dashboard/orders"
          className="inline-flex items-center gap-2 text-xs font-bold text-[#211000]/50 hover:text-[#B66B44] transition-colors mb-4"
        >
          <ArrowLeft className="size-3.5" />
          Back to orders
        </Link>

        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
              Order detail
            </p>
            <h1 className="font-mono text-2xl sm:text-3xl font-medium tracking-tight mt-2">
              {order.reference}
            </h1>
            <p className="text-sm text-[#211000]/55 font-medium mt-1">
              Placed on{" "}
              {new Date(order.createdAt).toLocaleDateString("en-NG", {
                day: "numeric",
                month: "long",
                year: "numeric",
              })}
            </p>
          </div>

          <button
            onClick={() => copyId(order.reference, "Reference")}
            className="inline-flex items-center gap-2 rounded-full bg-white border border-[#211000]/10 hover:border-[#B66B44]/30 px-4 py-2 text-xs font-bold transition-colors self-start"
          >
            <Copy className="size-3" />
            Copy reference
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-5 lg:gap-6">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-5">
          <OrderTracking order={order} />

          {/* Items */}
          <div className="rounded-2xl bg-white border border-[#211000]/6 overflow-hidden">
            <div className="p-5 border-b border-[#211000]/6">
              <h2 className="font-serif text-lg font-medium">Items</h2>
              <p className="text-xs text-[#211000]/45 font-medium mt-0.5">
                {order.items?.length} {order.items?.length === 1 ? "piece" : "pieces"}
              </p>
            </div>

            <div className="divide-y divide-[#211000]/6">
              {order.items?.map((item, i) => (
                <div key={i} className="p-4 sm:p-5 flex items-center gap-4">
                  <div className="size-16 sm:size-20 rounded-xl overflow-hidden bg-[#E8CEB0]/30 shrink-0">
                    {item.image && (
                      <img
                        src={item.image}
                        alt={item.itemTitle}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/45">
                      {item.sellerName}
                    </p>
                    <h3 className="font-serif text-sm sm:text-base font-medium truncate">
                      {item.itemTitle}
                    </h3>
                    <p className="text-[11px] text-[#211000]/45 font-medium mt-1">
                      Qty: {item.quantity}
                    </p>
                  </div>

                  <p className="text-sm font-bold shrink-0">
                    {formatNaira(item.price * item.quantity)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery info */}
          <div className="rounded-2xl bg-white border border-[#211000]/6 p-5">
            <h2 className="font-serif text-lg font-medium mb-4">
              {order.deliveryType === "delivery" ? "Delivery information" : "Pickup information"}
            </h2>

            <div className="space-y-3 text-sm">
              <InfoRow icon={<User className="size-4" />} label="Contact" value={order.fullName} />
              <InfoRow icon={<Phone className="size-4" />} label="Phone" value={order.phone} />
              <InfoRow icon={<Mail className="size-4" />} label="Email" value={order.email} />

              {order.deliveryType === "delivery" ? (
                <InfoRow
                  icon={<MapPin className="size-4" />}
                  label="Address"
                  value={`${order.address || ""}, ${order.lga || ""}, ${order.state || ""}`}
                />
              ) : order.status === "confirmed" || order.status === "completed" ? (
                <div className="rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-3 space-y-2">
                  <p className="text-xs font-bold text-[#B66B44] mb-1 flex items-center gap-1">
                    <MapPin className="size-3.5" />
                    Pickup locations
                  </p>
                  {order.items?.map((item, i) => (
                    <div key={i} className="flex items-center justify-between gap-3">
                      <p className="text-xs text-[#211000]/65">
                        <strong>{item.itemTitle}</strong> — {item.sellerName}
                        {item.sellerAddress ? `, ${item.sellerAddress}` : ""}
                        {item.sellerState ? `, ${item.sellerState}` : ""}
                      </p>
                      <button
                        onClick={() => messageSeller(item.listingId)}
                        className="shrink-0 inline-flex items-center gap-1.5 rounded-full bg-[#211000] text-[#FAF4EC] px-3 py-1.5 text-[10px] font-bold hover:bg-[#211000]/90 transition-colors"
                      >
                        <MessageCircle className="size-3" />
                        Chat for directions
                      </button>
                    </div>
                  ))}
                  <p className="text-[10px] text-[#211000]/45 font-medium pt-1">
                    Phone numbers stay private — message the seller here to arrange exact meeting details.
                  </p>
                </div>
              ) : (
                <div className="rounded-xl bg-[#FAF4EC] border border-[#211000]/8 p-3">
                  <p className="text-xs text-[#211000]/55">
                    Seller pickup details will be shared once your payment is confirmed.
                  </p>
                </div>
              )}

              {order.deliveryDate && (
                <InfoRow
                  icon={<Clock className="size-4" />}
                  label="Preferred date"
                  value={order.deliveryDate}
                />
              )}
            </div>
          </div>

          {/* Payment info */}
          <div className="rounded-2xl bg-white border border-[#211000]/6 p-5">
            <h2 className="font-serif text-lg font-medium mb-4">Payment</h2>

            <div className="rounded-xl bg-[#FAF4EC] border border-[#211000]/6 p-4 mb-4">
              <div className="flex items-center gap-3 mb-3">
                {order.paymentMethod === "paystack" && (
                  <CreditCard className="size-5 text-[#B66B44]" />
                )}
                {order.paymentMethod === "transfer" && (
                  <Banknote className="size-5 text-[#B66B44]" />
                )}
                <div>
                  <p className="text-sm font-bold">
                    {order.paymentMethod === "paystack" ? "Paystack" : "Bank Transfer"}
                  </p>
                  <p className="text-[11px] text-[#211000]/45">
                    {order.paymentMethod === "paystack"
                      ? "Paid via Paystack"
                      : "Direct bank transfer"}
                  </p>
                </div>
              </div>

              <div className="pt-3 border-t border-[#211000]/8 flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/45">
                    Payment reference
                  </p>
                  <p className="font-mono text-xs font-bold mt-0.5">{order.reference}</p>
                </div>
                <button
                  onClick={() => copyId(order.reference, "Reference")}
                  className="text-[#B66B44] hover:underline text-xs font-bold flex items-center gap-1"
                >
                  <Copy className="size-3" />
                  Copy
                </button>
              </div>

              {order.receiptUrl && (
                <div className="pt-3 mt-3 border-t border-[#211000]/8">
                  <a
                    href={order.receiptUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-[#B66B44] hover:underline"
                  >
                    View uploaded receipt →
                  </a>
                </div>
              )}
            </div>

            <div className="space-y-2 text-sm">
              <div className="pt-2 flex items-center justify-between">
                <span className="text-sm font-bold">Total paid</span>
                <span className="text-lg font-bold">
                  {formatNaira(Number(order.total) || 0)}
                </span>
              </div>
            </div>

            {order.status === "rejected" && order.rejectionReason && (
              <div className="mt-4 rounded-xl bg-red-50 border border-red-200 p-3">
                <p className="text-xs font-bold text-red-700 mb-1">Payment was rejected</p>
                <p className="text-xs text-red-600">{order.rejectionReason}</p>
              </div>
            )}
          </div>
        </div>

        {/* Right column - Actions */}
        <div className="space-y-5">
          {canConfirmReceived && !isDisputed && (
            <div className="rounded-2xl bg-white border-2 border-[#B66B44]/30 overflow-hidden">
              <div className="bg-[#B66B44]/5 p-5 border-b border-[#B66B44]/20">
                <div className="flex items-center gap-2 text-[#B66B44] mb-1">
                  <ShieldCheck className="size-4" />
                  <p className="text-[10px] font-bold uppercase tracking-wider">
                    Payment confirmed
                  </p>
                </div>
                <h3 className="font-serif text-xl font-medium">Have you received it?</h3>
                <p className="text-xs text-[#211000]/65 font-medium mt-1 leading-relaxed">
                  Let us know once you've picked up or received your item.
                </p>
              </div>

              <div className="p-5 space-y-3">
                <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex gap-2">
                  <AlertTriangle className="size-4 text-red-600 shrink-0 mt-0.5" />
                  <div className="text-[11px] text-red-700 leading-relaxed font-medium">
                    <strong className="font-bold">Important:</strong> Only click "Received" if
                    the item is physically in your hands and matches the description.
                  </div>
                </div>

                <button
                  onClick={() => setWarningModal(true)}
                  disabled={confirmingReceived}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#5F7161] hover:bg-[#4d5e50] disabled:opacity-60 text-white py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {confirmingReceived ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Confirming...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="size-4" />
                      Confirm received
                    </>
                  )}
                </button>

                <button
                  onClick={() => setComplaintModal(true)}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-white border border-red-300 hover:bg-red-50 text-red-600 py-3.5 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <AlertTriangle className="size-4" />
                  Report a problem
                </button>
              </div>
            </div>
          )}

          {isCompleted && (
            <div className="rounded-2xl bg-[#5F7161]/10 border border-[#5F7161]/30 p-5 text-center">
              <CheckCircle2 className="size-10 text-[#5F7161] mx-auto mb-3" />
              <h3 className="font-serif text-lg font-medium text-[#5F7161] mb-2">
                Order completed
              </h3>
              <p className="text-xs text-[#211000]/65 font-medium leading-relaxed mb-4">
                Thank you for using Refurnish!
              </p>
              {!hasReview && (
                <button
                  onClick={() => setReviewModal(true)}
                  className="inline-flex items-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  <Star className="size-3.5" />
                  Leave a review
                </button>
              )}
              {hasReview && (
                <p className="text-xs text-[#5F7161] font-bold flex items-center justify-center gap-1">
                  <CheckCircle2 className="size-3.5" />
                  Review submitted
                </p>
              )}
            </div>
          )}

          {isDisputed && (
            <div className="rounded-2xl bg-red-50 border border-red-200 p-5">
              <AlertTriangle className="size-8 text-red-600 mb-3" />
              <h3 className="font-serif text-lg font-medium text-red-700 mb-2">
                {resolvedDispute ? "Dispute resolved" : "Dispute filed"}
              </h3>
              {openDispute && (
                <p className="text-xs text-red-600 font-medium leading-relaxed mb-4">
                  Our team is reviewing your dispute. Expect a response within 24 hours.
                </p>
              )}
              {resolvedDispute && (
                <div className="rounded-xl bg-white border border-red-200 p-3 mb-4">
                  <p className="text-[10px] font-bold uppercase tracking-wider text-red-500 mb-1">
                    Resolution
                  </p>
                  <p className="text-xs text-red-700">{resolvedDispute.resolution}</p>
                </div>
              )}
              <Link
                href="/support"
                className="inline-flex items-center gap-2 rounded-full bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                Contact support
                <ArrowRight className="size-3.5" />
              </Link>
            </div>
          )}

          <div className="rounded-2xl bg-[#211000] text-[#FAF4EC] p-5">
            <MessageCircle className="size-5 text-[#E8CEB0] mb-3" />
            <h3 className="font-serif text-lg font-medium mb-2">Need help?</h3>
            <p className="text-xs text-[#FAF4EC]/55 leading-relaxed mb-4">
              Our support team is available 24/7 for order and delivery issues.
            </p>
            <Link
              href="/support"
              className="inline-flex items-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] text-white px-4 py-2 text-xs font-bold uppercase tracking-wider transition-colors"
            >
              Live chat
              <ArrowRight className="size-3" />
            </Link>
          </div>
        </div>
      </div>

      <WarningModal
        open={warningModal}
        onClose={() => setWarningModal(false)}
        onConfirm={handleConfirmReceived}
      />

      <ReviewModal
        open={reviewModal}
        onSkip={handleSkipReview}
        onSubmit={handleSubmitReview}
      />

      <ComplaintModal
        open={complaintModal}
        onClose={() => setComplaintModal(false)}
        onSubmit={handleSubmitComplaint}
      />

      <Toast message={toast} />
    </div>
  );
}

/* ========== Tracking ========== */
function OrderTracking({ order }: { order: Order }) {
  const paymentConfirmed = ["confirmed", "completed", "disputed"].includes(order.status);

  // Pickup readiness must come from the seller actually confirming — not just
  // from payment being confirmed, otherwise the tracker overstates progress
  // before the seller has said anything.
  const sellerAvailability = order.sellerConfirmations?.[0]?.availability;
  const sellerConfirmedAvailable = sellerAvailability === "available";
  const sellerSaidUnavailable = sellerAvailability === "unavailable";

  const steps = [
    {
      id: "ordered",
      label: "Order placed",
      desc: "Your order has been submitted",
      done: true,
    },
    {
      id: "confirmed",
      label: "Payment confirmed",
      desc: "We've confirmed your payment",
      done: paymentConfirmed,
    },
    {
      id: "pickup",
      label: order.deliveryType === "pickup" ? "Ready for pickup" : "Out for delivery",
      desc: sellerSaidUnavailable
        ? "Item unavailable — refund initiated"
        : order.deliveryType === "pickup"
        ? sellerConfirmedAvailable
          ? "Seller confirmed availability"
          : "Waiting on seller to confirm"
        : "On the way to you",
      done: order.deliveryType === "pickup" ? sellerConfirmedAvailable : paymentConfirmed,
    },
    {
      id: "received",
      label: order.deliveryType === "pickup" ? "Picked up" : "Delivered",
      desc: "You confirmed receipt",
      done: order.status === "completed",
    },
  ];

  const rejected = order.status === "rejected" || order.status === "payment_failed";

  if (rejected) {
    return (
      <div className="rounded-2xl bg-white border border-[#211000]/6 p-5">
        <h2 className="font-serif text-lg font-medium mb-3">Order status</h2>
        <div className="flex items-center gap-3 text-red-600">
          <AlertCircle className="size-5" />
          <p className="text-sm font-bold">Payment could not be confirmed</p>
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-2xl bg-white border border-[#211000]/6 p-5">
      <h2 className="font-serif text-lg font-medium mb-5">Order tracking</h2>

      <div className="space-y-4">
        {steps.map((step, i) => (
          <div key={step.id} className="flex items-start gap-3">
            <div className="flex flex-col items-center">
              <div
                className={`size-8 rounded-full flex items-center justify-center transition-all ${
                  step.done
                    ? "bg-[#5F7161] text-white"
                    : "bg-[#211000]/8 text-[#211000]/35"
                }`}
              >
                {step.done ? (
                  <CheckCircle2 className="size-4" />
                ) : (
                  <span className="text-xs font-bold">{i + 1}</span>
                )}
              </div>
              {i < steps.length - 1 && (
                <div
                  className={`w-0.5 h-8 mt-1 ${
                    step.done ? "bg-[#5F7161]" : "bg-[#211000]/10"
                  }`}
                />
              )}
            </div>

            <div className="flex-1 pb-2">
              <p
                className={`text-sm font-bold ${
                  step.done ? "text-[#211000]" : "text-[#211000]/45"
                }`}
              >
                {step.label}
              </p>
              <p className="text-xs text-[#211000]/45 font-medium mt-0.5">{step.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ========== Warning Modal ========== */
function WarningModal({
  open,
  onClose,
  onConfirm,
}: {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
}) {
  const [confirmed, setConfirmed] = useState(false);

  useEffect(() => {
    if (!open) setConfirmed(false);
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center px-4"
        >
          <div
            className="absolute inset-0 bg-[#211000]/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            className="relative w-full max-w-md rounded-3xl bg-[#FAF4EC] border border-[#211000]/10 shadow-2xl overflow-hidden"
          >
            <div className="p-7 text-center">
              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <AlertTriangle className="size-8 text-red-600" />
              </div>

              <h2 className="font-serif text-2xl font-medium tracking-tight mb-3">
                Important confirmation
              </h2>

              <p className="text-sm text-[#211000]/70 font-medium leading-relaxed mb-5">
                Only confirm if you have{" "}
                <strong className="text-red-600">physically received</strong> the item and
                inspected it.
              </p>

              <div className="rounded-xl bg-red-50 border border-red-200 p-4 text-left mb-5">
                <p className="text-xs font-bold text-red-700 mb-2">
                  By confirming, you agree that:
                </p>
                <ul className="space-y-1.5 text-xs text-red-700 font-medium">
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>The item is in your possession</span>
                  </li>
                  <li className="flex gap-2">
                    <span className="shrink-0">•</span>
                    <span>It matches the description and photos</span>
                  </li>
                </ul>
              </div>

              <label className="flex items-start gap-2 cursor-pointer mb-5 text-left">
                <input
                  type="checkbox"
                  checked={confirmed}
                  onChange={(e) => setConfirmed(e.target.checked)}
                  className="mt-0.5 size-4 rounded border-[#211000]/20 text-[#B66B44] focus:ring-[#B66B44]"
                />
                <span className="text-xs text-[#211000]/70 font-medium">
                  I confirm I have received the item and inspected it.
                </span>
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onClose}
                  className="rounded-full bg-white border border-[#211000]/15 hover:bg-[#E8CEB0]/25 text-[#211000] py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={onConfirm}
                  disabled={!confirmed}
                  className="rounded-full bg-[#5F7161] hover:bg-[#4d5e50] disabled:opacity-40 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Yes, confirm
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ========== Review Modal ========== */
function ReviewModal({
  open,
  onSkip,
  onSubmit,
}: {
  open: boolean;
  onSkip: () => void;
  onSubmit: (review: ReviewPayload) => void;
}) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [recommend, setRecommend] = useState<boolean | null>(null);

  useEffect(() => {
    if (!open) {
      setRating(0);
      setComment("");
      setRecommend(null);
    }
  }, [open]);

  const handleSubmit = () => {
    if (rating === 0) return;
    onSubmit({ rating, comment: comment.trim(), recommend });
  };

  return (
    <AnimatePresence>
      {open && (
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
            className="relative w-full max-w-md rounded-3xl bg-[#FAF4EC] border border-[#211000]/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-7">
              <div className="w-16 h-16 rounded-full bg-[#5F7161]/10 flex items-center justify-center mx-auto mb-4">
                <Sparkles className="size-8 text-[#5F7161]" />
              </div>

              <h2 className="font-serif text-2xl font-medium tracking-tight text-center mb-2">
                How was your experience?
              </h2>

              <p className="text-sm text-[#211000]/55 font-medium text-center mb-6">
                Your review helps other buyers make better decisions.
              </p>

              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 mb-3 text-center">
                  Rate this purchase
                </p>
                <div className="flex justify-center gap-2">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onClick={() => setRating(star)}
                      onMouseEnter={() => setHoverRating(star)}
                      onMouseLeave={() => setHoverRating(0)}
                      className="transition-transform hover:scale-110"
                    >
                      <Star
                        className={`size-9 ${
                          (hoverRating || rating) >= star
                            ? "fill-[#B66B44] text-[#B66B44]"
                            : "text-[#211000]/15"
                        }`}
                      />
                    </button>
                  ))}
                </div>
                {rating > 0 && (
                  <p className="text-center text-xs text-[#211000]/55 font-medium mt-2">
                    {rating === 5 && "Excellent"}
                    {rating === 4 && "Very good"}
                    {rating === 3 && "Good"}
                    {rating === 2 && "Fair"}
                    {rating === 1 && "Poor"}
                  </p>
                )}
              </div>

              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                  Tell us more (optional)
                </label>
                <textarea
                  rows={4}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your experience with this seller and item..."
                  className="w-full rounded-xl bg-white border border-[#211000]/12 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all resize-none"
                />
              </div>

              <div className="mb-6">
                <p className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 mb-3">
                  Would you recommend this seller?
                </p>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setRecommend(true)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      recommend === true
                        ? "bg-[#5F7161] text-white border-[#5F7161]"
                        : "bg-white border-[#211000]/10 hover:border-[#5F7161]/30"
                    }`}
                  >
                    <ThumbsUp className="size-4" />
                    Yes
                  </button>
                  <button
                    onClick={() => setRecommend(false)}
                    className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all ${
                      recommend === false
                        ? "bg-red-500 text-white border-red-500"
                        : "bg-white border-[#211000]/10 hover:border-red-300"
                    }`}
                  >
                    <ThumbsDown className="size-4" />
                    No
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onSkip}
                  className="rounded-full bg-white border border-[#211000]/15 hover:bg-[#E8CEB0]/25 text-[#211000] py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Not now
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={rating === 0}
                  className="rounded-full bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-40 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Submit review
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ========== Complaint Modal ========== */
function ComplaintModal({
  open,
  onClose,
  onSubmit,
}: {
  open: boolean;
  onClose: () => void;
  onSubmit: (complaint: ComplaintPayload) => void;
}) {
  const [reason, setReason] = useState("");
  const [description, setDescription] = useState("");

  const REASONS = [
    { id: "not_received", label: "Item not received" },
    { id: "not_as_described", label: "Item not as described" },
    { id: "damaged", label: "Item arrived damaged" },
    { id: "missing_parts", label: "Missing parts" },
    { id: "wrong_item", label: "Wrong item received" },
    { id: "other", label: "Other issue" },
  ];

  useEffect(() => {
    if (!open) {
      setReason("");
      setDescription("");
    }
  }, [open]);

  const handleSubmit = () => {
    if (!reason || description.length < 20) return;
    onSubmit({ reason, description: description.trim() });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[80] flex items-center justify-center px-4"
        >
          <div
            className="absolute inset-0 bg-[#211000]/60 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.94, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.94, y: 20 }}
            className="relative w-full max-w-lg rounded-3xl bg-[#FAF4EC] border border-[#211000]/10 shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="p-7">
              <button
                onClick={onClose}
                className="absolute top-4 right-4 size-9 rounded-full hover:bg-[#211000]/5 transition-colors grid place-items-center"
              >
                <X className="size-4 text-[#211000]/60" />
              </button>

              <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mb-4">
                <AlertTriangle className="size-8 text-red-600" />
              </div>

              <h2 className="font-serif text-2xl font-medium tracking-tight mb-2">
                Report a problem
              </h2>

              <p className="text-sm text-[#211000]/55 font-medium mb-6">
                Tell us what's wrong. Our team will review and get back to you.
              </p>

              <div className="mb-5">
                <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-3">
                  What's the issue?
                </label>
                <div className="space-y-2">
                  {REASONS.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => setReason(r.id)}
                      className={`w-full text-left p-3 rounded-xl border text-sm font-medium transition-all ${
                        reason === r.id
                          ? "bg-red-50 border-red-300 text-red-700"
                          : "bg-white border-[#211000]/10 hover:border-red-200"
                      }`}
                    >
                      {r.label}
                    </button>
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                  Describe the problem
                </label>
                <textarea
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Tell us exactly what happened. Include details that will help our team review your case..."
                  className="w-full rounded-xl bg-white border border-[#211000]/12 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-red-300 focus:ring-2 focus:ring-red-100 transition-all resize-none leading-relaxed"
                />
                <p className="text-[11px] text-[#211000]/40 font-medium mt-1.5">
                  {description.length} characters (minimum 20)
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={onClose}
                  className="rounded-full bg-white border border-[#211000]/15 hover:bg-[#E8CEB0]/25 text-[#211000] py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmit}
                  disabled={!reason || description.length < 20}
                  className="rounded-full bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  File dispute
                </button>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ========== Helpers ========== */
function InfoRow({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-[#211000]/40 mt-0.5">{icon}</span>
      <div className="flex-1 min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/45">
          {label}
        </p>
        <p className="text-sm font-medium mt-0.5">{value}</p>
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
          className="fixed bottom-6 left-1/2 z-[90] inline-flex items-center gap-2 bg-[#211000] text-[#FAF4EC] px-5 py-3 rounded-full shadow-2xl"
        >
          <CheckCircle2 className="size-4 text-[#5F7161]" />
          <span className="text-xs font-bold">{message}</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}