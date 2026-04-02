"use client";

import Image from "next/image";
import Link from "next/link";
import { useSelector, useDispatch } from "react-redux";
import { addToCart } from "@/redux/slices/cartSlice";
import { addToWishlist, removeFromWishlist } from "@/redux/slices/wishlistSlice";
import { RootState } from "@/redux/store";
import { ShoppingCart, Eye, Star, Heart } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface ProductProps {
  product: {
    _id: string;
    name: string;
    price: number;
    image: string;
    images?: string[];
    category: string;
    description: string;
    brand?: string;
    avgRating?: number;
    numReviews?: number;
  };
}

const ProductCard = ({ product }: ProductProps) => {
  const dispatch = useDispatch();
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const isInWishlist = wishlistItems.some((item) => item._id === product._id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    dispatch(addToCart(product as any));
    toast.success(`${product.name} added to cart!`);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    if (isInWishlist) {
      dispatch(removeFromWishlist(product._id));
      toast.success("Removed from wishlist");
    } else {
      dispatch(addToWishlist(product as any));
      toast.success("Added to wishlist!");
    }
  };

  return (
    <motion.div 
        layout
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -8 }}
        className="group relative bg-white rounded-[2.5rem] border border-gray-100 overflow-hidden transition-all duration-500 flex flex-col h-full shadow-premium hover:shadow-premium-hover"
    >
      <div className="absolute top-5 left-5 z-20 flex flex-col gap-2 pointer-events-none">
          <div className="glass-morphism px-4 py-2 rounded-2xl shadow-sm flex items-center gap-2">
              <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-widest text-foreground/80">
                  {product.category}
              </span>
          </div>
          {product.brand && (
              <div className="bg-foreground/5 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/20">
                  <span className="text-[9px] font-bold uppercase tracking-[0.2em] text-gray-500">
                      {product.brand}
                  </span>
              </div>
          )}
      </div>

      {/* Floating Action (Wishlist) */}
      <div className="absolute top-5 right-5 z-20">
          <motion.button 
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleWishlist}
            className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all shadow-lg border border-white/50 backdrop-blur-xl ${
                isInWishlist ? "bg-red-500 text-white shadow-red-200" : "bg-white/80 text-gray-400 hover:text-red-500"
            }`}
          >
            <Heart size={20} fill={isInWishlist ? "currentColor" : "none"} />
          </motion.button>
      </div>

      <Link href={`/product/${product._id}`} className="relative aspect-[1/1] overflow-hidden bg-zinc-50 group-hover:bg-white transition-colors duration-700">
        <Image
          src={product.images?.[0] || product.image || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-12 group-hover:scale-105 transition-transform duration-1000 ease-in-out"
        />
        
        {/* Quick Insights Overlay */}
        <div className="absolute inset-x-5 bottom-5 flex justify-center translate-y-12 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
            <div className="bg-foreground text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 shadow-2xl">
                <Eye size={14} />
                Explore Innovation
            </div>
        </div>
      </Link>
      
      <div className="p-8 flex flex-col flex-grow">
        <div className="flex items-center gap-4 mb-6">
            <div className="flex items-center gap-1.5 bg-yellow-400/10 px-3 py-1.5 rounded-xl border border-yellow-400/10">
                <Star size={12} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-yellow-700 font-black">{product.avgRating?.toFixed(1) || "5.0"}</span>
            </div>
            {(product.numReviews ?? 0) > 0 && (
                <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">
                    {product.numReviews} Verified Reviews
                </span>
            )}
        </div>
        
        <Link href={`/product/${product._id}`} className="text-2xl font-black text-foreground mb-4 group-hover:text-primary transition-colors line-clamp-1 leading-tight tracking-tight">
          {product.name}
        </Link>
        
        <p className="text-sm text-gray-500/80 line-clamp-2 mb-8 font-medium leading-[1.8]">
            {product.description || "Synthesizing cutting-edge technology with high-end aesthetic performance."}
        </p>

        <div className="mt-auto flex items-end justify-between pt-8 border-t border-gray-50">
          <div className="flex flex-col">
            <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest mb-1">Investment</span>
            <span className="text-3xl font-black text-foreground tracking-tighter">
                ${product.price ? product.price.toLocaleString() : "0"}
            </span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="group/btn relative w-16 h-16 bg-primary text-white rounded-3xl flex items-center justify-center shadow-xl shadow-primary/20 overflow-hidden"
          >
            <div className="absolute inset-0 bg-primary-dark translate-y-full group-hover/btn:translate-y-0 transition-transform duration-300" />
            <ShoppingCart size={24} className="relative z-10" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
