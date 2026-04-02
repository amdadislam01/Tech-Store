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

  return (
    <div className="bg-white min-h-screen">
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-zinc-50 to-transparent -z-10" />
      
      <div className="container-custom py-12">
        <Link href="/" className="inline-flex items-center gap-3 text-gray-400 hover:text-primary transition-all mb-12 group font-black text-[10px] uppercase tracking-widest">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          <span>Back to Collection</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-start">
            <div className="w-full">
                <div className="sticky top-12 space-y-6">
                    <motion.div 
                        layoutId={`product-img-${product._id}`}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                        className="relative aspect-square w-full bg-zinc-50 rounded-3xl overflow-hidden group shadow-xl shadow-gray-200/40 border border-white"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0, scale: 0.98 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.02 }}
                                transition={{ duration: 0.4, ease: "easeInOut" }}
                                className="absolute inset-0 p-12 md:p-16"
                            >
                                <Image
                                    src={activeImage || product.image || "/placeholder.png"}
                                    alt={product.name}
                                    fill
                                    className="object-contain hover:scale-110 transition-transform duration-700 ease-out"
                                    priority
                                />
                            </motion.div>
                        </AnimatePresence>
                        
                        <div className="absolute top-6 left-6">
                             <div className="bg-white/70 backdrop-blur-md px-4 py-2 rounded-xl shadow-lg border border-white/50 flex items-center gap-2">
                                 <Sparkles size={14} className="text-primary animate-pulse" />
                                 <span className="text-[9px] font-black uppercase tracking-widest text-foreground">Premium Series</span>
                             </div>
                        </div>
                    </motion.div>

                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-4 overflow-x-auto pb-4 no-scrollbar">
                            {product.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all duration-300 flex-shrink-0 ${
                                        activeImage === img ? "border-primary scale-105 shadow-lg shadow-primary/10" : "border-transparent opacity-60 hover:opacity-100"
                                    }`}
                                >
                                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <motion.div 
                initial="hidden"
                animate="visible"
                variants={{
                    hidden: { opacity: 0 },
                    visible: {
                        opacity: 1,
                        transition: {
                            staggerChildren: 0.1
                        }
                    }
                }}
                className="flex flex-col pt-2"
            >
                <motion.div 
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    className="flex flex-wrap items-center gap-2 mb-6"
                >
                    <span className="bg-primary/5 text-primary px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-primary/10">
                        {product.category}
                    </span>
                    {product.brand && (
                        <span className="bg-zinc-50 text-gray-400 px-4 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border border-zinc-100">
                            {product.brand}
                        </span>
                    )}
                </motion.div>

                <motion.h1 
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    className="text-4xl md:text-5xl font-black text-foreground mb-4 leading-tight tracking-tight"
                >
                   {product.name}
                </motion.h1>

                <motion.div 
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    className="flex items-center gap-4 mb-8 pb-8 border-b border-gray-100/60"
                >
                    <div className="flex items-center gap-2">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={14} fill={product.avgRating >= s ? "currentColor" : "none"} className={product.avgRating >= s ? "" : "text-gray-200"} />
                            ))}
                        </div>
                        <span className="text-sm font-black text-foreground">{product.avgRating?.toFixed(1) || "5.0"}</span>
                    </div>
                    <div className="h-3 w-px bg-gray-200" />
                    <span className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                        {product.numReviews || 0} Verifications
                    </span>
                </motion.div>

                <motion.p 
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    className="text-base text-gray-500 leading-relaxed font-medium mb-10 max-w-xl"
                >
                   {product.description || "Synthesizing cutting-edge technology with high-end aesthetic performance."}
                </motion.p>

                <motion.div 
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    className="flex items-baseline gap-2 mb-10"
                >
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest">$</span>
                    <span className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">
                        {product.price ? product.price.toLocaleString() : "0"}
                    </span>
                    <span className="text-[10px] font-black uppercase text-gray-400 tracking-widest ml-2">USD</span>
                </motion.div>

                <motion.div 
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    className="grid grid-cols-2 gap-4 mb-10"
                >
                    <div className="p-5 bg-zinc-50/50 rounded-2xl border border-white hover:bg-white hover:shadow-xl transition-all duration-300 group">
                         <ShieldCheck className="text-primary mb-3 group-hover:scale-110 transition-transform" size={24} />
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground mb-1">Authentic</h4>
                         <p className="text-[9px] font-bold text-gray-400">Original Components</p>
                    </div>
                    <div className="p-5 bg-zinc-50/50 rounded-2xl border border-white hover:bg-white hover:shadow-xl transition-all duration-300 group">
                         <Truck className="text-primary mb-3 group-hover:scale-110 transition-transform" size={24} />
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-foreground mb-1">Global</h4>
                         <p className="text-[9px] font-bold text-gray-400">Express Deployment</p>
                    </div>
                </motion.div>

                <motion.div 
                    variants={{
                        hidden: { opacity: 0, y: 10 },
                        visible: { opacity: 1, y: 0 }
                    }}
                    className="flex gap-4 mt-auto"
                >
                    <button 
                        onClick={() => {
                            dispatch(addToCart(product));
                            toast.success("Identity synthesized in cart!");
                        }}
                        className="flex-[4] bg-foreground text-white py-5 rounded-2xl font-black text-[10px] uppercase tracking-[0.25em] flex items-center justify-center gap-3 hover:bg-primary transition-all duration-300 shadow-xl hover:shadow-primary/20 active:scale-95"
                    >
                        <ShoppingCart size={18} />
                        Order Now
                    </button>
                    <button 
                        onClick={handleToggleWishlist}
                        className={`flex-[1] rounded-2xl flex items-center justify-center transition-all duration-300 border-2 ${
                            isInWishlist ? "bg-red-500 border-red-500 text-white shadow-lg" : "bg-white border-zinc-100 text-gray-300 hover:text-red-500 hover:border-red-100"
                        }`}
                    >
                        <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
                    </button>
                </motion.div>
            </motion.div>
        </div>

        <div className="mt-32">
             <div className="flex justify-center border-b border-gray-100/60 mb-12 overflow-x-auto no-scrollbar gap-10 md:gap-16">
                {[
                    { id: "description", label: "Overview", icon: FileText },
                    { id: "specs", label: "Intelligence", icon: ListTodo },
                    { id: "reviews", label: "Validation", icon: MessageSquare }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative py-8 px-2 text-[11px] font-black uppercase tracking-[0.25em] transition-all whitespace-nowrap flex items-center gap-3 group ${
                            activeTab === tab.id ? "text-primary" : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        <tab.icon size={16} className={`transition-all duration-300 ${activeTab === tab.id ? "scale-110" : "group-hover:scale-110"}`} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-t-full shadow-[0_-4px_12px_rgba(34,197,94,0.3)]"
                            />
                        )}
                    </button>
                ))}
             </div>

             <div className="max-w-6xl mx-auto">
                  <AnimatePresence mode="wait">
                    {activeTab === "description" && (
                        <motion.div 
                            key="desc"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                            className="space-y-16"
                        >
                            <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                                <div className="lg:col-span-7 space-y-8">
                                    <h3 className="text-3xl font-black text-foreground tracking-tight leading-tight">Mastering the intersection of design & performance.</h3>
                                    <p className="text-gray-500 text-base leading-relaxed font-medium">
                                        {product.description}
                                    </p>
                                    
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
                                        {[
                                            { title: "Performance", desc: "Optimized for extreme efficiency", icon: Sparkles },
                                            { title: "Build Quality", desc: "Premium aerospace-grade materials", icon: ShieldCheck },
                                            { title: "Innovation", desc: "Cutting-edge internal architecture", icon: ListTodo },
                                            { title: "Reliability", desc: "Extensively verified transmissions", icon: Clock }
                                        ].map((item, i) => (
                                            <div key={i} className="flex gap-4 p-4 rounded-2xl bg-zinc-50/50 border border-white hover:bg-white hover:shadow-lg transition-all group">
                                                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-primary shadow-sm group-hover:scale-110 transition-transform">
                                                    <item.icon size={18} />
                                                </div>
                                                <div>
                                                    <h4 className="text-[11px] font-black uppercase tracking-widest text-foreground">{item.title}</h4>
                                                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-tight">{item.desc}</p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                                <div className="lg:col-span-5">
                                    <div className="relative aspect-square bg-zinc-50 rounded-3xl overflow-hidden p-12 flex items-center justify-center border border-white group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                                        <MessageSquare size={120} className="text-zinc-100 absolute -bottom-10 -right-10 rotate-12" />
                                        <div className="text-center relative z-10">
                                            <div className="w-20 h-20 rounded-[2rem] bg-white border border-zinc-100 shadow-xl flex items-center justify-center mx-auto mb-6 group-hover:-translate-y-2 transition-transform duration-500">
                                                <Clock className="text-primary" size={32} />
                                            </div>
                                            <p className="text-[10px] font-black uppercase tracking-widest text-foreground mb-1">Time-Tested</p>
                                            <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">Global Standard Architecture</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}

                    {activeTab === "specs" && (
                        <motion.div 
                            key="specs"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20 }}
                        >
                            {product.specifications ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    {product.specifications.split("\n").filter((s: string) => s.trim().length > 0).map((spec: string, i: number) => {
                                        const [label, ...value] = spec.includes(":") ? spec.split(":") : [spec, ""];
                                        return (
                                            <div key={i} className="flex items-center justify-between p-6 bg-zinc-50/50 rounded-2xl border border-white hover:bg-white hover:shadow-xl transition-all group">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-zinc-100 flex items-center justify-center text-gray-400 group-hover:bg-primary/10 group-hover:text-primary transition-colors">
                                                        <ChevronRight size={14} />
                                                    </div>
                                                    <span className="text-[10px] font-black uppercase tracking-widest text-gray-400 group-hover:text-foreground transition-colors">{label}</span>
                                                </div>
                                                <span className="text-[10px] font-black uppercase tracking-widest text-foreground text-right max-w-[50%] truncate">{value.join(":").trim() || "Verified"}</span>
                                            </div>
                                        );
                                    })}
                                </div>
                            ) : (
                                <div className="py-32 text-center bg-zinc-50/50 rounded-3xl border-2 border-dashed border-white">
                                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-sm border border-zinc-50">
                                        <ListTodo size={24} className="text-gray-200" />
                                    </div>
                                    <p className="text-gray-300 font-black uppercase tracking-widest text-[10px]">No intelligence data defined for this sequence.</p>
                                </div>
                            )}
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
                                                className="p-6 bg-white rounded-2xl border border-zinc-100 shadow-sm hover:shadow-xl hover:shadow-gray-100/30 transition-all duration-500 relative group"
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
