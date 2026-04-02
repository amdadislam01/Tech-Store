"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ShieldCheck, MessageCircle } from "lucide-react";

export default function BenefitCards() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
            { title: "Ultra Logistics", desc: "Global fulfillment within 24-48 hours.", icon: ShoppingBag, color: "blue" },
            { title: "Iron Warranty", desc: "12-month zero-question replacement.", icon: ShieldCheck, color: "green" },
            { title: "Expert Support", desc: "24/7 dedicated engineering assistance.", icon: MessageCircle, color: "purple" }
        ].map((feature, i) => (
            <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="p-10 rounded-[40px] bg-white border border-gray-100 shadow-sm hover:shadow-xl transition-all group"
            >
                <div className={`w-16 h-16 rounded-3xl bg-${feature.color}-50 text-${feature.color}-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <feature.icon size={32} />
                </div>
                <h3 className="text-xl font-black text-[#1E293B] mb-3 tracking-tighter">{feature.title}</h3>
                <p className="text-gray-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
            </motion.div>
        ))}
    </div>
  );
}
