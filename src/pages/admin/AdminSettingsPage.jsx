import React, { useState, useEffect } from "react";
import {
  FiSave,
  FiRefreshCw,
  FiAlertCircle,
  FiCheckCircle,
  FiToggleLeft,
  FiToggleRight,
  FiDollarSign,
  FiMail,
  FiShoppingBag,
  FiInfo,
} from "react-icons/fi";
import toast from "react-hot-toast";
import supabase from "../../supabase/client";
import { formatPrice } from "../../utils/formatPrice";

const SETTINGS_KEYS = [
  "store_name",
  "store_status",
  "contact_email",
  "delivery_fee",
  "free_delivery_threshold",
  "min_order_amount",
  "currency",
];

const AdminSettingsPage = () => {
  const [settings, setSettings] = useState({});
  const [original, setOriginal] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null | 'success' | 'error'

  useEffect(() => {
    fetchSettings();
  }, []);

  async function fetchSettings() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("settings")
        .select("key, value")
        .in("key", SETTINGS_KEYS);

      if (error) throw error;

      const map = {};
      (data || []).forEach(({ key, value }) => {
        map[key] = value;
      });

      setSettings(map);
      setOriginal(map);
    } catch (err) {
      console.error("Failed to load settings:", err);
      toast.error("Failed to load settings.");
    } finally {
      setLoading(false);
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    setSaveStatus(null);

    try {
      // Upsert all changed settings
      const updates = Object.entries(settings).map(([key, value]) => ({
        key,
        value: String(value),
        updated_at: new Date().toISOString(),
      }));

      const { error } = await supabase
        .from("settings")
        .upsert(updates, { onConflict: "key" });

      if (error) throw error;

      setOriginal({ ...settings });
      setSaveStatus("success");
      toast.success("Settings saved!");
    } catch (err) {
      console.error("Failed to save settings:", err);
      setSaveStatus("error");
      toast.error("Failed to save settings. " + (err.message || ""));
    } finally {
      setSaving(false);
    }
  }

  function handleChange(key, value) {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaveStatus(null);
  }

  const isDirty = JSON.stringify(settings) !== JSON.stringify(original);

  if (loading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-oya-teal border-t-oya-green"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-fadeIn max-w-3xl">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-oya-teal">Store Settings</h1>
          <p className="mt-1 text-sm text-oya-teal/60">
            Configure global store preferences. Changes take effect immediately after saving.
          </p>
        </div>
        <button
          onClick={fetchSettings}
          className="flex items-center gap-2 rounded-lg border border-oya-teal/10 bg-white px-3 py-2 text-sm font-medium text-oya-teal/70 hover:bg-oya-teal/5 transition"
        >
          <FiRefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      <form onSubmit={handleSave} className="space-y-6">
        {/* ── Store Identity ──────────────────────────────────── */}
        <section className="rounded-xl border border-oya-teal/10 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-oya-teal/10 bg-oya-teal/5">
            <div className="flex items-center gap-2">
              <FiShoppingBag className="w-4 h-4 text-oya-teal" />
              <h2 className="text-sm font-bold text-oya-teal uppercase tracking-wider">Store Identity</h2>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-oya-teal mb-1.5">
                Store Name
              </label>
              <input
                type="text"
                value={settings.store_name || ""}
                onChange={(e) => handleChange("store_name", e.target.value)}
                placeholder="Oya Deliver"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
              />
              <p className="mt-1.5 text-xs text-oya-teal/50">Displayed in the browser tab and emails.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-oya-teal mb-1.5">
                <span className="flex items-center gap-1.5"><FiMail className="w-3.5 h-3.5" /> Contact Email</span>
              </label>
              <input
                type="email"
                value={settings.contact_email || ""}
                onChange={(e) => handleChange("contact_email", e.target.value)}
                placeholder="hello@oyadeliver.com"
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
              />
              <p className="mt-1.5 text-xs text-oya-teal/50">Customer support email address.</p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-oya-teal mb-1.5">Currency</label>
              <select
                value={settings.currency || "NGN"}
                onChange={(e) => handleChange("currency", e.target.value)}
                className="w-full rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
              >
                <option value="NGN">NGN — Nigerian Naira (₦)</option>
                <option value="USD">USD — US Dollar ($)</option>
                <option value="GBP">GBP — British Pound (£)</option>
                <option value="EUR">EUR — Euro (€)</option>
              </select>
            </div>
          </div>
        </section>

        {/* ── Store Availability ─────────────────────────────── */}
        <section className="rounded-xl border border-oya-teal/10 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-oya-teal/10 bg-oya-teal/5">
            <div className="flex items-center gap-2">
              <FiInfo className="w-4 h-4 text-oya-teal" />
              <h2 className="text-sm font-bold text-oya-teal uppercase tracking-wider">Availability</h2>
            </div>
          </div>
          <div className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold text-oya-teal">Store Status</p>
                <p className="mt-1 text-xs text-oya-teal/50">
                  When closed, customers will see a maintenance message.
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  handleChange(
                    "store_status",
                    settings.store_status === "open" ? "closed" : "open"
                  )
                }
                className={`flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
                  settings.store_status === "open"
                    ? "bg-emerald-100 text-emerald-700 hover:bg-emerald-200"
                    : "bg-red-100 text-red-700 hover:bg-red-200"
                }`}
              >
                {settings.store_status === "open" ? (
                  <FiToggleRight className="w-5 h-5" />
                ) : (
                  <FiToggleLeft className="w-5 h-5" />
                )}
                {settings.store_status === "open" ? "Open" : "Closed"}
              </button>
            </div>
          </div>
        </section>

        {/* ── Delivery & Pricing ─────────────────────────────── */}
        <section className="rounded-xl border border-oya-teal/10 bg-white shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-oya-teal/10 bg-oya-teal/5">
            <div className="flex items-center gap-2">
              <FiDollarSign className="w-4 h-4 text-oya-teal" />
              <h2 className="text-sm font-bold text-oya-teal uppercase tracking-wider">Delivery & Pricing</h2>
            </div>
          </div>
          <div className="p-6 space-y-5">
            <div>
              <label className="block text-sm font-semibold text-oya-teal mb-1.5">
                Flat Delivery Fee (₦)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-oya-teal/50 font-medium text-sm">₦</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={settings.delivery_fee || "0"}
                  onChange={(e) => handleChange("delivery_fee", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                />
              </div>
              <p className="mt-1.5 text-xs text-oya-teal/50">
                Current: {formatPrice(Number(settings.delivery_fee || 0))} per order.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-oya-teal mb-1.5">
                Free Delivery Threshold (₦)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-oya-teal/50 font-medium text-sm">₦</span>
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={settings.free_delivery_threshold || "0"}
                  onChange={(e) => handleChange("free_delivery_threshold", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                />
              </div>
              <p className="mt-1.5 text-xs text-oya-teal/50">
                Set to 0 to disable. Orders above {formatPrice(Number(settings.free_delivery_threshold || 0))} get free delivery.
              </p>
            </div>

            <div>
              <label className="block text-sm font-semibold text-oya-teal mb-1.5">
                Minimum Order Amount (₦)
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-oya-teal/50 font-medium text-sm">₦</span>
                <input
                  type="number"
                  min="0"
                  step="100"
                  value={settings.min_order_amount || "0"}
                  onChange={(e) => handleChange("min_order_amount", e.target.value)}
                  className="w-full rounded-lg border border-slate-300 bg-white pl-8 pr-4 py-2.5 text-sm text-slate-900 outline-none transition focus:border-oya-green focus:ring-2 focus:ring-oya-green/20"
                />
              </div>
              <p className="mt-1.5 text-xs text-oya-teal/50">Set to 0 to allow any order size.</p>
            </div>
          </div>
        </section>

        {/* ── Save Bar ───────────────────────────────────────── */}
        <div
          className={`sticky bottom-4 z-10 flex items-center justify-between rounded-xl px-6 py-4 shadow-lg transition-all duration-300 ${
            isDirty
              ? "bg-oya-teal opacity-100 translate-y-0"
              : "bg-oya-teal/0 opacity-0 translate-y-4 pointer-events-none"
          }`}
        >
          <div className="flex items-center gap-2 text-white text-sm font-medium">
            <FiAlertCircle className="w-4 h-4" />
            You have unsaved changes.
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => { setSettings({ ...original }); setSaveStatus(null); }}
              className="text-white/70 hover:text-white text-sm font-medium transition"
            >
              Discard
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex items-center gap-2 rounded-lg bg-white px-5 py-2 text-sm font-semibold text-oya-teal transition hover:bg-oya-paper disabled:opacity-60"
            >
              {saving ? (
                <FiRefreshCw className="w-4 h-4 animate-spin" />
              ) : saveStatus === "success" ? (
                <FiCheckCircle className="w-4 h-4 text-emerald-600" />
              ) : (
                <FiSave className="w-4 h-4" />
              )}
              {saving ? "Saving…" : "Save changes"}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AdminSettingsPage;
