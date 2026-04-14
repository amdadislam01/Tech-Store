"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { ProductSkeleton } from "@/components/Skeleton";

interface ProductCatalogProps {
  products: any[];
  loading: boolean;
  category: any;
  search: string;
  setCategory: (val: any) => void;
  setSearch: (val: string) => void;
  sort: string;
  setSort: (val: string) => void;
  columns?: number;
  limit?: number;
}

export default function ProductCatalog({ 
  products, 
  loading, 
  category, 
  search, 
  setCategory, 
  setSearch,
  sort,
  setSort,
  columns = 4,
  limit = 20
}: ProductCatalogProps) {
  
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring" as const,
        stiffness: 100
      }
    }
  };

  return (
    <>
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-6 md:gap-0"
        >
            <div>
                <h2 className="text-2xl font-bold text-[#1E293B] uppercase tracking-wide">Featured <span className="text-primary italic">Products</span></h2>
                <p className="text-gray-400 text-xs mt-1">Check & Select Your Desired Product!</p>
            </div>
            <div className="flex items-center gap-6 text-gray-500 text-sm font-bold md:border-l border-gray-100 md:pl-8">
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-primary" />
                    <span>{(Array.isArray(products) ? products : []).slice(0, limit).length} Items</span>
                </div>
                <div className="flex items-center gap-2 group relative">
                    <TrendingUp size={16} className="text-primary" />
                    <select 
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-sm font-bold text-gray-500 cursor-pointer hover:text-primary transition-colors appearance-none pr-4"
                    >
                        <option value="newest">Latest First</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none">
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-primary transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                        </svg>
                    </div>
                </div>
            </div>
        </motion.div>

        <AnimatePresence mode="wait">
            <motion.div 
                key={(typeof category === 'object' ? category._id : category) + search}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className={`grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 ${
                    columns === 5 ? "xl:grid-cols-5" : "xl:grid-cols-4"
                } gap-3 md:gap-6`}
            >
            {loading ? (
                Array.from({ length: limit }).map((_, i) => <ProductSkeleton key={i} />)
            ) : (Array.isArray(products) ? products : []).length > 0 ? (
                (Array.isArray(products) ? products : []).slice(0, limit).map((product: any) => (
                <motion.div key={product._id} variants={itemVariants}>
                    <ProductCard product={product} />
                </motion.div>
                ))
            ) : (
                <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="col-span-full py-32 text-center"
                >
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-[30px] mb-6 shadow-inner">
                    <Search size={40} className="text-gray-300" />
                </div>
                <h3 className="text-2xl font-black mb-2 text-foreground">No matches found</h3>
                <p className="text-gray-500 max-w-sm mx-auto">Try refining your search terms or exploring different categories.</p>
                <button 
                    onClick={() => {setCategory("All"); setSearch("");}}
                    className="mt-8 px-8 py-3 bg-primary/10 text-primary font-bold rounded-2xl hover:bg-primary hover:text-white transition-all shadow-sm"
                >
                    Reset All Filters
                </button>
                </motion.div>
            )}
            </motion.div>
        </AnimatePresence>
    </>
  );
}
