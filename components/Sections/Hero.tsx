"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Search, Globe, Award, Zap, ArrowRight, ShieldCheck } from "lucide-react";
import { useRef } from "react";
import Link from "next/link";

interface HeroProps {
  search: string;
  setSearch: (val: string) => void;
  handleSearch: (e?: React.KeyboardEvent | React.MouseEvent) => void;
  settings?: any;
}

export default function Hero({ search, setSearch, handleSearch, settings }: HeroProps) {
  const containerRef = useRef(null);
  
  // Default values for fallback
  const heroBadge = settings?.heroBadge || "Hand-Picked Tech Just for You";
  const headlinePrimary = settings?.heroHeadlinePrimary || "Stop Settling for";
  const headlineSecondary = settings?.heroHeadlineSecondary || "Cheap Gear.";
  const description = settings?.heroDescription || "Get the tech that actually works for you—from high-performance laptops to the headphones you'll never want to take off. We only stock the good stuff.";
  const heroImage = settings?.heroImage || "https://i.ibb.co.com/svSnsb6F/tech-removebg-preview.png";

  return (
    <section ref={containerRef} className="relative min-h-[90vh] lg:min-h-[85vh] flex items-center overflow-hidden bg-[#f0fdf4] pt-24 pb-12 lg:pt-32 lg:pb-20">
      {/* ... abstract background decorations ... */}
      <div className="absolute top-10 left-[-5%] w-48 h-48 lg:w-64 lg:h-64 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-5 right-[-5%] w-64 h-64 lg:w-96 lg:h-96 bg-emerald-200/20 rounded-full blur-3xl" />
      
      {/* Animated SVG Patterns */}
      <div className="absolute inset-0 opacity-[0.35] pointer-events-none hidden sm:block">
        <svg className="absolute top-[10%] left-[5%] text-emerald-400" width="100" height="100" viewBox="0 0 100 100">
          <circle cx="10" cy="10" r="2" fill="currentColor" />
          <circle cx="30" cy="10" r="2" fill="currentColor" />
          <circle cx="50" cy="10" r="2" fill="currentColor" />
        </svg>
        <motion.div 
          animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
          className="absolute top-[40%] right-[15%] text-emerald-500 opacity-20 hidden lg:block"
        >
          <svg width="200" height="100" viewBox="0 0 200 100" fill="none">
            <path d="M0 50 Q50 0 100 50 T200 50" stroke="currentColor" strokeWidth="4" />
          </svg>
        </motion.div>
      </div>
 
      <div className="container-custom px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-12 items-center">
          
          {/* Left Content */}
          <motion.div 
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, x: -30 },
              visible: { opacity: 1, x: 0, transition: { staggerChildren: 0.15 } }
            }}
            className="lg:col-span-12 xl:col-span-6 text-center lg:text-left"
          >
            {/* Badge */}
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-emerald-100 shadow-sm mb-6"
            >
              <span className="text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.1em] text-emerald-700">{heroBadge}</span>
            </motion.div>
 
            {/* Dynamic Headline */}
            <motion.h1 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-6 leading-[1.1] px-2 sm:px-0"
            >
              {headlinePrimary} <br className="hidden sm:block" /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                {headlineSecondary}
              </span>
            </motion.h1>
 
            <motion.p 
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="text-base sm:text-lg md:text-xl text-slate-700 max-w-xl mb-10 leading-relaxed font-medium mx-auto lg:mx-0 px-4 sm:px-0"
            >
              {description}
            </motion.p>
 
            {/* CTA & Search Box */}
            <motion.div 
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0 } }}
              className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-2 bg-white/90 backdrop-blur-xl border border-green-100 rounded-[28px] shadow-2xl shadow-green-200/30 max-w-2xl mx-auto lg:mx-0"
            >
              <div className="relative flex-1 w-full">
                <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  type="text" 
                  placeholder="Need something specific?" 
                  className="w-full pl-12 pr-4 py-4 rounded-2xl bg-transparent focus:outline-none text-slate-900 font-bold text-sm sm:text-base"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  onKeyDown={handleSearch}
                />
              </div>
              <button 
                onClick={handleSearch}
                className="w-full sm:w-auto px-10 py-4 bg-primary shadow-lg shadow-green-200 text-white font-black rounded-[22px] hover:bg-primary-dark transition-all flex items-center justify-center gap-2 group text-sm sm:text-base mb-1 sm:mb-0"
              >
                {search.trim() ? "Search Now" : "Shop Now"}
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </motion.div>
 
            {/* Features summary */}
            <motion.div 
              variants={{ hidden: { opacity: 0 }, visible: { opacity: 1 } }}
              className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8"
            >
              <div className="flex items-center gap-2 text-slate-600">
                <div className="p-1.5 bg-green-100 rounded-full text-green-600">
                  <ShieldCheck size={16} />
                </div>
                <span className="text-[12px] sm:text-sm font-bold">1 Year Warranty</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600">
                <div className="p-1.5 bg-green-100 rounded-full text-green-600">
                  <Zap size={16} />
                </div>
                <span className="text-[12px] sm:text-sm font-bold">Next-Day Delivery</span>
              </div>
            </motion.div>
          </motion.div>
 
          {/* Right Illustrations */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, rotate: 5 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-12 xl:col-span-6 relative w-full mt-8 lg:mt-0"
          >
            {/* Background floating circles */}
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="absolute top-10 right-10 w-32 h-32 sm:w-48 sm:h-48 bg-lime-400/20 rounded-full -z-10" 
            />
            <motion.div 
              animate={{ scale: [1.1, 1, 1.1] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="absolute bottom-10 left-10 w-48 h-48 sm:w-64 sm:h-64 bg-emerald-400/20 rounded-full -z-10" 
            />
            
            {/* Main Illustration Bundle */}
            <div className="relative z-10 p-2 sm:p-4 max-w-[500px] lg:max-w-full mx-auto">
              <div className="relative group">
                <div className="absolute inset-0 bg-white/20 rounded-[30px] sm:rounded-[40px] blur-xl -z-10 group-hover:bg-white/30 transition-colors" />
                <Image 
                  src={heroImage} 
                  alt="Tech Bundle" 
                  width={800}
                  height={800}
                  className="w-full h-auto drop-shadow-[0_20px_50px_rgba(34,197,94,0.15)] group-hover:scale-[1.02] transition-transform duration-700 object-contain" 
                  priority
                />
              </div>
 
              {/* Floating micro-elements */}
              <motion.div 
                animate={{ y: [0, -15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-[10%] left-[-2%] sm:left-[-5%] bg-white p-2 sm:p-3 rounded-xl sm:rounded-2xl shadow-xl border border-green-50 hidden sm:block"
              >
                <Award className="text-yellow-500" size={20} />
              </motion.div>
              
              <motion.div 
                animate={{ y: [0, 15, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-[15%] right-[-2%] sm:right-[-5%] bg-slate-900 text-white px-3 py-1.5 sm:px-4 sm:py-2 rounded-lg sm:rounded-xl shadow-2xl hidden sm:block"
              >
                <p className="text-[8px] sm:text-[10px] font-bold uppercase tracking-widest text-emerald-400">Best Sellers</p>
                <p className="text-[12px] sm:text-sm font-black">2026 Edition</p>
              </motion.div>
            </div>
          </motion.div>
 
        </div>
      </div>
    </section>
  );
}