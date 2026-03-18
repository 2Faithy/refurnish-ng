"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

// ── SVG Icon set — no emoji ───────────────────────────────────

const IcCheck = () => (
  <svg
    width="11"
    height="11"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="3"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
const IcArrow = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="5" y1="12" x2="19" y2="12" />
    <polyline points="12 5 19 12 12 19" />
  </svg>
);
const IcArrowLeft = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="19" y1="12" x2="5" y2="12" />
    <polyline points="12 19 5 12 12 5" />
  </svg>
);
const IcCamera = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);
const IcUser = () => (
  <svg
    width="28"
    height="28"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.4"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const IcShoppingBag = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
    <line x1="3" y1="6" x2="21" y2="6" />
    <path d="M16 10a4 4 0 01-8 0" />
  </svg>
);
const IcTag = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
    <line x1="7" y1="7" x2="7.01" y2="7" />
  </svg>
);
const IcRefresh = () => (
  <svg
    width="26"
    height="26"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <polyline points="23 4 23 10 17 10" />
    <polyline points="1 20 1 14 7 14" />
    <path d="M3.51 9a9 9 0 0114.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0020.49 15" />
  </svg>
);
const IcMapPin = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);
const IcPhone = () => (
  <svg
    width="15"
    height="15"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.8"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 014.69 12 19.79 19.79 0 011.65 3.42 2 2 0 013.62 1.25h3a2 2 0 012 1.72 12.84 12.84 0 00.7 2.81 2 2 0 01-.45 2.11L7.91 8.64a16 16 0 005.45 5.45l1.06-.96a2 2 0 012.11-.45 12.84 12.84 0 002.81.7A2 2 0 0122 16.92z" />
  </svg>
);
const IcShield = () => (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
  </svg>
);
const IcLock = () => (
  <svg
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0110 0v4" />
  </svg>
);
const IcIdCard = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <rect x="2" y="5" width="20" height="14" rx="2" />
    <line x1="2" y1="10" x2="22" y2="10" />
    <line x1="7" y1="15" x2="7.01" y2="15" />
    <line x1="11" y1="15" x2="13" y2="15" />
  </svg>
);
const IcBank = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <line x1="3" y1="22" x2="21" y2="22" />
    <line x1="6" y1="18" x2="6" y2="11" />
    <line x1="10" y1="18" x2="10" y2="11" />
    <line x1="14" y1="18" x2="14" y2="11" />
    <line x1="18" y1="18" x2="18" y2="11" />
    <polygon points="12 2 20 7 4 7" />
  </svg>
);
const IcSkip = () => (
  <svg
    width="22"
    height="22"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.6"
    strokeLinecap="round"
    strokeLinejoin="round"
    aria-hidden="true"
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 8 16 12 12 16" />
    <line x1="8" y1="12" x2="16" y2="12" />
  </svg>
);
const IcWhatsApp = () => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="currentColor"
    aria-hidden="true"
  >
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12.004 0C5.374 0 0 5.373 0 12c0 2.117.554 4.103 1.523 5.83L.057 23.882l6.204-1.626A11.947 11.947 0 0012.004 24C18.63 24 24 18.626 24 12S18.63 0 12.004 0zm0 21.818a9.818 9.818 0 01-5.003-1.373l-.359-.214-3.724.976.993-3.631-.234-.374a9.818 9.818 0 1114.317-8.2c0 5.42-4.4 9.816-9.99 9.816z" />
  </svg>
);
const IcNgFlag = () => (
  <svg
    width="20"
    height="14"
    viewBox="0 0 20 14"
    aria-label="Nigeria"
    role="img"
  >
    <rect width="20" height="14" fill="#fff" />
    <rect width="7" height="14" fill="#008751" />
    <rect x="13" width="7" height="14" fill="#008751" />
  </svg>
);

// Category icon map — SVG only
const CatIcon = ({ id }: { id: string }) => {
  const icons: Record<string, JSX.Element> = {
    sofa: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 10V7a1 1 0 011-1h16a1 1 0 011 1v3" />
        <rect x="1" y="10" width="22" height="8" rx="1" />
        <line x1="4" y1="18" x2="4" y2="21" />
        <line x1="20" y1="18" x2="20" y2="21" />
        <line x1="1" y1="13" x2="23" y2="13" />
      </svg>
    ),
    bed: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M2 4v16" />
        <path d="M2 8h18a2 2 0 012 2v10" />
        <path d="M2 17h20" />
        <path d="M6 8v9" />
      </svg>
    ),
    dining: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="2" x2="12" y2="22" />
        <path d="M17 5H9.5a3.5 3.5 0 000 7h5a3.5 3.5 0 010 7H6" />
      </svg>
    ),
    storage: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    outdoor: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
        <polyline points="9 22 9 12 15 12 15 22" />
      </svg>
    ),
    office: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="2" y="3" width="20" height="14" rx="2" />
        <line x1="8" y1="21" x2="16" y2="21" />
        <line x1="12" y1="17" x2="12" y2="21" />
      </svg>
    ),
    lighting: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <line x1="12" y1="2" x2="12" y2="6" />
        <line x1="12" y1="18" x2="12" y2="22" />
        <line x1="4.93" y1="4.93" x2="7.76" y2="7.76" />
        <line x1="16.24" y1="16.24" x2="19.07" y2="19.07" />
        <line x1="2" y1="12" x2="6" y2="12" />
        <line x1="18" y1="12" x2="22" y2="12" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
    decor: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <circle cx="8.5" cy="8.5" r="1.5" />
        <polyline points="21 15 16 10 5 21" />
      </svg>
    ),
    kids: (
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z" />
      </svg>
    ),
  };
  return icons[id] ?? icons.sofa;
};

// ── Data ──────────────────────────────────────────────────────

const CATEGORIES = [
  { id: "sofa", label: "Sofas & Seating" },
  { id: "bed", label: "Beds & Bedroom" },
  { id: "dining", label: "Dining Sets" },
  { id: "storage", label: "Storage" },
  { id: "outdoor", label: "Outdoor" },
  { id: "office", label: "Office & Study" },
  { id: "lighting", label: "Lighting" },
  { id: "decor", label: "Décor & Art" },
  { id: "kids", label: "Kids" },
];

const STATES = [
  "Lagos",
  "Abuja (FCT)",
  "Rivers",
  "Kano",
  "Oyo",
  "Delta",
  "Anambra",
  "Enugu",
  "Kaduna",
  "Ondo",
  "Ogun",
  "Edo",
  "Kogi",
  "Kwara",
  "Osun",
  "Ekiti",
  "Imo",
  "Abia",
  "Cross River",
  "Akwa Ibom",
  "Bayelsa",
  "Benue",
  "Plateau",
  "Nasarawa",
];

const LGAS: Record<string, string[]> = {
  Lagos: [
    "Ikeja",
    "Lekki",
    "Victoria Island",
    "Surulere",
    "Yaba",
    "Ajah",
    "Ikoyi",
    "Apapa",
    "Alimosho",
    "Mushin",
  ],
  "Abuja (FCT)": [
    "Garki",
    "Wuse",
    "Maitama",
    "Asokoro",
    "Gwarinpa",
    "Lugbe",
    "Kubwa",
    "Nyanya",
  ],
  Rivers: ["Port Harcourt", "Obio-Akpor", "Eleme", "Bonny", "Okrika", "Oyigbo"],
  Kano: ["Kano Municipal", "Fagge", "Dala", "Gwale", "Nassarawa", "Tarauni"],
  Oyo: ["Ibadan North", "Ibadan South", "Ogbomosho", "Oyo", "Iseyin"],
};

type Role = "buyer" | "seller" | "both" | "";

interface FormState {
  photo: string;
  name: string;
  role: Role;
  state: string;
  lga: string;
  categories: string[];
  whatsapp: string;
  verifyMethod: "nin" | "bvn" | "skip";
  verifyValue: string;
}

// ── Component ─────────────────────────────────────────────────

export default function OnboardingPage() {
  const router = useRouter();
  const fileRef = useRef<HTMLInputElement>(null);
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    photo: "",
    name: "",
    role: "",
    state: "",
    lga: "",
    categories: [],
    whatsapp: "",
    verifyMethod: "skip",
    verifyValue: "",
  });

  const set = (k: keyof FormState, v: any) =>
    setForm((f) => ({ ...f, [k]: v }));
  const toggleCat = (id: string) =>
    setForm((f) => ({
      ...f,
      categories: f.categories.includes(id)
        ? f.categories.filter((c) => c !== id)
        : [...f.categories, id],
    }));

  const trustScore = () => {
    let s = 10;
    if (form.photo) s += 15;
    if (form.name.length > 1) s += 10;
    if (form.role) s += 10;
    if (form.state) s += 15;
    if (form.categories.length > 0) s += 10;
    if (form.whatsapp.length > 9) s += 15;
    if (form.verifyMethod !== "skip") s += 15;
    return Math.min(s, 100);
  };

  const canNext = () => {
    if (step === 1) return form.name.trim().length > 1 && form.role !== "";
    if (step === 2) return form.state !== "" && form.categories.length > 0;
    return true;
  };

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) set("photo", URL.createObjectURL(file));
  };

  const score = trustScore();
  const trustItems = [
    { label: "Profile photo", earned: !!form.photo },
    { label: "Display name", earned: form.name.length > 1 },
    { label: "Role selected", earned: !!form.role },
    { label: "Location set", earned: !!form.state },
    { label: "Categories", earned: form.categories.length > 0 },
    { label: "WhatsApp linked", earned: form.whatsapp.length > 9 },
    { label: "ID verified", earned: form.verifyMethod !== "skip" },
  ];

  const inp =
    "w-full px-4 py-3 bg-white border-[1.5px] border-[#E5D5C0] rounded-xl text-[#2C1F0E] text-sm placeholder-[#8C7A6B] outline-none transition-all duration-200 focus:border-[#755210] focus:ring-2 focus:ring-[#755210]/10 appearance-none";

  return (
    // pt-16 pushes below navbar
    <div className="min-h-screen flex font-sans bg-[#FDF8F3] pt-26">
      {/* ══ SIDEBAR ════════════════════════════════════════════ */}
      <aside className="hidden lg:flex w-[300px] flex-shrink-0 flex-col bg-[#755210] relative overflow-hidden sticky top-16 h-[calc(100vh-4rem)]">
        {/* bg image */}
        <div className="absolute inset-0 pointer-events-none">
          <Image
            src="/living.jpg"
            alt=""
            fill
            className="object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#2C1A07]/60 via-[#755210]/25 to-[#0F0701]/92" />
        </div>

        <div className="relative z-10 flex flex-col h-full p-8">
          {/* Logo */}
          <Image
            src="/login-bg.png"
            alt="Logo"
            width={110}
            height={36}
            className="object-contain brightness-0 invert mb-10"
          />

          {/* Steps */}
          <div className="flex flex-col flex-1">
            {[
              { n: 1, title: "Your Profile", sub: "Name, photo & role" },
              {
                n: 2,
                title: "Location & Preferences",
                sub: "State, area & categories",
              },
              {
                n: 3,
                title: "Trust & Verification",
                sub: "WhatsApp & ID check",
              },
            ].map(({ n, title, sub }) => {
              const done = n < step;
              const active = n === step;
              return (
                <div
                  key={n}
                  className="flex gap-4 items-start pb-7 relative last:pb-0"
                >
                  {/* connector line */}
                  {n < 3 && (
                    <div
                      className={`absolute left-[14px] top-8 w-px h-[calc(100%-20px)] ${
                        done ? "bg-white/40" : "bg-white/15"
                      }`}
                    />
                  )}
                  {/* dot */}
                  <div
                    className={`w-7 h-7 rounded-full flex-shrink-0 flex items-center justify-center text-xs font-bold transition-all ${
                      done
                        ? "bg-[#33B64B] text-white border-[#33B64B]"
                        : active
                        ? "bg-[#E8CEB0] text-[#755210] border-[#E8CEB0]"
                        : "border border-white/25 text-white/40"
                    }`}
                  >
                    {done ? <IcCheck /> : n}
                  </div>
                  <div className="pt-0.5">
                    <p
                      className={`text-sm font-medium transition-colors ${
                        active
                          ? "text-white font-semibold"
                          : done
                          ? "text-white/65"
                          : "text-white/40"
                      }`}
                    >
                      {title}
                    </p>
                    <p
                      className={`text-xs mt-0.5 ${
                        active ? "text-white/55" : "text-white/28"
                      }`}
                    >
                      {sub}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Trust score */}
          <div className="bg-white/10 border border-white/15 rounded-2xl p-5 mt-auto">
            <div className="flex items-center justify-between mb-2.5">
              <span className="text-[10px] font-bold text-white/50 uppercase tracking-widest">
                Trust Score
              </span>
              <span className="font-serif text-2xl text-white">
                {score}
                <span className="text-sm text-white/35">/100</span>
              </span>
            </div>
            <div className="h-1.5 bg-white/10 rounded-full overflow-hidden mb-3">
              <div
                className="h-full bg-[#33B64B] rounded-full transition-all duration-500"
                style={{ width: `${score}%` }}
              />
            </div>
            <div className="flex flex-col gap-1.5">
              {trustItems.map(({ label, earned }) => (
                <div
                  key={label}
                  className={`flex items-center gap-2 text-xs ${
                    earned ? "text-white/80" : "text-white/35"
                  }`}
                >
                  <div
                    className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${
                      earned ? "bg-[#33B64B]" : "bg-white/20"
                    }`}
                  />
                  {label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </aside>

      {/* ══ MAIN ══════════════════════════════════════════════ */}
      <main className="flex-1 overflow-y-auto">
        <div className="max-w-2xl mx-auto px-6 py-10 lg:px-12 lg:py-12">
          {/* Progress bar */}
          <div className="h-1 bg-[#E5D5C0] rounded-full mb-10 overflow-hidden">
            <div
              className="h-full bg-[#755210] rounded-full transition-all duration-400"
              style={{ width: `${(step / 3) * 100}%` }}
            />
          </div>

          {/* Step badge */}
          <span className="inline-flex items-center bg-[#F4E8D8] text-[#755210] text-[10.5px] font-bold uppercase tracking-widest px-3 py-1.5 rounded-full mb-4">
            Step {step} of 3
          </span>

          {/* ── STEP 1 ── */}
          {step === 1 && (
            <div>
              <h1 className="font-serif text-3xl font-semibold text-[#2C1F0E] mb-2">
                Tell us about yourself
              </h1>
              <p className="text-sm text-[#8C7A6B] font-light leading-relaxed mb-8">
                This helps buyers and sellers know who they're dealing with —
                trust that makes every transaction smoother.
              </p>

              {/* Photo upload */}
              <div className="flex items-center gap-6 mb-8">
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className="w-20 h-20 rounded-full flex-shrink-0 border-2 border-dashed border-[#E5D5C0] bg-[#F4E8D8] hover:border-[#755210] transition-colors overflow-hidden flex items-center justify-center relative group"
                >
                  {form.photo ? (
                    <Image
                      src={form.photo}
                      alt="Profile"
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-1 text-[#8C7A6B] group-hover:text-[#755210] transition-colors">
                      <IcCamera />
                      <span className="text-[9px] font-medium">Add photo</span>
                    </div>
                  )}
                </button>
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*"
                  className="sr-only"
                  onChange={handlePhoto}
                />
                <div>
                  <p className="text-sm font-medium text-[#2C1F0E] mb-1">
                    Profile photo
                  </p>
                  <p className="text-xs text-[#8C7A6B] leading-relaxed">
                    Listings with a photo get{" "}
                    <strong className="text-[#755210] font-semibold">
                      3× more responses
                    </strong>
                    . A clear face photo builds immediate trust.
                  </p>
                </div>
              </div>

              {/* Name */}
              <div className="mb-5">
                <label className="block text-xs font-semibold text-[#2C1F0E] mb-2">
                  Display Name
                </label>
                <input
                  type="text"
                  placeholder="e.g. Amara O. or Okafor Furniture"
                  value={form.name}
                  onChange={(e) => set("name", e.target.value)}
                  className={inp}
                />
              </div>

              {/* Role cards */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#2C1F0E] mb-3">
                  I'm here to…
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      id: "buyer",
                      Icon: IcShoppingBag,
                      name: "Buy",
                      desc: "Browse & purchase furniture",
                    },
                    {
                      id: "seller",
                      Icon: IcTag,
                      name: "Sell",
                      desc: "List items & earn money",
                    },
                    {
                      id: "both",
                      Icon: IcRefresh,
                      name: "Both",
                      desc: "Buy and sell furniture",
                    },
                  ].map(({ id, Icon, name, desc }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => set("role", id as Role)}
                      className={`relative border-[1.5px] rounded-2xl p-4 text-center transition-all ${
                        form.role === id
                          ? "border-[#755210] bg-[#755210]/5"
                          : "border-[#E5D5C0] bg-white hover:border-[#755210]/40"
                      }`}
                    >
                      {form.role === id && (
                        <div className="absolute top-2 right-2 w-4 h-4 rounded-full bg-[#755210] flex items-center justify-center text-white">
                          <IcCheck />
                        </div>
                      )}
                      <div
                        className={`flex justify-center mb-2 ${
                          form.role === id ? "text-[#755210]" : "text-[#8C7A6B]"
                        }`}
                      >
                        <Icon />
                      </div>
                      <p
                        className={`text-sm font-semibold mb-1 ${
                          form.role === id ? "text-[#755210]" : "text-[#2C1F0E]"
                        }`}
                      >
                        {name}
                      </p>
                      <p className="text-[10.5px] text-[#8C7A6B] leading-snug">
                        {desc}
                      </p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 2 ── */}
          {step === 2 && (
            <div>
              <h1 className="font-serif text-3xl font-semibold text-[#2C1F0E] mb-2">
                Location & preferences
              </h1>
              <p className="text-sm text-[#8C7A6B] font-light leading-relaxed mb-8">
                We show listings closest to you first. Your location is never
                shared publicly — only used to calculate distance.
              </p>

              {/* State + LGA */}
              <div className="grid grid-cols-2 gap-4 mb-5">
                <div>
                  <label className="block text-xs font-semibold text-[#2C1F0E] mb-2 flex items-center gap-1.5">
                    <IcMapPin /> State
                  </label>
                  <select
                    value={form.state}
                    onChange={(e) => {
                      set("state", e.target.value);
                      set("lga", "");
                    }}
                    className={inp}
                  >
                    <option value="">Select state</option>
                    {STATES.map((s) => (
                      <option key={s}>{s}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2C1F0E] mb-2">
                    Area / LGA
                  </label>
                  <select
                    value={form.lga}
                    onChange={(e) => set("lga", e.target.value)}
                    disabled={!form.state}
                    className={`${inp} disabled:opacity-50 disabled:cursor-not-allowed`}
                  >
                    <option value="">Select area</option>
                    {(LGAS[form.state] ?? ["Other"]).map((l) => (
                      <option key={l}>{l}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Categories */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-[#2C1F0E] mb-1">
                  What furniture interests you?
                  <span className="text-[#8C7A6B] font-normal ml-2">
                    Pick all that apply
                  </span>
                </label>
                <div className="grid grid-cols-3 gap-2.5 mt-3">
                  {CATEGORIES.map(({ id, label }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() => toggleCat(id)}
                      className={`flex flex-col items-center gap-2 p-3 rounded-xl border-[1.5px] text-center transition-all ${
                        form.categories.includes(id)
                          ? "border-[#755210] bg-[#755210]/5 text-[#755210]"
                          : "border-[#E5D5C0] bg-white text-[#8C7A6B] hover:border-[#755210]/40"
                      }`}
                    >
                      <CatIcon id={id} />
                      <span
                        className={`text-[10.5px] font-medium leading-snug ${
                          form.categories.includes(id)
                            ? "text-[#755210]"
                            : "text-[#2C1F0E]"
                        }`}
                      >
                        {label}
                      </span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* ── STEP 3 ── */}
          {step === 3 && (
            <div>
              <h1 className="font-serif text-3xl font-semibold text-[#2C1F0E] mb-2">
                Build your trust profile
              </h1>
              <p className="text-sm text-[#8C7A6B] font-light leading-relaxed mb-6">
                Verified accounts close deals faster. You can skip any of these
                and complete them later from your dashboard.
              </p>

              {/* Security notice */}
              <div className="flex items-start gap-3 bg-[#F4E8D8] border border-[#E8CEB0] rounded-xl px-4 py-3.5 mb-7 text-[#755210]">
                <div className="mt-0.5 flex-shrink-0">
                  <IcLock />
                </div>
                <p className="text-xs leading-relaxed">
                  <strong className="font-semibold">Your data is safe.</strong>{" "}
                  Bank-level encryption. Your NIN or BVN is never stored — only
                  used once to confirm identity, then discarded.
                </p>
              </div>

              {/* WhatsApp */}
              <div className="mb-6">
                <label className="block text-xs font-semibold text-[#2C1F0E] mb-2 flex items-center gap-1.5">
                  <span className="text-[#25D366]">
                    <IcWhatsApp />
                  </span>
                  WhatsApp Number
                  <span className="text-[#5F7161] font-normal">
                    Recommended
                  </span>
                </label>
                <div className="flex">
                  <div className="flex items-center gap-2 px-3 bg-[#F0FDF4] border-[1.5px] border-[#BBF7D0] border-r-0 rounded-l-xl text-xs font-bold text-[#5F7161] flex-shrink-0">
                    <IcNgFlag /> +234
                  </div>
                  <input
                    type="tel"
                    placeholder="0801 234 5678"
                    value={form.whatsapp}
                    onChange={(e) => set("whatsapp", e.target.value)}
                    className="flex-1 px-4 py-3 bg-white border-[1.5px] border-[#E5D5C0] rounded-r-xl text-[#2C1F0E] text-sm placeholder-[#8C7A6B] outline-none focus:border-[#755210] focus:ring-2 focus:ring-[#755210]/10 transition-all"
                  />
                </div>
                <p className="text-xs text-[#8C7A6B] mt-1.5 leading-snug">
                  Buyers can message you instantly. Significantly speeds up deal
                  closures.
                </p>
              </div>

              {/* ID verification */}
              <div className="mb-4">
                <label className="block text-xs font-semibold text-[#2C1F0E] mb-3">
                  Identity Verification
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    {
                      id: "nin",
                      Icon: IcIdCard,
                      name: "NIN",
                      sub: "National Identity Number",
                      pts: "+15 pts",
                    },
                    {
                      id: "bvn",
                      Icon: IcBank,
                      name: "BVN",
                      sub: "Bank Verification Number",
                      pts: "+15 pts",
                    },
                    {
                      id: "skip",
                      Icon: IcSkip,
                      name: "Skip for now",
                      sub: "Complete later",
                      pts: null,
                    },
                  ].map(({ id, Icon, name, sub, pts }) => (
                    <button
                      key={id}
                      type="button"
                      onClick={() =>
                        set("verifyMethod", id as "nin" | "bvn" | "skip")
                      }
                      className={`relative border-[1.5px] rounded-xl p-4 text-center transition-all ${
                        form.verifyMethod === id
                          ? "border-[#755210] bg-[#755210]/5"
                          : "border-[#E5D5C0] bg-white hover:border-[#755210]/40"
                      }`}
                    >
                      {pts && (
                        <span className="absolute -top-px -right-px bg-[#33B64B] text-white text-[9px] font-bold px-2 py-0.5 rounded-bl-lg rounded-tr-xl">
                          {pts}
                        </span>
                      )}
                      <div
                        className={`flex justify-center mb-2 ${
                          form.verifyMethod === id
                            ? "text-[#755210]"
                            : "text-[#8C7A6B]"
                        }`}
                      >
                        <Icon />
                      </div>
                      <p
                        className={`text-xs font-semibold mb-1 ${
                          form.verifyMethod === id
                            ? "text-[#755210]"
                            : "text-[#2C1F0E]"
                        }`}
                      >
                        {name}
                      </p>
                      <p className="text-[10px] text-[#8C7A6B] leading-snug">
                        {sub}
                      </p>
                    </button>
                  ))}
                </div>
              </div>

              {/* ID input */}
              {form.verifyMethod !== "skip" && (
                <div className="mt-4">
                  <label className="block text-xs font-semibold text-[#2C1F0E] mb-2">
                    Enter your {form.verifyMethod.toUpperCase()}
                  </label>
                  <input
                    type="text"
                    placeholder={
                      form.verifyMethod === "nin"
                        ? "11-digit NIN"
                        : "10-digit BVN"
                    }
                    value={form.verifyValue}
                    onChange={(e) => set("verifyValue", e.target.value)}
                    maxLength={form.verifyMethod === "nin" ? 11 : 10}
                    className={inp}
                  />
                </div>
              )}
            </div>
          )}

          {/* ── BOTTOM NAV ── */}
          <div className="flex items-center justify-between mt-10 pt-6 border-t border-[#E5D5C0]">
            {step > 1 ? (
              <button
                type="button"
                onClick={() => setStep((s) => (s - 1) as 1 | 2)}
                className="flex items-center gap-2 border-[1.5px] border-[#E5D5C0] rounded-xl px-5 py-3 text-sm font-semibold text-[#8C7A6B] hover:border-[#755210] hover:text-[#755210] transition-all"
              >
                <IcArrowLeft /> Back
              </button>
            ) : (
              <div />
            )}

            <div className="flex flex-col items-end gap-2">
              <button
                type="button"
                onClick={() => {
                  if (step < 3) setStep((s) => (s + 1) as 2 | 3);
                  else router.push("/dashboard");
                }}
                disabled={!canNext()}
                className="flex items-center gap-2 bg-[#755210] hover:bg-[#9A7235] disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold px-7 py-3 rounded-xl transition-all shadow-md hover:shadow-lg"
              >
                {step < 3 ? "Continue" : "Go to Dashboard"} <IcArrow />
              </button>
              {step === 3 && (
                <button
                  type="button"
                  onClick={() => router.push("/dashboard")}
                  className="text-xs text-[#8C7A6B] underline underline-offset-2 hover:text-[#755210] transition-colors"
                >
                  Skip and go to dashboard
                </button>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
