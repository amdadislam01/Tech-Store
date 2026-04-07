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
  LogOut 
} from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";
import { signOut } from "next-auth/react";

const gridItems = [
  { label: "Orders", desc: "View your purchase history", icon: ShoppingBag, href: "/dashboard/orders", iconColor: "text-blue-500", bgColor: "bg-blue-50" },
  { label: "Edit Profile", desc: "Manage your personal info", icon: User, href: "/dashboard/profile", iconColor: "text-emerald-500", bgColor: "bg-emerald-50" },
  { label: "Change Password", desc: "Keep your account secure", icon: Lock, href: "/dashboard/profile", iconColor: "text-rose-500", bgColor: "bg-rose-50" },
  { label: "Addresses", desc: "Manage shipping destinations", icon: MapPin, href: "/dashboard/profile/addresses", iconColor: "text-amber-500", bgColor: "bg-amber-50" },
  { label: "Wishlist", desc: "Your favorite tech items", icon: Heart, href: "/wishlist", iconColor: "text-pink-500", bgColor: "bg-pink-50" },
  { label: "Saved PC", desc: "Your custom configurations", icon: Monitor, href: "/dashboard/saved-pc", iconColor: "text-indigo-500", bgColor: "bg-indigo-50" },
  { label: "Star Points", desc: "Check your reward balance", icon: Sparkles, href: "/dashboard/rewards", iconColor: "text-violet-500", bgColor: "bg-violet-50" },
  { label: "Transactions", desc: "View all payment history", icon: History, href: "/dashboard/transactions", iconColor: "text-gray-500", bgColor: "bg-gray-50" },
  { label: "Logout", desc: "Sign out of your account", icon: LogOut, action: () => signOut({ callbackUrl: "/login" }), iconColor: "text-red-500", bgColor: "bg-red-50" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemAnim = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export default function UserDashboardGrid() {
  return (
    <motion.div 
      variants={container}
      initial="hidden"
      animate="show"
      className="grid grid-cols-3 md:grid-cols-3 gap-3 md:gap-8"
    >
      {gridItems.map((item) => (
        <motion.div
          key={item.label}
          variants={itemAnim}
        >
          {item.href ? (
            <Link
              href={item.href}
              className="group bg-white p-3 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2 md:gap-4 hover:shadow-premium-hover hover:-translate-y-2 transition-all duration-500 h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 md:p-8 text-gray-50 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000">
                  <item.icon className="w-16 h-16 md:w-[120px] md:h-[120px]" />
              </div>
              <div className={`w-12 h-12 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${item.bgColor} ${item.iconColor} shadow-inner`}>
                <item.icon size={20} className="md:w-12 md:h-12" />
              </div>
              <div className="text-center relative z-10">
                <h3 className="text-[10px] md:text-lg font-black text-foreground tracking-tight group-hover:text-primary transition-colors leading-tight">
                  {item.label}
                </h3>
                <p className="hidden md:block text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">{item.desc}</p>
              </div>
            </Link>
          ) : (
            <button
              onClick={item.action}
              className="w-full group bg-white p-3 md:p-10 rounded-[1.5rem] md:rounded-[2.5rem] border border-gray-100 shadow-sm flex flex-col items-center justify-center gap-2 md:gap-4 hover:shadow-premium-hover hover:-translate-y-2 transition-all duration-500 h-full relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 p-4 md:p-8 text-gray-50 opacity-[0.03] group-hover:scale-150 transition-transform duration-1000">
                  <item.icon className="w-16 h-16 md:w-[120px] md:h-[120px]" />
              </div>
              <div className={`w-12 h-12 md:w-24 md:h-24 rounded-2xl md:rounded-3xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:rotate-6 ${item.bgColor} ${item.iconColor} shadow-inner`}>
                <item.icon size={20} className="md:w-12 md:h-12" />
              </div>
              <div className="text-center relative z-10">
                <h3 className="text-[10px] md:text-xl font-black text-foreground tracking-tight group-hover:text-primary transition-colors leading-tight">
                  {item.label}
                </h3>
                <p className="hidden md:block text-xs text-gray-400 font-medium mt-1 uppercase tracking-widest">{item.desc}</p>
              </div>
            </button>
          )}
        </motion.div>
      ))}
    </motion.div>
  );
}
