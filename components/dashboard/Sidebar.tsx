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
  Heart
} from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { signOut } from "next-auth/react";

interface SidebarProps {
  role: string;
}

const Sidebar = ({ role }: SidebarProps) => {
  const pathname = usePathname();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const menuItems = [
    { name: "Overview", icon: BarChart3, href: "/dashboard", roles: ["super-admin", "admin", "manager", "user"] },
    { name: "Users", icon: Users, href: "/dashboard/users", roles: ["super-admin", "admin"] },
    { name: "Products", icon: Package, href: "/dashboard/products", roles: ["super-admin", "admin", "manager"] },
    { name: "Orders", icon: ShoppingCart, href: "/dashboard/orders", roles: ["super-admin", "admin", "manager", "user"] },
    { name: "My Wishlist", icon: Heart, href: "/wishlist", roles: ["super-admin", "admin", "manager", "user"] },
    { name: "Site Settings", icon: Settings, href: "/dashboard/settings", roles: ["super-admin"] },
    { name: "Payments", icon: CreditCard, href: "/dashboard/payments", roles: ["super-admin"] },
    { name: "Profile", icon: User, href: "/dashboard/profile", roles: ["super-admin", "admin", "manager", "user"] },
  ];

  const filteredItems = menuItems.filter(item => item.roles.includes(role));

  return (
    <motion.aside
      initial={false}
      animate={{ width: isCollapsed ? "80px" : "280px" }}
      className="fixed left-0 top-0 h-screen bg-white border-r border-gray-100 shadow-xl z-50 flex flex-col transition-all duration-300"
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
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xl">T</span>
              </div>
              <span className="font-extrabold text-xl tracking-tight text-foreground">TechStore</span>
            </motion.div>
          )}
        </AnimatePresence>
        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 transition-colors"
        >
          {isCollapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
        </button>
      </div>

      <nav className="flex-grow px-4 py-4 space-y-2">
        <Link
            href="/"
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
  );
};

export default Sidebar;
