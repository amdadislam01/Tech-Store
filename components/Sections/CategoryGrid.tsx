"use client";

import { motion } from "framer-motion";
import { Sparkles, Zap, TrendingUp, LayoutGrid, List, Menu, Box } from "lucide-react";

interface CategoryGridProps {
  category: string;
  setCategory: (val: string) => void;
  categories: string[];
}

export default function CategoryGrid({ category, setCategory, categories }: CategoryGridProps) {
  // Duplicate categories to create a seamless infinite loop
  const duplicatedCategories = [...categories, ...categories];

  const getIcon = (cat: string) => {
    switch (cat) {
        case "All": return <Sparkles size={22} />;
        case "Smartphones": return <Zap size={22} />;
        case "Laptops": return <TrendingUp size={22} />;
        case "Accessories": return <LayoutGrid size={22} />;
        case "Tablets": return <List size={22} />;
        case "Audio": return <Menu size={22} />;
        default: return <Box size={22} />;
    }
  };

  return (
    <div className="marquee-container mb-20 py-4">
        <div className="marquee-content">
            {duplicatedCategories.map((cat, i) => (
                <button
                    key={`${cat}-${i}`}
                    onClick={() => setCategory(cat)}
                    className={`group p-6 rounded-[32px] transition-all duration-500 border flex flex-col items-center gap-4 min-w-[160px] md:min-w-[180px] ${
                        category === cat 
                        ? "bg-primary text-white border-primary shadow-2xl shadow-primary/30 -translate-y-2 scale-105" 
                        : "bg-white/80 backdrop-blur-xl text-gray-400 border-gray-100 hover:border-primary/30 hover:bg-white hover:shadow-xl hover:-translate-y-1"
                    }`}
                >
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-colors ${
                        category === cat ? "bg-white/20 text-white" : "bg-gray-50 text-gray-400 group-hover:text-primary"
                    }`}>
                        {getIcon(cat)}
                    </div>
                    <span className="text-[10px] font-black uppercase tracking-widest truncate w-full text-center px-2">{cat}</span>
                </button>
            ))}
        </div>
    </div>
  );
}
