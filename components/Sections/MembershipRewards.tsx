"use client";

import { Sparkles } from "lucide-react";

export default function MembershipRewards() {
  return (
    <section className="mb-20 sm:mb-32">
        <div className="bg-gray-900 rounded-[2.5rem] sm:rounded-[60px] p-8 sm:p-12 md:p-24 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full -mr-48 -mt-48 blur-[120px] transition-transform duration-1000 group-hover:scale-110" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                        <Sparkles size={14} className="text-yellow-400" />
                        <span>The TechStore Club</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tighter leading-tight sm:leading-none mb-6 sm:mb-8">Get Perks Just For <br className="hidden sm:block" /> <span className="text-primary">Being You.</span></h2>
                    <p className="text-gray-400 font-medium text-base sm:text-lg mb-8 sm:mb-12 max-w-md">Join our community to get 15% off on your birthday, early access to new drops, and invites to our exclusive tech meetups.</p>
                    <div className="flex flex-col sm:flex-row flex-wrap gap-4">
                        <button className="w-full sm:w-auto px-10 py-4 sm:py-5 bg-white text-gray-900 rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg active:scale-95">Join the Club</button>
                        <button className="w-full sm:w-auto px-10 py-4 sm:py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-[10px] sm:text-sm uppercase tracking-widest hover:bg-white/10 transition-all active:scale-95">Member Benefits</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: "Our Members", value: "125k+" },
                        { label: "Tech Events", value: "12/mo" },
                        { label: "Points Earned", value: "2.4M" },
                        { label: "Partner Brands", value: "48+" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md p-6 sm:p-8 rounded-[2rem] sm:rounded-[40px] border border-white/10 text-center flex flex-col justify-center translate-y-0 hover:-translate-y-2 transition-transform duration-500">
                            <span className="block text-2xl sm:text-4xl font-black text-white tracking-tighter mb-1 sm:mb-2">{stat.value}</span>
                            <span className="text-[8px] sm:text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
}
