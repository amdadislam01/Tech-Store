"use client";

import { Instagram, Heart, MessageCircle, Globe, Zap, Star, Quote, TrendingUp } from "lucide-react";
import { motion } from "framer-motion";
import Image from "next/image";

const COMMUNITY_CONTENT = [
  { 
    id: 1, 
    type: "image",
    img: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80", 
    likes: "2.4k", 
    comments: "128",
    size: "col-span-2 row-span-1" 
  },
  { 
    id: 2, 
    type: "quote",
    text: "The build quality is unlike anything I've seen in consumer tech. Truly a professional's tool.",
    author: "Elena Vance",
    role: "Visual Director @ Lumina",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=150&q=80",
    size: "col-span-1 row-span-1"
  },
  { 
    id: 3, 
    type: "image",
    img: "https://images.unsplash.com/photo-1525547719571-a2d4ac8945e2?auto=format&fit=crop&w=800&q=80", 
    likes: "1.8k", 
    comments: "84",
    size: "col-span-1 row-span-2" 
  },
  { 
    id: 4, 
    type: "image",
    img: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=800&q=80", 
    likes: "3.1k", 
    comments: "210",
    size: "col-span-1 row-span-1" 
  },
  { 
    id: 5, 
    type: "quote",
    text: "Minimalism meets extreme power. TechStore redefined my workspace setup.",
    author: "Marcus Chen",
    role: "Systems Architect",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80",
    size: "col-span-1 row-span-1"
  },
  { 
    id: 6, 
    type: "image",
    img: "https://images.unsplash.com/photo-1614850523296-d8c1af93d400?auto=format&fit=crop&w=800&q=80", 
    likes: "1.5k", 
    comments: "67",
    size: "col-span-2 row-span-1" 
  },
];

const IMPACT_STATS = [
  { label: "Trustpilot Rating", value: "4.9/5", icon: Star, color: "text-yellow-400" },
  { label: "Uptime Support", value: "24/7/365", icon: Zap, color: "text-primary" },
  { label: "Countries Served", value: "180+", icon: Globe, color: "text-blue-500" },
];

const BRAND_LOGOS = ["Lumina", "Nexen", "Vortex", "Aura", "Quantum", "Apex"];

const PulsePoint = ({ className }: { className: string }) => (
  <span className={`absolute flex h-3 w-3 ${className}`}>
    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
    <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
  </span>
);

export default function CommunityPulse() {
  return (
    <section className="mb-10 relative py-16 overflow-hidden">
      {/* Cinematic Dot-Grid Background */}
      <div className="absolute inset-0 -z-10 [mask-image:radial-gradient(ellipse_at_center,transparent_20%,black)]">
        <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:32px_32px] opacity-30" />
      </div>

      {/* Decorative Gradient Glows */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 blur-[120px] rounded-full -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/5 blur-[120px] rounded-full -z-10" />

      <div className="container-custom">
        <div className="max-w-4xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-6 py-2.5 rounded-full bg-zinc-900 text-white border border-white/10 mb-10 shadow-2xl"
          >
             <TrendingUp size={14} className="text-primary" />
             <span className="text-[10px] font-black uppercase tracking-[0.25em]">World-Class Social Proof</span>
          </motion.div>
          
          <motion.h2 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ type: "spring", stiffness: 50 }}
            className="text-6xl md:text-7xl font-black text-gray-900 tracking-tighter mb-10 leading-[1] uppercase"
          >
            The global <br /> 
            <span className="text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-600 to-primary/80">Innovation Hub.</span>
          </motion.h2>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-500 text-xl font-medium leading-relaxed max-w-2xl mx-auto"
          >
            Where enthusiasts, engineers, and visionaries meet. Join over 12 million global contributors shaping the next century of computing.
          </motion.p>
        </div>

        {/* Sophisticated Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 grid-rows-2 gap-6 mb-32 h-auto md:h-[900px]">
          {COMMUNITY_CONTENT.map((item, idx) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, type: "spring" }}
              className={`relative overflow-hidden rounded-[3.5rem] border border-gray-100/50 shadow-2xl group ${item.size}`}
            >
              {item.type === "image" ? (
                <>
                  <Image 
                    src={item.img!} 
                    alt="Community Moment" 
                    fill 
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="object-cover opacity-90 group-hover:scale-105 transition-transform duration-1000 ease-out" 
                  />
                  {idx === 0 && <PulsePoint className="top-8 right-8" />}
                  {idx === 5 && <PulsePoint className="bottom-8 left-8" />}
                  
                  {/* Premium Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-all duration-500 flex flex-col justify-end p-10">
                    <div className="flex items-center justify-between">
                        <div className="flex gap-6">
                            <div className="flex items-center gap-2 text-white">
                                <Heart size={18} fill="currentColor" className="text-red-500" />
                                <span className="text-sm font-black">{item.likes}</span>
                            </div>
                            <div className="flex items-center gap-2 text-white">
                                <MessageCircle size={18} fill="currentColor" className="text-primary" />
                                <span className="text-sm font-black">{item.comments}</span>
                            </div>
                        </div>
                        <div className="w-12 h-12 bg-white/10 backdrop-blur-2xl rounded-2xl flex items-center justify-center text-white border border-white/20">
                            <Instagram size={24} />
                        </div>
                    </div>
                  </div>
                </>
              ) : (
                <div className="w-full h-full bg-white p-12 flex flex-col justify-between group-hover:bg-zinc-50 transition-colors duration-500">
                   <div className="bg-primary/10 w-14 h-14 rounded-2xl flex items-center justify-center mb-8">
                       <Quote className="text-primary" size={24} />
                   </div>
                   <p className="text-xl font-bold text-gray-900 leading-snug tracking-tight mb-10">
                       &quot;{item.text}&quot;
                   </p>
                   <div className="flex items-center gap-4">
                        <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-primary/20">
                            <Image src={item.avatar!} alt={item.author!} fill sizes="56px" className="object-cover" />
                        </div>
                        <div className="flex flex-col">
                            <span className="text-sm font-black text-gray-900">{item.author}</span>
                            <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">{item.role}</span>
                        </div>
                   </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Global Impact & Authority */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 items-center border-t border-gray-100 pt-32">
             <div className="flex flex-col gap-2">
                 <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-gray-400">Industry Recognition</h4>
                 <p className="text-xs font-bold text-gray-900">Trusted by Global Innovators</p>
             </div>
             
             <div className="md:col-span-3 flex justify-between items-center overflow-x-auto no-scrollbar gap-12 opacity-30">
                 {BRAND_LOGOS.map((brand) => (
                     <span key={brand} className="text-2xl font-black text-gray-900 uppercase tracking-tighter hover:opacity-100 transition-opacity cursor-default">
                        {brand}
                     </span>
                 ))}
             </div>
        </div>

        {/* Final Stats Grid */}
        <div className="mt-32 grid grid-cols-1 md:grid-cols-3 gap-10">
          {IMPACT_STATS.map((stat, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.7 + idx * 0.1 }}
              className="p-12 rounded-[4rem] bg-zinc-50/50 backdrop-blur-sm border border-white hover:border-primary/20 transition-all group relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                  <stat.icon size={120} />
              </div>
              <div className={`w-14 h-14 mb-8 rounded-2xl flex items-center justify-center bg-white shadow-xl shadow-gray-200/50 ${stat.color}`}>
                <stat.icon size={28} />
              </div>
              <h3 className="text-4xl font-black text-gray-900 tracking-tighter mb-2 leading-none">{stat.value}</h3>
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.3em]">{stat.label}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
