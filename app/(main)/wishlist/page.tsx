"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromWishlist, clearWishlist } from "@/redux/slices/wishlistSlice";
import { addToCart } from "@/redux/slices/cartSlice";
import { 
  Heart, 
  Trash2, 
  ShoppingCart, 
  ArrowLeft,
  PackageSearch,
  Sparkles
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";
import Swal from "sweetalert2";

export default function WishlistPage() {
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const dispatch = useDispatch();

  const handleMoveToCart = (product: any) => {
    dispatch(addToCart({ ...product, quantity: 1 }));
    dispatch(removeFromWishlist(product._id));
    toast.success("Moved to cart!");
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
    }
  };

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-16">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8 mb-16">
            <div className="flex items-center gap-4">
                <Link 
                    href="/" 
                    className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all text-gray-500"
                >
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight">My Wishlist</h1>
                    <p className="text-gray-500 mt-1 font-medium italic">Your personalized collection of tech marvels.</p>
                </div>
            </div>
            
            {wishlistItems.length > 0 && (
                <button 
                    onClick={async () => {
                        const result = await Swal.fire({
                            title: "Clear Wishlist?",
                            text: "Are you sure you want to clear your entire wishlist?",
                            icon: "warning",
                            showCancelButton: true,
                            confirmButtonColor: "#ef4444",
                            cancelButtonColor: "#64748b",
                            confirmButtonText: "Yes, clear it!"
                        });
                        if(result.isConfirmed) {
                            dispatch(clearWishlist());
                            toast.success("Wishlist cleared");
                        }
                    }}
                    className="px-6 py-3 bg-white text-red-500 rounded-2xl border border-red-100 font-bold hover:bg-red-50 transition-all flex items-center gap-2 text-sm"
                >
                    <Trash2 size={18} />
                    Clear Favorites
                </button>
            )}
        </div>

        <AnimatePresence mode="wait">
            {wishlistItems.length > 0 ? (
                <motion.div 
                    key="wishlist-grid"
                    variants={containerVariants}
                    initial="hidden"
                    animate="visible"
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
                >
                {wishlistItems.map((item) => (
                    <motion.div 
                        key={item._id}
                        variants={itemVariants}
                        className="group bg-white rounded-[32px] border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col h-full relative"
                    >
                        <div className="absolute top-4 right-4 z-10">
                            <button 
                                onClick={() => dispatch(removeFromWishlist(item._id))}
                                className="w-10 h-10 bg-white/80 backdrop-blur-md rounded-xl flex items-center justify-center text-red-500 shadow-sm border border-gray-100 hover:bg-red-500 hover:text-white transition-all shadow-red-500/10"
                            >
                                <Heart size={18} fill="currentColor" />
                            </button>
                        </div>

                        <Link href={`/product/${item._id}`} className="relative aspect-square overflow-hidden bg-gray-50/50 block group-hover:bg-white transition-colors duration-500">
                            <Image src={item.images?.[0] || item.image} alt={item.name} fill className="object-contain p-8 group-hover:scale-110 transition-transform duration-700 ease-out" />
                        </Link>

                        <div className="p-6 flex flex-col flex-grow">
                             <div className="mb-2">
                                <span className="text-[10px] font-black uppercase tracking-widest text-primary bg-primary/5 px-2 py-1 rounded-lg">
                                    {item.category}
                                </span>
                            </div>
                            <h3 className="font-bold text-foreground text-lg line-clamp-1 mb-4 group-hover:text-primary transition-colors">
                                {item.name}
                            </h3>
                            <div className="flex items-center justify-between mt-auto">
                                <span className="text-2xl font-black text-foreground tracking-tight">${item.price}</span>
                                <button 
                                    onClick={() => handleMoveToCart(item)}
                                    className="w-12 h-12 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary-dark transition-all transform active:scale-90 shadow-lg shadow-primary/20"
                                >
                                    <ShoppingCart size={20} />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                ))}
                </motion.div>
            ) : (
                <motion.div 
                    key="empty-wishlist"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="max-w-xl mx-auto py-32 text-center"
                >
                    <div className="w-24 h-24 bg-gray-100 rounded-[30px] flex items-center justify-center text-gray-300 mx-auto mb-8 shadow-inner">
                        <PackageSearch size={40} />
                    </div>
                    <h2 className="text-3xl font-black mb-4 text-foreground tracking-tight">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-12 font-medium">Browse our collection and save the devices that inspire your future workflow.</p>
                    <Link 
                        href="/" 
                        className="inline-flex items-center gap-3 px-10 py-4 bg-primary text-white font-black text-xs uppercase tracking-[3px] rounded-2xl shadow-2xl shadow-primary/30 hover:scale-105 active:scale-95 transition-all"
                    >
                        <Sparkles size={18} />
                        Explore Store
                    </Link>
                </motion.div>
            )}
        </AnimatePresence>
      </div>
    </div>
  );
}
