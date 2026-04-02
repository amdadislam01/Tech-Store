"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, TrendingUp, LayoutGrid, List, Menu } from "lucide-react";

const categories = ["All", "Smartphones", "Laptops", "Accessories", "Tablets", "Audio"];

interface CategoryGridProps {
  category: string;
  setCategory: (val: string) => void;
}

export default function CategoryGrid({ category, setCategory }: CategoryGridProps) {
  return (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-20"
    >
        {categories.map((cat, i) => (
            <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`group p-6 rounded-[32px] transition-all duration-500 border flex flex-col items-center gap-4 ${
                    category === cat 
                    ? "bg-primary text-white border-primary shadow-2xl shadow-primary/30 -translate-y-2" 
                    : "bg-white/80 backdrop-blur-xl text-gray-400 border-gray-100 hover:border-primary/30 hover:bg-white hover:shadow-xl hover:-translate-y-1"
                }`}
            >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                    category === cat ? "bg-white/20 text-white" : "bg-gray-50 text-gray-400 group-hover:text-primary"
                }`}>
                    {cat === "All" && <Sparkles size={22} />}
                    {cat === "Smartphones" && <Zap size={22} />}
                    {cat === "Laptops" && <TrendingUp size={22} />}
                    {cat === "Accessories" && <LayoutGrid size={22} />}
                    {cat === "Tablets" && <List size={22} />}
                    {cat === "Audio" && <Menu size={22} />}
                </div>
                <span className="text-[10px] font-black uppercase tracking-widest">{cat}</span>
            </button>
        ))}
    </motion.div>
  );
}
