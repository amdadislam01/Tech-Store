"use client";

import { motion } from "framer-motion";
import { Sparkles, Gift, TrendingUp, History, Star, ArrowRight } from "lucide-react";

export default function RewardsPage() {
  const history = [
    { id: 1, activity: "Order #TS9283", points: "+50", date: "Apr 05, 2026" },
    { id: 2, activity: "Product Review", points: "+20", date: "Mar 28, 2026" },
    { id: 3, activity: "Profile Completion", points: "+100", date: "Mar 15, 2026" },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      {/* Rewards Hero */}
      <div className="relative bg-[#081621] rounded-[2.5rem] p-6 md:p-12 overflow-hidden text-white shadow-2xl">
        <div className="absolute top-0 right-0 p-8 md:p-12 text-white/5 opacity-20">
          <Sparkles size={160} className="md:w-[240px] md:h-[240px] rotate-12" />
        </div>
        
        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full border border-white/10 text-xs font-black uppercase tracking-widest text-primary">
              <Star size={14} fill="currentColor" />
              <span>Elite Tier Status</span>
            </div>
            <h1 className="text-3xl md:text-5xl font-black tracking-tighter leading-none">
              Your Reward <br /> <span className="text-primary text-glow">Universe</span>
            </h1>
            <p className="text-white/60 text-lg font-medium leading-relaxed max-w-sm">
              Unlock exclusive discounts and early access to premium tech gear.
            </p>
          </div>
          
          <div className="bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 p-6 md:p-8 flex flex-col items-center justify-center text-center">
            <p className="text-white/40 text-[10px] md:text-xs font-black uppercase tracking-widest mb-2">Available Balance</p>
            <div className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
              250 <span className="text-lg md:text-xl text-primary font-black uppercase tracking-widest block md:inline md:ml-2">PTS</span>
            </div>
            <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden mb-4">
              <div className="w-[60%] h-full bg-primary shadow-[0_0_15px_rgba(255,54,120,0.8)]" />
            </div>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-widest">50 points more to Gold Tier</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tier Benefits */}
        <div className="lg:col-span-2 space-y-6">
          <h3 className="text-2xl font-black text-foreground tracking-tight">Earning Opportunities</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 group-hover:scale-110 transition-transform">
                <Gift size={24} />
              </div>
              <h4 className="text-lg font-black text-foreground mb-2">Refer a Friend</h4>
              <p className="text-sm text-gray-500 font-medium">Earn 500 PTS for every friend who makes their first purchase.</p>
            </div>
            <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-all group">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp size={24} />
              </div>
              <h4 className="text-lg font-black text-foreground mb-2">Shop & Earn</h4>
              <p className="text-sm text-gray-500 font-medium">Earn 5 points for every ৳100 spent on our platform.</p>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-500">
              <History size={20} />
            </div>
            <h3 className="text-xl font-black text-foreground tracking-tight">Point Logs</h3>
          </div>
          
          <div className="space-y-6">
            {history.map((item) => (
              <div key={item.id} className="flex items-center justify-between group">
                <div>
                  <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors">{item.activity}</p>
                  <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">{item.date}</p>
                </div>
                <span className="text-sm font-black text-emerald-500 tracking-tight">{item.points}</span>
              </div>
            ))}
          </div>
          
          <button className="w-full mt-10 py-4 bg-gray-50 text-gray-400 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-primary hover:text-white transition-all flex items-center justify-center gap-2">
            Full Statement <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
