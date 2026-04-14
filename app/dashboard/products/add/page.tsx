"use client";

import { useState, useEffect } from "react";
import { 
  Plus, 
  Trash2, 
  Image as ImageIcon, 
  Package, 
  Tag, 
  DollarSign, 
  Layers,
  Loader2,
  ChevronLeft,
  X,
  UploadCloud,
  FileText,
  ShieldCheck,
  Settings
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";

export default function AddProductPage() {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    regularPrice: "",
    category: "",
    stock: "",
    brand: "",
    modelName: "",
    warranty: "",
    specifications: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [categories, setCategories] = useState<{ _id: string; name: string; parent?: string }[]>([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const data = await res.json();
        if (Array.isArray(data)) {
          setCategories(data);
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (images.length + files.length > 5) {
      toast.error("You can only upload up to 5 images");
      return;
    }

    setIsUploading(true);
    const apiKey = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

    if (!apiKey || apiKey === "your_imagebb_api_key_here") {
      toast.error("ImageBB API key is missing. Please add it to .env.local");
      setIsUploading(false);
      return;
    }

    try {
      const uploadPromises = Array.from(files).map(async (file) => {
        const formData = new FormData();
        formData.append("image", file);
        const res = await fetch(`https://api.imgbb.com/1/upload?key=${apiKey}`, {
          method: "POST",
          body: formData,
        });
        const data = await res.json();
        if (data.success) {
          return data.data.url;
        }
        throw new Error("Upload failed");
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast.success("Images uploaded successfully!");
    } catch (error) {
      toast.error("Failed to upload images");
    } finally {
      setIsUploading(false);
    }
  };

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (images.length === 0) {
      toast.error("Please upload at least one image");
      return;
    }
    setLoading(true);

    try {
      let categoryId = formData.category;
      
      if (!categoryId) {
        toast.error("Please select a category");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            category: categoryId,
            images: images,
            image: images[0], // Primary image
            price: Number(formData.price),
            regularPrice: formData.regularPrice ? Number(formData.regularPrice) : undefined,
            stock: Number(formData.stock)
        }),
      });

      if (res.ok) {
        toast.success("Product listed successfully!");
        router.push("/dashboard/products");
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to list product");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-700 pb-20 px-4 sm:px-6">
      {/* Professional Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-4">
        <div className="space-y-1">
          <Link href="/dashboard/products" className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-gray-400 hover:text-primary transition-colors mb-1">
            <ChevronLeft size={12} />
            Back to Inventory
          </Link>
          <h1 className="text-2xl sm:text-3xl font-black text-foreground tracking-tight">Add Product</h1>
        </div>
        
        {/* Mobile-hidden Publish Button for quick access */}
        <button
            onClick={(e) => handleSubmit(e as any)}
            disabled={loading}
            className="hidden sm:flex px-8 py-3 bg-primary text-white rounded-2xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-primary/20 hover:bg-primary/90 transition-all active:scale-95 items-center gap-2"
        >
            {loading ? <Loader2 className="animate-spin" size={16} /> : <Plus size={16} />}
            {loading ? "Publishing..." : "Publish Product"}
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
        {/* Left Column: Core Data */}
        <div className="lg:col-span-2 space-y-6">
            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8"
            >
                <div className="flex items-center gap-3 text-primary border-b border-gray-50 pb-4">
                    <Package size={20} />
                    <h2 className="text-lg font-bold tracking-tight">Product Information</h2>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Product Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-foreground outline-none"
                            placeholder="e.g. MacBook Pro 14"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Brand</label>
                        <input
                            required
                            type="text"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-foreground outline-none"
                            placeholder="e.g. Apple"
                        />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Description</label>
                    <textarea
                        required
                        rows={5}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-foreground outline-none resize-none no-scrollbar"
                        placeholder="Detailed product overview..."
                    />
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6"
            >
                <div className="flex items-center justify-between border-b border-gray-50 pb-4">
                    <div className="flex items-center gap-3 text-primary">
                        <ImageIcon size={20} />
                        <h2 className="text-lg font-bold tracking-tight">Media Assets</h2>
                    </div>
                    <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">{images.length} / 5</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {images.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-xl overflow-hidden border border-gray-100 group shadow-sm bg-gray-50">
                            <img src={url} alt="Product preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-white text-red-500 rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                            >
                                <Trash2 size={12} />
                            </button>
                            {index === 0 && (
                                <div className="absolute bottom-0 inset-x-0 bg-primary py-0.5 text-[8px] font-bold uppercase text-white text-center tracking-widest">
                                    Primary
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {images.length < 5 && (
                        <label className={`aspect-square rounded-xl border-2 border-dashed border-gray-100 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 hover:border-primary/30 transition-all group ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                disabled={isUploading}
                                className="hidden"
                            />
                            {isUploading ? (
                                <Loader2 size={20} className="text-primary animate-spin" />
                            ) : (
                                <>
                                    <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                                        <Plus size={16} className="text-gray-400 group-hover:text-primary" />
                                    </div>
                                    <span className="text-[8px] font-bold uppercase text-gray-400 tracking-widest">Upload</span>
                                </>
                            )}
                        </label>
                    )}
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6"
            >
                <div className="flex items-center gap-3 text-primary border-b border-gray-50 pb-4">
                    <Settings size={20} />
                    <h2 className="text-lg font-bold tracking-tight">Specifications</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Model Reference</label>
                        <input
                            type="text"
                            value={formData.modelName}
                            onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                            className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-foreground outline-none"
                            placeholder="e.g. MKGP3LL/A"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Warranty</label>
                        <input
                            type="text"
                            value={formData.warranty}
                            onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                            className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-foreground outline-none"
                            placeholder="e.g. 1-Year Limited"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Technical Details</label>
                    <textarea
                        rows={4}
                        value={formData.specifications}
                        onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-foreground outline-none resize-none no-scrollbar"
                        placeholder="Key specs (CPU, RAM, Storage...)"
                    />
                </div>
            </motion.div>
        </div>

        {/* Right Column: Pricing & Inventory */}
        <div className="space-y-6">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-8"
            >
                <div className="flex items-center gap-3 text-primary border-b border-gray-50 pb-4">
                    <Tag size={20} />
                    <h2 className="text-lg font-bold tracking-tight">Organization</h2>
                </div>
                
                <div className="space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Special Price (৳)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">৳</span>
                                <input
                                    required
                                    type="number"
                                    value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-foreground outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Regular Price (৳)</label>
                            <div className="relative">
                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 font-bold text-sm">৳</span>
                                <input
                                    type="number"
                                    value={formData.regularPrice}
                                    onChange={(e) => setFormData({ ...formData, regularPrice: e.target.value })}
                                    className="w-full pl-10 pr-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-foreground outline-none"
                                    placeholder="0.00"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <div className="flex items-center justify-between px-1">
                            <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Category Selection</label>
                        </div>

                        <div className="relative">
                            <select
                                required
                                value={formData.category}
                                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-foreground outline-none appearance-none cursor-pointer"
                            >
                                <option value="">Choose category</option>
                                {categories.filter(c => !c.parent).map((parent) => (
                                    <optgroup key={parent._id} label={parent.name}>
                                        <option value={parent._id}>{parent.name} (Main)</option>
                                        {categories.filter(c => c.parent === parent._id).map((sub) => (
                                            <option key={sub._id} value={sub._id}>
                                                &nbsp;&nbsp;&nbsp;{sub.name}
                                            </option>
                                        ))}
                                    </optgroup>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                <Plus size={12} className="text-gray-400 rotate-45" />
                            </div>
                        </div>
                    </div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-6 sm:p-8 rounded-3xl border border-gray-100 shadow-sm space-y-6"
            >
                <div className="flex items-center gap-3 text-primary border-b border-gray-50 pb-4">
                    <Layers size={20} />
                    <h2 className="text-lg font-bold tracking-tight">Stock</h2>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400 ml-1">Available Units</label>
                    <input
                        required
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-4 py-3.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-semibold text-foreground outline-none"
                        placeholder="0"
                    />
                </div>
            </motion.div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-black text-white rounded-2xl font-bold text-xs uppercase tracking-[2px] shadow-xl hover:bg-gray-900 transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:bg-gray-400"
            >
                {loading ? <Loader2 className="animate-spin" size={18} /> : <Plus size={18} />}
                {loading ? "Processing..." : "Publish to Store"}
            </button>
        </div>
      </form>
    </div>
  );
}
