"use client";

import { motion } from "framer-motion";
import { Zap } from "lucide-react";
import Image from "next/image";

export default function TechInsights() {
  return (
    <section className="mb-32">
        <div className="flex items-end justify-between mb-16">
            <div>
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-primary mb-4 block">The Journal</span>
                <h2 className="text-4xl font-black text-gray-900 tracking-tighter">News You Can <span className="text-primary">Actually Use.</span></h2>
            </div>
            <button className="hidden md:flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-gray-400 hover:text-primary transition-colors">
                Read All Stories <Zap size={14} />
            </button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
                { title: "The Future of Spatial Computing", category: "Trends", img: "https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?q=80&w=2624&auto=format&fit=crop" },
                { title: "Top 10 Essential Devices for 2024", category: "Culture", img: "https://i.ytimg.com/vi/TD0Are31diM/hq720.jpg?sqp=-oaymwEhCK4FEIIDSFryq4qpAxMIARUAAAAAGAElAADIQj0AgKJD&rs=AOn4CLDaAgWtxQ9JlEhpmYM_CG_4p1k_3w" },
                { title: "Inside the Munich Design Hub", category: "Studio", img: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2670&auto=format&fit=crop" }
            ].map((post, i) => (
                <motion.div
                    key={i}
                    whileHover={{ y: -10 }}
                    className="group cursor-pointer"
                >
                    <div className="relative overflow-hidden rounded-[40px] mb-6 aspect-video">
                        <Image 
                            src={post.img} 
                            alt={post.title} 
                            fill
                            sizes="(max-width: 768px) 100vw, 33vw"
                            className="object-cover transition-transform duration-1000 group-hover:scale-110" 
                        />
                    </div>
                    <span className="text-[9px] font-black uppercase tracking-widest text-primary mb-3 block">{post.category}</span>
                    <h4 className="text-xl font-black text-gray-900 tracking-tighter leading-tight group-hover:text-primary transition-colors">{post.title}</h4>
                </motion.div>
            ))}
        </div>
    </section>
  );
}
