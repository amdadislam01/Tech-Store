"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, TrendingUp, LayoutGrid, List, Menu, Box } from "lucide-react";

interface CategoryGridProps {
  category: string;
  setCategory: (val: string) => void;
  categories: string[];
}

export default function CategoryGrid({ category, setCategory, categories }: CategoryGridProps) {
  const getIcon = (cat: string) => {
    switch (cat) {
        case "All": return <Sparkles size={24} />;
        case "Smartphones": return <Zap size={24} />;
        case "Laptops": return <TrendingUp size={24} />;
        case "Accessories": return <LayoutGrid size={24} />;
        case "Tablets": return <List size={24} />;
        case "Audio": return <Menu size={24} />;
        default: return <Box size={24} />;
    }
  };

  return (
    <div className="mb-12">
        <h2 className="text-xl font-bold text-center mb-8 uppercase tracking-widest text-[#1E293B]">Featured Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {categories.map((cat, i) => (
                <button
                    key={cat}
                    onClick={() => setCategory(cat)}
                    className={`group p-4 rounded-lg transition-all border flex flex-col items-center gap-3 ${
                        category === cat 
                        ? "bg-white border-primary shadow-md active-category" 
                        : "bg-white text-gray-400 border-gray-100 hover:border-primary/50 hover:shadow-sm"
                    }`}
                >
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors ${
                        category === cat ? "bg-primary/10 text-primary" : "bg-gray-50 text-gray-500 group-hover:text-primary"
                    }`}>
                        {getIcon(cat)}
                    </div>
                    <span className="text-xs font-bold text-slate-700 text-center">{cat}</span>
                </button>
            ))}
        </div>
    </div>
  );
}
