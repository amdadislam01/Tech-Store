"use client";

import { ShoppingBag, Heart, Sparkles, Clock, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { motion } from "framer-motion";

export default function UserDashboardStats({ myOrdersCount }: { myOrdersCount: number }) {
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);

  const stats = [
    { 
        label: "My Orders", 
        value: myOrdersCount.toString(), 
        icon: ShoppingBag, 
        change: "Active History",
        bgColor: "bg-emerald-50", 
        textColor: "text-emerald-600",
        badgeColor: "bg-emerald-100 text-emerald-700" 
    },
    { 
        label: "Favorites", 
        value: wishlistItems.length.toString(), 
        icon: Heart, 
        change: "In Wishlist",
        bgColor: "bg-rose-50", 
        textColor: "text-rose-600",
        badgeColor: "bg-rose-100 text-rose-700" 
    },
    { 
        label: "Market Rewards", 
        value: "250 pts", 
        icon: Sparkles, 
        change: "Trending Up",
        bgColor: "bg-violet-50", 
        textColor: "text-violet-600",
        badgeColor: "bg-violet-100 text-violet-700" 
    },
    { 
        label: "Support Desk", 
        value: "Active", 
        icon: Clock, 
        change: "24/7 Access",
        bgColor: "bg-indigo-50", 
        textColor: "text-indigo-600",
        badgeColor: "bg-indigo-100 text-indigo-700" 
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat: any, i) => (
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={i} 
            className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-premium-hover transition-all duration-500 group relative overflow-hidden"
        >
            <div className="flex items-center justify-between mb-6">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg ${stat.bgColor} ${stat.textColor}`}>
                    <stat.icon size={24} />
                </div>
                <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg tracking-widest uppercase ${stat.badgeColor}`}>
                    {stat.change}
                </span>
            </div>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">{stat.label}</p>
            <h3 className="text-3xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">{stat.value}</h3>
        </motion.div>
      ))}
    </div>
  );
}
