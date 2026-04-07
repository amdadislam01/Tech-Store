"use client";

import { 
  ShoppingBag, 
  User, 
  Lock, 
  MapPin, 
  Heart, 
  Monitor, 
  Sparkles, 
  History, 
  LifeBuoy,
  LayoutDashboard
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

const navItems = [
  { label: "Dashboard", icon: LayoutDashboard, href: "/dashboard" },
  { label: "Orders", icon: ShoppingBag, href: "/dashboard/orders" },
  { label: "Edit Profile", icon: User, href: "/dashboard/profile" },
  { label: "Password", icon: Lock, href: "/dashboard/profile#security-center" },
  { label: "Addresses", icon: MapPin, href: "/dashboard/profile/addresses" },
  { label: "Wishlist", icon: Heart, href: "/wishlist" },
  { label: "Saved PC", icon: Monitor, href: "/dashboard/saved-pc" },
  { label: "Star Points", icon: Sparkles, href: "/dashboard/rewards" },
];

export default function UserDashboardSubNav() {
  const pathname = usePathname();

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 sm:top-[72px] z-20 shadow-sm">
      <div className="max-w-7xl mx-auto relative group">
        {/* Left Fade Indicator */}
        <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
        
        {/* Right Fade Indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />

        <div className="overflow-x-auto no-scrollbar scroll-smooth">
          <div className="flex items-center gap-1 sm:gap-2 px-4 md:px-8 min-w-max">
              {navItems.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <motion.div key={item.label} whileHover={{ y: -1 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href={item.href}
                      className={`flex items-center gap-2 px-4 py-4 sm:px-6 sm:py-5 transition-all relative group shrink-0 ${
                        isActive ? "text-primary font-black" : "text-gray-400 hover:text-foreground font-bold"
                      }`}
                    >
                      <item.icon size={16} className={`sm:w-5 sm:h-5 ${isActive ? "text-primary" : "text-gray-300 group-hover:text-primary transition-colors"}`} />
                      <span className="text-[9px] sm:text-[10px] md:text-[11px] uppercase tracking-widest font-black whitespace-nowrap">
                        {item.label}
                      </span>
                      {isActive && (
                        <motion.div 
                          layoutId="subnav-active"
                          className="absolute bottom-0 left-4 right-4 sm:left-6 sm:right-6 h-0.5 sm:h-1 bg-primary rounded-t-full shadow-[0_-2px_10px_rgba(255,54,120,0.4)]" 
                        />
                      )}
                    </Link>
                  </motion.div>
                );
              })}
          </div>
        </div>
      </div>
    </div>
  );
}
