"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Store, 
  ChevronRight, 
  Loader2, 
  LayoutGrid, 
  Smartphone, 
  Laptop, 
  Watch, 
  Headphones, 
  Speaker, 
  Camera, 
  Zap,
  MoreVertical,
  Settings,
  Package,
  ArrowRight,
  Save,
  Edit,
  RefreshCw,
  Monitor,
  Mouse,
  Cpu,
  Tv,
  HardDrive,
  Gamepad2,
  Wifi,
  Keyboard,
  Battery,
  Cable
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

const ICON_OPTIONS = [
  { name: "LayoutGrid", Icon: LayoutGrid },
  { name: "Smartphone", Icon: Smartphone },
  { name: "Laptop", Icon: Laptop },
  { name: "Monitor", Icon: Monitor },
  { name: "Cpu", Icon: Cpu },
  { name: "Mouse", Icon: Mouse },
  { name: "Keyboard", Icon: Keyboard },
  { name: "HardDrive", Icon: HardDrive },
  { name: "Tv", Icon: Tv },
  { name: "Gamepad2", Icon: Gamepad2 },
  { name: "Watch", Icon: Watch },
  { name: "Headphones", Icon: Headphones },
  { name: "Speaker", Icon: Speaker },
  { name: "Camera", Icon: Camera },
  { name: "Zap", Icon: Zap },
  { name: "Wifi", Icon: Wifi },
  { name: "Battery", Icon: Battery },
  { name: "Cable", Icon: Cable },
];

export default function CategoriesPage() {
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    icon: "LayoutGrid",
    parent: ""
  });

  const handleIconUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey) {
      toast.error("ImageBB API key is missing");
      setIsUploading(false);
      return;
    }

    try {
      const fd = new FormData();
      fd.append("image", file);
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
        method: "POST",
        body: fd,
      });
      const data = await res.json();
      if (data.success) {
        setFormData(prev => ({ ...prev, icon: data.data.url }));
        toast.success("Icon uploaded!");
      } else {
        throw new Error("Upload failed");
      }
    } catch (error) {
      toast.error("Failed to upload icon");
    } finally {
      setIsUploading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
      }
    } catch (error) {
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const url = "/api/categories";
      const method = editMode ? "PUT" : "POST";
      const body = editMode ? { ...formData, id: editId } : formData;

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success(editMode ? "Category updated!" : "Category added successfully!");
        setFormData({ name: "", icon: "LayoutGrid", parent: "" });
        setEditMode(false);
        setEditId(null);
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to save category");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (cat: any) => {
    setEditMode(true);
    setEditId(cat._id);
    setFormData({
        name: cat.name,
        icon: cat.icon || "LayoutGrid",
        parent: cat.parent || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSync = async () => {
    setSyncing(true);
    const id = toast.loading("Analyzing legacy product entries...");
    try {
      const res = await fetch("/api/seed-categories");
      const data = await res.json();
      if (res.ok) {
        toast.success(`Successfully synced ${data.documentsCreated} categories!`, { id });
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to sync legacy data", { id });
      }
    } catch (error) {
      toast.error("An error occurred during sync", { id });
    } finally {
      setSyncing(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Delete Category?",
      text: "This action will fail if there are associated products or sub-categories. Proceed?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!",
      background: "#ffffff",
      customClass: {
        popup: "rounded-[32px] border border-gray-100 shadow-2xl",
        confirmButton: "rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 py-3",
        cancelButton: "rounded-xl font-bold uppercase tracking-widest text-[10px] px-6 py-3"
      }
    });

    if (!result.isConfirmed) return;

    try {
      const res = await fetch(`/api/categories?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Category deleted");
        fetchCategories();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (error) {
      toast.error("An error occurred");
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Premium Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[3px] text-primary bg-primary/5 w-fit px-3 py-1 rounded-full mb-2">
            <Settings size={12} />
            Management
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tight flex items-center gap-3">
            Category <span className="text-gray-300 font-light">Inventory</span>
          </h1>
          <p className="text-gray-500 text-sm font-medium">Organize your store structure and monitor product distribution.</p>
        </div>

        <button
            onClick={handleSync}
            disabled={syncing}
            className="flex items-center gap-3 px-6 py-4 bg-primary/10 text-primary rounded-2xl font-black text-[10px] uppercase tracking-widest hover:bg-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
        >
            <RefreshCw size={14} className={syncing ? "animate-spin" : ""} />
            {syncing ? "Synchronizing..." : "Sync Legacy Data"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Form */}
        <div className="lg:col-span-4 space-y-6">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="bg-white p-6 md:p-8 rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 space-y-8 sticky top-24"
          >
            <div className="flex items-center justify-between pb-4 border-b border-gray-50">
              <div className="flex items-center gap-3 text-primary">
                {editMode ? <Settings size={20} /> : <Plus size={20} />}
                <h2 className="text-lg font-bold tracking-tight text-foreground">{editMode ? "Update Category" : "Add New Category"}</h2>
              </div>
              {editMode && (
                <button 
                    onClick={() => { setEditMode(false); setEditId(null); setFormData({ name: "", icon: "LayoutGrid", parent: "" }); }}
                    className="text-[10px] font-bold text-gray-400 hover:text-red-500 uppercase tracking-widest"
                >
                    Cancel
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Category Name</label>
                <input
                  required
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold outline-none shadow-sm"
                  placeholder="e.g. Mobile Phones"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400 ml-1">Parent (Make this a Sub-Category)</label>
                <select
                  value={formData.parent}
                  onChange={(e) => setFormData({ ...formData, parent: e.target.value })}
                  className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary transition-all text-sm font-semibold outline-none appearance-none cursor-pointer"
                >
                  <option value="">None (Top Level Category)</option>
                  {categories.filter(c => !c.parent && c._id !== editId).map((cat) => (
                    <option key={cat._id} value={cat._id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between ml-1">
                  <label className="text-[10px] font-extrabold uppercase tracking-widest text-gray-400">Visual Icon</label>
                  <label className="cursor-pointer text-[10px] font-bold text-primary hover:underline">
                    {isUploading ? "Uploading..." : "Upload File"}
                    <input type="file" className="hidden" accept="image/*" onChange={handleIconUpload} disabled={isUploading} />
                  </label>
                </div>
                
                {/* Preview for URL icons (Uploaded) */}
                {formData.icon.startsWith("http") && (
                   <div className="w-full aspect-video rounded-2xl bg-gray-50 flex items-center justify-center p-4 border border-dashed border-gray-200">
                      <img src={formData.icon} alt="Preview" className="h-full object-contain" />
                   </div>
                )}

                <div className="grid grid-cols-4 gap-3">
                  {ICON_OPTIONS.map(({ name, Icon }) => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => setFormData({ ...formData, icon: name })}
                      className={`aspect-square flex items-center justify-center rounded-xl border transition-all ${
                        formData.icon === name 
                          ? "bg-primary text-white border-primary shadow-lg shadow-primary/20 scale-110" 
                          : "bg-gray-50 text-gray-400 border-transparent hover:bg-gray-100"
                      } ${formData.icon.startsWith("http") && name === "LayoutGrid" ? "opacity-50" : ""}`}
                    >
                      <Icon size={20} />
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-4 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-[2px] shadow-xl hover:bg-gray-900 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-gray-400 mt-2"
              >
                {submitting ? <Loader2 className="animate-spin" size={18} /> : (editMode ? <Save size={18} /> : <ArrowRight size={18} />)}
                {submitting ? "Processing..." : (editMode ? "Update Changes" : "Publish Category")}
              </button>
            </form>
          </motion.div>
        </div>

        {/* Right: List */}
        <div className="lg:col-span-8">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[32px] border border-gray-100 shadow-xl shadow-gray-200/50 overflow-hidden"
          >
            <div className="p-6 md:p-8 flex items-center justify-between border-b border-gray-50 bg-gray-50/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/10">
                  <LayoutGrid size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold tracking-tight">System Categories</h2>
                  <p className="text-[10px] uppercase font-bold text-gray-400 tracking-widest">{categories.length} total entries</p>
                </div>
              </div>
            </div>

            <div className="divide-y divide-gray-50">
              {loading ? (
                <div className="p-20 flex flex-col items-center justify-center gap-4 text-gray-400">
                  <Loader2 className="animate-spin" size={32} />
                  <p className="text-xs font-bold uppercase tracking-widest">Loading entries...</p>
                </div>
              ) : categories.length === 0 ? (
                <div className="p-20 flex flex-col items-center justify-center text-center gap-6 text-gray-400">
                  <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center border border-gray-100 mb-2">
                    <Store size={40} strokeWidth={1} className="text-gray-300" />
                  </div>
                  <div className="max-w-xs space-y-2">
                    <p className="text-sm font-bold text-foreground">No Categories Discovered</p>
                    <p className="text-xs font-medium text-gray-400 leading-relaxed">We couldn't find any registered categories. You can manually add one or sync your legacy product data.</p>
                  </div>
                  <button
                    onClick={handleSync}
                    className="px-8 py-3 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:shadow-lg hover:shadow-primary/25 transition-all active:scale-95"
                  >
                    Run Legacy Data Sync
                  </button>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead>
                      <tr className="text-[10px] font-black uppercase text-gray-400 tracking-widest">
                        <th className="px-8 py-4">Structure</th>
                        <th className="px-8 py-4 text-center">Products</th>
                        <th className="px-8 py-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((cat) => {
                        const IconComponent = ICON_OPTIONS.find(i => i.name === cat.icon)?.Icon;
                        const isSub = !!cat.parent;
                        
                        return (
                          <motion.tr 
                            layout
                            key={cat._id} 
                            className={`group hover:bg-gray-50/50 transition-all ${isSub ? 'bg-gray-50/20' : ''}`}
                          >
                            <td className="px-8 py-5">
                              <div className="flex items-center gap-4">
                                {isSub ? (
                                  <div className="flex items-center">
                                    <div className="w-3 h-px bg-gray-200" />
                                    <ChevronRight size={14} className="text-gray-300" />
                                  </div>
                                ) : (
                                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-sm transition-all group-hover:scale-110 overflow-hidden ${isSub ? 'bg-white text-gray-400' : 'bg-primary text-white'}`}>
                                    {IconComponent ? <IconComponent size={20} /> : <img src={cat.icon} alt={cat.name} className="w-full h-full object-cover" />}
                                  </div>
                                )}
                                <div>
                                  <p className={`font-bold text-sm leading-none mb-1 ${isSub ? 'text-gray-600' : 'text-foreground'}`}>
                                    {cat.name}
                                  </p>
                                  <p className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
                                    /{cat.slug}
                                  </p>
                                </div>
                              </div>
                            </td>
                            <td className="px-8 py-5">
                              <div className="flex items-center justify-center">
                                <span className={`px-3 py-1 rounded-full text-[10px] font-black tracking-widest ${cat.productCount > 0 ? 'bg-green-50 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                  {cat.productCount} UNITS
                                </span>
                              </div>
                            </td>
                            <td className="px-8 py-5 text-right">
                              <div className="flex items-center justify-end gap-2">
                                <button
                                    onClick={() => handleEdit(cat)}
                                    className="p-2 text-gray-300 hover:text-primary hover:bg-primary/5 rounded-xl transition-all"
                                >
                                    <Edit size={18} />
                                </button>
                                <button
                                    onClick={() => handleDelete(cat._id)}
                                    className="p-2 text-gray-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                                >
                                    <Trash2 size={18} />
                                </button>
                              </div>
                            </td>
                          </motion.tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
