"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { 
  BarChart3, 
  Users, 
  Package, 
  ShoppingCart, 
  User, 
  LogOut,
  ChevronLeft,
  ChevronRight,
  Home,
  Settings,
  CreditCard,
  Heart,
  Store,
  Zap
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

interface SidebarProps {
  role: string;
  isOpenMobile?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ role, isOpenMobile, onClose }: SidebarProps) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Overview", icon: BarChart3, href: "/dashboard", roles: ["super-admin", "admin", "manager", "user"] },
    { name: "Users", icon: Users, href: "/dashboard/users", roles: ["super-admin", "admin"] },
    { name: "Categories", icon: Store, href: "/dashboard/categories", roles: ["super-admin", "admin"] },
    { name: "Products", icon: Package, href: "/dashboard/products", roles: ["super-admin", "admin", "manager"] },
    { name: "Banner", icon: Zap, href: "/dashboard/hero", roles: ["super-admin", "admin"] },
    { name: "Orders", icon: ShoppingCart, href: "/dashboard/orders", roles: ["super-admin", "admin", "manager", "user"] },
    { name: "My Wishlist", icon: Heart, href: "/wishlist", roles: ["super-admin", "admin", "manager", "user"] },
    { name: "Site Settings", icon: Settings, href: "/dashboard/settings", roles: ["super-admin"] },
    { name: "Payments", icon: CreditCard, href: "/dashboard/payments", roles: ["super-admin"] },
    { name: "Profile", icon: User, href: "/dashboard/profile", roles: ["super-admin", "admin", "manager", "user"] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <>
      {/* Mobile Overlay */}
      <AnimatePresence>
        {isOpenMobile && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[45] lg:hidden"
          />
        )}
      </AnimatePresence>

      <motion.aside
        initial={false}
        animate={{ 
          width: isCollapsed ? "80px" : "280px",
          x: isOpenMobile ? 0 : (typeof window !== 'undefined' && window.innerWidth < 1024 ? -280 : 0)
        }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 shadow-xl z-50 flex flex-col transition-all duration-300 lg:translate-x-0 ${
          isOpenMobile ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="p-6 flex items-center justify-between">
          <AnimatePresence mode="wait">
            {!isCollapsed && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="flex items-center gap-2"
              >
                <div className="w-9 h-9 bg-primary rounded-xl flex items-center justify-center text-white shadow-lg shadow-primary/10">
                  <Store size={20} />
                </div>
                <span className="font-black text-xl tracking-tighter text-primary">Tech<span className="text-foreground">Store</span></span>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => {
              if (typeof window !== 'undefined' && window.innerWidth < 1024) {
                onClose?.();
              } else {
                setIsCollapsed(!isCollapsed);
              }
            }}
            className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
          >
            {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>

        <nav className="flex-grow px-4 py-4 space-y-2 overflow-y-auto no-scrollbar">
          <Link
              href="/"
              onClick={() => { if (typeof window !== 'undefined' && window.innerWidth < 1024) onClose?.(); }}
              className="flex items-center gap-4 px-4 py-3 rounded-xl text-gray-500 hover:bg-gray-100 transition-all group"
          >
              <Home size={22} className="group-hover:text-primary transition-colors" />
              {!isCollapsed && <span className="font-medium">Back to Shop</span>}
          </Link>
          <div className="h-px bg-gray-100 my-4 mx-4" />
          {filteredItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => { if (typeof window !== 'undefined' && window.innerWidth < 1024) onClose?.(); }}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl transition-all group relative ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-gray-500 hover:bg-gray-100"
                }`}
              >
                <item.icon size={22} className={isActive ? "text-white" : "group-hover:text-primary transition-colors"} />
                {!isCollapsed && (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="font-medium"
                  >
                    {item.name}
                  </motion.span>
                )}
                {isActive && !isCollapsed && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute right-2 w-1.5 h-6 bg-white/40 rounded-full"
                  />
                )}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button
            onClick={() => signOut({ callbackUrl: "/login" })}
            className="w-full flex items-center gap-4 px-4 py-3 rounded-xl text-red-500 hover:bg-red-50 transition-all font-medium cursor-pointer"
          >
            <LogOut size={22} />
            {!isCollapsed && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>
    </>
  );
};

export default Sidebar;
