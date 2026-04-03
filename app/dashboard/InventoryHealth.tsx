"use client";

import { motion } from "framer-motion";
import { Package, AlertTriangle, ShieldCheck } from "lucide-react";

interface InventoryHealthProps {
  products: {
    name: string;
    stock: number;
  }[];
}

export default function InventoryHealth({ products }: InventoryHealthProps) {
  const LOW_STOCK_THRESHOLD = 5;

  return (
    <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm group">
      <div className="flex items-center justify-between mb-10">
        <div className="space-y-1">
            <h3 className="text-xl font-black text-foreground tracking-tight">Stock Protocol</h3>
            <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Inventory Integrity</p>
        </div>
        <div className="w-10 h-10 bg-primary/5 rounded-xl flex items-center justify-center text-primary border border-primary/10">
            <Package size={20} />
        </div>
      </div>

      <div className="space-y-8">
        {products.map((product, i) => {
          const isLow = product.stock < LOW_STOCK_THRESHOLD;
          return (
            <div key={i} className="space-y-4 group/item">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    {isLow ? <AlertTriangle size={14} className="text-rose-500 animate-pulse" /> : <ShieldCheck size={14} className="text-emerald-500" />}
                    <span className="text-sm font-black text-foreground tracking-tight group-hover/item:text-primary transition-colors cursor-default">{product.name}</span>
                </div>
                <div className={`text-[9px] font-black uppercase tracking-[0.15em] px-2 py-0.5 rounded-md border ${
                    isLow ? "text-rose-600 bg-rose-50 border-rose-100 shadow-sm shadow-rose-100" : "text-emerald-600 bg-emerald-50 border-emerald-100 shadow-sm shadow-emerald-100"
                }`}>
                  {product.stock} Units
                </div>
              </div>
              <div className="w-full h-2.5 bg-gray-50 rounded-full overflow-hidden border border-gray-100/50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isLow ? "15%" : "85%" }}
                  transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                  className={`h-full rounded-full relative ${
                      isLow 
                        ? "bg-gradient-to-r from-rose-400 to-rose-600" 
                        : "bg-gradient-to-r from-emerald-400 to-primary"
                  }`} 
                >
                    <div className={`absolute inset-0 blur-md opacity-20 scale-75 ${isLow ? "bg-rose-500" : "bg-emerald-500"}`} />
                </motion.div>
              </div>
            </div>
          );
        })}
      </div>
      
      <button className="w-full mt-10 py-4 bg-gray-50 text-[10px] font-black uppercase tracking-widest text-gray-400 rounded-2xl hover:bg-primary hover:text-white transition-all transform active:scale-95 border border-gray-100">
          Sync Catalog Integrity
      </button>
    </div>
  );
}
