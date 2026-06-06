"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Settings,
  Globe,
  Moon,
  Sun,
  Monitor,
  Eye,
  EyeOff,
  MapPin,
  CreditCard,
  Truck,
  Smartphone,
  Shield,
  ShieldCheck,
  Lock,
  Bell,
  BellOff,
  Trash2,
  Download,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  ChevronRight,
  Loader2,
  X,
  Info,
  ToggleLeft,
  ToggleRight,
  Wallet,
  Users,
  Package,
  Scale,
  FileText,
  Banknote,
  Heart,
  Clock,
} from "lucide-react";

const SETTINGS_KEY = "refurnish_settings";
const USER_KEY = "refurnish_user";

const CURRENCIES = [
  { code: "NGN", label: "Nigerian Naira (₦)", symbol: "₦" },
  { code: "USD", label: "US Dollar ($)", symbol: "$" },
  { code: "GBP", label: "British Pound (£)", symbol: "£" },
];

const LANGUAGES = [
  { code: "en", label: "English" },
  { code: "yo", label: "Yoruba" },
  { code: "ig", label: "Igbo" },
  { code: "ha", label: "Hausa" },
  { code: "pcm", label: "Pidgin English" },
];

type TabId =
  | "general"
  | "privacy"
  | "buying"
  | "selling"
  | "data"
  | "danger";

export default function SettingsPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabId>("general");
  const [saving, setSaving] = useState(false);
  const [toast, setToast] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDeactivateModal, setShowDeactivateModal] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState("");

  const [settings, setSettings] = useState({
    // General
    language: "en",
    currency: "NGN",
    theme: "light",

    // Privacy
    showProfile: true,
    showLocation: true,
    showOnlineStatus: true,
    showListingsCount: true,
    showReviews: true,
    allowMessages: "everyone",
    showPhoneToSellers: false,
    showEmailToSellers: false,

    // Buying preferences
    defaultDelivery: "delivery",
    defaultState: "Lagos",
    autoSaveSearch: true,
    priceAlerts: true,
    priceAlertThreshold: 15,
    savedSearchNotify: true,
    showSoldItems: false,

    // Selling preferences
    autoRenewListings: true,
    allowOffers: true,
    minOfferPercentage: 80,
    instantBuyEnabled: true,
    showViewCount: true,
    autoReplyEnabled: false,
    autoReplyMessage: "Thanks for your interest! I'll get back to you shortly.",

    // Communication
    emailDigestFrequency: "daily",
    marketingEmails: false,
    partnerEmails: false,
    orderUpdatesSMS: true,
    escrowAlertsSMS: true,

    // Data
    downloadDataRequested: false,
    lastDataExport: null as string | null,
  });
  

  useEffect(() => {
    try {
      const stored = localStorage.getItem(SETTINGS_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setSettings((prev) => ({ ...prev, ...parsed }));
        applyTheme(parsed.theme || "light");
      }
    } catch {}
  }, []);

  useEffect(() => {
    if (!toast) return;
    const t = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(t);
  }, [toast]);

  const saveSettings = async (updates: Partial<typeof settings>) => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 400));
  
    const updated = { ...settings, ...updates };
    setSettings(updated);
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(updated));
  
    if (updates.theme) applyTheme(updates.theme); // 👈 add this line
  
    setSaving(false);
    setToast("Settings saved");
  };

  const handleDeactivate = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    setSaving(false);
    setShowDeactivateModal(false);
    setToast("Account deactivated. You can reactivate by signing in again.");
    setTimeout(() => {
      localStorage.removeItem(USER_KEY);
      router.push("/login");
    }, 2000);
  };

  const handleDelete = async () => {
    if (deleteConfirmText !== "DELETE MY ACCOUNT") return;
    setSaving(true);
    await new Promise((r) => setTimeout(r, 2000));
    localStorage.clear();
    router.push("/login");
  };

  const handleExportData = async () => {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1500));
    await saveSettings({
      downloadDataRequested: true,
      lastDataExport: new Date().toISOString(),
    });
    setToast("Data export requested. You'll receive an email within 24 hours.");
  };

  const tabs: { id: TabId; label: string; icon: any }[] = [
    { id: "general", label: "General", icon: Settings },
    { id: "privacy", label: "Privacy", icon: Eye },
    { id: "buying", label: "Buying", icon: Package },
    { id: "selling", label: "Selling", icon: Wallet },
    { id: "data", label: "Data", icon: Download },
    { id: "danger", label: "Account", icon: AlertTriangle },
  ];

  return (
    <div className="px-4 sm:px-6 lg:px-8 xl:px-10 py-6 lg:py-10 max-w-5xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/dashboard"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#211000]/50 hover:text-[#B66B44] transition-colors mb-5"
        >
          <ArrowLeft className="size-4" />
          Dashboard
        </Link>

        <p className="text-[11px] font-bold uppercase tracking-[0.25em] text-[#B66B44]">
          Settings
        </p>
        <h1 className="font-serif text-3xl sm:text-4xl font-medium tracking-tight mt-1">
          Preferences
        </h1>
        <p className="text-sm text-[#211000]/55 font-medium mt-1">
          Customise your Refurnish experience.
        </p>
      </div>

      {/* Tabs */}
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
            <SettingsCard title="Language & region" icon={Globe}>
              <div className="grid sm:grid-cols-2 gap-4">
                <SelectField
                  label="Language"
                  value={settings.language}
                  options={LANGUAGES.map((l) => ({ value: l.code, label: l.label }))}
                  onChange={(v) => saveSettings({ language: v })}
                />
                <SelectField
                  label="Currency"
                  value={settings.currency}
                  options={CURRENCIES.map((c) => ({ value: c.code, label: c.label }))}
                  onChange={(v) => saveSettings({ currency: v })}
                />
              </div>
            </SettingsCard>

            <SettingsCard title="Appearance" icon={Sun}>
              <div>
                <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-3">
                  Theme
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: "light", label: "Light", icon: Sun },
                    { id: "dark", label: "Dark", icon: Moon },
                    { id: "system", label: "System", icon: Monitor },
                  ].map((t) => {
                    const Icon = t.icon;
                    const active = settings.theme === t.id;
                    return (
                      <button
                        key={t.id}
                        onClick={() => saveSettings({ theme: t.id })}
                        className={`p-4 rounded-xl border text-center transition-all ${
                          active
                            ? "bg-[#211000] text-[#E8CEB0] border-[#211000]"
                            : "bg-[#FAF4EC] border-[#211000]/8 hover:border-[#211000]/20"
                        }`}
                      >
                        <Icon className="size-5 mx-auto mb-2" />
                        <p className="text-xs font-bold">{t.label}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </SettingsCard>

            <SettingsCard title="Communication preferences" icon={Bell}>
              <div className="space-y-3">
                <SelectField
                  label="Email digest frequency"
                  value={settings.emailDigestFrequency}
                  options={[
                    { value: "realtime", label: "Real-time (every email)" },
                    { value: "daily", label: "Daily digest" },
                    { value: "weekly", label: "Weekly digest" },
                    { value: "never", label: "Never" },
                  ]}
                  onChange={(v) => saveSettings({ emailDigestFrequency: v })}
                />
                <ToggleRow
                  label="Marketing emails"
                  description="Receive promotions, tips, and offers from Refurnish"
                  checked={settings.marketingEmails}
                  onChange={(v) => saveSettings({ marketingEmails: v })}
                />
                <ToggleRow
                  label="Partner emails"
                  description="Receive relevant offers from Refurnish partners"
                  checked={settings.partnerEmails}
                  onChange={(v) => saveSettings({ partnerEmails: v })}
                />
                <ToggleRow
                  label="Order updates via SMS"
                  description="Get text messages when your order status changes"
                  checked={settings.orderUpdatesSMS}
                  onChange={(v) => saveSettings({ orderUpdatesSMS: v })}
                />
                <ToggleRow
                  label="Escrow alerts via SMS"
                  description="Critical alerts when escrow funds are held or released"
                  checked={settings.escrowAlertsSMS}
                  onChange={(v) => saveSettings({ escrowAlertsSMS: v })}
                />
              </div>
            </SettingsCard>
          </TabContent>
        )}

        {/* ─── PRIVACY ─── */}
        {activeTab === "privacy" && (
          <TabContent key="privacy">
            <SettingsCard title="Profile visibility" icon={Eye}>
              <div className="space-y-3">
                <ToggleRow
                  label="Show profile publicly"
                  description="Other users can view your profile page"
                  checked={settings.showProfile}
                  onChange={(v) => saveSettings({ showProfile: v })}
                />
                <ToggleRow
                  label="Show location"
                  description="Display your city/state on your profile"
                  checked={settings.showLocation}
                  onChange={(v) => saveSettings({ showLocation: v })}
                />
                <ToggleRow
                  label="Show online status"
                  description="Let others see when you're currently active"
                  checked={settings.showOnlineStatus}
                  onChange={(v) => saveSettings({ showOnlineStatus: v })}
                />
                <ToggleRow
                  label="Show listings count"
                  description="Display how many active listings you have"
                  checked={settings.showListingsCount}
                  onChange={(v) => saveSettings({ showListingsCount: v })}
                />
                <ToggleRow
                  label="Show reviews"
                  description="Display reviews from previous transactions"
                  checked={settings.showReviews}
                  onChange={(v) => saveSettings({ showReviews: v })}
                />
              </div>
            </SettingsCard>

            <SettingsCard title="Contact information" icon={Shield}>
              <div className="space-y-3">
                <ToggleRow
                  label="Share phone with sellers"
                  description="Sellers can see your phone number after you place an order"
                  checked={settings.showPhoneToSellers}
                  onChange={(v) => saveSettings({ showPhoneToSellers: v })}
                />
                <ToggleRow
                  label="Share email with sellers"
                  description="Sellers can see your email after you place an order"
                  checked={settings.showEmailToSellers}
                  onChange={(v) => saveSettings({ showEmailToSellers: v })}
                />
                <SelectField
                  label="Who can message me"
                  value={settings.allowMessages}
                  options={[
                    { value: "everyone", label: "Everyone" },
                    { value: "verified", label: "Verified users only" },
                    { value: "orders", label: "Users I have orders with" },
                    { value: "nobody", label: "Nobody" },
                  ]}
                  onChange={(v) => saveSettings({ allowMessages: v })}
                />
              </div>

              <div className="mt-4 rounded-xl bg-[#E8CEB0]/30 border border-[#E8CEB0] p-3 flex items-start gap-2.5">
                <Info className="size-4 text-[#B66B44] shrink-0 mt-0.5" />
                <p className="text-xs text-[#211000]/60 font-medium leading-relaxed">
                  All in-app messages are monitored. Sharing personal contact information outside the platform is blocked for your safety.
                </p>
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
                  value={settings.defaultDelivery}
                  options={[
                    { value: "delivery", label: "Home delivery" },
                    { value: "pickup", label: "Self pickup" },
                  ]}
                  onChange={(v) => saveSettings({ defaultDelivery: v })}
                />
                <SelectField
                  label="Default state"
                  value={settings.defaultState}
                  options={[
                    "Lagos", "Abuja", "Rivers", "Ogun", "Oyo", "Kano", "Kaduna",
                  ].map((s) => ({ value: s, label: s }))}
                  onChange={(v) => saveSettings({ defaultState: v })}
                />
              </div>
            </SettingsCard>

            <SettingsCard title="Search & discovery" icon={Heart}>
              <div className="space-y-3">
                <ToggleRow
                  label="Save search history"
                  description="Remember your recent searches for quicker access"
                  checked={settings.autoSaveSearch}
                  onChange={(v) => saveSettings({ autoSaveSearch: v })}
                />
                <ToggleRow
                  label="Price drop alerts"
                  description="Get notified when items you saved drop in price"
                  checked={settings.priceAlerts}
                  onChange={(v) => saveSettings({ priceAlerts: v })}
                />
                {settings.priceAlerts && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                      Alert when price drops by at least
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range"
                        min={5}
                        max={50}
                        step={5}
                        value={settings.priceAlertThreshold}
                        onChange={(e) =>
                          saveSettings({ priceAlertThreshold: Number(e.target.value) })
                        }
                        className="flex-1 accent-[#B66B44]"
                      />
                      <span className="text-sm font-bold w-12 text-right">
                        {settings.priceAlertThreshold}%
                      </span>
                    </div>
                  </div>
                )}
                <ToggleRow
                  label="Saved search notifications"
                  description="Get notified when new items match your saved searches"
                  checked={settings.savedSearchNotify}
                  onChange={(v) => saveSettings({ savedSearchNotify: v })}
                />
                <ToggleRow
                  label="Show sold items"
                  description="Show previously sold items in search results"
                  checked={settings.showSoldItems}
                  onChange={(v) => saveSettings({ showSoldItems: v })}
                />
              </div>
            </SettingsCard>
          </TabContent>
        )}

        {/* ─── SELLING ─── */}
        {activeTab === "selling" && (
          <TabContent key="selling">
            <SettingsCard title="Listing defaults" icon={Package}>
              <div className="space-y-4">
                <ToggleRow
                  label="Auto-renew listings"
                  description="Automatically relist expired listings"
                  checked={settings.autoRenewListings}
                  onChange={(v) => saveSettings({ autoRenewListings: v })}
                />
                <ToggleRow
                  label="Show view count"
                  description="Display how many people have viewed your listing"
                  checked={settings.showViewCount}
                  onChange={(v) => saveSettings({ showViewCount: v })}
                />
              </div>
            </SettingsCard>

            <SettingsCard title="Offers & pricing" icon={Banknote}>
              <div className="space-y-3">
                <ToggleRow
                  label="Allow offers"
                  description="Let buyers send you price offers"
                  checked={settings.allowOffers}
                  onChange={(v) => saveSettings({ allowOffers: v })}
                />
                {settings.allowOffers && (
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
                        value={settings.minOfferPercentage}
                        onChange={(e) =>
                          saveSettings({ minOfferPercentage: Number(e.target.value) })
                        }
                        className="flex-1 accent-[#B66B44]"
                      />
                      <span className="text-sm font-bold w-16 text-right">
                        {settings.minOfferPercentage}% min
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
                  checked={settings.instantBuyEnabled}
                  onChange={(v) => saveSettings({ instantBuyEnabled: v })}
                />
              </div>
            </SettingsCard>

            <SettingsCard title="Auto-reply" icon={Clock}>
              <div className="space-y-3">
                <ToggleRow
                  label="Auto-reply to messages"
                  description="Automatically respond when someone messages you about a listing"
                  checked={settings.autoReplyEnabled}
                  onChange={(v) => saveSettings({ autoReplyEnabled: v })}
                />
                {settings.autoReplyEnabled && (
                  <div>
                    <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
                      Auto-reply message
                    </label>
                    <textarea
                      rows={3}
                      value={settings.autoReplyMessage}
                      onChange={(e) =>
                        setSettings({ ...settings, autoReplyMessage: e.target.value })
                      }
                      onBlur={() =>
                        saveSettings({ autoReplyMessage: settings.autoReplyMessage })
                      }
                      className="w-full rounded-xl bg-[#FAF4EC] border border-[#211000]/10 px-4 py-3.5 text-sm font-medium placeholder:text-[#211000]/30 focus:outline-none focus:border-[#B66B44] focus:ring-2 focus:ring-[#B66B44]/10 transition-all resize-none"
                    />
                    <p className="text-[11px] text-[#211000]/40 font-medium mt-1.5">
                      This message is sent through the platform. Personal contacts are blocked.
                    </p>
                  </div>
                )}
              </div>
            </SettingsCard>
          </TabContent>
        )}

        {/* ─── DATA ─── */}
        {activeTab === "data" && (
          <TabContent key="data">
            <SettingsCard title="Export your data" icon={Download}>
              <p className="text-sm text-[#211000]/55 font-medium leading-relaxed mb-5">
                Request a copy of all data associated with your account including orders, messages, listings, and profile information.
              </p>

              {settings.lastDataExport && (
                <div className="rounded-xl bg-[#5F7161]/10 border border-[#5F7161]/20 p-3 flex items-center gap-2.5 mb-5">
                  <CheckCircle2 className="size-4 text-[#5F7161] shrink-0" />
                  <p className="text-xs font-bold text-[#5F7161]">
                    Last export requested:{" "}
                    {new Date(settings.lastDataExport).toLocaleDateString()}
                  </p>
                </div>
              )}

              <button
                onClick={handleExportData}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-full bg-[#211000] hover:bg-[#211000]/90 text-[#FAF4EC] px-5 py-3 text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {saving ? (
                  <>
                    <Loader2 className="size-4 animate-spin" />
                    Preparing...
                  </>
                ) : (
                  <>
                    <Download className="size-4" />
                    Request data export
                  </>
                )}
              </button>
            </SettingsCard>

            <SettingsCard title="Connected services" icon={Globe}>
              <p className="text-sm text-[#211000]/55 font-medium leading-relaxed mb-5">
                Third-party services connected to your Refurnish account.
              </p>

              <div className="space-y-3">
                {[
                  { name: "Google", connected: true, email: "user@gmail.com" },
                  { name: "Apple", connected: false },
                ].map((service) => (
                  <div
                    key={service.name}
                    className="flex items-center justify-between p-3 rounded-xl bg-[#FAF4EC] border border-[#211000]/5"
                  >
                    <div>
                      <p className="text-sm font-bold">{service.name}</p>
                      {service.connected && (
                        <p className="text-[11px] text-[#211000]/45 font-medium">
                          {service.email}
                        </p>
                      )}
                    </div>
                    <button
                      className={`text-xs font-bold px-3 py-1.5 rounded-full border transition-colors ${
                        service.connected
                          ? "border-red-200 text-red-500 hover:bg-red-50"
                          : "border-[#211000]/10 text-[#211000]/60 hover:border-[#B66B44]/30"
                      }`}
                    >
                      {service.connected ? "Disconnect" : "Connect"}
                    </button>
                  </div>
                ))}
              </div>
            </SettingsCard>

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
          </TabContent>
        )}

        {/* ─── DANGER ZONE ─── */}
        {activeTab === "danger" && (
          <TabContent key="danger">
            <div className="rounded-2xl bg-red-50 border border-red-200 p-5 sm:p-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="size-5 text-red-500" />
                <h2 className="font-serif text-xl font-medium text-red-700">
                  Danger zone
                </h2>
              </div>
              <p className="text-xs text-red-600/70 font-medium leading-relaxed mb-6">
                These actions are irreversible. Please be certain before proceeding.
              </p>

              <div className="space-y-4">
                {/* Sign out everywhere */}
                <DangerAction
                  title="Sign out of all devices"
                  description="Revoke all active sessions. You will need to sign in again on every device."
                  buttonLabel="Sign out everywhere"
                  icon={LogOut}
                  onClick={() => {
                    localStorage.removeItem(USER_KEY);
                    router.push("/login");
                  }}
                />

                {/* Deactivate */}
                <DangerAction
                  title="Deactivate account"
                  description="Temporarily disable your account. Your data is preserved and you can reactivate by signing in."
                  buttonLabel="Deactivate"
                  icon={BellOff}
                  onClick={() => setShowDeactivateModal(true)}
                />

                {/* Delete */}
                <DangerAction
                  title="Delete account permanently"
                  description="Permanently delete your account, all orders, listings, messages, and reviews. This cannot be undone."
                  buttonLabel="Delete account"
                  icon={Trash2}
                  destructive
                  onClick={() => setShowDeleteModal(true)}
                />
              </div>
            </div>

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
              <h3 className="font-serif text-2xl font-medium tracking-tight mb-3">
                Deactivate your account?
              </h3>
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
                  className="rounded-full bg-yellow-500 hover:bg-yellow-600 text-white py-3 text-xs font-bold uppercase tracking-wider transition-colors"
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
                This is permanent. All your data will be erased including orders, reviews, listings, and messages.
              </p>
              <p className="text-xs font-bold text-red-500 mb-6">
                Type "DELETE MY ACCOUNT" to confirm
              </p>
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

function applyTheme(theme: string) {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else if (theme === "light") {
      root.classList.remove("dark");
    } else {
      // system
      const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      root.classList.toggle("dark", prefersDark);
    }
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

function SettingsCard({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: any;
  children: React.ReactNode;
}) {
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
      <label className="text-xs font-bold uppercase tracking-wider text-[#211000]/60 block mb-2">
        {label}
      </label>
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
        <p className="text-[11px] text-[#211000]/45 font-medium mt-0.5 leading-relaxed">
          {description}
        </p>
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
          <p className="text-xs text-[#211000]/50 font-medium mt-0.5 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
      <button
        onClick={onClick}
        className={`shrink-0 px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-colors ${
          destructive
            ? "bg-red-500 hover:bg-red-600 text-white"
            : "border border-red-300 text-red-500 hover:bg-red-50"
        }`}
      >
        {buttonLabel}
      </button>
    </div>
  );
}

function Modal({
  children,
  onClose,
}: {
  children: React.ReactNode;
  onClose: () => void;
}) {
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