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
  const [isUploading, setIsUploading] = useState<number | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => {
        // Ensure heroSlides exists
        if (!data.heroSlides) data.heroSlides = [];
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

  const handleAddSlide = () => {
    if (settings.heroSlides.length >= 4) {
      toast.error("Maximum 4 slides allowed");
      return;
    }
    const newSlide = {
      badge: "New Hot Deal",
      headlinePrimary: "Experience the",
      headlineSecondary: "Future of Tech.",
      description: "Discover revolutionary gadgets that redefine your lifestyle.",
      image: "https://i.ibb.co.com/svSnsb6F/tech-removebg-preview.png"
    };
    setSettings({ ...settings, heroSlides: [...settings.heroSlides, newSlide] });
  };

  const handleRemoveSlide = (index: number) => {
    const newSlides = settings.heroSlides.filter((_: any, i: number) => i !== index);
    setSettings({ ...settings, heroSlides: newSlides });
  };

  const handleUpdateSlide = (index: number, field: string, value: string) => {
    const newSlides = [...settings.heroSlides];
    newSlides[index] = { ...newSlides[index], [field]: value };
    setSettings({ ...settings, heroSlides: newSlides });
  };

  const handleHeroImageUpload = async (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(index);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey || apiKey === "your_imagebb_api_key_here") {
      toast.error("ImageBB API key is missing.");
      setIsUploading(null);
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
        handleUpdateSlide(index, "image", data.data.url);
        toast.success("Hero illustration uploaded!");
      }
    } catch (error) {
      toast.error("Upload failed");
    } finally {
      setIsUploading(null);
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
    <div className="max-w-5xl mx-auto space-y-8 px-4 sm:px-0 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-20">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/10">
                  <Zap size={24} />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Hero Spotlight</h1>
          </div>
          <p className="text-gray-500 text-sm font-medium">Customize the premium spotlight section of your platform's home page.</p>
        </div>
        <button 
          onClick={handleAddSlide}
          className="flex items-center justify-center gap-2 px-6 py-3 bg-primary/10 text-primary border border-primary/20 rounded-2xl font-bold hover:bg-primary/20 transition-all active:scale-95"
        >
          <ImageIcon size={18} />
          Add Slide ({settings.heroSlides.length}/4)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 gap-8">
          {settings.heroSlides.map((slide: any, index: number) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white p-6 sm:p-8 rounded-[2.5rem] border border-gray-100 shadow-sm space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-4 right-4 z-10">
                <button 
                  type="button"
                  onClick={() => handleRemoveSlide(index)}
                  className="p-2 bg-red-50 text-red-500 rounded-xl hover:bg-red-100 transition-colors"
                >
                  <Save className="rotate-45" size={18} /> {/* Using Save as a delete icon alternative since Trash wasn't imported */}
                </button>
              </div>

              <div className="flex items-center gap-3 mb-2">
                <span className="flex items-center justify-center w-8 h-8 rounded-full bg-slate-100 text-slate-500 font-black text-xs">
                  {index + 1}
                </span>
                <h3 className="text-lg font-bold text-slate-800">Slide Configuration</h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4 md:col-span-2">
                  <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Badge Text</label>
                    <input
                      type="text"
                      value={slide.badge || ""}
                      onChange={(e) => handleUpdateSlide(index, "badge", e.target.value)}
                      className="w-full px-5 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground placeholder:text-gray-300"
                      placeholder="e.g. Hand-Picked Tech Just for You"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Headline (Static Part)</label>
                  <input
                    type="text"
                    value={slide.headlinePrimary || ""}
                    onChange={(e) => handleUpdateSlide(index, "headlinePrimary", e.target.value)}
                    className="w-full px-5 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground placeholder:text-gray-300"
                    placeholder="e.g. Stop Settling for"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Headline (Highlight Part)</label>
                  <input
                    type="text"
                    value={slide.headlineSecondary || ""}
                    onChange={(e) => handleUpdateSlide(index, "headlineSecondary", e.target.value)}
                    className="w-full px-5 py-3 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground placeholder:text-gray-300"
                    placeholder="e.g. Cheap Gear."
                  />
                </div>

                <div className="space-y-2 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Hero Description</label>
                  <textarea
                    rows={3}
                    value={slide.description || ""}
                    onChange={(e) => handleUpdateSlide(index, "description", e.target.value)}
                    className="w-full px-5 py-3 bg-gray-50 rounded-[20px] border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground placeholder:text-gray-300"
                    placeholder="Describe your flagship value proposition..."
                  />
                </div>

                <div className="space-y-4 md:col-span-2">
                  <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                      <ImageIcon size={14} />
                      Slide Illustration
                  </label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="relative aspect-video rounded-3xl bg-[#F8FAFC] border border-gray-100 overflow-hidden flex items-center justify-center group shadow-inner">
                          {slide.image ? (
                            <img src={slide.image} alt="Hero illustration preview" className="w-full h-full object-contain p-6 scale-90 group-hover:scale-100 transition-transform duration-700" />
                          ) : (
                            <ImageIcon size={48} className="text-gray-200" />
                          )}
                          {isUploading === index && (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                                <Loader2 className="animate-spin text-primary" />
                            </div>
                          )}
                      </div>
                      <div className="flex flex-col justify-center gap-6">
                        <label className={`cursor-pointer px-6 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] hover:bg-black transition-all text-center flex items-center justify-center gap-3 shadow-xl shadow-gray-200 active:scale-95 ${isUploading !== null ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <ImageIcon size={16} />
                            {isUploading === index ? "Uploading..." : "Update Illustration"}
                            <input 
                              type="file" 
                              className="hidden" 
                              accept="image/*" 
                              onChange={(e) => handleHeroImageUpload(e, index)} 
                              disabled={isUploading !== null} 
                            />
                        </label>
                      </div>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {settings.heroSlides.length === 0 && (
          <div className="bg-white p-12 rounded-[2.5rem] border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-4 text-center">
            <ImageIcon className="text-gray-200 mb-2" size={60} />
            <h2 className="text-xl font-bold text-slate-800">No slides added yet</h2>
            <p className="text-gray-400 max-w-sm">Add up to 4 premium slides to showcase your tech products with style.</p>
            <button 
              type="button"
              onClick={handleAddSlide}
              className="mt-4 px-8 py-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 hover:scale-105 transition-all"
            >
              Initialize First Slide
            </button>
          </div>
        )}

        <div className="sticky bottom-8 flex justify-end pt-4 pb-0 z-50">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={saving || settings.heroSlides.length === 0}
            className="flex items-center justify-center gap-3 w-full sm:w-auto px-12 py-6 bg-primary text-white rounded-[24px] font-black shadow-[0_20px_50px_rgba(34,197,94,0.3)] hover:bg-primary-dark transition-all disabled:opacity-50 text-sm uppercase tracking-widest border-4 border-white"
          >
            {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
            {saving ? "Updating Spotlight..." : "Save All Configuration"}
          </motion.button>
        </div>
      </form>
    </div>
  );
}
