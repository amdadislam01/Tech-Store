"use client";

import { Smartphone, Headphones, Cpu, Monitor, Laptop } from "lucide-react";
import { motion } from "framer-motion";

const brands = [
  { name: "Apple", logo: <Smartphone size={24} /> },
  { name: "Samsung", logo: <Smartphone size={24} /> },
  { name: "Sony", logo: <Headphones size={24} /> },
  { name: "NVIDIA", logo: <Cpu size={24} /> },
  { name: "LG", logo: <Monitor size={24} /> },
  { name: "Dell", logo: <Laptop size={24} /> }
];

export default function BrandPartners() {
  return (
    <section className="bg-white border-y border-gray-100 py-12 overflow-hidden">
        <motion.div 
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1 }}
          className="container-custom"
        >
          <div className="flex items-center justify-between gap-12">
            <motion.span 
              initial={{ x: -20, opacity: 0 }}
              whileInView={{ x: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="text-[10px] font-black uppercase tracking-widest text-gray-400 whitespace-nowrap border-r border-gray-100 pr-12 hidden lg:block"
            >
              Global Fleet
            </motion.span>
            <div className="flex-1 flex items-center justify-between opacity-30 grayscale hover:grayscale-0 hover:opacity-100 transition-all duration-700">
               {brands.map((brand, idx) => (
                 <motion.div 
                    key={brand.name} 
                    initial={{ y: 20, opacity: 0 }}
                    whileInView={{ y: 0, opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (idx * 0.1) }}
                    className="flex items-center gap-3 group cursor-default"
                 >
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors"
                    >
                      {brand.logo}
                    </motion.div>
                    <span className="text-sm font-black tracking-tighter text-gray-900 uppercase">{brand.name}</span>
                 </motion.div>
               ))}
            </div>
          </div>
        </motion.div>
      </section>
  );
}
