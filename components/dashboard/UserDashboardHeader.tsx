"use client";

import { User, Sparkles, CreditCard, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

interface UserDashboardHeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
  };
  stats: {
    rewards?: number;
    credit?: number;
    ordersCount?: number;
  };
}

export default function UserDashboardHeader({ user, stats }: UserDashboardHeaderProps) {
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-[2.5rem] overflow-hidden border border-gray-100 shadow-premium"
    >
      <div className="p-8 md:p-12">
        <div className="flex flex-col md:flex-row items-end justify-between gap-8">
          <div className="flex flex-col md:flex-row items-center md:items-end gap-6 w-full md:w-auto text-center md:text-left">
            <div className="w-24 h-24 md:w-32 md:h-32 rounded-full bg-white p-1.5 shadow-2xl z-10">
              <div className="w-full h-full rounded-full bg-primary/10 flex items-center justify-center text-primary border-4 border-gray-50 overflow-hidden">
                   <User size={48} className="md:w-16 md:h-16" />
              </div>
            </div>
            <div className="space-y-1 mb-2">
              <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Account Hub</p>
              <h2 className="text-3xl md:text-5xl font-black text-foreground tracking-tighter leading-none">
                {user.name || "Customer"}
              </h2>
              <p className="text-gray-500 text-sm font-medium opacity-70">{user.email}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 md:gap-6 w-full md:w-auto">
            <div className="flex flex-col items-center p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary mb-3 group-hover:scale-110 transition-transform">
                <Sparkles size={20} />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Star Points</p>
                <p className="text-xl font-black text-foreground">{stats.rewards || 0}</p>
              </div>
            </div>
            
            <div className="flex flex-col items-center p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-3 group-hover:scale-110 transition-transform">
                <CreditCard size={20} />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Store Credit</p>
                <p className="text-xl font-black text-foreground">৳{stats.credit || 0}</p>
              </div>
            </div>

            <div className="flex flex-col items-center p-5 rounded-3xl bg-white border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-10 h-10 rounded-xl bg-violet-50 flex items-center justify-center text-violet-500 mb-3 group-hover:scale-110 transition-transform">
                <ShoppingBag size={20} />
              </div>
              <div className="text-center">
                <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-0.5">Total Orders</p>
                <p className="text-xl font-black text-foreground">{stats.ordersCount || 0}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
