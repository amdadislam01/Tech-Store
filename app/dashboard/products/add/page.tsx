"use client";

import { useState } from "react";
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

export default function AddProductPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
    brand: "",
    modelName: "",
    warranty: "",
    specifications: "",
  });

  const [images, setImages] = useState<string[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [newCategory, setNewCategory] = useState("");
  const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);

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
      const finalCategory = isAddingNewCategory ? newCategory : formData.category;
      if (!finalCategory) {
        toast.error("Please select or add a category");
        setLoading(false);
        return;
      }

      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            ...formData,
            category: finalCategory,
            images: images,
            image: images[0], // Primary image
            price: Number(formData.price),
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
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000 pb-10">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <Link href="/dashboard/products" className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-primary hover:gap-3 transition-all mb-2">
            <ChevronLeft size={14} />
            Back to Inventory
          </Link>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Expand Collection</h1>
          <p className="text-gray-500 font-medium">Add a new premium item to your store catalog.</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-8">
            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6"
            >
                <div className="flex items-center gap-3 text-primary mb-2">
                    <Package size={22} />
                    <h2 className="text-xl font-black">Core Details</h2>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Name</label>
                        <input
                            required
                            type="text"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                            placeholder="e.g. iPhone 15 Pro Max"
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Brand / Manufacturer</label>
                        <input
                            required
                            type="text"
                            value={formData.brand}
                            onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                            placeholder="e.g. Apple"
                        />
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Detailed Description</label>
                        <textarea
                            required
                            rows={4}
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            className="w-full px-5 py-4 bg-gray-50 rounded-[28px] border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground no-scrollbar"
                            placeholder="Describe the unique features of this product..."
                        />
                    </div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6"
            >
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3 text-primary mb-2">
                        <ImageIcon size={22} />
                        <h2 className="text-xl font-black">Visual Assets</h2>
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{images.length}/5 Images</span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                    {images.map((url, index) => (
                        <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group">
                            <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                            <button
                                type="button"
                                onClick={() => removeImage(index)}
                                className="absolute top-2 right-2 p-1.5 bg-white/90 backdrop-blur-sm text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                            >
                                <X size={14} />
                            </button>
                            {index === 0 && (
                                <div className="absolute bottom-0 inset-x-0 bg-primary/80 backdrop-blur-sm py-1 text-[8px] font-black uppercase text-white text-center tracking-widest">
                                    Primary
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {images.length < 5 && (
                        <label className={`aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2 cursor-pointer hover:bg-gray-50 hover:border-primary transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                            <input
                                type="file"
                                accept="image/*"
                                multiple
                                onChange={handleImageUpload}
                                disabled={isUploading}
                                className="hidden"
                            />
                            {isUploading ? (
                                <Loader2 size={24} className="text-primary animate-spin" />
                            ) : (
                                <>
                                    <UploadCloud size={24} className="text-gray-400" />
                                    <span className="text-[9px] font-black uppercase text-gray-400 tracking-tighter">Add Photo</span>
                                </>
                            )}
                        </label>
                    )}
                </div>
                <p className="text-[10px] text-gray-400 font-medium italic">High-quality square images (1:1) work best. The first image will be the primary thumbnail.</p>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6"
            >
                <div className="flex items-center gap-3 text-primary mb-2">
                    <Settings size={22} />
                    <h2 className="text-xl font-black">Advanced Specs</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Model Name / Number</label>
                        <div className="relative">
                            <FileText className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={formData.modelName}
                                onChange={(e) => setFormData({ ...formData, modelName: e.target.value })}
                                className="w-full pl-12 pr-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                                placeholder="e.g. A2968"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Warranty Period</label>
                        <div className="relative">
                            <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                type="text"
                                value={formData.warranty}
                                onChange={(e) => setFormData({ ...formData, warranty: e.target.value })}
                                className="w-full pl-12 pr-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                                placeholder="e.g. 1 Year Official"
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Technical Specifications</label>
                    <textarea
                        rows={3}
                        value={formData.specifications}
                        onChange={(e) => setFormData({ ...formData, specifications: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 rounded-[28px] border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground no-scrollbar"
                        placeholder="Key technical specs (CPU, RAM, Battery...)"
                    />
                </div>
            </motion.div>
        </div>

        <div className="space-y-8">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6"
            >
                <div className="flex items-center gap-3 text-primary mb-2">
                    <Tag size={22} />
                    <h2 className="text-xl font-black">Economics</h2>
                </div>
                <div className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Base Price ($)</label>
                        <div className="relative">
                            <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                            <input
                                required
                                type="number"
                                value={formData.price}
                                onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                className="w-full pl-12 pr-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                                placeholder="0.00"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Category</label>
                            <button
                                type="button"
                                onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                                className="text-[10px] font-bold text-primary hover:underline transition-all"
                            >
                                {isAddingNewCategory ? "Choose Existing" : "+ New Category"}
                            </button>
                        </div>
                        {isAddingNewCategory ? (
                            <input
                                required
                                type="text"
                                value={newCategory}
                                onChange={(e) => setNewCategory(e.target.value)}
                                className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                                placeholder="New category name..."
                            />
                        ) : (
                            <div className="relative">
                                <select
                                    required
                                    value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground appearance-none"
                                >
                                    <option value="">Select category</option>
                                    <option value="Electronics">Electronics</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Wearables">Wearables</option>
                                    <option value="Home Tech">Home Tech</option>
                                    <option value="Smart Home">Smart Home</option>
                                    <option value="Audio">Audio</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Plus size={14} className="text-gray-400 rotate-45" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </motion.div>

            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm space-y-6"
            >
                <div className="flex items-center gap-3 text-primary mb-2">
                    <Layers size={22} />
                    <h2 className="text-xl font-black">Inventory</h2>
                </div>
                <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Initial Stock</label>
                    <input
                        required
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-5 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                        placeholder="0"
                    />
                </div>
            </motion.div>

            <button
                type="submit"
                disabled={loading}
                className="w-full py-5 bg-primary text-white rounded-3xl font-black text-sm uppercase tracking-[2px] shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all transform active:scale-95 flex items-center justify-center gap-3"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : <Plus size={20} />}
                {loading ? "Publishing..." : "Launch Product"}
            </button>
        </div>
      </form>
    </div>
  );
}
