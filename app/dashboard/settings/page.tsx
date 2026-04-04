"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Globe, 
  Layout, 
  Mail, 
  Info,
  Loader2,
  Image as ImageIcon,
  CheckCircle2,
  XCircle,
  Truck,
  CreditCard
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function SettingsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings),
      });

      if (res.ok) {
        toast.success("Settings updated successfully");
      } else {
        toast.error("Failed to update settings");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-gray-500 font-bold animate-pulse">Fetching global configurations...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div>
        <h1 className="text-3xl font-black text-foreground tracking-tight">Site Settings</h1>
        <p className="text-gray-500 mt-1 font-medium">Configure global platform identity and behavior.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Identity Section */}
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6"
          >
            <h2 className="text-xl font-black flex items-center gap-3 text-primary">
              <Globe size={22} />
              Brand Identity
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Platform Name</label>
                <input
                  type="text"
                  value={settings.siteName}
                  onChange={(e) => setSettings({ ...settings, siteName: e.target.value })}
                  className="w-full px-5 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Logo URL</label>
                <div className="flex gap-3">
                    <div className="relative flex-grow">
                        <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input
                            type="text"
                            value={settings.siteLogo}
                            onChange={(e) => setSettings({ ...settings, siteLogo: e.target.value })}
                            className="w-full pl-12 pr-5 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                            placeholder="https://example.com/logo.png"
                        />
                    </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Contact Section */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-8 rounded-[32px] border border-gray-100 shadow-sm space-y-6"
          >
            <h2 className="text-xl font-black flex items-center gap-3 text-primary">
              <Mail size={22} />
              Contact Info
            </h2>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Support Email</label>
                <input
                  type="email"
                  value={settings.contactEmail}
                  onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
                  className="w-full px-5 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Footer Text</label>
                <input
                  type="text"
                  value={settings.footerText}
                  onChange={(e) => setSettings({ ...settings, footerText: e.target.value })}
                  className="w-full px-5 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                />
              </div>
            </div>
          </motion.div>
        </div>

        {/* Content Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6"
        >
          <h2 className="text-xl font-black flex items-center gap-3 text-primary">
            <Layout size={22} />
            Platform Description
          </h2>
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">SEO Description</label>
            <textarea
              rows={4}
              value={settings.siteDescription}
              onChange={(e) => setSettings({ ...settings, siteDescription: e.target.value })}
              className="w-full px-5 py-3 bg-gray-50 rounded-[24px] border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground no-scrollbar"
            />
          </div>
        </motion.div>
        
        {/* Payment Gateways Section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-8"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-black flex items-center gap-3 text-primary">
              <CreditCard size={22} />
              Payment Gateways
            </h2>
            <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Select active methods</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { id: "cod", label: "Cash on Delivery", icon: <Truck size={20} /> },
              { id: "bkash", label: "bKash", icon: <span className="font-black text-xs">bK</span> },
              { id: "nagad", label: "Nagad", icon: <span className="font-black text-xs">N</span> },
              { id: "rocket", label: "Rocket", icon: <span className="font-black text-xs">R</span> },
              { id: "sslcommerz", label: "SSLCommerz", icon: <Globe size={20} /> },
              { id: "stripe", label: "Stripe", icon: <CreditCard size={20} /> },
            ].map((method) => {
              const isActive = settings.activePaymentMethods?.includes(method.id);
              return (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => {
                    const currentMethods = settings.activePaymentMethods || [];
                    const newMethods = isActive
                      ? currentMethods.filter((m: string) => m !== method.id)
                      : [...currentMethods, method.id];
                    setSettings({ ...settings, activePaymentMethods: newMethods });
                  }}
                  className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all ${
                    isActive 
                      ? "border-primary bg-primary/5 text-primary" 
                      : "border-gray-50 bg-gray-50 text-gray-400 hover:border-gray-200"
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-xl ${isActive ? "bg-white shadow-sm" : "bg-gray-100"}`}>
                      {method.icon}
                    </div>
                    <span className="font-bold text-sm tracking-tight">{method.label}</span>
                  </div>
                  {isActive ? <CheckCircle2 size={18} /> : <XCircle size={18} className="opacity-20" />}
                </button>
              );
            })}
          </div>
        </motion.div>

        <div className="flex justify-end">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={saving}
            className="flex items-center gap-3 px-10 py-4 bg-primary text-white rounded-[20px] font-black shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? "Deploying Changes..." : "Save Global Settings"}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
