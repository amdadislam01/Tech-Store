"use client";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Search, Award, Zap, ArrowRight, ShieldCheck, ChevronLeft, ChevronRight } from "lucide-react";
import { useState, useEffect, useCallback } from "react";

interface HeroProps {
  search: string;
  setSearch: (val: string) => void;
  handleSearch: (e?: React.KeyboardEvent | React.MouseEvent) => void;
  settings?: any;
}

export default function Hero({ search, setSearch, handleSearch, settings }: HeroProps) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  // Default slides if none provided in settings
  const defaultSlides = [
    {
      badge: settings?.heroBadge || "Hand-Picked Tech Just for You",
      headlinePrimary: settings?.heroHeadlinePrimary || "Stop Settling for",
      headlineSecondary: settings?.heroHeadlineSecondary || "Cheap Gear.",
      description: settings?.heroDescription || "Get the tech that actually works for you—from high-performance laptops to the headphones you'll never want to take off.",
      image: settings?.heroImage || "https://i.ibb.co.com/svSnsb6F/tech-removebg-preview.png"
    },
    {
      badge: "Professional Grade Audio",
      headlinePrimary: "Immerse Yourself in",
      headlineSecondary: "Pure Sound.",
      description: "Experience music like never before with our range of professional noise-cancelling headphones and studio gear.",
      image: "/hero-slides/headphones.png"
    },
    {
      badge: "Performance Reimagined",
      headlinePrimary: "Unlock Your",
      headlineSecondary: "Full Potential.",
      description: "From high-octane gaming to creative work, our laptops are built to handle anything you throw at them.",
      image: "/hero-slides/laptop.png"
    }
  ];

  const slides = settings?.heroSlides && settings.heroSlides.length > 0 
    ? settings.heroSlides 
    : defaultSlides;

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, [slides.length]);

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 6000);
    return () => clearInterval(interval);
  }, [nextSlide, isAutoPlaying]);

  return (
    <section className="relative flex items-center overflow-hidden bg-white pt-6 pb-6 lg:pt-10 lg:pb-0 lg:h-[75vh]">
      {/* Background dynamic color shift */}
      <motion.div 
        animate={{ 
          backgroundColor: currentSlide === 0 ? "#f0fdf4" : currentSlide === 1 ? "#f8fafc" : "#f0f9ff" 
        }}
        transition={{ duration: 1.5 }}
        className="absolute inset-0 -z-10"
      />

      {/* Abstract decorations */}
      <div className="absolute top-10 left-[-5%] w-48 h-48 lg:w-64 lg:h-64 bg-green-200/30 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-5 right-[-5%] w-64 h-64 lg:w-96 lg:h-96 bg-emerald-200/20 rounded-full blur-3xl" />
      
      <div className="container-custom px-4 sm:px-6 relative z-10 h-full flex items-center">
        <div className="w-full">
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center"
            >
              
              {/* Left Content */}
              <div className="lg:col-span-12 xl:col-span-6 text-center lg:text-left order-2 lg:order-1">
                {/* Badge */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/70 backdrop-blur-sm border border-emerald-100 shadow-sm mb-4 lg:mb-6"
                >
                  <span className="text-[10px] sm:text-[12px] font-bold uppercase tracking-[0.1em] text-emerald-700">
                    {slides[currentSlide].badge}
                  </span>
                </motion.div>
    
                {/* Headline */}
                <motion.h1 
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3, duration: 0.6 }}
                  className="text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-slate-900 mb-4 lg:mb-6 leading-[1.1]"
                >
                  {slides[currentSlide].headlinePrimary} <br className="hidden sm:block" /> 
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-green-600 to-emerald-500">
                    {slides[currentSlide].headlineSecondary}
                  </span>
                </motion.h1>
    
                {/* Description */}
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className="text-sm sm:text-lg md:text-xl text-slate-700 max-w-xl mb-8 lg:mb-10 leading-relaxed font-medium mx-auto lg:mx-0 px-2 lg:px-0"
                >
                  {slides[currentSlide].description}
                </motion.p>
    
                {/* Search Box */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 p-1.5 sm:p-2 bg-white/90 backdrop-blur-xl border border-green-100 rounded-[24px] sm:rounded-[28px] shadow-2xl shadow-green-200/30 max-w-2xl mx-auto lg:mx-0"
                >
                  <div className="relative flex-1 w-full">
                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      placeholder="Need something specific?" 
                      className="w-full pl-12 pr-4 py-3 sm:py-4 rounded-2xl bg-transparent focus:outline-none text-slate-900 font-bold text-xs sm:text-base"
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      onKeyDown={handleSearch}
                    />
                  </div>
                  <button 
                    onClick={handleSearch}
                    className="w-full sm:w-auto px-8 py-3 sm:py-4 bg-primary shadow-lg shadow-green-200 text-white font-black rounded-[18px] sm:rounded-[22px] hover:bg-primary-dark transition-all flex items-center justify-center gap-2 group text-xs sm:text-base"
                  >
                    {search.trim() ? "Search" : "Shop Now"}
                    <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                  </button>
                </motion.div>
    
                {/* Features */}
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8 }}
                  className="mt-8 lg:mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-8 overflow-hidden"
                >
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="p-1.5 bg-green-100 rounded-full text-green-600">
                      <ShieldCheck size={14} />
                    </div>
                    <span className="text-[10px] sm:text-sm font-bold">1 Year Warranty</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-600">
                    <div className="p-1.5 bg-green-100 rounded-full text-green-600">
                      <Zap size={14} />
                    </div>
                    <span className="text-[10px] sm:text-sm font-bold">Next-Day Delivery</span>
                  </div>
                </motion.div>
              </div>
    
              {/* Right Illustration */}
              <div className="lg:col-span-12 xl:col-span-6 relative w-full mt-4 lg:mt-0 order-1 lg:order-2">
                <div className="relative z-10 p-2 max-w-full mx-auto">
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                    className="relative group h-[250px] sm:h-[450px] lg:h-[550px] w-full flex items-center justify-center"
                  >
                    <div className="absolute inset-0 bg-white/20 rounded-[30px] sm:rounded-[40px] blur-3xl -z-10" />
                    <Image 
                      src={slides[currentSlide].image} 
                      alt={slides[currentSlide].headlineSecondary} 
                      width={800}
                      height={800}
                      className="w-full h-full drop-shadow-[0_15px_30px_rgba(34,197,94,0.1)] object-contain p-4 lg:p-0" 
                      priority
                    />
                    
                    {/* Floating micro-elements */}
                    <motion.div 
                      animate={{ y: [0, -10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute top-[10%] left-0 bg-white p-2 rounded-xl shadow-lg border border-green-50 hidden sm:block"
                    >
                      <Award className="text-yellow-500" size={16} />
                    </motion.div>
                    
                    <motion.div 
                      animate={{ y: [0, 10, 0] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                      className="absolute bottom-[10%] right-0 bg-slate-900 text-white px-3 py-1 rounded-lg shadow-xl hidden sm:block"
                    >
                      <p className="text-[8px] font-bold uppercase tracking-widest text-emerald-400">Best Seller</p>
                      <p className="text-[10px] font-black">2026</p>
                    </motion.div>
                  </motion.div>
                </div>
              </div>
            </motion.div>
        </AnimatePresence>
        </div>
      </div>

      {/* Progress Bar (Auto-play indicator) */}
      <div className="absolute bottom-0 left-0 h-1 bg-green-100 w-full overflow-hidden">
        <motion.div 
          key={currentSlide + (isAutoPlaying ? "-playing" : "-stopped")}
          initial={{ x: "-100%" }}
          animate={isAutoPlaying ? { x: "0%" } : { x: "-100%" }}
          transition={{ duration: 6, ease: "linear" }}
          className="h-full bg-primary"
        />
      </div>
    </section>
  );
}