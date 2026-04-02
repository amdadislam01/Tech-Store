"use client";

import { Sparkles } from "lucide-react";

export default function MembershipRewards() {
  return (
    <section className="mb-32">
        <div className="bg-gray-900 rounded-[60px] p-12 md:p-24 text-white relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/20 rounded-full -mr-48 -mt-48 blur-[120px] transition-transform duration-1000 group-hover:scale-110" />
            <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                <div>
                    <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/10 rounded-full text-[10px] font-black uppercase tracking-widest mb-6">
                        <Sparkles size={14} className="text-yellow-400" />
                        <span>Membership Exclusive</span>
                    </div>
                    <h2 className="text-5xl font-black tracking-tighter leading-none mb-8">Join the Inner <br /> <span className="text-primary">Innovation Circle</span></h2>
                    <p className="text-gray-400 font-medium text-lg mb-12 max-w-md">Unlock early access to flagship drops, 15% anniversary rewards, and invite-only tech events across the globe.</p>
                    <div className="flex flex-wrap gap-4">
                        <button className="px-10 py-5 bg-white text-gray-900 rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-primary hover:text-white transition-all shadow-lg">Become a Member</button>
                        <button className="px-10 py-5 bg-white/5 border border-white/10 text-white rounded-2xl font-black text-sm uppercase tracking-widest hover:bg-white/10 transition-all">Learn Rewards</button>
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {[
                        { label: "Members", value: "125k+" },
                        { label: "Tech Events", value: "12/mo" },
                        { label: "Points Earned", value: "2.4M" },
                        { label: "Partner Brands", value: "48+" }
                    ].map((stat, i) => (
                        <div key={i} className="bg-white/5 backdrop-blur-md p-8 rounded-[40px] border border-white/10 text-center">
                            <span className="block text-4xl font-black text-white tracking-tighter mb-2">{stat.value}</span>
                            <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">{stat.label}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </section>
  );
}
