"use client";

import { motion } from "framer-motion";
import { 
  Sparkles, 
  Zap, 
  TrendingUp, 
  LayoutGrid, 
  List, 
  Menu, 
  Box,
  Smartphone,
  Laptop,
  Watch,
  Headphones,
  Speaker,
  Camera,
  Monitor,
  Mouse,
  Cpu,
  Tv,
  HardDrive,
  Gamepad2,
  Wifi,
  Keyboard,
  Battery,
  Cable
} from "lucide-react";

const ICON_MAP: any = {
  "LayoutGrid": <LayoutGrid size={24} />,
  "Smartphone": <Smartphone size={24} />,
  "Laptop": <Laptop size={24} />,
  "Watch": <Watch size={24} />,
  "Headphones": <Headphones size={24} />,
  "Speaker": <Speaker size={24} />,
  "Camera": <Camera size={24} />,
  "Zap": <Zap size={24} />,
  "Monitor": <Monitor size={24} />,
  "Mouse": <Mouse size={24} />,
  "Cpu": <Cpu size={24} />,
  "Tv": <Tv size={24} />,
  "HardDrive": <HardDrive size={24} />,
  "Gamepad2": <Gamepad2 size={24} />,
  "Wifi": <Wifi size={24} />,
  "Keyboard": <Keyboard size={24} />,
  "Battery": <Battery size={24} />,
  "Cable": <Cable size={24} />,
};

interface CategoryGridProps {
  category: any;
  setCategory: (val: any) => void;
  categories: any[];
}

export default function CategoryGrid({ category, setCategory, categories }: CategoryGridProps) {
  const getIcon = (cat: any) => {
    // 1. Check if it's a known icon name from dashboard
    if (typeof cat === 'object' && cat.icon && ICON_MAP[cat.icon]) {
        return ICON_MAP[cat.icon];
    }

    // 2. Legacy name-based fallbacks
    const catName = typeof cat === 'string' ? cat : cat.name;
    switch (catName) {
        case "All": return <Sparkles size={24} />;
        case "Smartphones": return <Smartphone size={24} />;
        case "Laptops": return <Laptop size={24} />;
        case "Accessories": return <LayoutGrid size={24} />;
        case "Tablets": return <List size={24} />;
        case "Audio": return <Headphones size={24} />;
        default: return <Box size={24} />;
    }
  };

  return (
    <div className="mb-12">
        <h2 className="text-xl font-bold text-center mb-8 uppercase tracking-widest text-[#1E293B]">Featured Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-8 gap-4">
            {categories.map((cat, i) => {
                const catName = typeof cat === 'string' ? cat : cat.name;
                const catId = typeof cat === 'string' ? cat : cat._id;
                const isActive = typeof category === 'object' ? category._id === catId : category === catId;
                const iconPath = typeof cat === 'object' && cat.icon?.startsWith("http") ? cat.icon : null;

                return (
                    <button
                        key={catId}
                        onClick={() => setCategory(cat)}
                        className={`group p-4 rounded-lg transition-all border flex flex-col items-center gap-3 ${
                            isActive 
                            ? "bg-white border-primary shadow-md active-category" 
                            : "bg-white text-gray-400 border-gray-100 hover:border-primary/50 hover:shadow-sm"
                        }`}
                    >
                        <div className={`w-14 h-14 rounded-full flex items-center justify-center transition-colors overflow-hidden ${
                            isActive ? "bg-primary/10 text-primary" : "bg-gray-50 text-gray-500 group-hover:text-primary"
                        }`}>
                            {iconPath ? (
                                <img src={iconPath} alt={catName} className="w-full h-full object-cover" />
                            ) : (
                                getIcon(cat)
                            )}
                        </div>
                        <span className="text-xs font-bold text-slate-700 text-center">{catName}</span>
                    </button>
                );
            })}
        </div>
    </div>
  );
}
