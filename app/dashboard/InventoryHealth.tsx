"use client";

import { motion } from "framer-motion";

interface InventoryHealthProps {
  products: {
    name: string;
    stock: number;
  }[];
}

export default function InventoryHealth({ products }: InventoryHealthProps) {
  const LOW_STOCK_THRESHOLD = 5;

  return (
    <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm">
      <div className="flex items-center justify-between mb-8">
        <h3 className="text-xl font-black text-foreground tracking-tight">Inventory Health</h3>
        <button className="text-xs font-black uppercase tracking-widest text-primary hover:underline">Manage Catalog</button>
      </div>
      <div className="space-y-6">
        {products.map((product, i) => {
          const isLow = product.stock < LOW_STOCK_THRESHOLD;
          return (
            <div key={i} className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-black text-foreground tracking-tight">{product.name}</span>
                <span className={`text-[10px] font-black uppercase tracking-widest ${isLow ? "text-red-500" : "text-gray-400"}`}>
                  {isLow ? `Low Stock (${product.stock} left)` : `In Stock (${product.stock} left)`}
                </span>
              </div>
              <div className="w-full h-3 bg-gray-50 rounded-full overflow-hidden border border-gray-100">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: isLow ? "20%" : "85%" }}
                  transition={{ duration: 1.5, ease: "circOut" }}
                  className={`h-full rounded-full ${isLow ? "bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.3)]" : "bg-primary shadow-[0_0_10px_rgba(10,10,10,0.1)]"}`} 
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
