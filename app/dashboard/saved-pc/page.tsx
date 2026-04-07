"use client";

import { motion } from "framer-motion";
import { Monitor, Cpu, Zap, ArrowRight, Star, Layers, Activity } from "lucide-react";
import Link from "next/link";

export default function SavedPCPage() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center p-4 md:p-12 relative overflow-hidden">
      {/* Decorative Elements */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl -z-10" />
      <div className="absolute top-0 right-0 p-24 text-gray-100 opacity-5 -z-10 rotate-12">
        <Monitor size={480} />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8 }}
        className="max-w-3xl w-full bg-white rounded-[2.5rem] md:rounded-[3rem] p-6 md:p-16 border border-gray-100 shadow-2xl text-center relative"
      >
        <div className="w-16 h-16 md:w-24 md:h-24 bg-primary/10 rounded-[1.5rem] md:rounded-[2rem] flex items-center justify-center text-primary mx-auto mb-8 md:mb-10 shadow-inner group transition-all hover:scale-110">
          <Monitor size={32} className="md:w-12 md:h-12 transition-transform group-hover:rotate-12" />
        </div>

        <div className="inline-flex items-center gap-2 px-5 py-2 bg-gray-50 rounded-full border border-gray-100 mb-6">
          <Zap size={12} className="text-amber-500 fill-amber-500" />
          <span className="text-[9px] md:text-[10px] font-black uppercase tracking-[0.2em] text-gray-500">Advanced Module</span>
        </div>

        <h1 className="text-3xl md:text-4xl font-black text-foreground tracking-tighter leading-none mb-6">
          Saved PC <br /> <span className="text-primary text-glow">Configurations</span>
        </h1>
        
        <p className="text-gray-500 text-sm md:text-lg font-medium max-w-lg mx-auto leading-relaxed mb-10 md:mb-12">
          Your master builds are currently being synchronized with our high-performance cloud servers. This module will be live shortly.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-12">
          <div className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-3xl border border-gray-100">
             <Cpu size={24} className="text-indigo-500" />
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Spec Tracking</p>
          </div>
          <div className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-3xl border border-gray-100">
             <Layers size={24} className="text-emerald-500" />
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Component Sync</p>
          </div>
          <div className="flex flex-col items-center gap-3 p-6 bg-gray-50 rounded-3xl border border-gray-100">
             <Activity size={24} className="text-rose-500" />
             <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">FPS Analytics</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link 
            href="/dashboard"
            className="w-full sm:w-auto px-10 py-5 bg-zinc-900 text-white rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-black shadow-xl transition-all active:scale-95 flex items-center justify-center gap-2"
          >
            Go Back
          </Link>
          <Link 
            href="/support"
            className="w-full sm:w-auto px-10 py-5 bg-white text-gray-400 border border-gray-100 rounded-2xl font-black text-xs uppercase tracking-widest hover:text-primary hover:border-primary/20 shadow-sm transition-all flex items-center justify-center gap-2"
          >
            Get Notified <ArrowRight size={14} />
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
