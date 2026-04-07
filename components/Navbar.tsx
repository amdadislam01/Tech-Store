"use client";

import Link from "next/link";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ShoppingCart, 
  User, 
  Search, 
  Menu, 
  X, 
  Heart,
  Home,
  LayoutGrid,
  Zap,
  LifeBuoy,
  Store
} from "lucide-react";
import ProfileDropdown from "./ProfileDropdown";

const Navbar = () => {
  const pathname = usePathname();

  const links = [
    { name: "Home", href: "/", icon: Home },
    { name: "Collection", href: "/products", icon: LayoutGrid },
    { name: "New Arrivals", href: "/products?sort=newest", icon: Zap },
    { name: "Support", href: "/support", icon: LifeBuoy }
  ];
  const { items } = useSelector((state: RootState) => state.cart);
  const cartCount = items.reduce((total, item) => total + item.quantity, 0);
  const { wishlistItems } = useSelector((state: RootState) => state.wishlist);
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-white/80 backdrop-blur-xl border-b border-gray-100 sticky top-0 z-50 transition-all duration-300">
      <div className="container-custom px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
        <Link href="/" className="text-xl sm:text-2xl font-black text-primary flex items-center gap-1.5 sm:gap-2 group">
          <div className="w-8 h-8 sm:w-10 sm:h-10 bg-primary rounded-[14px] sm:rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20 group-hover:rotate-12 transition-transform duration-500">
            <Store size={18} className="sm:w-[22px] sm:h-[22px]" />
          </div>
          <span className="text-lg sm:text-2xl tracking-tighter">Tech<span className="text-foreground">Store</span></span>
        </Link>
 
        <div className="hidden lg:flex items-center gap-6 xl:gap-8">
          {links.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link 
                  key={link.name} 
                  href={link.href} 
                  className={`text-sm font-bold flex items-center gap-2 transition-all relative group py-2 ${
                    isActive ? "text-primary" : "text-gray-500 hover:text-primary"
                  }`}
              >
                <link.icon size={16} className={isActive ? "text-primary" : "text-gray-400 group-hover:text-primary transition-colors"} />
                {link.name}
                <span className={`absolute bottom-0 left-0 h-0.5 bg-primary transition-all duration-300 ${
                    isActive ? "w-full" : "w-0 group-hover:w-full"
                }`} />
              </Link>
            );
          })}
        </div>
 
        <div className="flex items-center gap-1.5 sm:gap-3 lg:gap-5">
          <div className="hidden lg:flex items-center gap-2 px-4 py-2 bg-gray-50 rounded-2xl border border-gray-100 focus-within:bg-white focus-within:ring-2 focus-within:ring-primary/10 transition-all">
            <Search size={18} className="text-gray-400" />
            <input 
                type="text" 
                placeholder="Find anything..." 
                className="bg-transparent border-none focus:ring-0 text-sm font-medium w-32 xl:w-48 placeholder:text-gray-400"
            />
          </div>
          
          <div className="flex items-center gap-1 sm:gap-2">
            <Link href="/wishlist" className="p-2 sm:p-2.5 hover:bg-gray-50 rounded-2xl transition-colors relative text-gray-500 group hidden sm:block">
                <Heart size={20} className="group-hover:scale-110 group-hover:text-red-500 transition-all sm:w-[22px] sm:h-[22px]" />
                {wishlistItems.length > 0 && (
                <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 bg-red-500 text-white text-[10px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                >
                    {wishlistItems.length}
                </motion.span>
                )}
            </Link>
            <Link href="/cart" className="p-2 sm:p-2.5 hover:bg-gray-50 rounded-2xl transition-colors relative text-gray-500 group">
                <ShoppingCart size={20} className="group-hover:scale-110 transition-transform sm:w-[22px] sm:h-[22px]" />
                {cartCount > 0 && (
                <motion.span 
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute top-1 right-1 bg-primary text-white text-[10px] font-black w-4 h-4 sm:w-5 sm:h-5 rounded-full flex items-center justify-center shadow-lg border-2 border-white"
                >
                    {cartCount}
                </motion.span>
                )}
            </Link>
 
            {session ? (
                <ProfileDropdown user={session.user} />
            ) : (
                <Link href="/login" className="flex items-center gap-2 pl-2 pr-2 sm:pr-6 py-1.5 sm:py-2.5 bg-primary text-white rounded-[14px] sm:rounded-[18px] font-black hover:bg-primary-dark transition-all transform hover:-translate-y-0.5 active:translate-y-0 group shadow-lg shadow-primary/20">
                    <div className="w-7 h-7 sm:w-8 sm:h-8 bg-white/20 rounded-lg sm:rounded-xl flex items-center justify-center cursor-pointer">
                        <User size={14} className="sm:w-[18px] sm:h-[18px]" />
                    </div>
                    <span className="hidden sm:block text-xs sm:text-sm tracking-tight">Sign In</span>
                </Link>
            )}
          </div>
 
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="p-2 sm:p-2.5 bg-gray-50 text-gray-500 rounded-xl sm:rounded-2xl lg:hidden hover:bg-white border border-transparent hover:border-gray-100 transition-all"
          >
            {isMobileMenuOpen ? <X size={20} className="sm:w-[22px] sm:h-[22px]" /> : <Menu size={20} className="sm:w-[22px] sm:h-[22px]" />}
          </button>
        </div>
      </div>
 
      <AnimatePresence>
        {isMobileMenuOpen && (
            <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="lg:hidden bg-white border-t border-gray-100 overflow-hidden"
            >
                <div className="container-custom py-6 pb-12 flex flex-col gap-4">
                    {/* Mobile Search Box */}
                    <div className="relative group mb-2">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                        <input 
                            type="text" 
                            placeholder="Search products..." 
                            className="w-full pl-12 pr-4 py-4 bg-gray-50 border border-gray-100 rounded-2xl focus:bg-white focus:ring-4 focus:ring-primary/10 transition-all text-sm font-bold"
                        />
                    </div>
 
                    {links.map((link) => {
                        const isActive = pathname === link.href;
                        return (
                            <Link 
                                key={link.name} 
                                href={link.href} 
                                onClick={() => setIsMobileMenuOpen(false)}
                                className={`text-sm sm:text-base font-bold flex items-center gap-4 p-3.5 sm:p-4 rounded-xl sm:rounded-2xl transition-all ${
                                    isActive ? "bg-primary/5 text-primary border border-primary/10" : "text-gray-600 hover:bg-gray-50 border border-transparent"
                                }`}
                            >
                                <div className={`w-8 h-8 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl flex items-center justify-center ${isActive ? "bg-primary text-white" : "bg-gray-100 text-gray-400"}`}>
                                    <link.icon size={16} className="sm:w-[20px] sm:h-[20px]" />
                                </div>
                                {link.name}
                            </Link>
                        )
                    })}
                    
                    <div className="h-px bg-gray-100 my-2" />
                    
                    {!session && (
                        <Link href="/login" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center justify-center p-4 bg-primary text-white rounded-2xl font-black shadow-xl shadow-primary/20 text-sm">
                            Get Started Today
                        </Link>
                    )}
                </div>
            </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Navbar;
