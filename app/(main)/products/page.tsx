"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import ProductCard from "@/components/ProductCard";
import { ProductSkeleton } from "@/components/Skeleton";
import { Search, Filter, LayoutGrid, List, SlidersHorizontal, Sparkles, TrendingUp, Zap, ChevronRight } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// Dynamic categories fetched from API

function ProductsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("search") || "";
  
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState<any[]>([{ _id: "All", name: "All" }]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState<any>("All");
  const [search, setSearch] = useState(initialSearch);
  const [viewType, setViewType] = useState<"grid" | "list">("grid");
  
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalProducts, setTotalProducts] = useState(0);
  const [sort, setSort] = useState("newest");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [hoveredParent, setHoveredParent] = useState<string | null>(null);
  const [structuredCategories, setStructuredCategories] = useState<any[]>([]);

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (Array.isArray(data)) {
        setCategories(data);
        
        // Build structure: Parents (parent === null)
        const parents = data.filter((cat: any) => !cat.parent);
        const structured = parents.map((parent: any) => ({
          ...parent,
          children: data.filter((child: any) => child.parent?.toString() === parent._id.toString())
        }));
        
        setStructuredCategories(structured);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const categoryId = typeof category === "object" ? category._id : category;
      const res = await fetch(`/api/products?category=${categoryId}&search=${search}&page=${page}&limit=8&sort=${sort}&minPrice=${minPrice}&maxPrice=${maxPrice}`);
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
    fetchCategories();
  }, []);

  useEffect(() => {
    setSearch(initialSearch);
  }, [initialSearch]);

  useEffect(() => {
    setPage(1); // Ensure navigation starts at page one when applying new filters
  }, [category, search, sort, minPrice, maxPrice]);

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchProducts();
    }, 300);
    return () => clearTimeout(timer);
  }, [category, search, page, sort, minPrice, maxPrice]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pt-12 pb-24">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
            <div>

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

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 md:gap-12">
            <aside className="lg:col-span-1 space-y-8">
                <div className="bg-white rounded-[32px] border border-gray-100/50 shadow-sm p-8 space-y-10">
                    {/* Search Section */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[2px] text-slate-400 mb-6 flex items-center gap-2">
                             <Search size={14} /> Search
                        </h3>
                        <div className="relative group">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                            <input 
                                type="text" 
                                placeholder="Search products..." 
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                className="w-full pl-12 pr-4 py-3.5 bg-gray-50/50 border border-transparent rounded-2xl focus:bg-white focus:border-primary transition-all text-sm font-semibold outline-none"
                            />
                        </div>
                    </div>

                    {/* Category List */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[2px] text-slate-400 mb-6 flex items-center gap-2">
                            <SlidersHorizontal size={14} /> Shop by Category
                        </h3>
                        <div className="flex flex-col gap-1.5 relative">
                            {/* All Category */}
                            <button
                                onClick={() => setCategory("All")}
                                className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                                    category === "All" 
                                    ? "bg-primary/5 text-primary" 
                                    : "text-slate-500 hover:bg-gray-50 hover:text-slate-900"
                                }`}
                            >
                                <div className="flex items-center gap-3">
                                    <div className={`w-1.5 h-1.5 rounded-full transition-all ${category === "All" ? "bg-primary scale-125" : "bg-transparent group-hover:bg-gray-300"}`} />
                                    <span>All Products</span>
                                </div>
                                {category === "All" && <Zap size={12} className="fill-primary text-primary" />}
                            </button>

                            {/* Hierarchical Categories */}
                            {structuredCategories.map((cat) => {
                                const isActive = typeof category === "object" ? category._id === cat._id : category === cat._id;
                                const hasChildren = cat.children && cat.children.length > 0;
                                
                                return (
                                    <div 
                                        key={cat._id}
                                        className="relative group/parent"
                                        onMouseEnter={() => setHoveredParent(cat._id)}
                                        onMouseLeave={() => setHoveredParent(null)}
                                    >
                                        <button
                                            onClick={() => setCategory(cat)}
                                            className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all group ${
                                                isActive 
                                                ? "bg-primary/5 text-primary" 
                                                : "text-slate-500 hover:bg-gray-50 hover:text-slate-900"
                                            }`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <div className={`w-1.5 h-1.5 rounded-full transition-all ${isActive ? "bg-primary scale-125" : "bg-transparent group-hover:bg-gray-300"}`} />
                                                <span>{cat.name}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                {isActive && <Zap size={12} className="fill-primary text-primary" />}
                                                {hasChildren && <ChevronRight size={14} className={`text-slate-300 transition-transform ${hoveredParent === cat._id ? "rotate-90 md:rotate-0 md:translate-x-1" : ""}`} />}
                                            </div>
                                        </button>

                                        {/* Sub-category Fly-out / Dropdown */}
                                        <AnimatePresence>
                                            {hasChildren && hoveredParent === cat._id && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: -10, y: 0 }}
                                                    animate={{ opacity: 1, x: 10, y: 0 }}
                                                    exit={{ opacity: 0, x: -10, y: 0 }}
                                                    className="md:absolute top-0 md:left-full z-[100] md:pl-2 w-full md:w-64"
                                                >
                                                    <div className="bg-white rounded-2xl border border-gray-100 shadow-2xl p-2 ml-4 md:ml-0">
                                                        {cat.children.map((child: any) => {
                                                            const isChildActive = typeof category === "object" && category._id === child._id;
                                                            return (
                                                                <button
                                                                    key={child._id}
                                                                    onClick={() => setCategory(child)}
                                                                    className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                                                                        isChildActive 
                                                                        ? "bg-primary/5 text-primary" 
                                                                        : "text-slate-500 hover:bg-gray-50 hover:text-slate-900"
                                                                    }`}
                                                                >
                                                                    <span>{child.name}</span>
                                                                    {isChildActive && <Zap size={10} className="fill-primary text-primary" />}
                                                                </button>
                                                            );
                                                        })}
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Price Range */}
                    <div>
                        <h3 className="text-xs font-bold uppercase tracking-[2px] text-slate-400 mb-6 flex items-center gap-2">
                            <TrendingUp size={14} /> Price Range
                        </h3>
                        <div className="grid grid-cols-2 gap-3 mb-4">
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Min (৳)</label>
                                <input 
                                    type="number" 
                                    placeholder="0"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-transparent rounded-xl focus:bg-white focus:border-primary transition-all text-sm font-bold outline-none"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-[10px] font-bold text-slate-400 uppercase tracking-wider ml-1">Max (৳)</label>
                                <input 
                                    type="number" 
                                    placeholder="50k+"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full px-4 py-3 bg-gray-50/50 border border-transparent rounded-xl focus:bg-white focus:border-primary transition-all text-sm font-bold outline-none"
                                />
                            </div>
                        </div>
                        {(minPrice || maxPrice) && (
                            <button 
                                onClick={() => { setMinPrice(""); setMaxPrice(""); }}
                                className="text-[10px] font-bold text-primary hover:underline uppercase tracking-widest"
                            >
                                Reset Price
                            </button>
                        )}
                    </div>
                </div>
                
                <div className="bg-slate-900 rounded-[32px] p-8 text-white relative overflow-hidden group shadow-xl">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full -mr-16 -mt-16 blur-2xl group-hover:scale-150 transition-transform duration-700" />
                    <Sparkles className="text-yellow-400 mb-4" />
                    <h4 className="text-lg font-black tracking-tight mb-2 uppercase">Member Rewards</h4>
                    <p className="text-gray-400 text-[10px] font-bold uppercase tracking-widest leading-relaxed mb-6">Join our loyalty program and save up to 15%.</p>
                    <button className="w-full py-4 bg-white text-slate-900 rounded-2xl text-[10px] font-black uppercase tracking-[2px] hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95">Enroll Now</button>
                </div>
            </aside>

            <main className="lg:col-span-3">
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-100">
                    <p className="text-sm font-bold text-gray-500">Showing <span className="text-foreground">{totalProducts}</span> revolutionary devices</p>
                    <select 
                        value={sort}
                        onChange={(e) => setSort(e.target.value)}
                        className="bg-transparent border-none focus:ring-0 text-sm font-black text-foreground cursor-pointer"
                    >
                        <option value="newest">Newest Arrivals</option>
                        <option value="price-asc">Price: Low to High</option>
                        <option value="price-desc">Price: High to Low</option>
                    </select>
                </div>

                <AnimatePresence mode="wait">
                    <motion.div 
                        key={category + search + viewType}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className={viewType === "grid" ? "grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 md:gap-6" : "flex flex-col gap-6"}
                    >
                    {loading ? (
                        Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)
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
