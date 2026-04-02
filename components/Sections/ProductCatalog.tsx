"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Zap, TrendingUp, Search } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { ProductSkeleton } from "@/components/Skeleton";

interface ProductCatalogProps {
  products: any[];
  loading: boolean;
  category: string;
  search: string;
  setCategory: (val: string) => void;
  setSearch: (val: string) => void;
}

export default function ProductCatalog({ 
  products, 
  loading, 
  category, 
  search, 
  setCategory, 
  setSearch 
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
            className="flex items-center justify-between mb-12"
        >
            <div>
                <h2 className="text-4xl font-black text-[#1E293B] tracking-tighter">Flagship <span className="text-primary italic">Catalog</span></h2>
                <p className="text-gray-500 font-medium mt-1">Discover our hand-picked selection of high-performance tech.</p>
            </div>
            <div className="flex items-center gap-6 text-gray-500 text-sm font-bold border-l border-gray-100 pl-8">
                <div className="flex items-center gap-2">
                    <Zap size={16} className="text-primary" />
                    <span>{products.slice(0, 4).length} Items</span>
                </div>
                <div className="flex items-center gap-2">
                    <TrendingUp size={16} className="text-primary" />
                    <span>Latest First</span>
                </div>
            </div>
        </motion.div>

        <AnimatePresence mode="wait">
            <motion.div 
                key={category + search}
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10"
            >
            {loading ? (
                Array.from({ length: 4 }).map((_, i) => <ProductSkeleton key={i} />)
            ) : products.length > 0 ? (
                products.slice(0, 4).map((product: any) => (
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
