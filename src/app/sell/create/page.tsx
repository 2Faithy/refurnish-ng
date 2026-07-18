"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import {
    Camera,
    X,
    ArrowRight,
    ArrowLeft,
    Upload,
    Lightbulb,
    Star,
    Sofa,
    BedDouble,
    UtensilsCrossed,
    Briefcase,
    ChefHat,
    TreePine,
    Lamp,
    Bath,
    CheckCircle2,
    AlertCircle,
    MapPin,
    Phone,
    Mail,
    User,
    Truck,
    Users,
    Package,
    DollarSign,
    Ruler,
    Palette,
    Layers,
    Calendar,
    MessageCircle,
    ImageIcon,
    Loader2,
    Sparkles,
    Check,
    Info,
    Shield,
    Wrench,
    Maximize,
    Weight,
    ThumbsUp,
  } from "lucide-react";

const fadeUp = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0 },
};

const STEPS = [
  { id: "photos", label: "Photos & Info", icon: Camera },
  { id: "category", label: "Category", icon: Layers },
  { id: "condition", label: "Condition", icon: Star },
  { id: "description", label: "Description", icon: MessageCircle },
  { id: "pricing", label: "Pricing", icon: DollarSign },
  { id: "location", label: "Location", icon: MapPin },
  { id: "review", label: "Review", icon: CheckCircle2 },
];

const CATEGORIES = [
  { id: "living-room", label: "Living Room", icon: Sofa, desc: "Sofas, coffee tables, TV stands, shelves" },
  { id: "bedroom", label: "Bedroom", icon: BedDouble, desc: "Beds, wardrobes, dressers, nightstands" },
  { id: "dining", label: "Dining Room", icon: UtensilsCrossed, desc: "Tables, chairs, sideboards, bar carts" },
  { id: "office", label: "Office", icon: Briefcase, desc: "Desks, chairs, filing cabinets, bookcases" },
  { id: "kitchen", label: "Kitchen", icon: ChefHat, desc: "Cabinets, countertops, appliances" },
  { id: "outdoor", label: "Outdoor", icon: TreePine, desc: "Patio sets, garden furniture, loungers" },
  { id: "lighting", label: "Lighting", icon: Lamp, desc: "Pendants, chandeliers, floor lamps, sconces" },
  { id: "decor", label: "Decor & Art", icon: ImageIcon, desc: "Mirrors, wall art, vases, rugs" },
  { id: "bathroom", label: "Bathroom", icon: Bath, desc: "Vanities, showers, storage" },
  { id: "other", label: "Other", icon: Package, desc: "Miscellaneous furniture items" },
];

const CONDITIONS = [
  {
    id: "brand-new",
    label: "Brand New",
    desc: "Never used, with original packaging",
    color: "#5F7161",
    icon: <Check className="size-5" />,
  },
  {
    id: "like-new",
    label: "Like New",
    desc: "Used once or twice, no visible flaws",
    color: "#5F7161",
    icon: <Sparkles className="size-5" />,
  },
  {
    id: "very-good",
    label: "Very Good",
    desc: "Minor wear, fully functional",
    color: "#5F7161",
    icon: <Star className="size-5" />,
  },
  {
    id: "good",
    label: "Good",
    desc: "Some signs of wear, fully functional",
    color: "#B66B44",
    icon: <ThumbsUp className="size-5" />,
  },
  {
    id: "fair",
    label: "Fair",
    desc: "Noticeable wear but still functional",
    color: "#B66B44",
    icon: <AlertCircle className="size-5" />,
  },
  {
    id: "needs-repair",
    label: "Needs Repair",
    desc: "Requires fixing before use",
    color: "#c0392b",
    icon: <Wrench className="size-5" />,
  },
];

const COLORS = [
  "White",
  "Black",
  "Brown",
  "Beige",
  "Grey",
  "Blue",
  "Green",
  "Red",
  "Yellow",
  "Orange",
  "Purple",
  "Pink",
  "Natural Wood",
  "Multi-color",
  "Metallic",
  "Transparent",
];

const MATERIALS = [
  "Solid Wood",
  "Engineered Wood",
  "Metal",
  "Fabric",
  "Leather",
  "Glass",
  "Rattan",
  "Plastic",
  "Stone / Marble",
  "Velvet",
  "Linen",
  "Cotton",
  "Wool",
  "Acrylic",
  "Mixed Materials",
];

const AGES = [
  "Less than 1 year",
  "1-2 years",
  "2-5 years",
  "5-10 years",
  "10-20 years",
  "20+ years / Vintage",
];

const SELL_REASONS = [
  "Moving / Relocating",
  "Upgrading furniture",
  "Redecorating",
  "Downsizing",
  "No longer needed",
  "Financial reasons",
  "Estate sale",
  "Other",
];

const AVAILABILITY = [
  "Immediately",
  "Within 24 hours",
  "Within 3 days",
  "Within 1 week",
  "Within 2 weeks",
  "Flexible / Appointment only",
];

const URGENCY = ["Not urgent", "Somewhat urgent", "Very urgent - Sell ASAP"];

const CALL_TIMES = [
  "Anytime",
  "Morning (8am - 12pm)",
  "Afternoon (12pm - 5pm)",
  "Evening (5pm - 9pm)",
  "Weekends only",
];

const NIGERIAN_STATES = [
  "Abia", "Adamawa", "Akwa Ibom", "Anambra", "Bauchi", "Bayelsa", "Benue",
  "Borno", "Cross River", "Delta", "Ebonyi", "Edo", "Ekiti", "Enugu", "FCT",
  "Gombe", "Imo", "Jigawa", "Kaduna", "Kano", "Katsina", "Kebbi", "Kogi",
  "Kwara", "Lagos", "Nasarawa", "Niger", "Ogun", "Ondo", "Osun", "Oyo",
  "Plateau", "Rivers", "Sokoto", "Taraba", "Yobe", "Zamfara",
];

const DEFECTS = [
  { id: "scratches", label: "Scratches / Scuff marks" },
  { id: "stains", label: "Stains / Discoloration" },
  { id: "dents", label: "Dents / Dings" },
  { id: "chips", label: "Chips / Cracks" },
  { id: "tears", label: "Tears / Holes (upholstery)" },
  { id: "loose", label: "Loose parts / Handles" },
  { id: "structural", label: "Structural damage" },
  { id: "odors", label: "Odors / Smoke damage" },
];

// ThumbsUp component (not in lucide-react by default? but we can use a different one or import from another set. Since we are using lucide-react, let's use ThumbsUp from 'lucide-react' if available, else use a different icon. Actually, lucide-react does have ThumbsUp. But in the code above we used ThumbsUp in CONDITIONS. Let's assume it's available. If not, we can replace with ThumbsUp from 'lucide-react'.)

// We'll add a ThumbsUp import at the top? Actually, in the code above we used ThumbsUp in CONDITIONS array but didn't import it. Let's fix by importing it.

// However, note that the original code for CONDITIONS used Star, Check, etc. and we added ThumbsUp. So we must import ThumbsUp.

// Since I'm rewriting the entire file, I'll include the import for ThumbsUp.

// But wait, in the original provided code, we used:
//   import { ... Star, ... } from "lucide-react";
// So we need to add ThumbsUp to the import list.

// Let's adjust the import at the top.

export default function CreateListingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const editId = searchParams.get("edit");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(0);
  const [restoredNotice, setRestoredNotice] = useState(false);
  const [editingListingId, setEditingListingId] = useState<string | null>(null);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [editLoadError, setEditLoadError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Form state
  const [photos, setPhotos] = useState<string[]>([]);
  const [itemTitle, setItemTitle] = useState("");
  const [category, setCategory] = useState("");
  const [subCategory, setSubCategory] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const [condition, setCondition] = useState("");
  const [defects, setDefects] = useState<string[]>([]);
  const [conditionNotes, setConditionNotes] = useState("");
  const [age, setAge] = useState("");
  const [color, setColor] = useState("");
  const [material, setMaterial] = useState("");
  const [dimLength, setDimLength] = useState("");
  const [dimWidth, setDimWidth] = useState("");
  const [dimHeight, setDimHeight] = useState("");
  const [dimWeight, setDimWeight] = useState("");
  const [description, setDescription] = useState("");
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [originalPrice, setOriginalPrice] = useState("");
  const [sellingPrice, setSellingPrice] = useState("");
  const [negotiable, setNegotiable] = useState(true);
  const [sellReason, setSellReason] = useState("");
  const [availability, setAvailability] = useState("");
  const [urgency, setUrgency] = useState("");
  const [sellerName, setSellerName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [callTime, setCallTime] = useState("");
  const [address, setAddress] = useState("");
  const [state, setState] = useState("");
  const [lga, setLga] = useState("");
  const [warranty, setWarranty] = useState("");
  const [warrantyDuration, setWarrantyDuration] = useState("");

  const populateForm = (data: any) => {
    setPhotos(data.photos || []);
    setItemTitle(data.itemTitle || "");
    setCategory(data.category || "");
    setBrand(data.brand || "");
    setModel(data.model || "");
    setCondition(data.condition || "");
    setDefects(data.defects || []);
    setConditionNotes(data.conditionNotes || "");
    setAge(data.age || "");
    setColor(data.color || "");
    setMaterial(data.material || "");
    setDimLength(data.dimLength || "");
    setDimWidth(data.dimWidth || "");
    setDimHeight(data.dimHeight || "");
    setDimWeight(data.dimWeight || "");
    setDescription(data.description || "");
    setTags(data.tags || []);
    setOriginalPrice(data.originalPrice || "");
    setSellingPrice(data.sellingPrice || "");
    setNegotiable(data.negotiable ?? true);
    setSellReason(data.sellReason || "");
    setAvailability(data.availability || "");
    setUrgency(data.urgency || "");
    setSellerName(data.sellerName || "");
    setPhone(data.phone || "");
    setEmail(data.email || "");
    setWhatsapp(data.whatsapp || "");
    setCallTime(data.callTime || "");
    setAddress(data.address || "");
    setState(data.state || "");
    setLga(data.lga || "");
    setWarranty(data.warranty || "");
    setWarrantyDuration(data.warrantyDuration || "");
  };

  // Load a rejected listing for editing (via ?edit=<id>)
  useEffect(() => {
    if (!editId) return;

    const user = JSON.parse(localStorage.getItem("refurnish_user") || "null");

    if (!user?.token) {
      router.push(`/login?next=${encodeURIComponent(`/sell/create?edit=${editId}`)}`);
      return;
    }

    const loadListing = async () => {
      setLoadingEdit(true);
      setEditLoadError("");
      try {
        const res = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${editId}`,
          { headers: { Authorization: `Bearer ${user.token}` } }
        );
        const data = await res.json();

        if (!res.ok) {
          throw new Error(data?.message || "Could not load this listing.");
        }

        populateForm(data.listing);
        setEditingListingId(editId);
        setStep(6); // jump to review
      } catch (err: any) {
        setEditLoadError(err.message || "Could not load this listing.");
      } finally {
        setLoadingEdit(false);
      }
    };

    loadListing();
  }, [editId]);

  // Restore a listing that was saved before the person was sent to sign up
  useEffect(() => {
    if (editId) return; // editing takes priority over a stale draft
    const user = JSON.parse(localStorage.getItem("refurnish_user") || "null");
    const pending = localStorage.getItem("refurnish_pending_listing");
    if (user && pending) {
      try {
        const data = JSON.parse(pending);
        populateForm(data);
        setStep(6); // jump to review
        setRestoredNotice(true);
      } catch {
        localStorage.removeItem("refurnish_pending_listing");
      }
    }
  }, []);

  // Photos handler — uploads directly to Cloudinary
  const [uploadingCount, setUploadingCount] = useState(0);
  const [photoError, setPhotoError] = useState("");

  const uploadToCloudinary = async (file: File): Promise<string> => {
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
    const preset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;

    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", preset as string);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: "POST", body: formData }
    );

    const data = await res.json();

    if (!res.ok) {
      throw new Error(data?.error?.message || "Failed to upload image.");
    }

    return data.secure_url as string;
  };

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    setPhotoError("");

    const remaining = 10 - photos.length;
    const toAdd = Array.from(files).slice(0, remaining);

    setUploadingCount((c) => c + toAdd.length);

    for (const file of toAdd) {
      try {
        const url = await uploadToCloudinary(file);
        setPhotos((prev) => [...prev, url]);
      } catch (err: any) {
        console.error(err);
        setPhotoError(err.message || "Failed to upload one or more photos. Please try again.");
      } finally {
        setUploadingCount((c) => Math.max(0, c - 1));
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const removePhoto = (index: number) => {
    setPhotos((prev) => prev.filter((_, i) => i !== index));
  };

  const addTag = () => {
    const trimmed = tagInput.trim();
    if (trimmed && !tags.includes(trimmed) && tags.length < 8) {
      setTags([...tags, trimmed]);
      setTagInput("");
    }
  };

  const removeTag = (index: number) => {
    setTags(tags.filter((_, i) => i !== index));
  };

  const toggleDefect = (defectId: string) => {
    setDefects((prev) =>
      prev.includes(defectId)
        ? prev.filter((d) => d !== defectId)
        : [...prev, defectId]
    );
  };

  const canProceed = () => {
    switch (step) {
      case 0:
        return photos.length >= 1 && itemTitle.trim() && uploadingCount === 0;
  
      case 1:
        return category && age && color && material;
  
      case 2:
        return !!condition;
  
      case 3:
        return description.trim().length >= 20;
  
      case 4:
        return !!sellingPrice;
  
      case 5:
        return sellerName.trim() && phone.trim() && address.trim() && state;
  
      case 6:
        return true;
  
      default:
        return false;
    }
  };

  const goNext = () => {
    if (step < STEPS.length - 1) {
      setStep(step + 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const goBack = () => {
    if (step > 0) {
      setStep(step - 1);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const buildListingPayload = () => ({
    photos, itemTitle, category, brand, model, condition, defects,
    conditionNotes, age, color, material, dimLength, dimWidth, dimHeight,
    dimWeight, description, tags, originalPrice, sellingPrice, negotiable,
    sellReason, availability, urgency, sellerName, phone, email, whatsapp,
    callTime, address, state, lga, warranty, warrantyDuration,
  });

  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async () => {
    const user = JSON.parse(localStorage.getItem("refurnish_user") || "null");

    if (!user?.token) {
      // Save the completed form and send them to sign up first
      localStorage.setItem(
        "refurnish_pending_listing",
        JSON.stringify(buildListingPayload())
      );
      router.push("/login?mode=signup&next=/sell/create");
      return;
    }

    setSubmitError("");
    setSubmitting(true);
    try {
      const isEditing = !!editingListingId;
      const url = isEditing
        ? `${process.env.NEXT_PUBLIC_API_URL}/api/listings/${editingListingId}`
        : `${process.env.NEXT_PUBLIC_API_URL}/api/listings`;

      const res = await fetch(url, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user.token}`,
        },
        body: JSON.stringify(buildListingPayload()),
      });

      let data: any = null;
      try {
        data = await res.json();
      } catch {
        // Response wasn't JSON (e.g. a raw server error page)
      }

      if (!res.ok) {
        throw new Error(
          data?.message ||
            (res.status === 413
              ? "Your photos are too large. Try removing a few or using smaller images."
              : "Failed to submit listing.")
        );
      }

      localStorage.removeItem("refurnish_pending_listing");
      setSubmitted(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err: any) {
      console.error(err);
      setSubmitError(err.message || "Something went wrong submitting your listing. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased pt-28 pb-20 px-4 sm:px-8 lg:px-16">
        <div className="max-w-lg mx-auto text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="w-20 h-20 rounded-full bg-[#5F7161]/10 flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 className="size-10 text-[#5F7161]" />
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mb-3"
          >
            Listing submitted!
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-sm text-[#211000]/55 font-medium mb-8 max-w-md mx-auto"
          >
            {editingListingId ? (
              <>Your updated listing for <strong>"{itemTitle}"</strong> has been resubmitted for review. We'll reach out within a few hours.</>
            ) : (
              <>Your listing for <strong>"{itemTitle}"</strong> is now under review. We've sent a confirmation to your email, and we'll reach out within a few hours to let you know if it's approved.</>
            )}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="flex flex-col sm:flex-row gap-3 justify-center"
          >
            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center gap-2 bg-[#B66B44] hover:bg-[#a05934] text-white font-bold text-sm px-6 py-3.5 rounded-full transition-all shadow-md shadow-[#B66B44]/20"
            >
              Go to dashboard
              <ArrowRight className="size-4" />
            </Link>
            <Link
              href="/sell/create"
              onClick={() => window.location.reload()}
              className="inline-flex items-center justify-center gap-2 border border-[#211000]/15 bg-white hover:bg-[#E8CEB0]/20 text-[#211000] font-bold text-sm px-6 py-3.5 rounded-full transition-colors"
            >
              List another item
            </Link>
          </motion.div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#FAF4EC] text-[#211000] font-sans antialiased pt-28 pb-20 px-4 sm:px-8 lg:px-16">
      <div className="max-w-3xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link
            href="/sell"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/50 hover:text-[#B66B44] transition-colors mb-4"
          >
            <ArrowLeft className="size-4" />
            Back to Sell
          </Link>

          <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
            New listing
          </p>
          <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mt-1">
            List your piece
          </h1>
        </div>

        {restoredNotice && (
          <div className="mb-6 rounded-xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-4 flex gap-3">
            <CheckCircle2 className="size-5 text-[#5F7161] shrink-0 mt-0.5" />
            <p className="text-xs text-[#211000]/65 font-medium">
              Welcome back! We saved your listing — just review and publish below.
            </p>
          </div>
        )}

        {editingListingId && !loadingEdit && (
          <div className="mb-6 rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-4 flex gap-3">
            <Info className="size-5 text-[#B66B44] shrink-0 mt-0.5" />
            <p className="text-xs text-[#211000]/65 font-medium">
              Editing your listing — make the needed changes and resubmit for review.
            </p>
          </div>
        )}

        {loadingEdit && (
          <div className="mb-6 rounded-xl bg-white border border-[#211000]/10 p-6 flex items-center justify-center gap-3">
            <Loader2 className="size-5 animate-spin text-[#B66B44]" />
            <p className="text-sm text-[#211000]/55 font-medium">Loading your listing…</p>
          </div>
        )}

        {editLoadError && (
          <div className="mb-6 rounded-xl bg-red-50 border border-red-200 p-4 flex gap-3">
            <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-medium">{editLoadError}</p>
          </div>
        )}

        {/* Progress */}
        <div className="mb-10">
          {/* Bar */}
          <div className="w-full h-[3px] bg-[#211000]/10 rounded-full overflow-hidden mb-4">
            <motion.div
              className="h-full bg-[#B66B44]"
              initial={{ width: 0 }}
              animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
              transition={{ duration: 0.4, ease: "easeInOut" }}
            />
          </div>

          {/* Step pills (horizontally scrollable) */}
          <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2">
            {STEPS.map((s, i) => {
              const Icon = s.icon;
              const isActive = i === step;
              const isDone = i < step;

              return (
                <button
                  key={s.id}
                  onClick={() => i <= step && setStep(i)}
                  disabled={i > step}
                  className={`shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-bold transition-all duration-200 border ${
                    isActive
                      ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                      : isDone
                      ? "bg-[#5F7161]/10 text-[#5F7161] border-[#5F7161]/20 cursor-pointer"
                      : "bg-white/60 text-[#211000]/35 border-[#211000]/8 cursor-not-allowed"
                  }`}
                >
                  {isDone ? (
                    <Check className="size-3" />
                  ) : (
                    <Icon className="size-3" />
                  )}
                  <span className="hidden sm:inline">{s.label}</span>
                  <span className="sm:hidden">{i + 1}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          >
            {/* === STEP 0: Photos & Info === */}
            {step === 0 && (
              <div className="space-y-8">
                <SectionTitle
                  title="Photos & Item Name"
                  subtitle="Add up to 10 high-quality photos. First photo is the main image."
                />

                {/* Photo tip */}
                <div className="rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-4 flex gap-3">
                  <Lightbulb className="size-5 text-[#B66B44] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#211000]/65 font-medium leading-relaxed">
                    <strong className="text-[#211000] font-bold block mb-1">
                      Photo Tips:
                    </strong>
                    • Use bright, natural lighting (no flash)<br />
                    • Capture multiple angles (front, side, back, top)<br />
                    • Show any defects clearly in close-up<br />
                    • Use actual room settings for scale<br />
                    • Ensure item is clean and styled nicely
                  </div>
                </div>

                {/* Photo grid */}
                <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                  {photos.map((photo, i) => (
                    <div
                      key={i}
                      className="relative aspect-square rounded-xl overflow-hidden bg-white border border-[#211000]/10 group"
                    >
                      <img
                        src={photo}
                        alt={`Upload ${i + 1}`}
                        className="w-full h-full object-cover"
                      />
                      {i === 0 && (
                        <span className="absolute top-1.5 left-1.5 bg-[#B66B44] text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                          MAIN
                        </span>
                      )}
                      <button
                        onClick={() => removePhoto(i)}
                        className="absolute top-1.5 right-1.5 size-6 rounded-full bg-[#211000]/70 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="size-3" />
                      </button>
                    </div>
                  ))}

                  {uploadingCount > 0 &&
                    Array.from({ length: uploadingCount }).map((_, i) => (
                      <div
                        key={`uploading-${i}`}
                        className="aspect-square rounded-xl bg-white border border-[#211000]/10 flex items-center justify-center"
                      >
                        <Loader2 className="size-5 text-[#B66B44] animate-spin" />
                      </div>
                    ))}

                  {photos.length + uploadingCount < 10 && (
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="aspect-square rounded-xl border-2 border-dashed border-[#211000]/15 bg-white hover:bg-[#E8CEB0]/20 hover:border-[#B66B44]/40 transition-all flex flex-col items-center justify-center gap-1.5"
                    >
                      <Upload className="size-5 text-[#211000]/35" />
                      <span className="text-[10px] font-bold text-[#211000]/40">
                        Add Photo
                      </span>
                    </button>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>

                <p className="text-xs text-[#211000]/40 font-medium">
                  {photos.length}/10 photos uploaded (first photo will be the cover)
                </p>

                {photoError && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-3 flex gap-2">
                    <AlertCircle className="size-4 text-red-500 shrink-0 mt-0.5" />
                    <p className="text-xs text-red-700 font-medium">{photoError}</p>
                  </div>
                )}

                {/* Item title */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                    Item Title *
                  </label>
                  <input
                    type="text"
                    placeholder='e.g. "Walnut Mid-Century Dining Table" or "IKEA KALLAX Shelf Unit"'
                    value={itemTitle}
                    onChange={(e) => setItemTitle(e.target.value)}
                    className="w-full rounded-xl bg-white border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                  />
                  <p className="text-[11px] text-[#211000]/40 font-medium mt-1.5">
                    Be specific — include brand, style, and key features.
                  </p>
                </div>

                {/* Brand & Model */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                      Brand <span className="text-[#211000]/40">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. IKEA, Muji, Local Artisan"
                      value={brand}
                      onChange={(e) => setBrand(e.target.value)}
                      className="w-full rounded-xl bg-white border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                      Model / SKU <span className="text-[#211000]/40">(Optional)</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. KALLAX, EKTORP"
                      value={model}
                      onChange={(e) => setModel(e.target.value)}
                      className="w-full rounded-xl bg-white border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* === STEP 1: Category & Details === */}
            {step === 1 && (
              <div className="space-y-8">
                <SectionTitle
                  title="Category & Physical Details"
                  subtitle="Help buyers find your piece by selecting the right category and physical attributes."
                />

                {/* Category grid */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-3">
                    Furniture Category *
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {CATEGORIES.map((cat) => {
                      const Icon = cat.icon;
                      const isSelected = category === cat.id;
                      return (
                        <motion.button
                          key={cat.id}
                          whileTap={{ scale: 0.98 }}
                          onClick={() => setCategory(cat.id)}
                          className={`p-4 rounded-xl border text-left transition-all duration-200 ${
                            isSelected
                              ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                              : "bg-white border-[#211000]/10 hover:border-[#B66B44]/30"
                          }`}
                        >
                          <Icon className="size-5 mb-2" />
                          <span className="text-sm font-bold block">{cat.label}</span>
                          <span className={`text-[10px] mt-0.5 block ${
                            isSelected ? "text-[#E8CEB0]/70" : "text-[#211000]/45"
                          }`}>
                            {cat.desc}
                          </span>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                {/* Physical details row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <SelectField
                    label="Age"
                    icon={<Calendar className="size-4" />}
                    value={age}
                    onChange={setAge}
                    options={AGES}
                    placeholder="Select age"
                  />
                  <SelectField
                    label="Primary Color"
                    icon={<Palette className="size-4" />}
                    value={color}
                    onChange={setColor}
                    options={COLORS}
                    placeholder="Select color"
                  />
                  <SelectField
                    label="Primary Material"
                    icon={<Layers className="size-4" />}
                    value={material}
                    onChange={setMaterial}
                    options={MATERIALS}
                    placeholder="Select material"
                  />
                </div>

                {/* Dimensions */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-3">
                    Dimensions (Optional but recommended)
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    <DimInput
                      label="Length (cm)"
                      value={dimLength}
                      onChange={setDimLength}
                      icon={<Ruler className="size-3.5" />}
                    />
                    <DimInput
                      label="Width (cm)"
                      value={dimWidth}
                      onChange={setDimWidth}
                      icon={<Maximize className="size-3.5" />}
                    />
                    <DimInput
                      label="Height (cm)"
                      value={dimHeight}
                      onChange={setDimHeight}
                      icon={<Ruler className="size-3.5" />}
                    />
                    <DimInput
                      label="Weight (kg)"
                      value={dimWeight}
                      onChange={setDimWeight}
                      icon={<Weight className="size-3.5" />}
                    />
                  </div>
                  <p className="text-[11px] text-[#211000]/40 font-medium mt-1.5">
                    Measure in centimeters. Weight helps with shipping quotes.
                  </p>
                </div>

                {/* Warranty info */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-3">
                    Warranty Information <span className="text-[#211000]/40">(Optional)</span>
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField
                      label="Warranty Status"
                      value={warranty}
                      onChange={setWarranty}
                      options={["None", "Remaining manufacturer warranty", "Seller warranty (terms apply)"]}
                      placeholder="Select warranty status"
                    />
                    {warranty && warranty !== "None" && (
                      <div>
                        <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                          Warranty Duration
                        </label>
                        <input
                          type="text"
                          placeholder="e.g. 6 months, 1 year"
                          value={warrantyDuration}
                          onChange={(e) => setWarrantyDuration(e.target.value)}
                          className="w-full rounded-xl bg-white border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                        />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* === STEP 2: Condition === */}
            {step === 2 && (
              <div className="space-y-8">
                <SectionTitle
                  title="Item Condition"
                  subtitle="Be honest — accurate condition descriptions build trust and reduce returns."
                />

                {/* Condition selection */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {CONDITIONS.map((cond) => {
                    const isSelected = condition === cond.id;
                    return (
                      <motion.button
                        key={cond.id}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setCondition(cond.id)}
                        className={`relative p-5 rounded-xl border text-left transition-all duration-200 ${
                          isSelected
                            ? "bg-white border-[#B66B44] ring-2 ring-[#B66B44]/20"
                            : "bg-white border-[#211000]/10 hover:border-[#211000]/25"
                        }`}
                      >
                        {isSelected && (
                          <div className="absolute top-4 right-4 size-6 rounded-full bg-[#B66B44] flex items-center justify-center">
                            <Check className="size-3.5 text-white" />
                          </div>
                        )}
                        <div
                          className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                          style={{ backgroundColor: `${cond.color}15`, color: cond.color }}
                        >
                          {cond.icon}
                        </div>
                        <h3 className="font-bold text-sm mb-1">{cond.label}</h3>
                        <p className="text-xs text-[#211000]/50 font-medium">
                          {cond.desc}
                        </p>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Condition-specific questions */}
                {condition && condition !== "brand-new" && condition !== "like-new" && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-6 pt-4 border-t border-[#211000]/10"
                  >
                    {/* Defects checkboxes */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-3">
                        Select all defects that apply:
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {DEFECTS.map((defect) => {
                          const isChecked = defects.includes(defect.id);
                          return (
                            <button
                              key={defect.id}
                              type="button"
                              onClick={() => toggleDefect(defect.id)}
                              className={`px-3 py-2 rounded-lg text-xs font-medium border transition-all ${
                                isChecked
                                  ? "bg-[#B66B44]/10 border-[#B66B44] text-[#B66B44]"
                                  : "bg-white border-[#211000]/10 hover:border-[#211000]/20"
                              }`}
                            >
                              {defect.label}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Condition notes */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                        Condition Details <span className="text-[#211000]/40">(Optional but recommended)</span>
                      </label>
                      <textarea
                        rows={4}
                        placeholder="Describe any defects, repairs, or special conditions. Mention if item has been professionally cleaned, restored, etc."
                        value={conditionNotes}
                        onChange={(e) => setConditionNotes(e.target.value)}
                        className="w-full rounded-xl bg-white border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all resize-none leading-relaxed"
                      />
                      <p className="text-[11px] text-[#211000]/40 font-medium mt-1.5">
                        Transparency leads to faster sales and happier buyers.
                      </p>
                    </div>

                    {/* Repair history */}
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-3">
                        Has this item been repaired or refurbished?
                      </label>
                      <div className="flex gap-3">
                        {["Yes", "No"].map((opt) => (
                          <button
                            key={opt}
                            type="button"
                            onClick={() => {
                              // You can store this in state if needed
                            }}
                            className={`px-4 py-2 rounded-xl text-sm font-bold border transition-all ${
                              // Add state for this if you want to capture it
                              "bg-white border-[#211000]/10 hover:border-[#B66B44]/30"
                            }`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {condition && (condition === "brand-new" || condition === "like-new") && (
                  <div className="rounded-xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-4 flex gap-3">
                    <CheckCircle2 className="size-5 text-[#5F7161] shrink-0 mt-0.5" />
                    <p className="text-xs text-[#211000]/65 font-medium">
                      Great! Items in excellent condition typically sell faster and for better prices.
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* === STEP 3: Description === */}
            {step === 3 && (
              <div className="space-y-8">
                <SectionTitle
                  title="Description"
                  subtitle="Write a detailed description. Mention what makes this piece special."
                />

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                    Detailed Description *
                  </label>
                  <textarea
                    rows={8}
                    placeholder="Describe the piece — its style, material quality, any unique features, history, and what makes it a great find. Include measurements, care instructions, and any other details buyers should know."
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full rounded-xl bg-white border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all resize-none leading-relaxed"
                  />
                  <div className="flex justify-between items-center mt-1.5">
                    <p className="text-[11px] text-[#211000]/40 font-medium">
                      {description.length} characters (minimum 20)
                    </p>
                    {description.length > 20 && (
                      <span className="text-[10px] font-bold text-[#5F7161]">
                        Good length!
                      </span>
                    )}
                  </div>
                </div>

                {/* Tags */}
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                    Tags (Optional)
                  </label>
                  <p className="text-[11px] text-[#211000]/40 font-medium mb-3">
                    Add keywords to help buyers find your item (e.g. mid-century, minimalist, rattan, oak)
                  </p>
                  <div className="flex gap-2 flex-wrap mb-3">
                    {tags.map((tag, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 bg-[#E8CEB0]/40 border border-[#E8CEB0] px-2.5 py-1 rounded-full text-xs font-bold"
                      >
                        {tag}
                        <button
                          onClick={() => removeTag(i)}
                          className="hover:text-red-500 transition-colors"
                        >
                          <X className="size-3" />
                        </button>
                      </span>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      placeholder="Add a tag and press Enter"
                      value={tagInput}
                      onChange={(e) => setTagInput(e.target.value)}
                      onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                      className="flex-1 rounded-xl bg-white border border-[#211000]/12 px-4 py-3 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                    />
                    <button
                      type="button"
                      onClick={addTag}
                      disabled={!tagInput.trim()}
                      className="px-4 py-3 rounded-xl bg-[#211000] text-[#E8CEB0] text-sm font-bold disabled:opacity-30 hover:bg-[#211000]/90 transition-colors"
                    >
                      Add
                    </button>
                  </div>
                  <p className="text-[11px] text-[#211000]/40 font-medium mt-1.5">
                    {tags.length}/8 tags added
                  </p>
                </div>
              </div>
            )}

            {/* === STEP 4: Pricing === */}
            {step === 4 && (
              <div className="space-y-8">
                <SectionTitle
                  title="Pricing"
                  subtitle="Set a competitive price. Items priced fairly sell 3× faster."
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                      Original Purchase Price (Optional)
                    </label>
                    <PriceInput
                      value={originalPrice}
                      onChange={setOriginalPrice}
                      placeholder="0"
                    />
                    <p className="text-[11px] text-[#211000]/40 font-medium mt-1.5">
                      Helps buyers see the value.
                    </p>
                  </div>
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                      Your Selling Price *
                    </label>
                    <PriceInput
                      value={sellingPrice}
                      onChange={setSellingPrice}
                      placeholder="0"
                    />
                    {originalPrice && sellingPrice && Number(originalPrice) > Number(sellingPrice) && (
                      <p className="text-[11px] text-[#5F7161] font-bold mt-1.5">
                        That's {Math.round(((Number(originalPrice) - Number(sellingPrice)) / Number(originalPrice)) * 100)}% off original price — attractive!
                      </p>
                    )}
                  </div>
                </div>

                {/* Negotiable toggle */}
                <div
                  className="flex items-center justify-between p-4 rounded-xl bg-white border border-[#211000]/10 cursor-pointer"
                  onClick={() => setNegotiable(!negotiable)}
                >
                  <div>
                    <p className="text-sm font-bold">Price is negotiable</p>
                    <p className="text-xs text-[#211000]/45 font-medium">
                      Allow buyers to make offers
                    </p>
                  </div>
                  <div
                    className={`w-11 h-6 rounded-full transition-colors duration-200 relative ${
                      negotiable ? "bg-[#B66B44]" : "bg-[#211000]/15"
                    }`}
                  >
                    <motion.div
                      layout
                      transition={{ type: "spring", stiffness: 500, damping: 35 }}
                      className="absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm"
                      style={{ left: negotiable ? "calc(100% - 22px)" : "2px" }}
                    />
                  </div>
                </div>

                {/* Reason & Availability */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <SelectField
                    label="Reason for Selling"
                    value={sellReason}
                    onChange={setSellReason}
                    options={SELL_REASONS}
                    placeholder="Select reason"
                  />
                  <SelectField
                    label="Availability"
                    value={availability}
                    onChange={setAvailability}
                    options={AVAILABILITY}
                    placeholder="Select availability"
                  />
                </div>

                <SelectField
                  label="How urgent is the sale?"
                  value={urgency}
                  onChange={setUrgency}
                  options={URGENCY}
                  placeholder="Select urgency"
                />
              </div>
            )}

            {/* === STEP 5: Location & Contact === */}
            {step === 5 && (
              <div className="space-y-8">
                <SectionTitle
                  title="Location & Contact"
                  subtitle="Help buyers know where the item is and how to reach you."
                />

                {/* Contact info */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block">
                    Contact Information *
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <IconInput
                      icon={<User className="size-4" />}
                      placeholder="Your full name"
                      value={sellerName}
                      onChange={setSellerName}
                      required
                    />
                    <IconInput
                      icon={<Phone className="size-4" />}
                      placeholder="08012345678"
                      value={phone}
                      onChange={setPhone}
                      type="tel"
                      required
                    />
                    <IconInput
                      icon={<Mail className="size-4" />}
                      placeholder="your.email@example.com"
                      value={email}
                      onChange={setEmail}
                      type="email"
                    />
                    <IconInput
                      icon={<MessageCircle className="size-4" />}
                      placeholder="WhatsApp (optional)"
                      value={whatsapp}
                      onChange={setWhatsapp}
                      type="tel"
                    />
                  </div>

                  <SelectField
                    label="Best Time to Call"
                    value={callTime}
                    onChange={setCallTime}
                    options={CALL_TIMES}
                    placeholder="Select preferred time"
                  />
                </div>

                {/* Address */}
                <div className="space-y-4">
                  <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block">
                    Item Location *
                  </label>

                  <IconInput
                    icon={<MapPin className="size-4" />}
                    placeholder="Full address (e.g. 15 Palm Avenue, Ikeja)"
                    value={address}
                    onChange={setAddress}
                    required
                  />

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <SelectField
                      label="State"
                      value={state}
                      onChange={setState}
                      options={NIGERIAN_STATES}
                      placeholder="Select state"
                    />
                    <div>
                      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                        LGA / Area / Neighborhood
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ikeja, Lekki Phase 1"
                        value={lga}
                        onChange={(e) => setLga(e.target.value)}
                        className="w-full rounded-xl bg-white border border-[#211000]/12 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
                      />
                    </div>
                  </div>

                  {/* Map embed placeholder */}
                  {address && state && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: "auto" }}
                      className="rounded-xl overflow-hidden border border-[#211000]/10"
                    >
                      <iframe
                        src={`https://maps.google.com/maps?q=${encodeURIComponent(
                          `${address}, ${lga}, ${state}, Nigeria`
                        )}&t=&z=14&ie=UTF8&iwloc=&output=embed`}
                        className="w-full h-52 border-0"
                        loading="lazy"
                        allowFullScreen
                      />
                    </motion.div>
                  )}
                </div>

                {/* Safety tips */}
                <div className="rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-4 flex gap-3">
                  <Shield className="size-5 text-[#B66B44] shrink-0 mt-0.5" />
                  <div className="text-xs text-[#211000]/65 font-medium leading-relaxed">
                    <strong className="text-[#211000] font-bold block mb-1">
                      Safety Tips:
                    </strong>
                    • Meet in public places for first meetings<br />
                    • Don't share personal financial information<br />
                    • Use Refurnish's secure messaging system<br />
                    • Report suspicious activity to our team
                  </div>
                </div>
              </div>
            )}

            {/* === STEP 6: Review === */}
            {step === 6 && (
              <div className="space-y-8">
                <SectionTitle
                  title="Review Your Listing"
                  subtitle="Make sure everything looks right before publishing."
                />

                {/* Preview card */}
                <div className="rounded-2xl bg-white border border-[#211000]/10 shadow-sm overflow-hidden">
                  {photos[0] && (
                    <div className="aspect-video w-full overflow-hidden">
                      <img
                        src={photos[0]}
                        alt="Main"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}

                  <div className="p-6 space-y-5">
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#B66B44]">
                        {CATEGORIES.find((c) => c.id === category)?.label || "—"}
                        {brand && ` · ${brand}`}
                      </p>
                      <h2 className="font-serif text-2xl font-medium mt-1">
                        {itemTitle || "Untitled"}
                      </h2>
                      {model && (
                        <p className="text-xs text-[#211000]/50 font-medium mt-0.5">
                          Model: {model}
                        </p>
                      )}
                    </div>

                    <div className="flex items-baseline gap-3 flex-wrap">
                      <span className="text-2xl font-bold">
                        ₦{Number(sellingPrice || 0).toLocaleString("en-NG")}
                      </span>
                      {originalPrice && (
                        <span className="text-sm text-[#211000]/40 line-through">
                          ₦{Number(originalPrice).toLocaleString("en-NG")}
                        </span>
                      )}
                      {negotiable && (
                        <span className="text-[10px] font-bold bg-[#E8CEB0]/40 px-2 py-0.5 rounded-full">
                          Negotiable
                        </span>
                      )}
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <ReviewRow label="Condition" value={CONDITIONS.find((c) => c.id === condition)?.label || "—"} />
                      <ReviewRow label="Age" value={age || "—"} />
                      <ReviewRow label="Color" value={color || "—"} />
                      <ReviewRow label="Material" value={material || "—"} />
                      {(dimLength || dimWidth || dimHeight) && (
                        <ReviewRow
                          label="Dimensions"
                          value={`${dimLength || "—"} × ${dimWidth || "—"} × ${dimHeight || "—"} cm`}
                        />
                      )}
                      {dimWeight && <ReviewRow label="Weight" value={`${dimWeight} kg`} />}
                      <ReviewRow
                        label="Location"
                        value={`${address}${lga ? `, ${lga}` : ""}, ${state}`}
                      />
                      <ReviewRow label="Contact" value={`${sellerName} · ${phone}`} />
                      {warranty && warranty !== "None" && (
                        <ReviewRow label="Warranty" value={warranty} />
                      )}
                    </div>

                    {defects.length > 0 && (
                      <div>
                        <p className="text-xs font-bold uppercase tracking-wider text-[#211000]/50 mb-2">
                          Reported Defects
                        </p>
                        <div className="flex flex-wrap gap-1.5">
                          {defects.map((defectId) => {
                            const defect = DEFECTS.find((d) => d.id === defectId);
                            return defect ? (
                              <span
                                key={defectId}
                                className="text-[10px] font-bold bg-red-50 border border-red-200 text-red-700 px-2 py-0.5 rounded-full"
                              >
                                {defect.label}
                              </span>
                            ) : null;
                          })}
                        </div>
                      </div>
                    )}

                    {description && (
                      <div className="border-t border-[#211000]/8 pt-4">
                        <p className="text-xs font-bold uppercase tracking-wider text-[#211000]/50 mb-1.5">
                          Description
                        </p>
                        <p className="text-sm text-[#211000]/70 font-medium leading-relaxed">
                          {description}
                        </p>
                        {conditionNotes && (
                          <div className="mt-3 pt-3 border-t border-[#211000]/6">
                            <p className="text-xs font-bold text-[#211000]/50 mb-1">Condition Notes:</p>
                            <p className="text-xs text-[#211000]/60 leading-relaxed">
                              {conditionNotes}
                            </p>
                          </div>
                        )}
                      </div>
                    )}

                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {tags.map((tag, i) => (
                          <span
                            key={i}
                            className="text-[10px] font-bold bg-[#E8CEB0]/30 border border-[#E8CEB0] px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}

                    {photos.length > 1 && (
                      <div className="flex gap-2 overflow-x-auto pt-2">
                        {photos.slice(1).map((p, i) => (
                          <div
                            key={i}
                            className="w-16 h-16 rounded-lg overflow-hidden shrink-0 border border-[#211000]/8"
                          >
                            <img
                              src={p}
                              alt=""
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {submitError && (
          <div className="mt-6 rounded-xl bg-red-50 border border-red-200 p-4 flex gap-3">
            <AlertCircle className="size-5 text-red-500 shrink-0 mt-0.5" />
            <p className="text-xs text-red-700 font-medium">{submitError}</p>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between gap-4 mt-10 pt-6 border-t border-[#211000]/8">
          <button
            onClick={goBack}
            disabled={step === 0}
            className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/60 hover:text-[#211000] disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ArrowLeft className="size-4" />
            Previous
          </button>

          <span className="text-xs font-bold text-[#211000]/35">
            Step {step + 1} of {STEPS.length}
          </span>

          {step < STEPS.length - 1 ? (
            <button
              onClick={goNext}
              disabled={!canProceed()}
              className="inline-flex items-center gap-2 bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md shadow-[#B66B44]/15"
            >
              Next
              <ArrowRight className="size-4" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="inline-flex items-center gap-2 bg-[#5F7161] hover:bg-[#4d5e50] disabled:opacity-60 text-white font-bold text-sm px-6 py-3 rounded-full transition-all shadow-md shadow-[#5F7161]/15"
            >
              {submitting ? (
                <>
                  <Loader2 className="size-4 animate-spin" />
                  {editingListingId ? "Resubmitting…" : "Publishing…"}
                </>
              ) : (
                <>
                  <Sparkles className="size-4" />
                  {editingListingId ? "Resubmit Listing" : "Publish Listing"}
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </main>
  );
}

/* ==== Sub-components ==== */

function SectionTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div>
      <h2 className="font-serif text-2xl font-medium tracking-tight">{title}</h2>
      <p className="text-sm text-[#211000]/50 font-medium mt-1">{subtitle}</p>
    </div>
  );
}

function SelectField({
  label,
  value,
  onChange,
  options,
  placeholder,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: string[];
  placeholder: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[#211000]/40">
            {icon}
          </span>
        )}
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl bg-white border border-[#211000]/12 ${
            icon ? "pl-11" : "pl-4"
          } pr-10 py-3.5 text-sm font-medium text-[#211000] focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all appearance-none cursor-pointer`}
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23211000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m2 4 4 4 4-4'/%3E%3C/svg%3E")`,
            backgroundRepeat: "no-repeat",
            backgroundPosition: "right 14px center",
          }}
        >
          <option value="" disabled>
            {placeholder}
          </option>
          {options.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

function DimInput({
  label,
  value,
  onChange,
  icon,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <label className="text-[10px] font-bold uppercase tracking-wider text-[#211000]/45 block mb-1.5">
        {label}
      </label>
      <div className="relative">
        {icon && (
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[#211000]/30">
            {icon}
          </span>
        )}
        <input
          type="number"
          placeholder="0"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`w-full rounded-xl bg-white border border-[#211000]/12 ${
            icon ? "pl-9" : "pl-3"
          } pr-3 py-2.5 text-sm font-medium placeholder:text-[#211000]/25 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all`}
        />
      </div>
    </div>
  );
}

function PriceInput({
  value,
  onChange,
  placeholder,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
}) {
  return (
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-[#211000]/50">
        ₦
      </span>
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-white border border-[#211000]/12 pl-9 pr-4 py-3.5 text-sm font-bold placeholder:text-[#211000]/30 placeholder:font-medium focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
      />
    </div>
  );
}

function IconInput({
  icon,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}: {
  icon: React.ReactNode;
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  type?: string;
  required?: boolean;
}) {
  return (
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
        className="w-full rounded-xl bg-white border border-[#211000]/12 pl-11 pr-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/15 transition-all"
      />
    </div>
  );
}

function ReviewRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between items-start gap-4 text-sm">
      <span className="text-[#211000]/45 font-medium">{label}</span>
      <span className="font-bold text-right">{value}</span>
    </div>
  );
}