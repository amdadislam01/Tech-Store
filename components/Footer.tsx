"use client";

import Link from "next/link";
import { ShoppingCart, Facebook, Twitter, Instagram, Youtube, Mail, MapPin, Phone, Github, Store } from "lucide-react";
import { motion } from "framer-motion";

export default function Footer() {
  return (
    <footer className="bg-[#0F172A] text-gray-400 pt-24 pb-12 overflow-hidden relative">
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary/10 rounded-full -ml-40 -mt-40 blur-3xl" />
      
      <div className="container-custom relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
          {/* Brand Column */}
          <div className="space-y-8">
            <Link href="/" className="text-2xl font-black text-white flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 transition-transform group-hover:rotate-12">
                <Store size={22} />
              </div>
              <span className="tracking-tighter">Tech<span className="text-primary">Store</span></span>
            </Link>
            <p className="text-sm leading-relaxed max-w-xs">
              Empowering your digital lifestyle with high-performance hardware and futuristic innovation. Your trusted partner in tech excellence since 2024.
            </p>
            <div className="flex items-center gap-4">
              {[Facebook, Twitter, Instagram, Github].map((Icon, i) => (
                <Link key={i} href="#" className="w-10 h-10 bg-white/5 rounded-xl flex items-center justify-center hover:bg-primary hover:text-white transition-all transform hover:-translate-y-1">
                  <Icon size={18} />
                </Link>
              ))}
            </div>
          </div>

          {/* Catalog Column */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-8">Catalog</h3>
            <ul className="space-y-4 text-sm font-medium">
              {["Smartphones", "Laptops", "Accessories", "Tablets", "Audio Systems", "Gaming Gear"].map((item) => (
                <li key={item}>
                  <Link href="/products" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-px bg-primary group-hover:w-3 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Links Column */}
          <div>
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-8">Support</h3>
            <ul className="space-y-4 text-sm font-medium">
              {["Help Center", "Order Tracking", "Returns & Refunds", "Technical Setup", "Warranty Policy", "Contact Us"].map((item) => (
                <li key={item}>
                  <Link href="/support" className="hover:text-primary transition-colors flex items-center gap-2 group">
                    <span className="w-0 h-px bg-primary group-hover:w-3 transition-all" />
                    {item}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Column */}
          <div className="space-y-8">
            <h3 className="text-white font-black text-sm uppercase tracking-widest mb-8">Stay Ahead</h3>
            <p className="text-xs leading-relaxed">Subscribe to receive early-bird tech deals and innovation updates.</p>
            <div className="relative group">
              <input 
                type="email" 
                placeholder="tech@example.com"
                className="w-full bg-white/5 border border-white/10 rounded-2xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all text-white font-bold"
              />
              <button className="absolute right-2 top-2 bottom-2 px-4 bg-primary text-[#0F172A] rounded-xl text-[10px] font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all">Join</button>
            </div>
          </div>
        </div>

        {/* Contact Info Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 py-10 border-t border-white/5 text-xs font-black uppercase tracking-widest text-gray-500">
           <div className="flex items-center gap-3">
             <MapPin size={16} className="text-primary" />
             <span>Dhaka, Bangladesh · Global Hub</span>
           </div>
           <div className="flex items-center gap-3 md:justify-center">
             <Mail size={16} className="text-primary" />
             <span>support@techstore.io</span>
           </div>
           <div className="flex items-center gap-3 md:justify-end">
             <Phone size={16} className="text-primary" />
             <span>+880 1234-TECH-00</span>
           </div>
        </div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row items-center justify-between pt-10 border-t border-white/5 text-[10px] font-bold uppercase tracking-widest gap-4">
          <p>© 2024 Techstore Innovation Lab. All rights rights reserved.</p>
          <div className="flex items-center gap-8 text-white/40">
            <Link href="#" className="hover:text-white transition-colors">Privacy Privacy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Cookie Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
