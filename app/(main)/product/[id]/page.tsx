"use client";

import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice";
import { RootState } from "@/redux/store";
import { 
  ShoppingCart, 
  ArrowLeft, 
  Star, 
  ShieldCheck, 
  Truck, 
  Heart, 
  MessageSquare, 
  ListTodo, 
  FileText,
  Clock,
  ChevronRight,
  Sparkles
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetails() {
  const { id } = useParams();
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"description" | "specs" | "reviews">("description");
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [submittingReview, setSubmittingReview] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { data: session } = useSession();
  const dispatch = useDispatch();
  
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const isInWishlist = useMemo(() => wishlistItems.some((item) => item._id === product?._id), [wishlistItems, product]);

  const handleToggleWishlist = () => {
    if (!product) return;
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product));
      toast.success("Added to wishlist!");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
        const data = await res.json();
        
        if (data.error) {
          setProduct(null);
        } else {
          setProduct(data);
          setActiveImage(data.images && data.images.length > 0 ? data.images[0] : data.image);
        }
      } catch (error) {
        console.error("Error:", error);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  const handleReviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) return toast.error("Please login to post a review");
    
    setSubmittingReview(true);
    try {
      const res = await fetch(`/api/products/${id}/reviews`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rating, comment }),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Review submitted!");
        setProduct(data.product);
        setComment("");
        setRating(5);
        setActiveTab("reviews");
      } else {
        toast.error(data.error || "Failed to submit review");
      }
    } catch (err) {
      toast.error("An error occurred");
    } finally {
      setSubmittingReview(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(new Date(dateString));
  };

  const reviewStats = useMemo(() => {
    if (!product?.reviews) return null;
    const stats = [0, 0, 0, 0, 0];
    product.reviews.forEach((r: any) => {
        if (r.rating >= 1 && r.rating <= 5) stats[5 - r.rating]++;
    });
    return stats.map(count => ({
        count,
        percentage: (count / product.reviews.length) * 100
    }));
  }, [product]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-6">
            <motion.div 
               animate={{ rotate: 360 }}
               transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
               className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full shadow-xl shadow-primary/10" 
            />
            <motion.p 
               initial={{ opacity: 0 }}
               animate={{ opacity: 1 }}
               className="text-gray-400 font-black uppercase tracking-[0.3em] text-[10px]"
            >
               Initializing Premium Experience
            </motion.p>
        </div>
    </div>
  );

  if (!product) return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-white px-6 text-center">
        <div className="w-32 h-32 bg-zinc-50 rounded-[4rem] flex items-center justify-center mb-10 shadow-2xl shadow-gray-100 border border-white">
            <ShoppingCart size={40} className="text-gray-200" />
        </div>
        <h2 className="text-4xl font-black text-foreground mb-4 tracking-tighter">Identity Not Found</h2>
        <p className="text-gray-500 max-w-sm mb-12 font-medium leading-relaxed">The requested innovation sequence could not be matched. It may have been archived or repositioned.</p>
        <Link href="/" className="px-12 py-5 bg-foreground text-white font-black text-xs uppercase tracking-[3px] rounded-3xl shadow-2xl hover:bg-primary transition-all duration-500 active:scale-95">
            Return to Core
        </Link>
    </div>
  );

  const regularPrice = product.regularPrice || product.price + Math.floor(product.price * 0.1);
  const discountAmount = regularPrice - product.price;

  return (
    <div className="bg-[#F2F4F8] min-h-screen pb-20">
      <div className="container-custom py-6">
        {/* Breadcrumb - Star Tech style */}
        <div className="flex items-center gap-2 text-[10px] sm:text-xs text-gray-500 mb-6 sm:mb-8 overflow-x-auto whitespace-nowrap py-3 no-scrollbar border-b border-gray-100 sm:border-0 px-2 sm:px-0">
            <Link href="/" className="hover:text-primary transition-colors flex-shrink-0">Home</Link>
            <ChevronRight size={10} className="flex-shrink-0" />
            <Link href="/products" className="hover:text-primary transition-colors flex-shrink-0">Products</Link>
            <ChevronRight size={10} className="flex-shrink-0" />
            <span className="text-gray-400 flex-shrink-0">
                {product.category?.name || (typeof product.category === 'string' ? product.category : "General")}
            </span>
            <ChevronRight size={10} className="flex-shrink-0" />
            <span className="font-bold text-slate-800 truncate">{product.name}</span>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-100 p-6 md:p-10 mb-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
                {/* Image Section */}
                <div className="lg:col-span-5 space-y-6">
                    <div className="relative aspect-square w-full bg-white rounded-lg overflow-hidden group border border-gray-100 p-8">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="absolute inset-0 p-8"
                            >
                                <Image
                                    src={activeImage || product.image || "/placeholder.png"}
                                    alt={product.name}
                                    fill
                                    className="object-contain"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>
                    </div>

                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-3 overflow-x-auto pb-2 no-scrollbar">
                            {product.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`relative w-16 h-16 rounded border transition-all flex-shrink-0 ${
                                        activeImage === img ? "border-primary shadow-sm" : "border-gray-100 opacity-60 hover:opacity-100"
                                    }`}
                                >
                                    <Image src={img} alt={`${product.name} thumbnail`} fill className="object-cover p-1" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                {/* Main Content Area */}
                <div className="lg:col-span-7 flex flex-col space-y-6">
                    <h1 className="text-2xl md:text-3xl font-bold text-slate-800 leading-tight">
                        {product.name}
                    </h1>

                    {/* Metadata Bar - Pills - Improved for responsiveness */}
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                        <div className="bg-gray-100 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold text-gray-500">
                           Price: <span className="text-slate-800">৳{product.price.toLocaleString()}</span>
                        </div>
                        <div className="bg-gray-100 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold text-gray-500">
                           Stock: <span className="text-primary">In Stock</span>
                        </div>
                        <div className="bg-gray-100 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold text-gray-500">
                           Code: <span className="text-slate-800">{product._id.slice(-6).toUpperCase()}</span>
                        </div>
                        <div className="bg-gray-100 px-3 sm:px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-bold text-gray-500">
                           Brand: <span className="text-slate-800">{product.brand || "Tech Store"}</span>
                        </div>
                    </div>

                    {/* Quick Overview */}
                    <div className="pt-4">
                        <h3 className="text-sm font-bold text-slate-800 mb-4 tracking-wide uppercase border-b-2 border-primary/20 inline-block pb-1">Key Features</h3>
                        <ul className="space-y-3">
                            <li className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                <span>High-performance flagship experience</span>
                            </li>
                            <li className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                <span>Professional build with durable materials</span>
                            </li>
                            <li className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                <span>Advanced technology for daily lifestyle</span>
                            </li>
                            <li className="flex items-center gap-3 text-xs text-gray-600 font-medium">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                                <span>Authentic component verification</span>
                            </li>
                        </ul>
                        <Link href="#specs" onClick={(e) => { e.preventDefault(); setActiveTab("specs"); }} className="text-[11px] font-bold text-[#ef4444] hover:underline mt-4 inline-block">View More Info</Link>
                    </div>

                    {/* Pricing Tier Box - Star Tech Style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6">
                        <div className="bg-[#f0fdf4] p-5 rounded-lg border-2 border-primary/20 relative group hover:border-primary transition-all">
                            <div className="absolute -top-3 right-4 bg-[#6e2594] text-white px-3 py-1 rounded-full text-[10px] font-bold">Save: ৳{discountAmount}</div>
                            <span className="text-2xl font-bold text-[#ef4444]">৳{product.price.toLocaleString()}</span>
                            <p className="text-[11px] text-gray-500 font-bold mt-1">Special Price</p>
                        </div>
                        <div className="bg-gray-50 p-5 rounded-lg border border-gray-100 opacity-80">
                            <span className="text-2xl font-bold text-slate-800">৳{regularPrice.toLocaleString()}</span>
                            <p className="text-[11px] text-gray-400 font-bold mt-1">Regular Price</p>
                        </div>
                    </div>

                    {/* Quantity & Actions - Final Fix for visibility */}
                    <div className="pt-4 sm:pt-8 flex flex-col xl:flex-row items-stretch xl:items-center gap-4 sm:gap-6">
                        <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden h-12 sm:h-14 w-full xl:w-auto shadow-sm bg-white">
                            <button 
                                onClick={() => setQuantity(q => q > 1 ? q - 1 : 1)}
                                className="w-12 sm:w-16 h-full hover:bg-gray-50 transition-colors text-lg sm:text-xl font-bold border-r border-gray-100 flex items-center justify-center"
                            >
                                -
                            </button>
                            <span className="flex-1 xl:flex-none px-4 sm:px-10 font-bold text-slate-800 text-sm sm:text-lg min-w-[50px] sm:min-w-[80px] text-center flex items-center justify-center bg-white">{quantity}</span>
                            <button 
                                onClick={() => setQuantity(q => q + 1)}
                                className="w-12 sm:w-16 h-full hover:bg-gray-50 transition-colors text-lg sm:text-xl font-bold border-l border-gray-100 flex items-center justify-center"
                            >
                                +
                            </button>
                        </div>

                        <div className="flex gap-2 sm:gap-3 w-full">
                            <button 
                                onClick={() => {
                                    dispatch(addToCart({ ...product, quantity }));
                                    toast.success("Added to cart!");
                                }}
                                className="flex-[3] h-12 sm:h-14 bg-primary text-white rounded-lg font-bold text-[11px] sm:text-sm hover:bg-primary-dark transition-all shadow-md active:scale-95 uppercase tracking-wider"
                            >
                                Buy Now
                            </button>
                            <button 
                                onClick={() => {
                                    dispatch(addToCart({ ...product, quantity }));
                                    toast.success("Added to cart!");
                                }}
                                className="flex-[3] h-12 sm:h-14 bg-white text-primary border-2 border-primary rounded-lg font-bold text-[11px] sm:text-sm hover:bg-primary hover:text-white transition-all shadow-sm active:scale-95 uppercase tracking-wider"
                            >
                                Add to Cart
                            </button>
                            <button 
                                onClick={handleToggleWishlist}
                                className={`w-12 h-12 sm:w-14 sm:h-14 border-2 rounded-lg flex items-center justify-center transition-all flex-shrink-0 ${
                                    isInWishlist ? "bg-red-500 border-red-500 text-white shadow-lg" : "border-gray-200 text-gray-300 hover:text-red-500 hover:border-red-500"
                                }`}
                            >
                                <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} className="sm:w-[22px] sm:h-[22px]" />
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>

         <div className="mt-12 overflow-hidden" id="specs">
              <div className="flex justify-start md:justify-center border-b border-gray-100 mb-8 overflow-x-auto no-scrollbar pt-4">
                 {[
                     { id: "specs", label: "Specification", icon: ListTodo },
                     { id: "description", label: "Description", icon: FileText },
                     { id: "reviews", label: "Reviews", icon: MessageSquare }
                 ].map((tab) => (
                     <button
                         key={tab.id}
                         onClick={() => setActiveTab(tab.id as any)}
                         className={`relative py-4 px-6 text-xs font-bold transition-all whitespace-nowrap flex items-center gap-2 group ${
                             activeTab === tab.id ? "text-white bg-[#ef4444] rounded-t-lg shadow-md" : "text-gray-500 hover:text-primary bg-gray-50/50 rounded-t-lg mx-0.5 border-t border-x border-transparent hover:border-gray-100"
                         }`}
                     >
                         <tab.icon size={14} />
                         {tab.label}
                     </button>
                 ))}
              </div>
 
              <div className="max-w-7xl mx-auto px-4 md:px-0">
                   <AnimatePresence mode="wait">
                     {activeTab === "specs" && (
                         <motion.div 
                             key="specs"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             className="space-y-10"
                         >
                            <h2 className="text-xl font-bold text-slate-800">Technical <span className="text-primary italic">Specifications</span></h2>
                             {product.specifications ? (
                                 <div className="bg-white rounded-lg border border-gray-100 overflow-hidden shadow-sm">
                                     <div className="w-full">
                                         {/* Group Header */}
                                         <div className="bg-[#f0fdf4] border-b border-gray-100 px-5 sm:px-8 py-4">
                                            <h3 className="font-bold text-primary uppercase tracking-wider italic text-xs sm:text-sm flex items-center gap-2">
                                                <ListTodo size={14} /> Main Components
                                            </h3>
                                         </div>
                                         
                                         {/* Specs List */}
                                         <div className="divide-y divide-gray-100">
                                             {product.specifications.split("\n").filter((s: string) => s.trim().length > 0).map((spec: string, i: number) => {
                                                 const [label, ...value] = spec.includes(":") ? spec.split(":") : [spec, ""];
                                                 return (
                                                     <div key={i} className="flex flex-col sm:flex-row hover:bg-gray-50 transition-colors">
                                                         <div className="px-5 sm:px-8 py-3 sm:py-5 font-bold text-gray-500 text-[10px] sm:text-xs sm:w-1/3 bg-gray-50/40 uppercase tracking-tight sm:tracking-normal sm:uppercase-none">
                                                             {label.trim()}
                                                         </div>
                                                         <div className="px-5 sm:px-8 py-3 sm:py-5 text-slate-800 font-bold sm:font-medium text-[11px] sm:text-xs border-t border-gray-50 sm:border-0">
                                                             {value.join(":").trim() || "Verified Premium"}
                                                         </div>
                                                     </div>
                                                 );
                                             })}
                                         </div>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="py-20 text-center bg-white rounded-lg border-2 border-dashed border-gray-100">
                                     <div className="w-16 h-16 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-4 border border-gray-100">
                                         <ListTodo size={24} className="text-gray-300" />
                                     </div>
                                     <p className="text-gray-400 font-bold text-xs uppercase tracking-widest">Detailed specifications coming soon.</p>
                                 </div>
                             )}
                         </motion.div>
                     )}
 
                     {activeTab === "description" && (
                         <motion.div 
                             key="desc"
                             initial={{ opacity: 0 }}
                             animate={{ opacity: 1 }}
                             exit={{ opacity: 0 }}
                             className="bg-white p-8 rounded-lg border border-gray-100 shadow-sm"
                         >
                            <h2 className="text-xl font-bold text-slate-800 mb-8">Product <span className="text-primary italic">Description</span></h2>
                            <div className="prose prose-sm max-w-none text-gray-600 leading-relaxed font-medium">
                                <p className="mb-6">{product.description}</p>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 bg-[#f0fdf4]/50 p-6 rounded-lg border border-primary/10">
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-primary flex items-center gap-2">
                                            <ShieldCheck size={16} /> Key Advantages
                                        </h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2 text-xs">
                                                <div className="w-1 h-1 bg-primary rounded-full" />
                                                Next-generation architecture integration
                                            </li>
                                            <li className="flex items-center gap-2 text-xs">
                                                <div className="w-1 h-1 bg-primary rounded-full" />
                                                Optimized for extreme durability and power
                                            </li>
                                        </ul>
                                    </div>
                                    <div className="space-y-4">
                                        <h4 className="font-bold text-primary flex items-center gap-2">
                                            <Truck size={16} /> Global Reliability
                                        </h4>
                                        <ul className="space-y-2">
                                            <li className="flex items-center gap-2 text-xs">
                                                <div className="w-1 h-1 bg-primary rounded-full" />
                                                Tested against international standards
                                            </li>
                                            <li className="flex items-center gap-2 text-xs">
                                                <div className="w-1 h-1 bg-primary rounded-full" />
                                                Express global deployment channels
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                         </motion.div>
                     )}

                    {activeTab === "reviews" && (
                        <motion.div 
                            key="reviews"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20"
                        >
                            <div className="lg:col-span-5 space-y-10">
                                <div className="bg-zinc-50/50 p-8 rounded-3xl border border-white shadow-xl shadow-gray-100/20">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-5xl font-black text-foreground tracking-tighter mb-1">{product.avgRating?.toFixed(1) || "5.0"}</h2>
                                            <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">Global Rating</p>
                                        </div>
                                        <div className="text-right">
                                            <div className="flex text-yellow-400 mb-1 justify-end">
                                                {[1, 2, 3, 4, 5].map((s) => (
                                                    <Star key={s} size={14} fill={product.avgRating >= s ? "currentColor" : "none"} className={product.avgRating >= s ? "" : "text-gray-100"} />
                                                ))}
                                            </div>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{product.numReviews || 0} Verifications</p>
                                        </div>
                                    </div>
                                    
                                    <div className="space-y-3">
                                        {reviewStats?.map((stat, i) => (
                                            <div key={i} className="flex items-center gap-4 group">
                                                <span className="text-[9px] font-black text-gray-400 w-3">{5 - i}</span>
                                                <div className="flex-1 h-1.5 bg-white rounded-full overflow-hidden border border-gray-100/50 relative">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${stat.percentage}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        className="h-full bg-primary relative z-10" 
                                                    />
                                                </div>
                                                <span className="text-[9px] font-bold text-gray-400 w-6 group-hover:text-primary transition-colors">{stat.percentage.toFixed(0)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="relative p-8 bg-white rounded-3xl border border-zinc-100 shadow-2xl shadow-gray-100/40">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary">
                                            <MessageSquare size={18} />
                                        </div>
                                        <h3 className="text-lg font-black text-foreground tracking-tight">Post Analysis</h3>
                                    </div>
                                    
                                    {session ? (
                                        <form onSubmit={handleReviewSubmit} className="space-y-6">
                                            <div>
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-3">Rating Scale</label>
                                                <div className="flex gap-2">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <button
                                                            key={s}
                                                            type="button"
                                                            onClick={() => setRating(s)}
                                                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-300 ${
                                                                rating >= s ? "bg-primary text-white shadow-lg shadow-primary/20 scale-105" : "bg-zinc-50 text-gray-300 hover:bg-white border border-transparent hover:border-zinc-100"
                                                            }`}
                                                        >
                                                            <Star size={16} fill={rating >= s ? "currentColor" : "none"} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[9px] font-black uppercase tracking-widest text-gray-400 block mb-3">Narrative Transcription</label>
                                                <textarea
                                                    required
                                                    rows={4}
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    className="w-full bg-zinc-50/50 border border-zinc-100 rounded-2xl p-6 focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary/20 transition-all text-xs font-medium outline-none resize-none"
                                                    placeholder="Synthesize your experience here..."
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submittingReview}
                                                className="w-full bg-foreground text-white py-4 rounded-xl font-black text-[9px] uppercase tracking-widest shadow-xl hover:bg-primary transition-all duration-300 disabled:opacity-50 active:scale-95"
                                            >
                                                {submittingReview ? "Processing..." : "Submit Review"}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="py-8 text-center bg-zinc-50/50 rounded-2xl border border-dashed border-zinc-200">
                                            <p className="text-[10px] text-gray-400 mb-6 font-bold uppercase tracking-tight">Identity Verification Required</p>
                                            <Link href="/login" className="inline-block px-8 py-3 bg-zinc-900 text-white rounded-xl text-[9px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-lg active:scale-95">
                                                Initiate Sign In
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="lg:col-span-7">
                                <div className="space-y-6">
                                    <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100/60">
                                        <h3 className="text-xl font-black text-foreground tracking-tight">Verified Transmissions</h3>
                                        <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">{product.reviews?.length || 0} Entries</span>
                                    </div>
                                    
                                    {product.reviews && product.reviews.length > 0 ? (
                                        product.reviews.map((rev: any, idx: number) => (
                                            <motion.div 
                                                layout
                                                initial={{ opacity: 0, scale: 0.98 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ delay: idx * 0.1 }}
                                                key={idx} 
                                                className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-gray-100/30 transition-all duration-500 relative group cursor-pointer"
                                            >
                                                <div className="flex items-start justify-between mb-6">
                                                    <div className="flex items-center gap-4">
                                                        <div className="w-12 h-12 bg-gradient-to-br from-primary/10 to-primary/5 rounded-xl flex items-center justify-center text-primary font-black text-lg shadow-inner group-hover:rotate-3 transition-transform">
                                                            {rev.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-sm font-black text-foreground mb-0.5">{rev.name}</h4>
                                                            <div className="flex items-center gap-2">
                                                                <span className="text-[8px] font-black uppercase tracking-widest text-primary">Explorer</span>
                                                                <div className="w-1 h-1 rounded-full bg-gray-200" />
                                                                <span className="text-[8px] text-gray-300 font-bold uppercase tracking-widest">{formatDate(rev.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex text-yellow-400 gap-0.5">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star key={i} size={12} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-gray-100"} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-5 bg-zinc-50/50 border border-white rounded-xl relative group-hover:bg-white transition-colors duration-500">
                                                    <MessageSquare size={14} className="absolute -top-1.5 -left-1.5 text-primary opacity-20" />
                                                    <p className="text-gray-500 font-medium leading-relaxed text-xs tracking-tight">
                                                        {rev.comment}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="py-32 text-center bg-zinc-50/50 rounded-3xl border-2 border-dashed border-white">
                                            <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-50">
                                                <MessageSquare size={24} className="text-gray-200" />
                                            </div>
                                            <p className="text-gray-300 font-black uppercase tracking-widest text-[9px]">Be the first to synthesize feedback.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
             </div>
        </div>
      </div>
    </div>
  );
}
