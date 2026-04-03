"use client";

import { motion } from "framer-motion";
import { TrendingUp } from "lucide-react";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface SalesChartProps {
  chartData: {
    label: string;
    value: number;
  }[];
}

export default function SalesChart({ chartData }: SalesChartProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const currentPeriod = searchParams.get("period") || "daily";

  const maxValue = Math.max(...chartData.map(d => d.value), 100);

  const setPeriod = (period: string) => {
    const params = new URLSearchParams(searchParams);
    params.set("period", period);
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  };

  return (
    <div className="lg:col-span-2 bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm relative overflow-hidden group min-h-[500px] flex flex-col">
      <div className="absolute top-0 right-0 p-10">
        <div className="w-12 h-12 bg-primary/5 rounded-2xl flex items-center justify-center text-primary border border-primary/10">
            <TrendingUp size={24} className="group-hover:scale-110 transition-transform duration-500" />
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-4">
        <div>
            <h3 className="text-2xl font-black text-foreground tracking-tight">Revenue Stream</h3>
            <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mt-2 bg-gray-50/80 px-2 py-1 rounded inline-block">Real-time Acquisition Metrics</p>
        </div>
        <div className="flex items-center gap-2 p-1.5 bg-gray-50 rounded-[1.25rem] border border-gray-100">
            <button 
                onClick={() => setPeriod("daily")}
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer ${
                    currentPeriod === "daily" 
                        ? "bg-white text-primary shadow-sm border border-gray-100/50" 
                        : "text-gray-400 hover:text-foreground"
                }`}
            >
                Daily
            </button>
            <button 
                onClick={() => setPeriod("monthly")}
                className={`px-6 py-3 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all duration-300 cursor-pointer ${
                    currentPeriod === "monthly" 
                        ? "bg-white text-primary shadow-sm border border-gray-100/50" 
                        : "text-gray-400 hover:text-foreground"
                }`}
            >
                Monthly
            </button>
        </div>
      </div>
      
      <div className="flex items-end justify-between h-64 gap-3 md:gap-5 mt-auto">
        {chartData.map((item, i) => {
          const barHeight = (item.value / maxValue) * 100;
          const isLast = i === chartData.length - 1;

          return (
            <div key={i} className="flex-grow flex flex-col items-center gap-6 group/bar h-full">
              <div className="relative w-full h-full flex items-end justify-center">
                <motion.div 
                  initial={{ height: 0 }}
                  animate={{ height: `${Math.max(barHeight, 5)}%` }}
                  transition={{ duration: 1.5, delay: i * 0.1, ease: "circOut" }}
                  className={`w-full max-w-[48px] rounded-2xl transition-all duration-700 relative group-hover/bar:shadow-2xl group-hover/bar:shadow-primary/20 ${
                      isLast 
                        ? "bg-gradient-to-t from-primary to-emerald-400 shadow-lg shadow-primary/20" 
                        : "bg-gray-50 group-hover/bar:bg-primary/20 group-hover/bar:text-primary transition-colors"
                  }`}
                >
                  {/* Tooltip */}
                  <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-zinc-900 text-white text-[10px] font-black px-3 py-1.5 rounded-xl opacity-0 group-hover/bar:opacity-100 transition-all duration-300 z-10 whitespace-nowrap shadow-xl pointer-events-none transform group-hover/bar:-translate-y-1">
                      ${item.value.toLocaleString()}
                  </div>
                  
                  {isLast && (
                      <div className="absolute inset-0 bg-primary/20 blur-xl scale-75 opacity-0 group-hover/bar:opacity-100 transition-opacity duration-1000" />
                  )}
                </motion.div>
              </div>
              <span className={`text-[10px] font-black tracking-widest uppercase transition-colors duration-300 ${
                  isLast ? "text-primary" : "text-gray-300 group-hover/bar:text-foreground"
              }`}>
                  {item.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
