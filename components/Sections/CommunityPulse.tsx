"use client";

import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  ShoppingCart, 
  ArrowRight,
  Maximize2,
  ChevronRight
} from "lucide-react";
import Image from "next/image";
import { useState } from "react";

const PRODUCTS = [
  {
    id: "macbook",
    name: "MacBook Pro M3 Max",
    price: "$2,499.00",
    spec: "14-Core CPU | 30-Core GPU",
    details: "The ultimate creative powerhouse for developers and designers alike.",
    top: "62%", 
    left: "48%",
    isDark: false
  },
  {
    id: "display",
    name: "UltraFine 5K Display",
    price: "$1,299.00",
    spec: "5120 x 2880 Resolution",
    details: "Stunning color accuracy and pixel-perfect clarity for every project.",
    top: "35%", 
    left: "55%",
    isDark: false
  },
  {
    id: "headphones",
    name: "Sonic Pro Wireless",
    price: "$349.00",
    spec: "Active Noise Cancellation",
    details: "Immersive spatial audio with industry-leading battery life.",
    top: "70%", 
    left: "25%",
    isDark: true
  },
  {
    id: "keyboard",
    name: "Tactile Mech Keyboard",
    price: "$199.00",
    spec: "Hot-swappable | RGB",
    details: "Precision typing experience with custom mechanical switches.",
    top: "78%", 
    left: "52%",
    isDark: false
  }
];

const Hotspot = ({ product, isActive, onToggle }: { product: typeof PRODUCTS[0], isActive: boolean, onToggle: () => void }) => (
  <div 
    className="absolute z-20"
    style={{ top: product.top, left: product.left }}
  >
    <div className="relative">
      {/* Pulse Animation */}
      <motion.div
        animate={{ scale: [1, 1.8, 1], opacity: [0.3, 0.6, 0.3] }}
        transition={{ duration: 2, repeat: Infinity }}
        className="absolute -inset-4 bg-primary/40 rounded-full blur-md cursor-pointer"
        onClick={onToggle}
      />
      
      {/* Main Interaction Node */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={onToggle}
        className={`relative w-8 h-8 rounded-full border-2 flex items-center justify-center transition-colors shadow-2xl backdrop-blur-md ${
          isActive 
            ? "bg-primary border-primary text-white" 
            : "bg-white/10 border-white/40 text-white hover:bg-primary/20 hover:border-primary"
        }`}
      >
        <Plus size={16} className={`transition-transform duration-300 ${isActive ? "rotate-45" : ""}`} />
      </motion.button>

      {/* Detail Card */}
      <AnimatePresence>
        {isActive && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            className={`absolute top-12 left-1/2 -translate-x-1/2 w-[calc(100vw-4rem)] md:w-64 p-6 rounded-3xl backdrop-blur-2xl border shadow-2xl z-50 ${
              product.isDark 
                ? "bg-zinc-900/90 border-white/10 text-white" 
                : "bg-white/90 border-gray-100 text-gray-900"
            }`}
          >
            <div className="space-y-4">
              <div className="space-y-1">
                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary">Tech Insight</span>
                <h4 className="text-lg font-black tracking-tighter leading-none">{product.name}</h4>
                <p className={`text-[10px] font-bold ${product.isDark ? "text-zinc-400" : "text-gray-400"} uppercase tracking-widest`}>
                    {product.spec}
                </p>
              </div>
              
              <p className={`text-xs font-medium leading-relaxed ${product.isDark ? "text-zinc-500" : "text-gray-500"}`}>
                {product.details}
              </p>

              <div className="flex items-center justify-between pt-2">
                 <span className="text-xl font-black tracking-tighter">{product.price}</span>
                 <button className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center hover:bg-primary/80 transition-colors">
                    <ShoppingCart size={18} />
                 </button>
              </div>
            </div>
            {/* Pointer Arrow */}
            <div className={`absolute -top-1.5 left-1/2 -translate-x-1/2 w-3 h-3 rotate-45 border-l border-t ${
              product.isDark ? "bg-zinc-900/90 border-white/10" : "bg-white/90 border-gray-100"
            }`} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export default function SiliconEcosystem() {
  const [activeId, setActiveId] = useState<string | null>(null);

  const toggleHotspot = (id: string) => {
    setActiveId(activeId === id ? null : id);
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container-custom">
        {/* Header Content */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-8">
          <div className="max-w-2xl space-y-4">
             <motion.div
               initial={{ opacity: 0, x: -20 }}
               whileInView={{ opacity: 1, x: 0 }}
               viewport={{ once: true }}
               className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gray-100 border border-gray-200"
             >
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Workspace Integration</span>
             </motion.div>
             <h2 className="text-5xl md:text-8xl font-black tracking-tighter text-gray-900 leading-[0.8] uppercase">
                Silicon <br /> 
                <span className="text-transparent bg-clip-text bg-gradient-to-br from-gray-900 via-gray-600 to-primary/80">Ecosystem.</span>
             </h2>
          </div>
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="flex flex-col items-start md:items-end text-left md:text-right"
          >
             <p className="text-gray-400 font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-4">
                Explore The Setup <ArrowRight size={14} />
             </p>
             <p className="text-gray-500 max-w-xs text-sm font-medium leading-relaxed">
                Experience how our high-performance hardware works in harmony to elevate your digital experience.
             </p>
          </motion.div>
        </div>

        {/* Interactive Scene */}
        <div className="relative w-full aspect-[4/5] md:aspect-[21/9] rounded-[2rem] md:rounded-[4rem] overflow-hidden shadow-2xl border border-gray-100 bg-gray-50 group">
          {/* Main Scenery Image */}
          <motion.div
            initial={{ scale: 1.1 }}
            whileInView={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            className="relative w-full h-full"
          >
            <Image 
              src="https://images.unsplash.com/photo-1491933382434-500287f9b54b?auto=format&fit=crop&w=2400&q=90" 
              alt="Premium Workspace Setup" 
              fill 
              sizes="100vw"
              priority
              className="object-cover opacity-95 group-hover:opacity-100 transition-opacity duration-1000 grayscale-[0.2] hover:grayscale-0"
            />
            
            {/* Cinematic Vignette */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
          </motion.div>

          {/* Interaction Overlays */}
          {PRODUCTS.map((product) => (
            <Hotspot 
              key={product.id} 
              product={product} 
              isActive={activeId === product.id}
              onToggle={() => toggleHotspot(product.id)}
            />
          ))}

          {/* Status Bar */}
          <div className="absolute top-6 right-6 md:top-10 md:right-10 flex items-center gap-6 z-10 shrink-0">
             <div className="hidden sm:flex px-6 py-3 rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/20 items-center gap-4">
                <div className="flex -space-x-2">
                   {[1,2,3].map(i => (
                     <div key={i} className="w-8 h-8 rounded-full border-2 border-white/40 bg-zinc-200 overflow-hidden">
                        <Image src={`https://i.pravatar.cc/100?u=${i}`} alt="User" width={32} height={32} />
                     </div>
                   ))}
                </div>
                <div className="flex flex-col">
                   <span className="text-[9px] font-bold text-white uppercase tracking-tighter">Live Sessions</span>
                   <span className="text-[10px] font-black text-white leading-none">1.2k+ Exploring</span>
                </div>
             </div>
             <motion.button 
               whileHover={{ rotate: 90 }}
               className="w-12 h-12 rounded-2xl bg-white/10 backdrop-blur-3xl border border-white/20 flex items-center justify-center text-white"
             >
                <Maximize2 size={20} />
             </motion.button>
          </div>
        </div>

        {/* Footer Features */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-12 border-t border-gray-100 pt-16">
            {[
                { title: "One-Click Configuration", desc: "Instantly configure your entire workspace set with optimized companion products." },
                { title: "Smart Sync Protocol", desc: "Our products communicate wirelessly to ensure a seamless cross-device workflow." },
                { title: "Eco-Friendly Pack", desc: "All system components ship in 100% recycled high-fidelity modular packaging." }
            ].map((feature, idx) => (
                <div key={idx} className="space-y-4 group cursor-pointer">
                    <div className="flex items-center justify-between group-hover:text-primary transition-colors">
                        <h4 className="text-xl font-black tracking-tighter uppercase">{feature.title}</h4>
                        <ChevronRight size={18} className="opacity-0 group-hover:opacity-100 translate-x-2 transition-all" />
                    </div>
                    <p className="text-gray-500 text-sm font-medium leading-relaxed">
                        {feature.desc}
                    </p>
                </div>
            ))}
        </div>
      </div>
    </section>
  );
}
