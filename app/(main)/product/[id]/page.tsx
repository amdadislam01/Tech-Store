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

  // Calculate review distribution
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
      {/* Decorative backdrop */}
      <div className="absolute top-0 left-0 w-full h-[60vh] bg-gradient-to-b from-zinc-50 to-transparent -z-10" />
      
      <div className="container-custom py-12">
        <Link href="/" className="inline-flex items-center gap-3 text-gray-400 hover:text-primary transition-all mb-12 group font-black text-[10px] uppercase tracking-widest">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          <span>Back to Collection</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-24">
            {/* Left Column: Media Gallery */}
            <div className="lg:col-span-7">
                <div className="sticky top-12 space-y-8">
                    <motion.div 
                        layoutId={`product-img-${product._id}`}
                        className="relative aspect-square w-full bg-zinc-50 rounded-[4rem] overflow-hidden group shadow-2xl shadow-gray-200/50 border border-white"
                    >
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeImage}
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                transition={{ duration: 0.5 }}
                                className="absolute inset-0 p-16 md:p-24"
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
                        
                        {/* Interactive floating badge */}
                        <div className="absolute bottom-8 left-8">
                             <div className="bg-white/80 backdrop-blur-xl px-6 py-3 rounded-2xl shadow-xl border border-white/50 flex items-center gap-3">
                                 <Sparkles size={16} className="text-primary animate-pulse" />
                                 <span className="text-[10px] font-black uppercase tracking-widest text-foreground">Premium Build</span>
                             </div>
                        </div>
                    </motion.div>

                    {product.images && product.images.length > 1 && (
                        <div className="flex gap-6 overflow-x-auto pb-4 no-scrollbar">
                            {product.images.map((img: string, idx: number) => (
                                <button
                                    key={idx}
                                    onClick={() => setActiveImage(img)}
                                    className={`relative w-24 h-24 rounded-3xl overflow-hidden border-4 transition-all duration-500 flex-shrink-0 ${
                                        activeImage === img ? "border-primary scale-105 shadow-2xl shadow-primary/20" : "border-transparent opacity-40 hover:opacity-100 hover:scale-110"
                                    }`}
                                >
                                    <Image src={img} alt={`${product.name} ${idx + 1}`} fill className="object-cover" />
                                </button>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Right Column: Product Intelligence */}
            <div className="lg:col-span-5 flex flex-col pt-4">
                <div className="flex flex-wrap items-center gap-3 mb-8">
                    <span className="bg-primary/10 text-primary px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em] border border-primary/5">
                        {product.category}
                    </span>
                    {product.brand && (
                        <span className="bg-zinc-100 text-gray-500 px-5 py-2 rounded-2xl text-[10px] font-black uppercase tracking-[0.2em]">
                            {product.brand}
                        </span>
                    )}
                </div>

                <h1 className="text-5xl md:text-6xl font-black text-foreground mb-6 leading-[1.1] tracking-tighter">
                   {product.name}
                </h1>

                <div className="flex items-center gap-6 mb-10 pb-10 border-b border-gray-100">
                    <div className="flex items-center gap-2.5">
                        <div className="flex text-yellow-400">
                            {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} size={18} fill={product.avgRating >= s ? "currentColor" : "none"} className={product.avgRating >= s ? "" : "text-gray-200"} />
                            ))}
                        </div>
                        <span className="text-lg font-black text-foreground">{product.avgRating?.toFixed(1) || "5.0"}</span>
                    </div>
                    <div className="h-4 w-px bg-gray-200" />
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400">
                        {product.numReviews || 0} Verifications
                    </span>
                </div>

                <p className="text-lg text-gray-500 leading-relaxed font-medium mb-12">
                   {product.description || "Synthesizing cutting-edge technology with high-end aesthetic performance."}
                </p>

                <div className="flex items-baseline gap-2 mb-12">
                    <span className="text-xs font-black uppercase text-gray-400 tracking-widest">$</span>
                    <span className="text-6xl font-black text-foreground tracking-tighter">
                        {product.price ? product.price.toLocaleString() : "0"}
                    </span>
                    <span className="text-xs font-black uppercase text-gray-400 tracking-widest ml-2">USD</span>
                </div>

                <div className="space-y-6 mb-12">
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-6 bg-zinc-50 rounded-[2.5rem] border border-white hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                             <ShieldCheck className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} />
                             <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-1">Authentic</h4>
                             <p className="text-[10px] font-bold text-gray-400">Original Components</p>
                        </div>
                        <div className="p-6 bg-zinc-50 rounded-[2.5rem] border border-white hover:bg-white hover:shadow-2xl transition-all duration-500 group">
                             <Truck className="text-primary mb-4 group-hover:scale-110 transition-transform" size={28} />
                             <h4 className="text-xs font-black uppercase tracking-widest text-foreground mb-1">Global</h4>
                             <p className="text-[10px] font-bold text-gray-400">Express Deployment</p>
                        </div>
                    </div>
                </div>

                <div className="flex gap-4 mt-auto">
                    <button 
                        onClick={() => {
                            dispatch(addToCart(product));
                            toast.success("Identity synthesized in cart!");
                        }}
                        className="flex-[4] bg-foreground text-white py-6 rounded-[3rem] font-black text-xs uppercase tracking-[0.3em] flex items-center justify-center gap-4 hover:bg-primary transition-all duration-500 shadow-2xl hover:shadow-primary/30"
                    >
                        <ShoppingCart size={20} />
                        Order Now
                    </button>
                    <button 
                        onClick={handleToggleWishlist}
                        className={`flex-[1] rounded-[3rem] flex items-center justify-center transition-all duration-500 border-2 ${
                            isInWishlist ? "bg-red-500 border-red-500 text-white shadow-xl shadow-red-200" : "bg-white border-zinc-100 text-gray-300 hover:text-red-500 hover:border-red-100"
                        }`}
                    >
                        <Heart size={24} fill={isInWishlist ? "currentColor" : "none"} />
                    </button>
                </div>
            </div>
        </div>

        {/* Dynamic Context Tabs */}
        <div className="mt-32">
             <div className="flex justify-center border-b border-gray-100 mb-16 overflow-x-auto no-scrollbar gap-12">
                {[
                    { id: "description", label: "Overview", icon: FileText },
                    { id: "specs", label: "Intelligence", icon: ListTodo },
                    { id: "reviews", label: "Validation", icon: MessageSquare }
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={`relative py-8 text-[11px] font-black uppercase tracking-[0.3em] transition-all whitespace-nowrap flex items-center gap-3 ${
                            activeTab === tab.id ? "text-primary" : "text-gray-400 hover:text-gray-600"
                        }`}
                    >
                        <tab.icon size={16} />
                        {tab.label}
                        {activeTab === tab.id && (
                            <motion.div 
                                layoutId="activeTab"
                                className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full"
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
                            className="space-y-12"
                        >
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
                                <div>
                                    <h3 className="text-4xl font-black text-foreground mb-8 tracking-tighter leading-tight">Crafting the future of performance.</h3>
                                    <p className="text-gray-500 text-lg leading-[2] font-medium">
                                        {product.description}
                                    </p>
                                </div>
                                <div className="relative aspect-[4/3] bg-zinc-50 rounded-[4rem] overflow-hidden p-12 flex items-center justify-center border border-white">
                                    <MessageSquare size={120} className="text-zinc-100 absolute -bottom-10 -right-10" />
                                    <div className="text-center relative z-10">
                                        <Clock className="mx-auto mb-6 text-primary" size={40} />
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Time-Tested Architecture</p>
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
                                <div className="bg-zinc-50 rounded-[4rem] p-16 md:p-24 border border-white relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 p-12 opacity-5 group-hover:opacity-10 transition-opacity">
                                        <ListTodo size={200} />
                                    </div>
                                    <p className="text-gray-600 leading-[2.2] whitespace-pre-line font-medium text-xl italic relative z-10 tracking-tight">
                                        {product.specifications}
                                    </p>
                                </div>
                            ) : (
                                <div className="py-32 text-center">
                                    <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-xs">No intelligence data defined for this sequence.</p>
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
                            className="grid grid-cols-1 lg:grid-cols-12 gap-20"
                        >
                            {/* Review Stats & Form */}
                            <div className="lg:col-span-5 space-y-12">
                                {/* Rating Summary */}
                                <div className="bg-zinc-50 p-12 rounded-[4rem] border border-white shadow-xl shadow-gray-100/50">
                                    <div className="text-center mb-10">
                                        <h2 className="text-7xl font-black text-foreground tracking-tighter mb-2">{product.avgRating?.toFixed(1) || "5.0"}</h2>
                                        <div className="flex justify-center text-yellow-400 mb-4">
                                            {[1, 2, 3, 4, 5].map((s) => (
                                                <Star key={s} size={24} fill={product.avgRating >= s ? "currentColor" : "none"} className={product.avgRating >= s ? "" : "text-gray-200"} />
                                            ))}
                                        </div>
                                        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400">Global Satisfaction</p>
                                    </div>
                                    
                                    <div className="space-y-4">
                                        {reviewStats?.map((stat, i) => (
                                            <div key={i} className="flex items-center gap-4">
                                                <span className="text-[10px] font-black text-gray-400 w-4">{5 - i}</span>
                                                <div className="flex-1 h-2 bg-white rounded-full overflow-hidden border border-gray-100">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ width: `${stat.percentage}%` }}
                                                        transition={{ duration: 1, delay: i * 0.1 }}
                                                        className="h-full bg-primary" 
                                                    />
                                                </div>
                                                <span className="text-[10px] font-bold text-gray-500 w-8">{stat.percentage.toFixed(0)}%</span>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                {/* Form Section */}
                                <div className="relative p-12 bg-white rounded-[4rem] border border-zinc-100 shadow-2xl shadow-gray-100/50">
                                    <h3 className="text-2xl font-black text-foreground mb-10 tracking-tighter">Contributor Feedback</h3>
                                    {session ? (
                                        <form onSubmit={handleReviewSubmit} className="space-y-10">
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-6">Experience Rating</label>
                                                <div className="flex gap-3">
                                                    {[1, 2, 3, 4, 5].map((s) => (
                                                        <button
                                                            key={s}
                                                            type="button"
                                                            onClick={() => setRating(s)}
                                                            className={`w-14 h-14 rounded-3xl flex items-center justify-center transition-all duration-500 ${
                                                                rating >= s ? "bg-primary text-white shadow-xl shadow-primary/20 scale-110" : "bg-zinc-50 text-gray-300 border border-white hover:bg-white"
                                                            }`}
                                                        >
                                                            <Star size={20} fill={rating >= s ? "currentColor" : "none"} />
                                                        </button>
                                                    ))}
                                                </div>
                                            </div>
                                            <div>
                                                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 block mb-6">Subjective Analysis</label>
                                                <textarea
                                                    required
                                                    rows={5}
                                                    value={comment}
                                                    onChange={(e) => setComment(e.target.value)}
                                                    className="w-full bg-zinc-50 border border-white rounded-[2.5rem] p-8 focus:ring-8 focus:ring-primary/5 focus:bg-white transition-all text-sm font-medium outline-none"
                                                    placeholder="Synthesize your thoughts here..."
                                                />
                                            </div>
                                            <button
                                                type="submit"
                                                disabled={submittingReview}
                                                className="w-full bg-foreground text-white py-6 rounded-[2.5rem] font-black text-xs uppercase tracking-[0.3em] shadow-2xl hover:bg-primary transition-all duration-500 disabled:opacity-50 active:scale-95"
                                            >
                                                {submittingReview ? "Processing Data..." : "Transmit Review"}
                                            </button>
                                        </form>
                                    ) : (
                                        <div className="py-12 text-center">
                                            <p className="text-gray-400 mb-8 font-bold text-sm tracking-tight">Identity verification required for validation.</p>
                                            <Link href="/login" className="inline-block px-10 py-4 bg-zinc-900 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary transition-all shadow-xl">
                                                Initiate Sign In
                                            </Link>
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Feed Section */}
                            <div className="lg:col-span-7">
                                <div className="space-y-10">
                                    <div className="flex items-center justify-between mb-12">
                                        <h3 className="text-3xl font-black text-foreground tracking-tighter">Verified Transmissions</h3>
                                        <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">{product.reviews?.length || 0} Entries</span>
                                    </div>
                                    
                                    {product.reviews && product.reviews.length > 0 ? (
                                        product.reviews.map((rev: any, idx: number) => (
                                            <motion.div 
                                                layout
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.1 }}
                                                key={idx} 
                                                className="p-10 bg-white rounded-[3.5rem] border border-zinc-100 shadow-sm hover:shadow-2xl hover:shadow-gray-100 transition-all duration-700 relative group overflow-hidden"
                                            >
                                                <div className="absolute top-0 right-0 p-8 opacity-0 group-hover:opacity-5 transition-opacity">
                                                    <Sparkles size={80} />
                                                </div>
                                                <div className="flex items-center justify-between mb-8">
                                                    <div className="flex items-center gap-5">
                                                        <div className="w-16 h-16 bg-gradient-to-br from-primary/20 to-primary/5 rounded-[2rem] flex items-center justify-center text-primary font-black text-2xl shadow-inner group-hover:rotate-6 transition-transform">
                                                            {rev.name.charAt(0)}
                                                        </div>
                                                        <div>
                                                            <h4 className="text-lg font-black text-foreground mb-1">{rev.name}</h4>
                                                            <div className="flex items-center gap-3">
                                                                <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-3 py-1 rounded-full">Explorer</span>
                                                                <span className="text-[9px] text-gray-300 font-bold uppercase tracking-widest">{formatDate(rev.createdAt)}</span>
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="flex text-yellow-400 gap-0.5">
                                                        {Array.from({ length: 5 }).map((_, i) => (
                                                            <Star key={i} size={16} fill={i < rev.rating ? "currentColor" : "none"} className={i < rev.rating ? "" : "text-gray-100"} />
                                                        ))}
                                                    </div>
                                                </div>
                                                <div className="p-8 bg-zinc-50 border border-white rounded-[2.5rem] relative">
                                                    <MessageSquare size={20} className="absolute -top-3 -left-3 text-primary opacity-20" />
                                                    <p className="text-gray-600 font-medium leading-[1.8] text-lg tracking-tight">
                                                        {rev.comment}
                                                    </p>
                                                </div>
                                            </motion.div>
                                        ))
                                    ) : (
                                        <div className="py-40 text-center bg-zinc-50 rounded-[5rem] border-4 border-dashed border-white shadow-inner">
                                            <div className="w-24 h-24 bg-white rounded-[3rem] flex items-center justify-center mx-auto mb-10 shadow-xl border border-white">
                                                <MessageSquare size={40} className="text-gray-100" />
                                            </div>
                                            <p className="text-gray-300 font-black uppercase tracking-[0.4em] text-xs">Be the first to synthesize feedback.</p>
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
