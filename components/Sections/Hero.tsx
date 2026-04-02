"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Globe, Award, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { useRef } from "react";

interface HeroProps {
  search: string;
  setSearch: (val: string) => void;
  handleSearch: (e: React.KeyboardEvent) => void;
}

export default function Hero({ search, setSearch, handleSearch }: HeroProps) {
  const containerRef = useRef(null);
  
  return (
    <section ref={containerRef} className="relative min-h-[90vh] flex items-center overflow-hidden bg-[#fafafa] pt-20 pb-12">
      {/* Background Aesthetic Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 rounded-full blur-[120px] animate-pulse" />
      <div className="absolute bottom-[-5%] right-[-5%] w-[30%] h-[40%] bg-blue-200/20 rounded-full blur-[100px]" />
      
      {/* Subtle Grain Texture Overlay */}
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://grainy-gradients.vercel.app/noise.svg')]" />

      <div className="container-custom px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0, transition: { staggerChildren: 0.2 } }
            }}
            className="lg:col-span-7 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div 
              variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0 } }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-6"
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.15em] text-slate-600">Edition 2026 is Live</span>
            </motion.div>

            {/* Main Headline */}
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-6xl md:text-7xl lg:text-8xl font-extrabold tracking-tight text-slate-950 mb-8 leading-[0.95]"
            >
              Elevate Your <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-600 to-indigo-600 italic font-serif font-medium">
                Digital Craft.
              </span>
            </motion.h1>

            <motion.p 
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="text-lg md:text-xl text-slate-600 max-w-xl mb-10 leading-relaxed font-normal mx-auto lg:mx-0"
            >
              Experience the intersection of high-end engineering and minimalist soul. Designed for those who build the future.
            </motion.p>

            {/* CTA & Search Box */}
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-col sm:flex-row items-center gap-4 p-2 bg-white/80 backdrop-blur-xl border border-slate-200 rounded-[24px] shadow-xl shadow-slate-200/50 max-w-2xl"
            >
              <div className="relative flex-1 w-full">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input 
                  type="text" 
                  placeholder="What are you looking for?" 
                  className="w-full pl-12 pr-4 py-4 rounded-xl bg-transparent focus:outline-none text-slate-900 font-medium"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
              <button className="w-full sm:w-auto px-8 py-4 bg-slate-950 text-white font-bold rounded-[18px] hover:bg-primary transition-colors flex items-center justify-center gap-2 group">
                Explore Now
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>

            {/* Trust Markers */}
            <motion.div 
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="mt-12 flex flex-wrap items-center justify-center lg:justify-start gap-8 opacity-60"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck size={20} />
                <span className="text-sm font-semibold uppercase tracking-wider">Secure Payment</span>
              </div>
              <div className="flex items-center gap-2">
                <Zap size={20} />
                <span className="text-sm font-semibold uppercase tracking-wider">Fast Delivery</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Right Showcase */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 relative"
          >
            <div className="relative group">
              {/* Main Image Wrapper */}
              <div className="relative w-full aspect-[4/5] z-10 rounded-[48px] overflow-hidden border-[8px] border-white shadow-2xl transform lg:rotate-3 group-hover:rotate-0 transition-transform duration-700">
                <Image 
                  src="/hero-bg.png" 
                  alt="Tech Showcase" 
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover scale-105 group-hover:scale-100 transition-transform duration-700" 
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent" />
              </div>

              {/* Floating Performance Card */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -right-8 top-20 z-20 bg-white/90 backdrop-blur-xl p-5 rounded-3xl shadow-2xl border border-white max-w-[180px]"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-2 bg-orange-100 text-orange-600 rounded-xl">
                    <Award size={20} />
                  </div>
                  <span className="text-[10px] font-black uppercase text-slate-500">Top Rated</span>
                </div>
                <p className="text-sm font-bold text-slate-900 leading-tight">Elite Performance Award 2026</p>
              </motion.div>

              {/* Floating Global Card */}
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
                className="absolute -left-10 bottom-20 z-20 bg-slate-900 text-white p-5 rounded-3xl shadow-2xl border border-slate-700"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-primary rounded-xl">
                    <Globe size={20} />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold text-slate-400 uppercase">Shipping</p>
                    <p className="text-sm font-bold">Worldwide</p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Background decorative circles */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-slate-200 rounded-full -z-10" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[140%] h-[140%] border border-slate-100 rounded-full -z-10" />
          </motion.div>

        </div>
      </div>
    </section>
  );
}