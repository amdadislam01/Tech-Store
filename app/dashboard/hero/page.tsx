"use client";

import { useState, useEffect } from "react";
import { 
  Save, 
  Zap, 
  Loader2,
  Image as ImageIcon,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function HeroSectionPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
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
        toast.success("Hero section updated successfully");
      } else {
        toast.error("Failed to update hero section");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey || apiKey === "your_imagebb_api_key_here") {
      toast.error("ImageBB API key is missing.");
      setIsUploading(false);
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setSettings({ ...settings, heroImage: data.data.url });
        toast.success("Hero illustration uploaded!");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-gray-500 font-bold animate-pulse">Loading hero spotlight config...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="space-y-1">
        <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/10">
                <Zap size={24} />
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Hero Spotlight</h1>
        </div>
        <p className="text-gray-500 text-sm font-medium">Customize the premium spotlight section of your platform's home page.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4 md:col-span-2">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Badge Text</label>
                <input
                  type="text"
                  value={settings.heroBadge || ""}
                  onChange={(e) => setSettings({ ...settings, heroBadge: e.target.value })}
                  className="w-full px-5 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground placeholder:text-gray-300"
                  placeholder="e.g. Hand-Picked Tech Just for You"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Headline (Static Part)</label>
              <input
                type="text"
                value={settings.heroHeadlinePrimary || ""}
                onChange={(e) => setSettings({ ...settings, heroHeadlinePrimary: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground placeholder:text-gray-300"
                placeholder="e.g. Stop Settling for"
              />
            </div>

            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Headline (Highlight Part)</label>
              <input
                type="text"
                value={settings.heroHeadlineSecondary || ""}
                onChange={(e) => setSettings({ ...settings, heroHeadlineSecondary: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground placeholder:text-gray-300"
                placeholder="e.g. Cheap Gear."
              />
            </div>

            <div className="space-y-2 md:col-span-2">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Hero Description</label>
              <textarea
                rows={3}
                value={settings.heroDescription || ""}
                onChange={(e) => setSettings({ ...settings, heroDescription: e.target.value })}
                className="w-full px-5 py-3 bg-gray-50 rounded-[20px] border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground placeholder:text-gray-300"
                placeholder="Describe your flagship value proposition..."
              />
            </div>

            <div className="space-y-4 md:col-span-2">
               <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                  <ImageIcon size={14} />
                  Hero Illustration Spotlight
               </label>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="relative aspect-video rounded-3xl bg-[#F8FAFC] border border-gray-100 overflow-hidden flex items-center justify-center group shadow-inner">
                      {settings.heroImage ? (
                        <img src={settings.heroImage} alt="Hero illustration preview" className="w-full h-full object-contain p-6 scale-90 group-hover:scale-100 transition-transform duration-700" />
                      ) : (
                        <ImageIcon size={48} className="text-gray-200" />
                      )}
                      {isUploading && (
                        <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                            <Loader2 className="animate-spin text-primary" />
                        </div>
                      )}
                  </div>
                  <div className="flex flex-col justify-center gap-6">
                    <div className="space-y-3">
                        <div className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-widest leading-relaxed">
                            <Info size={14} className="text-primary" />
                            Premium Optimization
                        </div>
                        <p className="text-xs text-gray-500 font-medium leading-relaxed">
                            Upload a high-quality transparent PNG or SVG illustration. Recommended dimension: 800x800px. Maximum size: 2MB.
                        </p>
                    </div>
                    <label className={`cursor-pointer px-6 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all text-center flex items-center justify-center gap-3 shadow-xl shadow-gray-200 active:scale-95 ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        <ImageIcon size={16} />
                        {isUploading ? "Uploading Spotlight..." : "Update Illustration"}
                        <input type="file" className="hidden" accept="image/*" onChange={handleHeroImageUpload} disabled={isUploading} />
                    </label>
                  </div>
               </div>
            </div>
          </div>
        </motion.div>

        <div className="flex justify-end pt-4 pb-12">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={saving}
            className="flex items-center justify-center gap-3 w-full sm:w-auto px-10 py-5 bg-primary text-white rounded-[24px] font-black shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all disabled:opacity-50 text-sm uppercase tracking-widest"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? "Updating..." : "Save Configuration"}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
