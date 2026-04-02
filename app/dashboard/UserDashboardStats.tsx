"use client";

import { ShoppingBag, Heart, Sparkles, Clock, TrendingUp } from "lucide-react";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";

export default function UserDashboardStats({ myOrdersCount }: { myOrdersCount: number }) {
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);

  const stats = [
    { label: "My Orders", value: myOrdersCount.toString(), icon: ShoppingBag, change: "Real-time", color: "green" },
    { label: "Favorites", value: wishlistItems.length.toString(), icon: Heart, change: "In Wishlist", color: "red" },
    { label: "Rewards", value: "250 pts", icon: Sparkles, icon2: TrendingUp, color: "purple" },
    { label: "Support Tickets", value: "0", icon: Clock, change: "All Clear", color: "blue" },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat: any, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
           <div className="flex items-center justify-between mb-4">
              <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 transform group-hover:scale-110 transition-transform`}>
                  <stat.icon size={24} />
              </div>
              <span className={`text-xs font-black px-2 py-1 rounded-lg ${stat.color === 'red' ? 'bg-red-50 text-red-500' : stat.color === 'blue' ? 'bg-blue-50 text-blue-500' : stat.color === 'purple' ? 'bg-purple-50 text-purple-500' : 'bg-green-50 text-green-500'}`}>
                  {stat.change}
              </span>
           </div>
           <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
           <h3 className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</h3>
        </div>
      ))}
    </div>
  );
}
