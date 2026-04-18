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
    regularPrice?: number;
    image: string;
    images?: string[];
    category: any;
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
        className="group relative bg-white rounded-lg border border-gray-50 overflow-hidden transition-all duration-300 flex flex-col h-full hover:shadow-lg"
    >
      {/* Save Badge - Star Tech style */}
      <div className="absolute top-2 left-2 z-20 pointer-events-none">
          <div className="bg-[#6e2594] text-white px-3 py-1 rounded-full text-[10px] font-bold shadow-sm">
              Save: ৳{Math.floor(product.price * 0.1)}
          </div>
      </div>

      {/* Wishlist Button */}
      <div className="absolute top-2 right-2 z-20">
          <motion.button 
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={handleToggleWishlist}
            className={`w-10 h-10 rounded-full flex items-center justify-center transition-all bg-white/90 backdrop-blur-sm border border-gray-100 shadow-sm ${
                isInWishlist ? "text-red-500" : "text-gray-300 hover:text-red-500"
            }`}
          >
            <Heart size={18} fill={isInWishlist ? "currentColor" : "none"} />
          </motion.button>
      </div>

      {/* Product Image */}
      <Link href={`/product/${product._id}`} className="relative aspect-[5/4] overflow-hidden bg-white border-b border-gray-50 flex items-center justify-center">
        <Image
          src={product.images?.[0] || product.image || "/placeholder.png"}
          alt={product.name}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-contain p-4 group-hover:scale-105 transition-transform duration-500"
        />
      </Link>
      
      {/* Content Area */}
      <div className="p-3 flex flex-col flex-grow">
        <div className="flex items-center justify-between mb-1.5">
            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-wider">{product.brand || "Tech Store"}</span>
            <div className="flex items-center gap-1">
                <Star size={9} className="fill-yellow-400 text-yellow-400" />
                <span className="text-[10px] text-gray-600 font-bold">{product.avgRating?.toFixed(1) || "5.0"}</span>
            </div>
        </div>
        
        <Link href={`/product/${product._id}`} className="text-[13px] font-bold text-slate-800 mb-2 group-hover:text-primary transition-colors line-clamp-2 leading-tight h-8">
          {product.name}
        </Link>
        

 
        {/* Pricing & Cart */}
        <div className="mt-auto pt-2 flex items-center justify-between">
          <div className="flex flex-col">
            <span className="text-base font-bold text-[#ef4444]">
                ৳{product.price ? product.price.toLocaleString() : "0"}
            </span>
            <span className="text-[10px] text-gray-400 line-through">
                ৳{product.regularPrice 
                  ? product.regularPrice.toLocaleString() 
                  : Math.floor(product.price * 1.1).toLocaleString()
                }
            </span>
          </div>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleAddToCart}
            className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-primary hover:text-white transition-all"
          >
            <ShoppingCart size={16} />
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;
