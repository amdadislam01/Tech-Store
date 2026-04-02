"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { 
  ArrowLeft, 
  Save, 
  Package, 
  Info, 
  DollarSign, 
  Layers,
  Image as ImageIcon,
  Loader2,
  X,
  UploadCloud,
  FileText,
  ShieldCheck,
  Settings,
  Plus,
  Tag
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";

export default function EditProductPage() {
  const router = useRouter();
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
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

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`);
        const data = await res.json();
        if (res.ok) {
          setFormData({
            name: data.name,
            description: data.description,
            price: data.price.toString(),
            category: data.category,
            stock: data.stock.toString(),
            brand: data.brand || "",
            modelName: data.modelName || "",
            warranty: data.warranty || "",
            specifications: data.specifications || "",
          });
          setImages(data.images && data.images.length > 0 ? data.images : (data.image ? [data.image] : []));
        } else {
          toast.error("Product not found");
          router.push("/dashboard/products");
        }
      } catch (error) {
        toast.error("Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, router]);

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
    setSaving(true);

    try {
      const finalCategory = isAddingNewCategory ? newCategory : formData.category;
      if (!finalCategory) {
        toast.error("Please select or add a category");
        setSaving(false);
        return;
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           ...formData,
           category: finalCategory,
           images: images,
           image: images[0], // Primary image
           price: parseFloat(formData.price),
           stock: parseInt(formData.stock)
        }),
      });

      if (res.ok) {
        toast.success("Product updated successfully!");
        router.push("/dashboard/products");
        router.refresh();
      } else {
        const data = await res.json();
        toast.error(data.error || "Failed to update product");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 text-primary animate-spin" />
        <p className="text-gray-500 font-bold uppercase tracking-widest text-[10px]">Retrieving Product Manifest...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex items-center justify-between">
        <Link 
          href="/dashboard/products" 
          className="flex items-center gap-2 text-gray-500 hover:text-primary transition-colors font-bold text-sm group"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          <span>Back to Inventory</span>
        </Link>
        <div className="px-4 py-1.5 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">
            Resource ID: {id}
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-2xl shadow-gray-200/50 overflow-hidden">
        <div className="p-8 md:p-12 border-b border-gray-50 bg-gray-50/30">
            <h1 className="text-4xl font-black text-foreground tracking-tight">Edit Product</h1>
            <p className="text-gray-500 mt-2 font-medium">Refine your product's presence and stock availability.</p>
        </div>

        <form onSubmit={handleSubmit} className="p-8 md:p-12 space-y-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
            {/* Core & Visuals */}
            <div className="space-y-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-primary">
                        <Package size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Core Details</h3>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-6">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Product Name</label>
                            <input 
                                type="text" 
                                required
                                placeholder="e.g. iPhone 15 Pro Max"
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Brand / Manufacturer</label>
                            <input 
                                type="text" 
                                required
                                placeholder="e.g. Apple"
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                                value={formData.brand}
                                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Contextual Description</label>
                            <textarea 
                                required
                                rows={4}
                                placeholder="Describe the unique features..."
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-foreground resize-none"
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                            />
                        </div>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2 text-primary">
                            <ImageIcon size={18} />
                            <h3 className="text-xs font-black uppercase tracking-widest">Visual Assets</h3>
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">{images.length}/5</span>
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        {images.map((url, index) => (
                            <div key={index} className="relative aspect-square rounded-2xl overflow-hidden border-2 border-gray-100 group">
                                <img src={url} alt={`Product ${index + 1}`} className="w-full h-full object-cover" />
                                <button
                                    type="button"
                                    onClick={() => removeImage(index)}
                                    className="absolute top-2 right-2 p-1 bg-white/90 backdrop-blur-sm text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-all hover:bg-red-500 hover:text-white"
                                >
                                    <X size={12} />
                                </button>
                                {index === 0 && (
                                    <div className="absolute bottom-0 inset-x-0 bg-primary/80 backdrop-blur-sm py-0.5 text-[7px] font-black uppercase text-white text-center tracking-widest">
                                        Primary
                                    </div>
                                )}
                            </div>
                        ))}
                        
                        {images.length < 5 && (
                            <label className={`aspect-square rounded-2xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-1 cursor-pointer hover:bg-gray-50 hover:border-primary transition-all ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                                <input
                                    type="file"
                                    accept="image/*"
                                    multiple
                                    onChange={handleImageUpload}
                                    disabled={isUploading}
                                    className="hidden"
                                />
                                {isUploading ? (
                                    <Loader2 size={18} className="text-primary animate-spin" />
                                ) : (
                                    <>
                                        <UploadCloud size={18} className="text-gray-400" />
                                        <span className="text-[8px] font-black uppercase text-gray-400">Add</span>
                                    </>
                                )}
                            </label>
                        )}
                    </div>
                </div>
            </div>

            {/* Economics & Specs */}
            <div className="space-y-10">
                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-primary">
                        <Tag size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Economics & Classification</h3>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
                                <DollarSign size={10} /> Market Price
                            </label>
                            <input 
                                type="number" 
                                required
                                placeholder="0.00"
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-black text-foreground text-xl"
                                value={formData.price}
                                onChange={(e) => setFormData({...formData, price: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Current Stock</label>
                            <input 
                                type="number" 
                                required
                                placeholder="Units"
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-black text-foreground text-xl text-primary"
                                value={formData.stock}
                                onChange={(e) => setFormData({...formData, stock: e.target.value})}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400">Classification</label>
                            <button
                                type="button"
                                onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}
                                className="text-[10px] font-bold text-primary hover:underline transition-all"
                            >
                                {isAddingNewCategory ? "Choose Existing" : "+ New category"}
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
                                    className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground appearance-none"
                                    value={formData.category}
                                    onChange={(e) => setFormData({...formData, category: e.target.value})}
                                >
                                    <option value="">Select Category</option>
                                    <option value="Smartphones">Smartphones</option>
                                    <option value="Laptops">Laptops</option>
                                    <option value="Accessories">Accessories</option>
                                    <option value="Tablets">Tablets</option>
                                    <option value="Audio">Audio</option>
                                    <option value="Wearables">Wearables</option>
                                    <option value="Home Tech">Home Tech</option>
                                </select>
                                <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none">
                                    <Plus size={14} className="text-gray-400 rotate-45" />
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="flex items-center gap-2 text-primary">
                        <Settings size={18} />
                        <h3 className="text-xs font-black uppercase tracking-widest">Advanced Specs</h3>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
                                <FileText size={10} /> Model Name / Number
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. A2968"
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                                value={formData.modelName}
                                onChange={(e) => setFormData({...formData, modelName: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px) font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
                                <ShieldCheck size={10} /> Warranty Period
                            </label>
                            <input 
                                type="text" 
                                placeholder="e.g. 1 Year Official"
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground"
                                value={formData.warranty}
                                onChange={(e) => setFormData({...formData, warranty: e.target.value})}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-1">
                                <Settings size={10} /> Technical Specifications
                            </label>
                            <textarea 
                                rows={3}
                                placeholder="Key technical specs..."
                                className="w-full px-6 py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-medium text-foreground resize-none"
                                value={formData.specifications}
                                onChange={(e) => setFormData({...formData, specifications: e.target.value})}
                            />
                        </div>
                    </div>
                </div>
            </div>
          </div>

          <div className="pt-10 flex flex-col md:flex-row gap-4 border-t border-gray-50">
            <button 
              type="submit" 
              disabled={saving}
              className="flex-grow bg-primary text-white py-5 px-10 rounded-[2rem] font-black text-sm uppercase tracking-[4px] shadow-2xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-[0.98] flex items-center justify-center gap-3 disabled:opacity-50"
            >
              {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
              {saving ? "Processing Manifest..." : "Commit Manifest Updates"}
            </button>
            <Link 
              href="/dashboard/products"
              className="bg-gray-100 text-gray-500 py-5 px-10 rounded-[2rem] font-black text-sm uppercase tracking-[4px] hover:bg-gray-200 transition-all text-center"
            >
              Cancel
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
