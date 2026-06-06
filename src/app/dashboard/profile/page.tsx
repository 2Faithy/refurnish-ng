"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  AlertCircle,
  Shield,
  ShieldCheck,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Home,
  Building,
  CreditCard,
  Lock,
  Bell,
  Eye,
  EyeOff,
  Upload,
  Trash2,
  FileText,
  Check,
  X,
  Loader2,
  Smartphone,
  MailCheck,
  PhoneCall,
  ShieldAlert,
  UserCheck,
  Fingerprint,
  ChevronRight,
  Info,
  AlertTriangle,
  Download,
  RefreshCcw,
  Clock,
} from "lucide-react";

const USER_KEY = "refurnish_user";
const PROFILE_KEY = "refurnish_profile_extended";

// Nigerian states for dropdown
const NIGERIAN_STATES = [
  "Abia",
  "Adamawa",
  "Akwa Ibom",
  "Anambra",
  "Bauchi",
  "Bayelsa",
  "Benue",
  "Borno",
  "Cross River",
  "Delta",
  "Ebonyi",
  "Edo",
  "Ekiti",
  "Enugu",
  "FCT",
  "Gombe",
  "Imo",
  "Jigawa",
  "Kaduna",
  "Kano",
  "Katsina",
  "Kebbi",
  "Kogi",
  "Kwara",
  "Lagos",
  "Nasarawa",
  "Niger",
  "Ogun",
  "Ondo",
  "Osun",
  "Oyo",
  "Plateau",
  "Rivers",
  "Sokoto",
  "Taraba",
  "Yobe",
  "Zamfara",
];

const ID_TYPES = [
  { id: "NIN", label: "National ID (NIN)", required: true },
  { id: "DRIVERS_LICENSE", label: "Driver's License", required: false },
  { id: "VOTERS_CARD", label: "Voter's Card", required: false },
  { id: "PASSPORT", label: "International Passport", required: false },
];

type TabId = "profile" | "verification" | "security" | "notifications";

export default function ProfilePage() {
  const [activeTab, setActiveTab] = useState<TabId>("profile");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const idFileInputRef = useRef<HTMLInputElement>(null);

  // Profile data
  const [profile, setProfile] = useState({
    // Basic info
    name: "",
    email: "",
    phone: "",
    whatsapp: "",
    profileImage: "",

    // Personal details
    dateOfBirth: "",
    gender: "",
    bio: "",

    // Address
    address: "",
    state: "",
    lga: "",
    city: "",

    // Verification
    idType: "NIN",
    idNumber: "",
    idImage: "",
    idVerified: false,
    idVerifiedAt: null as string | null,
    selfieImage: "",

    // Security
    passwordLastChanged: "2024-01-15",
    twoFactorEnabled: false,

    // Notifications
    emailNotifications: {
      orders: true,
      messages: true,
      promotions: false,
      newsletter: true,
    },
    pushNotifications: {
      orders: true,
      messages: true,
      priceDrops: true,
    },
    smsNotifications: {
      orders: true,
      delivery: true,
    },

    // Account
    createdAt: "2024-01-01",
    verifiedSeller: false,
    reputationScore: 4.8,
  });

  const [passwordForm, setPasswordForm] = useState({
    current: "",
    new: "",
    confirm: "",
  });
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  // Load profile
  useEffect(() => {
    try {
      const user = localStorage.getItem(USER_KEY);
      const extended = localStorage.getItem(PROFILE_KEY);

      let baseData: any = {};
      if (user) baseData = JSON.parse(user);

      let extendedData: any = {};
      if (extended) extendedData = JSON.parse(extended);

      setProfile((prev) => ({
        ...prev,
        ...baseData,
        ...extendedData,
        email: baseData.email || extendedData.email || "",
        name: baseData.name || extendedData.name || "",
        phone: baseData.phone || extendedData.phone || "",
      }));
    } catch {}
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const saveProfile = async (updates: Partial<typeof profile>) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 800));

    const updated = { ...profile, ...updates };
    setProfile(updated);

    // Save to localStorage
    localStorage.setItem(PROFILE_KEY, JSON.stringify(updated));
    localStorage.setItem(
      USER_KEY,
      JSON.stringify({
        id: 1,
        name: updated.name,
        email: updated.email,
        phone: updated.phone,
        profileImage: updated.profileImage,
      })
    );

    setSaving(false);
    setToast("Profile updated successfully");
  };

  const profileCompletion = useMemo(() => {
    let score = 0;
    if (profile.name) score += 10;
    if (profile.email) score += 10;
    if (profile.phone) score += 10;
    if (profile.profileImage) score += 10;
    if (profile.dateOfBirth) score += 10;
    if (profile.address && profile.state) score += 15;
    if (profile.bio) score += 10;
    if (profile.idNumber && profile.idImage) score += 15;
    if (profile.idVerified) score += 10;
    return Math.min(score, 100);
  }, [profile]);

  const verificationStatus = useMemo(() => {
    if (profile.idVerified)
      return {
        label: "Verified",
        color: "text-[#5F7161]",
        bg: "bg-[#5F7161]/10",
      };
    if (profile.idNumber && profile.idImage)
      return { label: "Pending", color: "text-yellow-700", bg: "bg-yellow-50" };
    return {
      label: "Not verified",
      color: "text-[#211000]/50",
      bg: "bg-[#211000]/5",
    };
  }, [profile]);

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      setToast("Image must be under 2MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      saveProfile({ profileImage: ev.target?.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleIdImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setToast("Document must be under 5MB");
      return;
    }

    const reader = new FileReader();
    reader.onload = (ev) => {
      saveProfile({
        idImage: ev.target?.result as string,
        idVerified: false,
        idVerifiedAt: null,
      });
      setToast("ID uploaded. Verification pending.");
    };
    reader.readAsDataURL(file);
  };

  const handlePasswordChange = async () => {
    if (!passwordForm.current || !passwordForm.new || !passwordForm.confirm) {
      setToast("Please fill all password fields");
      return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
      setToast("New passwords do not match");
      return;
    }
    if (passwordForm.new.length < 8) {
      setToast("Password must be at least 8 characters");
      return;
    }

    setSaving(true);
    await new Promise((r) => setTimeout(r, 1200));
    setSaving(false);

    setPasswordForm({ current: "", new: "", confirm: "" });
    await saveProfile({
      passwordLastChanged: new Date().toISOString().split("T")[0],
    });
    setToast("Password updated successfully");
  };

  const handleTwoFactorToggle = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 600));
    await saveProfile({ twoFactorEnabled: !profile.twoFactorEnabled });
    setSaving(false);
    setToast(profile.twoFactorEnabled ? "2FA disabled" : "2FA enabled");
  };

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-10 max-w-6xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/50 hover:text-[#B66B44] transition-colors mb-5"
        >
          <ArrowLeft className="size-4" />
          Back to dashboard
        </Link>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
              Account
            </p>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-medium tracking-tight mt-1">
              Profile & security
            </h1>
            <p className="text-sm text-[#211000]/55 font-medium mt-2 max-w-2xl">
              Manage your personal information, verification, and security
              settings.
            </p>
          </div>

          {/* Profile completion */}
          <div className="flex items-center gap-3 rounded-2xl bg-white border border-[#211000]/8 px-4 py-3">
            <div className="relative size-12">
              <svg className="size-12 -rotate-90">
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#21100010"
                  strokeWidth="3"
                />
                <circle
                  cx="24"
                  cy="24"
                  r="20"
                  fill="none"
                  stroke="#B66B44"
                  strokeWidth="3"
                  strokeDasharray={`${profileCompletion * 1.26} 126`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold">
                {profileCompletion}%
              </span>
            </div>
            <div>
              <p className="text-xs font-bold">Profile complete</p>
              <p className="text-[11px] text-[#211000]/45 font-medium">
                {profileCompletion < 100 ? "Add more details" : "All set!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2 mb-6">
        {[
          { id: "profile", label: "Profile", icon: User },
          { id: "verification", label: "Verification", icon: ShieldCheck },
          { id: "security", label: "Security", icon: Lock },
          { id: "notifications", label: "Notifications", icon: Bell },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold transition-all border ${
                activeTab === tab.id
                  ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                  : "bg-white text-[#211000]/60 border-[#211000]/10 hover:border-[#211000]/25"
              }`}
            >
              <Icon className="size-3.5" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <AnimatePresence mode="wait">
        {/* Profile Tab */}
        {activeTab === "profile" && (
          <motion.div
            key="profile"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* Profile photo */}
            <div className="rounded-2xl bg-white border border-[#211000]/6 p-5 sm:p-6">
              <h2 className="font-serif text-lg font-medium mb-5">
                Profile photo
              </h2>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5">
                <div className="relative">
                  {profile.profileImage ? (
                    <img
                      src={profile.profileImage}
                      alt="Profile"
                      className="size-24 rounded-full object-cover border-2 border-[#211000]/8"
                    />
                  ) : (
                    <div className="size-24 rounded-full bg-[#E8CEB0] text-[#211000] flex items-center justify-center font-bold text-2xl">
                      {profile.name?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-0 right-0 size-8 rounded-full bg-[#B66B44] text-white grid place-items-center shadow-lg hover:bg-[#a05934] transition-colors"
                  >
                    <Camera className="size-4" />
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleProfileImageUpload}
                    className="hidden"
                  />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold mb-1">
                    Upload a clear photo of yourself
                  </p>
                  <p className="text-xs text-[#211000]/50 font-medium leading-relaxed">
                    This helps build trust with buyers and sellers. Use a clear
                    headshot with good lighting.
                  </p>
                  <p className="text-[11px] text-[#211000]/35 font-medium mt-2">
                    JPG, PNG. Max 2MB.
                  </p>
                </div>
              </div>
            </div>

            {/* Personal information */}
            <div className="rounded-2xl bg-white border border-[#211000]/6 p-5 sm:p-6">
              <h2 className="font-serif text-lg font-medium mb-5">
                Personal information
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field
                  label="Full name"
                  value={profile.name}
                  onChange={(v: any) => setProfile({ ...profile, name: v })}
                  onBlur={() => saveProfile({ name: profile.name })}
                />
                <Field
                  label="Email address"
                  type="email"
                  value={profile.email}
                  onChange={(v: any) => setProfile({ ...profile, email: v })}
                  onBlur={() => saveProfile({ email: profile.email })}
                  disabled
                  hint="Contact support to change email"
                />
                <Field
                  label="Phone number"
                  type="tel"
                  value={profile.phone}
                  onChange={(v: any) => setProfile({ ...profile, phone: v })}
                  onBlur={() => saveProfile({ phone: profile.phone })}
                />
                <Field
                  label="WhatsApp number"
                  type="tel"
                  value={profile.whatsapp}
                  onChange={(v: any) => setProfile({ ...profile, whatsapp: v })}
                  onBlur={() => saveProfile({ whatsapp: profile.whatsapp })}
                  optional
                />
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                    Date of birth
                  </label>
                  <input
                    type="date"
                    value={profile.dateOfBirth}
                    onChange={(e) =>
                      setProfile({ ...profile, dateOfBirth: e.target.value })
                    }
                    onBlur={() =>
                      saveProfile({ dateOfBirth: profile.dateOfBirth })
                    }
                    max={
                      new Date(
                        new Date().setFullYear(new Date().getFullYear() - 18)
                      )
                        .toISOString()
                        .split("T")[0]
                    }
                    className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/10 px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                    Gender
                  </label>
                  <select
                    value={profile.gender}
                    onChange={(e) =>
                      setProfile({ ...profile, gender: e.target.value })
                    }
                    onBlur={() => saveProfile({ gender: profile.gender })}
                    className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/10 px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all"
                  >
                    <option value="">Select gender</option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer not to say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div className="mt-4">
                <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                  Bio
                  <span className="text-[#211000]/35 normal-case font-medium">
                    {" "}
                    (optional)
                  </span>
                </label>
                <textarea
                  rows={3}
                  value={profile.bio}
                  onChange={(e) =>
                    setProfile({ ...profile, bio: e.target.value })
                  }
                  onBlur={() => saveProfile({ bio: profile.bio })}
                  placeholder="Tell buyers and sellers about yourself..."
                  className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/10 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all resize-none"
                />
              </div>
            </div>

            {/* Address */}
            <div className="rounded-2xl bg-white border border-[#211000]/6 p-5 sm:p-6">
              <h2 className="font-serif text-lg font-medium mb-5">
                Address information
              </h2>
              <div className="space-y-4">
                <Field
                  label="Street address"
                  value={profile.address}
                  onChange={(v: any) => setProfile({ ...profile, address: v })}
                  onBlur={() => saveProfile({ address: profile.address })}
                  placeholder="15 Palm Avenue..."
                />
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                      State
                    </label>
                    <select
                      value={profile.state}
                      onChange={(e) =>
                        setProfile({ ...profile, state: e.target.value })
                      }
                      onBlur={() => saveProfile({ state: profile.state })}
                      className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/10 px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all"
                    >
                      <option value="">Select state</option>
                      {NIGERIAN_STATES.map((s) => (
                        <option key={s} value={s}>
                          {s}
                        </option>
                      ))}
                    </select>
                  </div>
                  <Field
                    label="LGA / Area"
                    value={profile.lga}
                    onChange={(v: any) => setProfile({ ...profile, lga: v })}
                    onBlur={() => saveProfile({ lga: profile.lga })}
                    placeholder="Ikeja"
                  />
                  <Field
                    label="City"
                    value={profile.city}
                    onChange={(v: any) => setProfile({ ...profile, city: v })}
                    onBlur={() => saveProfile({ city: profile.city })}
                    placeholder="Lagos"
                  />
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Verification Tab */}
        {activeTab === "verification" && (
          <motion.div
            key="verification"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* Verification status */}
            <div className="rounded-2xl bg-white border border-[#211000]/6 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div
                    className={`size-12 rounded-2xl flex items-center justify-center ${verificationStatus.bg}`}
                  >
                    <ShieldCheck
                      className={`size-6 ${verificationStatus.color
                        .split(" ")[0]
                        .replace("text-", "text-")}`}
                    />
                  </div>
                  <div>
                    <h2 className="font-serif text-xl font-medium">
                      Identity verification
                    </h2>
                    <p className="text-sm text-[#211000]/55 font-medium mt-1 max-w-md">
                      Verify your identity to build trust with buyers and
                      sellers. Verified accounts get a badge and higher
                      visibility.
                    </p>
                  </div>
                </div>
                <span
                  className={`shrink-0 px-3 py-1.5 rounded-full text-xs font-bold ${verificationStatus.bg} ${verificationStatus.color}`}
                >
                  {verificationStatus.label}
                </span>
              </div>

              {profile.idVerified && profile.idVerifiedAt && (
                <div className="mt-5 rounded-xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-3 flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#5F7161] shrink-0" />
                  <p className="text-xs font-bold text-[#5F7161]">
                    Verified on{" "}
                    {new Date(profile.idVerifiedAt).toLocaleDateString()}
                  </p>
                </div>
              )}
            </div>

            {/* ID details */}
            <div className="rounded-2xl bg-white border border-[#211000]/6 p-5 sm:p-6">
              <h3 className="font-serif text-lg font-medium mb-5">
                Verification details
              </h3>

              <div className="space-y-4">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                    ID type
                  </label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {ID_TYPES.map((type) => (
                      <button
                        key={type.id}
                        onClick={() => saveProfile({ idType: type.id })}
                        disabled={profile.idVerified}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          profile.idType === type.id
                            ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                            : "bg-[#FAF4EC] border-[#211000]/10 hover:border-[#211000]/20 disabled:opacity-50"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-sm font-bold">
                            {type.label}
                          </span>
                          {type.required && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-[#B66B44]/20 text-[#B66B44]">
                              Required
                            </span>
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                <Field
                  label="ID number"
                  value={profile.idNumber}
                  onChange={(v: any) => setProfile({ ...profile, idNumber: v })}
                  onBlur={() => saveProfile({ idNumber: profile.idNumber })}
                  placeholder="Enter your ID number"
                  disabled={profile.idVerified}
                />

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                    Upload ID document
                  </label>

                  {profile.idImage ? (
                    <div className="rounded-xl bg-[#FAF4EC] border border-[#211000]/8 p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="size-10 rounded-lg bg-white border border-[#211000]/8 grid place-items-center">
                            <FileText className="size-5 text-[#B66B44]" />
                          </div>
                          <div>
                            <p className="text-sm font-bold">
                              ID document uploaded
                            </p>
                            <p className="text-[11px] text-[#211000]/45 font-medium">
                              {profile.idVerified
                                ? "Verified"
                                : "Pending verification"}
                            </p>
                          </div>
                        </div>
                        {!profile.idVerified && (
                          <button
                            onClick={() => saveProfile({ idImage: "" })}
                            className="text-xs font-bold text-red-500 hover:underline"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    </div>
                  ) : (
                    <button
                      onClick={() => idFileInputRef.current?.click()}
                      className="w-full rounded-xl border-2 border-dashed border-[#211000]/15 bg-[#FAF4EC] hover:bg-[#E8CEB0]/20 hover:border-[#B66B44]/30 p-8 text-center transition-all"
                    >
                      <Upload className="size-8 text-[#211000]/30 mx-auto mb-3" />
                      <p className="text-sm font-bold">Click to upload ID</p>
                      <p className="text-xs text-[#211000]/45 font-medium mt-1">
                        JPG, PNG, or PDF. Max 5MB. Must be clear and legible.
                      </p>
                    </button>
                  )}
                  <input
                    ref={idFileInputRef}
                    type="file"
                    accept="image/*,application/pdf"
                    onChange={handleIdImageUpload}
                    className="hidden"
                  />
                </div>

                {!profile.idVerified && profile.idImage && (
                  <div className="rounded-xl bg-yellow-50 border border-yellow-200 p-4 flex items-start gap-3">
                    <Clock className="size-5 text-yellow-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-bold text-yellow-800">
                        Verification in progress
                      </p>
                      <p className="text-xs text-yellow-700 font-medium mt-1 leading-relaxed">
                        Our team reviews ID documents within 24 hours. You'll
                        receive an email once verified.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Why verify */}
            <div className="rounded-2xl bg-[#211000] text-[#FAF4EC] p-5 sm:p-6">
              <h3 className="font-serif text-lg font-medium mb-4 flex items-center gap-2">
                <Shield className="size-5 text-[#E8CEB0]" />
                Why verify your identity?
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#5F7161] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Build trust</p>
                    <p className="text-xs text-[#FAF4EC]/60 font-medium">
                      Verified badge on your profile and listings
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#5F7161] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Higher visibility</p>
                    <p className="text-xs text-[#FAF4EC]/60 font-medium">
                      Your listings rank higher in search results
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 className="size-4 text-[#5F7161] shrink-0 mt-0.5" />
                  <div>
                    <p className="font-bold">Faster transactions</p>
                    <p className="text-xs text-[#FAF4EC]/60 font-medium">
                      Buyers trust verified sellers more
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Security Tab */}
        {activeTab === "security" && (
          <motion.div
            key="security"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* Password */}
            <div className="rounded-2xl bg-white border border-[#211000]/6 p-5 sm:p-6">
              <h2 className="font-serif text-lg font-medium mb-1">
                Change password
              </h2>
              <p className="text-xs text-[#211000]/45 font-medium mb-5">
                Last changed: {profile.passwordLastChanged}
              </p>

              <div className="space-y-4 max-w-md">
                <PasswordField
                  label="Current password"
                  value={passwordForm.current}
                  onChange={(v: any) =>
                    setPasswordForm({ ...passwordForm, current: v })
                  }
                  show={showPasswords.current}
                  onToggle={() =>
                    setShowPasswords({
                      ...showPasswords,
                      current: !showPasswords.current,
                    })
                  }
                />
                <PasswordField
                  label="New password"
                  value={passwordForm.new}
                  onChange={(v: any) =>
                    setPasswordForm({ ...passwordForm, new: v })
                  }
                  show={showPasswords.new}
                  onToggle={() =>
                    setShowPasswords({
                      ...showPasswords,
                      new: !showPasswords.new,
                    })
                  }
                />
                <PasswordField
                  label="Confirm new password"
                  value={passwordForm.confirm}
                  onChange={(v: any) =>
                    setPasswordForm({ ...passwordForm, confirm: v })
                  }
                  show={showPasswords.confirm}
                  onToggle={() =>
                    setShowPasswords({
                      ...showPasswords,
                      confirm: !showPasswords.confirm,
                    })
                  }
                />

                <button
                  onClick={handlePasswordChange}
                  disabled={
                    saving ||
                    !passwordForm.current ||
                    !passwordForm.new ||
                    !passwordForm.confirm
                  }
                  className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-full bg-[#B66B44] hover:bg-[#a05934] disabled:opacity-50 text-white px-6 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {saving ? (
                    <>
                      <Loader2 className="size-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    <>
                      <Lock className="size-4" />
                      Update password
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Two-factor */}
            <div className="rounded-2xl bg-white border border-[#211000]/6 p-5 sm:p-6">
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-start gap-4">
                  <div className="size-11 rounded-2xl bg-[#5F7161]/10 flex items-center justify-center shrink-0">
                    <Smartphone className="size-5 text-[#5F7161]" />
                  </div>
                  <div>
                    <h2 className="font-serif text-lg font-medium">
                      Two-factor authentication
                    </h2>
                    <p className="text-xs text-[#211000]/55 font-medium mt-1 max-w-md">
                      Add an extra layer of security to your account with SMS or
                      authenticator app codes.
                    </p>
                  </div>
                </div>
                <button
                  onClick={handleTwoFactorToggle}
                  disabled={saving}
                  className={`relative w-12 h-7 rounded-full transition-colors ${
                    profile.twoFactorEnabled
                      ? "bg-[#5F7161]"
                      : "bg-[#211000]/15"
                  }`}
                >
                  <motion.div
                    layout
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                    className="absolute top-0.5 size-6 rounded-full bg-white shadow-sm"
                    style={{ left: profile.twoFactorEnabled ? "22px" : "2px" }}
                  />
                </button>
              </div>

              {profile.twoFactorEnabled && (
                <div className="mt-4 rounded-xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-3 flex items-center gap-2.5">
                  <CheckCircle2 className="size-4 text-[#5F7161] shrink-0" />
                  <p className="text-xs font-bold text-[#5F7161]">
                    Two-factor authentication is enabled
                  </p>
                </div>
              )}
            </div>

            {/* Sessions */}
            <div className="rounded-2xl bg-white border border-[#211000]/6 p-5 sm:p-6">
              <h2 className="font-serif text-lg font-medium mb-5">
                Active sessions
              </h2>
              <div className="space-y-3">
                {[
                  {
                    device: "Chrome on Windows",
                    location: "Lagos, Nigeria",
                    current: true,
                    time: "Active now",
                  },
                  {
                    device: "Safari on iPhone",
                    location: "Lagos, Nigeria",
                    current: false,
                    time: "2 days ago",
                  },
                ].map((session, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#FAF4EC] border border-[#211000]/5"
                  >
                    <div className="flex items-center gap-3">
                      <div className="size-9 rounded-lg bg-white border border-[#211000]/8 grid place-items-center">
                        <Smartphone className="size-4 text-[#211000]/60" />
                      </div>
                      <div>
                        <p className="text-sm font-bold">{session.device}</p>
                        <p className="text-[11px] text-[#211000]/45 font-medium">
                          {session.location} · {session.time}
                        </p>
                      </div>
                    </div>
                    {session.current ? (
                      <span className="text-[10px] font-bold px-2 py-1 rounded-full bg-[#5F7161]/10 text-[#5F7161]">
                        Current
                      </span>
                    ) : (
                      <button className="text-xs font-bold text-red-500 hover:underline">
                        Revoke
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Notifications Tab */}
        {activeTab === "notifications" && (
          <motion.div
            key="notifications"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="space-y-5"
          >
            {/* Email notifications */}
            <div className="rounded-2xl bg-white border border-[#211000]/6 p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-xl bg-[#B66B44]/10 flex items-center justify-center">
                  <Mail className="size-5 text-[#B66B44]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-medium">
                    Email notifications
                  </h2>
                  <p className="text-xs text-[#211000]/45 font-medium">
                    Receive updates via email
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries({
                  orders: "Order updates",
                  messages: "New messages",
                  promotions: "Promotions and offers",
                  newsletter: "Weekly newsletter",
                }).map(([key, label]) => (
                  <NotificationToggle
                    key={key}
                    label={label}
                    checked={
                      profile.emailNotifications[
                        key as keyof typeof profile.emailNotifications
                      ]
                    }
                    onChange={(checked) =>
                      saveProfile({
                        emailNotifications: {
                          ...profile.emailNotifications,
                          [key]: checked,
                        },
                      })
                    }
                  />
                ))}
              </div>
            </div>

            {/* Push notifications */}
            <div className="rounded-2xl bg-white border border-[#211000]/6 p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-xl bg-[#5F7161]/10 flex items-center justify-center">
                  <Bell className="size-5 text-[#5F7161]" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-medium">
                    Push notifications
                  </h2>
                  <p className="text-xs text-[#211000]/45 font-medium">
                    Get notified in your browser
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries({
                  orders: "Order updates",
                  messages: "New messages",
                  priceDrops: "Price drops on saved items",
                }).map(([key, label]) => (
                  <NotificationToggle
                    key={key}
                    label={label}
                    checked={
                      profile.pushNotifications[
                        key as keyof typeof profile.pushNotifications
                      ]
                    }
                    onChange={(checked) =>
                      saveProfile({
                        pushNotifications: {
                          ...profile.pushNotifications,
                          [key]: checked,
                        },
                      })
                    }
                  />
                ))}
              </div>
            </div>

            {/* SMS notifications */}
            <div className="rounded-2xl bg-white border border-[#211000]/6 p-5 sm:p-6">
              <div className="flex items-center gap-3 mb-5">
                <div className="size-10 rounded-xl bg-[#211000]/8 flex items-center justify-center">
                  <PhoneCall className="size-5 text-[#211000]/70" />
                </div>
                <div>
                  <h2 className="font-serif text-lg font-medium">
                    SMS notifications
                  </h2>
                  <p className="text-xs text-[#211000]/45 font-medium">
                    Receive texts for important updates
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {Object.entries({
                  orders: "Order updates",
                  delivery: "Delivery notifications",
                }).map(([key, label]) => (
                  <NotificationToggle
                    key={key}
                    label={label}
                    checked={
                      profile.smsNotifications[
                        key as keyof typeof profile.smsNotifications
                      ]
                    }
                    onChange={(checked) =>
                      saveProfile({
                        smsNotifications: {
                          ...profile.smsNotifications,
                          [key]: checked,
                        },
                      })
                    }
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast */}
      <AnimatePresence>
        {toast && (
          <motion.div
            initial={{ opacity: 0, y: 20, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-6 left-1/2 z-50 inline-flex items-center gap-2 bg-[#211000] text-[#FAF4EC] px-5 py-3 rounded-full shadow-2xl"
          >
            <CheckCircle2 className="size-4 text-[#5F7161]" />
            <span className="text-xs font-bold">{toast}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  onBlur,
  placeholder,
  type = "text",
  disabled = false,
  optional = false,
  hint,
}: any) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
        {label}
        {optional && (
          <span className="text-[#211000]/35 normal-case font-medium">
            {" "}
            (optional)
          </span>
        )}
      </label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/10 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
      />
      {hint && (
        <p className="text-[11px] text-[#211000]/40 font-medium mt-1.5">
          {hint}
        </p>
      )}
    </div>
  );
}

function PasswordField({ label, value, onChange, show, onToggle }: any) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
        {label}
      </label>
      <div className="relative">
        <input
          type={show ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/10 pl-4 pr-11 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#211000]/40 hover:text-[#211000] transition-colors"
        >
          {show ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
        </button>
      </div>
    </div>
  );
}

function NotificationToggle({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between p-3 rounded-xl bg-[#FAF4EC] hover:bg-[#E8CEB0]/30 border border-[#211000]/5 transition-colors"
    >
      <span className="text-sm font-medium">{label}</span>
      <div
        className={`w-11 h-6 rounded-full transition-colors relative ${
          checked ? "bg-[#B66B44]" : "bg-[#211000]/15"
        }`}
      >
        <motion.div
          layout
          transition={{ type: "spring", stiffness: 500, damping: 30 }}
          className="absolute top-0.5 size-5 rounded-full bg-white shadow-sm"
          style={{ left: checked ? "22px" : "2px" }}
        />
      </div>
    </button>
  );
}
