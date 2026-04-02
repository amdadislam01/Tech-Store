"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";

interface SalesChartProps {
  chartData: {
    label: string;
    value: number;
  }[];
}

export default function SalesChart({ chartData }: SalesChartProps) {
  const maxValue = Math.max(...chartData.map(d => d.value), 500); // Default min max for scale

  return (
    <div className="lg:col-span-2 bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm relative overflow-hidden group">
      <div className="absolute top-0 right-0 p-8">
        <TrendingUp size={24} className="text-primary/20 group-hover:text-primary transition-colors duration-1000" />
      </div>
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-4">
        <div>
            <h3 className="text-2xl font-black text-foreground tracking-tight">Sales Intelligence</h3>
            <p className="text-gray-400 text-sm font-medium mt-1">Real-time revenue growth & order volume metrics.</p>
        </div>
        <div className="flex items-center gap-2 p-1 bg-gray-50 rounded-2xl border border-gray-100">
            <button className="px-5 py-2 bg-white text-primary text-xs font-black uppercase tracking-widest rounded-xl shadow-sm border border-gray-100/50">Daily</button>
            <button className="px-5 py-2 text-gray-400 text-xs font-black uppercase tracking-widest rounded-xl hover:text-foreground transition-colors">Monthly</button>
        </div>
      </div>
      
      <div className="flex items-end justify-between h-64 gap-3 md:gap-6 mt-10">
        {chartData.map((item, i) => {
          const barHeight = (item.value / maxValue) * 100;
          return (
            <div key={i} className="flex-grow flex flex-col items-center gap-4 group/bar">
              <div className="relative w-full h-full flex items-end">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(barHeight, 5)}%` }} // Minimum height for visibility
                  transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                  className={`w-full rounded-2xl transition-all duration-500 relative group-hover/bar:brightness-110 shadow-lg ${
                      i === chartData.length - 1 ? "bg-primary shadow-primary/20" : "bg-gray-100"
                  }`}
                >
                  <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-foreground text-white text-[10px] font-black px-2 py-1 rounded opacity-0 group-hover/bar:opacity-100 transition-opacity">
                      ${item.value.toLocaleString()}
                  </div>
                </motion.div>
              </div>
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
