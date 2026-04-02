"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { ProductSkeleton } from "@/components/Skeleton";
import { Search, Filter, LayoutGrid, List, SlidersHorizontal, Sparkles, TrendingUp, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const categories = ["All", "Smartphones", "Laptops", "Accessories", "Tablets", "Audio"];

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState(initialSearch);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/products?category=${category}&search=${search}&page=${page}&limit=9`);
      const data = await res.json();
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
      setTotalProducts(data.totalProducts || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setPage(1); // Ensure navigation starts at page one when applying new filters
  }, [category, search]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [category, search, page]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-12 pb-24">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10 mb-4"
                >
                    <Sparkles size={12} />
                    <span>Premium Collection</span>
                </motion.div>
                <h1 className="text-4xl md:text-5xl font-black text-foreground tracking-tighter">Explore <span className="text-primary">Innovation</span></h1>
                <p className="text-gray-500 mt-2 font-medium">Discover the most advanced technology for your daily lifestyle.</p>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => setViewType("grid")}
                    className={`p-3 rounded-xl transition-all shadow-sm ${viewType === "grid" ? "bg-primary text-white" : "bg-white text-gray-400 border border-gray-100"}`}
                >
                    <LayoutGrid size={20} />
                </button>
                <button 
                    onClick={() => setViewType("list")}
                    className={`p-3 rounded-xl transition-all shadow-sm ${viewType === "list" ? "bg-primary text-white" : "bg-white text-gray-400 border border-gray-100"}`}
                >
                    <List size={20} />
                </button>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            <aside className="lg:col-span-1 space-y-10">
                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                        <Filter size={16} className="text-primary" />
                        Search Items
                    </h3>
                    <div className="relative group">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
                        <input 
                            type="text" 
                            placeholder="Find tech..." 
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-12 pr-4 py-4 bg-white border border-gray-100 rounded-2xl focus:ring-4 focus:ring-primary/10 focus:border-primary transition-all text-sm font-bold shadow-sm"
                        />
                    </div>
                </div>

                <div>
                    <h3 className="text-sm font-black uppercase tracking-widest text-foreground mb-6 flex items-center gap-2">
                        <SlidersHorizontal size={16} className="text-primary" />
                        Categories
                    </h3>
                    <div className="flex flex-col gap-2">
                        {categories.map((cat) => (
                            <button
                                key={cat}
                                onClick={() => setCategory(cat)}
                                className={`flex items-center justify-between px-5 py-4 rounded-2xl text-sm font-bold transition-all border ${
                                    category === cat 
                                    ? "bg-primary text-white border-primary shadow-xl shadow-primary/20 scale-[1.02]" 
                                    : "bg-white text-gray-500 hover:bg-gray-50 border-gray-100"
                                }`}
                            >
                                <span>{cat}</span>
                                {category === cat && <Zap size={14} className="fill-white" />}
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="bg-gray-900 rounded-[30px] p-8 text-white relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <Sparkles className="text-yellow-400 mb-4" />
                    <h4 className="text-lg font-black tracking-tight mb-2">Member Rewards</h4>
                    <p className="text-gray-400 text-xs font-medium leading-relaxed mb-6">Join our loyalty program and save up to 15% on your first flagship purchase.</p>
                    <button className="w-full py-3 bg-white text-gray-900 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95">Enroll Now</button>
                </div>
            </aside>

            <main className="lg:col-span-3">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-500">Showing <span className="text-foreground">{totalProducts}</span> revolutionary devices</p>
                    <select className="bg-transparent border-none focus:ring-0 text-sm font-black text-foreground cursor-pointer">
                        <option>Newest Arrivals</option>
                        <option>Price: Low to High</option>
                        <option>Price: High to Low</option>
                    </select>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={category + search + viewType}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={viewType === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8" : "flex flex-col gap-6"}
                    >
                    {loading ? (
                        Array.from({ length: 6 }).map((_, i) => <ProductSkeleton key={i} />)
                    ) : products.length > 0 ? (
                        products.map((product: any) => (
                          <ProductCard key={product._id} product={product} />
                        ))
                    ) : (
                        <div className="col-span-full py-32 text-center bg-white rounded-[40px] border border-gray-100 border-dashed">
                            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-50 rounded-3xl mb-4">
                                <Search size={32} className="text-gray-200" />
                            </div>
                            <h3 className="text-xl font-black text-foreground">No matches found</h3>
                            <p className="text-gray-400 text-xs font-medium max-w-[200px] mx-auto mt-2">Try adjusting your filters or search terms.</p>
                        </div>
                    )}
                    </motion.div>
                </AnimatePresence>

                {totalPages > 1 && (
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center justify-center gap-2 mt-16"
                    >
                        <button
                            disabled={page === 1}
                            onClick={() => setPage(prev => Math.max(1, prev - 1))}
                            className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:border-gray-100 transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                            Previous
                        </button>
                        
                        <div className="flex items-center gap-1 mx-4">
                            {Array.from({ length: totalPages }).map((_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => setPage(i + 1)}
                                    className={`w-10 h-10 rounded-xl text-[10px] font-black transition-all cursor-pointer ${
                                        page === i + 1 
                                        ? "bg-primary text-white shadow-lg shadow-primary/20 scale-110" 
                                        : "bg-white text-gray-400 border border-gray-100 hover:bg-gray-50"
                                    }`}
                                >
                                    {i + 1}
                                </button>
                            ))}
                        </div>

                        <button
                            disabled={page === totalPages}
                            onClick={() => setPage(prev => Math.min(totalPages, prev + 1))}
                            className="px-6 py-3 bg-white border border-gray-100 rounded-xl text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-primary hover:border-primary disabled:opacity-30 disabled:hover:text-gray-500 disabled:hover:border-gray-100 transition-all shadow-sm active:scale-95 cursor-pointer"
                        >
                            Next
                        </button>
                    </motion.div>
                )}
            </main>
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen bg-[#F8FAFC]" />}>
            <ProductsContent />
        </Suspense>
    );
}
