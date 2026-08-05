"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Truck,
  Banknote,
  Bell,
  Trash2,
  LogOut,
  BellOff,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Loader2,
  X,
  Info,
  FileText,
} from "lucide-react";

type TabId = "general" | "buying" | "selling" | "danger";

const DEFAULT_PREFERENCES = {
  emailDigestFrequency: "daily",
  marketingEmails: false,
  partnerEmails: false,
  orderUpdatesSMS: true,
  escrowAlertsSMS: true,
  defaultDelivery: "delivery",
  defaultState: "Lagos",
  allowOffers: true,
  minOfferPercentage: 80,
  instantBuyEnabled: true,
};

function getToken() {
  try {
    return JSON.parse(localStorage.getItem("refurnish_user") || "null")?.token || "";
  } catch {
    return "";
  }
}

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");
  const [preferences, setPreferences] = useState(DEFAULT_PREFERENCES);

  const authedFetch = (path: string, options: RequestInit = {}) =>
    fetch(`${process.env.NEXT_PUBLIC_API_URL}${path}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
        Authorization: `Bearer ${getToken()}`,
      },
    });

  useEffect(() => {
    const fetchPreferences = async () => {
      try {
        const res = await authedFetch("/api/users/me");
        const data = await res.json();
        if (res.ok && data.user?.preferences) {
          setPreferences({ ...DEFAULT_PREFERENCES, ...data.user.preferences });
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchPreferences();
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const savePreferences = async (updates: Partial<typeof preferences>) => {
    setSaving(true);
    const updated = { ...preferences, ...updates };
    setPreferences(updated);
    try {
      const res = await authedFetch("/api/users/me/preferences", {
        method: "PATCH",
        body: JSON.stringify(updates),
      });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.message || "Couldn't save changes.");
        return;
      }
      setToast("Settings saved");
    } catch (err) {
      console.error(err);
      setToast("Couldn't reach the server. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  const handleSignOutEverywhere = async () => {
    localStorage.removeItem("refurnish_user");
    router.push("/login");
  };

  const handleDeactivate = async () => {
    setSaving(true);
    try {
      const res = await authedFetch("/api/users/me/deactivate", { method: "POST" });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.message || "Couldn't deactivate account.");
        setSaving(false);
        return;
      }
      setShowDeactivateModal(false);
      setToast("Account deactivated. You can reactivate by signing in again.");
      setTimeout(() => {
        localStorage.removeItem("refurnish_user");
        router.push("/login");
      }, 1500);
    } catch (err) {
      console.error(err);
      setToast("Couldn't reach the server. Please try again.");
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE MY ACCOUNT") return;
    setSaving(true);
    try {
      const res = await authedFetch("/api/users/me", { method: "DELETE" });
      const data = await res.json();
      if (!res.ok) {
        setToast(data.message || "Couldn't delete account.");
        setSaving(false);
        return;
      }
      localStorage.removeItem("refurnish_user");
      router.push("/login");
    } catch (err) {
      console.error(err);
      setToast("Couldn't reach the server. Please try again.");
      setSaving(false);
    }
  };

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "general", label: "General", icon: Bell },
    { id: "buying", label: "Buying", icon: Truck },
    { id: "selling", label: "Selling", icon: Banknote },
    { id: "danger", label: "Account", icon: AlertTriangle },
  ];

  if (loading) {
    return (
      <div className="px-4 py-24 text-center">
        <Loader2 className="size-8 animate-spin text-[#B66B44] mx-auto" />
      </div>
    );
  }

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-10 max-w-5xl mx-auto">
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/50 hover:text-[#B66B44] transition-colors mb-5"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>

        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">Settings</p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mt-1">Preferences</h1>
        <p className="text-sm text-[#211000]/55 font-medium mt-1">Customise your Refurnish experience.</p>
      </div>

      <div className="flex gap-1.5 overflow-x-auto scrollbar-hide pb-2 mb-6">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isDanger = tab.id === "danger";
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`shrink-0 inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-bold border transition-all ${
                activeTab === tab.id
                  ? isDanger
                    ? "bg-red-500 text-white border-red-500"
                    : "bg-[#211000] text-[#E8CEB0] border-[#211000]"
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
        {/* ─── GENERAL ─── */}
        {activeTab === "general" && (
          <TabContent key="general">
            <SettingsCard title="Communication preferences" icon={Bell}>
              <div className="space-y-3">
                <SelectField
                  label="Email digest frequency"
                  value={preferences.emailDigestFrequency}
                  options={[
                    { value: "realtime", label: "Real-time (every email)" },
                    { value: "daily", label: "Daily digest" },
                    { value: "weekly", label: "Weekly digest" },
                    { value: "never", label: "Never" },
                  ]}
                  onChange={(v) => savePreferences({ emailDigestFrequency: v })}
                />
                <ToggleRow
                  label="Marketing emails"
                  description="Receive promotions, tips, and offers from Refurnish"
                  checked={preferences.marketingEmails}
                  onChange={(v) => savePreferences({ marketingEmails: v })}
                />
                <ToggleRow
                  label="Partner emails"
                  description="Receive relevant offers from Refurnish partners"
                  checked={preferences.partnerEmails}
                  onChange={(v) => savePreferences({ partnerEmails: v })}
                />
                <ToggleRow
                  label="Order updates via SMS"
                  description="Get text messages when your order status changes"
                  checked={preferences.orderUpdatesSMS}
                  onChange={(v) => savePreferences({ orderUpdatesSMS: v })}
                />
                <ToggleRow
                  label="Escrow alerts via SMS"
                  description="Critical alerts when escrow funds are held or released"
                  checked={preferences.escrowAlertsSMS}
                  onChange={(v) => savePreferences({ escrowAlertsSMS: v })}
                />
              </div>
            </SettingsCard>
          </TabContent>
        )}

        {/* ─── BUYING ─── */}
        {activeTab === "buying" && (
          <TabContent key="buying">
            <SettingsCard title="Delivery preferences" icon={Truck}>
              <div className="space-y-4">
                <SelectField
                  label="Default delivery method"
                  value={preferences.defaultDelivery}
                  options={[
                    { value: "delivery", label: "Home delivery" },
                    { value: "pickup", label: "Self pickup" },
                  ]}
                  onChange={(v) => savePreferences({ defaultDelivery: v })}
                />
                <SelectField
                  label="Default state"
                  value={preferences.defaultState}
                  options={["Lagos", "Abuja", "Rivers", "Ogun", "Oyo", "Kano", "Kaduna"].map((s) => ({
                    value: s,
                    label: s,
                  }))}
                  onChange={(v) => savePreferences({ defaultState: v })}
                />
              </div>
            </SettingsCard>
          </TabContent>
        )}

        {/* ─── SELLING ─── */}
        {activeTab === "selling" && (
          <TabContent key="selling">
            <SettingsCard title="Offers & pricing" icon={Banknote}>
              <div className="space-y-3">
                <ToggleRow
                  label="Allow offers"
                  description="Let buyers send you price offers"
                  checked={preferences.allowOffers}
                  onChange={(v) => savePreferences({ allowOffers: v })}
                />
                {preferences.allowOffers && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                      Minimum offer
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={50}
                        max={100}
                        step={5}
                        value={preferences.minOfferPercentage}
                        onChange={(e) =>
                          setPreferences({ ...preferences, minOfferPercentage: Number(e.target.value) })
                        }
                        onMouseUp={() => savePreferences({ minOfferPercentage: preferences.minOfferPercentage })}
                        onTouchEnd={() => savePreferences({ minOfferPercentage: preferences.minOfferPercentage })}
                        className="flex-1 accent-[#B66B44]"
                      />
                      <span className="text-sm font-bold w-16 text-right">
                        {preferences.minOfferPercentage}% min
                      </span>
                    </div>
                    <p className="text-[11px] text-[#211000]/45 font-medium mt-1.5">
                      Offers below this percentage of your listing price will be automatically declined.
                    </p>
                  </div>
                )}
                <ToggleRow
                  label="Instant buy"
                  description="Allow buyers to purchase immediately without messaging"
                  checked={preferences.instantBuyEnabled}
                  onChange={(v) => savePreferences({ instantBuyEnabled: v })}
                />
              </div>
            </SettingsCard>
          </TabContent>
        )}

        {/* ─── DANGER ZONE ─── */}
        {activeTab === "danger" && (
          <TabContent key="danger">
            <div className="rounded-2xl bg-red-50 border border-red-200 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="size-5 text-red-500" />
                <h2 className="font-serif text-xl font-medium text-red-700">Danger zone</h2>
              </div>
              <p className="text-xs text-red-600/70 font-medium leading-relaxed mb-6">
                These actions are irreversible. Please be certain before proceeding.
              </p>

              <div className="space-y-4">
                <DangerAction
                  title="Sign out of this device"
                  description="End your session here. You'll need to sign in again."
                  buttonLabel="Sign out"
                  icon={LogOut}
                  onClick={handleSignOutEverywhere}
                />

                <DangerAction
                  title="Deactivate account"
                  description="Temporarily disable your account. Your data is preserved and you can reactivate by signing in."
                  buttonLabel="Deactivate"
                  icon={BellOff}
                  onClick={() => setShowDeactivateModal(true)}
                />

                <DangerAction
                  title="Delete account permanently"
                  description="Your account will be deactivated and your personal details removed. Order and listing history is kept for other users' records but no longer tied to your identity."
                  buttonLabel="Delete account"
                  icon={Trash2}
                  destructive
                  onClick={() => setShowDeleteModal(true)}
                />
              </div>
            </div>

            <SettingsCard title="Legal" icon={FileText}>
              <div className="space-y-2">
                {[
                  { label: "Terms of Service", href: "/terms" },
                  { label: "Privacy Policy", href: "/privacy" },
                  { label: "Escrow Policy", href: "/escrow-policy" },
                  { label: "Community Guidelines", href: "/guidelines" },
                ].map((item) => (
                  <Link
                    key={item.label}
                    href={item.href}
                    className="flex items-center justify-between p-3 rounded-xl hover:bg-[#FAF4EC] transition-colors group"
                  >
                    <span className="text-sm font-medium">{item.label}</span>
                    <ChevronRight className="size-4 text-[#211000]/20 group-hover:text-[#B66B44] transition-colors" />
                  </Link>
                ))}
              </div>
            </SettingsCard>

            <SettingsCard title="About Refurnish" icon={Info}>
              <div className="text-sm text-[#211000]/55 font-medium space-y-1">
                <p>Version: 1.0.0</p>
                <p>Platform: Refurnish NG</p>
                <p>
                  Support:{" "}
                  <Link href="/support" className="text-[#B66B44] font-bold hover:underline">
                    Contact us
                  </Link>
                </p>
              </div>
            </SettingsCard>
          </TabContent>
        )}
      </AnimatePresence>

      {/* Deactivate Modal */}
      <AnimatePresence>
        {showDeactivateModal && (
          <Modal onClose={() => setShowDeactivateModal(false)}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-yellow-50 flex items-center justify-center mx-auto mb-4">
                <BellOff className="size-7 text-yellow-600" />
              </div>
              <h3 className="font-serif text-2xl font-medium tracking-tight mb-3">Deactivate your account?</h3>
              <p className="text-sm text-[#211000]/60 font-medium leading-relaxed mb-6 max-w-sm mx-auto">
                Your profile, listings, and messages will be hidden. You can reactivate anytime by signing in again.
              </p>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setShowDeactivateModal(false)}
                  className="rounded-full border border-[#211000]/10 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#E8CEB0]/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeactivate}
                  disabled={saving}
                  className="rounded-full bg-yellow-500 hover:bg-yellow-600 disabled:opacity-60 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {saving ? "Processing..." : "Deactivate"}
                </button>
              </div>
            </div>
          </Modal>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {showDeleteModal && (
          <Modal onClose={() => setShowDeleteModal(false)}>
            <div className="text-center">
              <div className="w-14 h-14 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-4">
                <Trash2 className="size-7 text-red-500" />
              </div>
              <h3 className="font-serif text-2xl font-medium tracking-tight text-red-700 mb-3">
                Delete your account?
              </h3>
              <p className="text-sm text-[#211000]/60 font-medium leading-relaxed mb-2 max-w-sm mx-auto">
                Your personal details (email, phone, ID, bank info) will be permanently removed and you won't be
                able to sign in again.
              </p>
              <p className="text-xs font-bold text-red-500 mb-6">Type "DELETE MY ACCOUNT" to confirm</p>
              <input
                value={deleteConfirmText}
                onChange={(e) => setDeleteConfirmText(e.target.value)}
                placeholder="DELETE MY ACCOUNT"
                className="w-full rounded-xl bg-red-50 border border-red-200 px-4 py-3 text-sm font-bold text-center text-red-700 placeholder:text-red-300 focus:outline-none focus:ring-2 focus:ring-red-300 mb-6"
              />
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setDeleteConfirmText("");
                  }}
                  className="rounded-full border border-[#211000]/10 py-3 text-xs font-bold uppercase tracking-wider hover:bg-[#E8CEB0]/20 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  disabled={deleteConfirmText !== "DELETE MY ACCOUNT" || saving}
                  className="rounded-full bg-red-500 hover:bg-red-600 disabled:opacity-40 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
                >
                  {saving ? "Deleting..." : "Delete permanently"}
                </button>
              </div>
            </div>
          </Modal>
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

/* ─── HELPER COMPONENTS ─── */

function TabContent({ children }: { children: React.ReactNode }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      className="space-y-5"
    >
      {children}
    </motion.div>
  );
}

function SettingsCard({ title, icon: Icon, children }: { title: string; icon: any; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl bg-white border border-[#211000]/6 p-5 sm:p-6">
      <div className="flex items-center gap-3 mb-5">
        <div className="size-10 rounded-xl bg-[#E8CEB0]/30 flex items-center justify-center shrink-0">
          <Icon className="size-5 text-[#B66B44]" />
        </div>
        <h2 className="font-serif text-lg font-medium">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function SelectField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/10 px-4 py-3.5 text-sm font-medium focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all appearance-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='none' stroke='%23211000' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m2 4 4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundRepeat: "no-repeat",
          backgroundPosition: "right 14px center",
        }}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ToggleRow({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className="w-full flex items-center justify-between gap-4 p-3 rounded-xl bg-[#FAF4EC] hover:bg-[#E8CEB0]/30 border border-[#211000]/5 transition-colors text-left"
    >
      <div>
        <p className="text-sm font-bold">{label}</p>
        <p className="text-[11px] text-[#211000]/45 font-medium mt-0.5 leading-relaxed">{description}</p>
      </div>
      <div
        className={`w-11 h-6 rounded-full transition-colors relative shrink-0 ${
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

function DangerAction({
  title,
  description,
  buttonLabel,
  icon: Icon,
  onClick,
  destructive = false,
}: {
  title: string;
  description: string;
  buttonLabel: string;
  icon: any;
  onClick: () => void;
  destructive?: boolean;
}) {
  return (
    <div className="rounded-xl bg-white border border-red-200 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-start gap-3">
        <div className="size-9 rounded-lg bg-red-50 grid place-items-center shrink-0">
          <Icon className="size-4 text-red-500" />
        </div>
        <div>
          <p className="text-sm font-bold">{title}</p>
          <p className="text-xs text-[#211000]/50 font-medium mt-0.5 leading-relaxed">{description}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
          destructive ? "bg-red-500 hover:bg-red-600 text-white" : "border border-red-300 text-red-500 hover:bg-red-50"
        }`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-end sm:items-center justify-center px-0 sm:px-4 bg-[#211000]/40 backdrop-blur-sm"
    >
      <div className="absolute inset-0" onClick={onClose} />
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: 40, scale: 0.97 }}
        transition={{ type: "spring", stiffness: 280, damping: 28 }}
        className="relative w-full sm:max-w-md bg-[#FAF4EC] rounded-t-3xl sm:rounded-3xl shadow-2xl border border-[#211000]/10 p-6 sm:p-8"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 size-9 rounded-full hover:bg-[#211000]/5 grid place-items-center"
        >
          <X className="size-4 text-[#211000]/60" />
        </button>
        {children}
      </motion.div>
    </motion.div>
  );
}