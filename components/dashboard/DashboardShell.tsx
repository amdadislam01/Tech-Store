"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, Bell, Search, User, X } from "lucide-react";
import UserDashboardSubNav from "./UserDashboardSubNav";
import { usePathname } from "next/navigation";
import Navbar from "../Navbar";
import Footer from "../Footer";

interface DashboardShellProps {
  children: React.ReactNode;
  user: {
    name?: string | null;
    email?: string | null;
    role: string;
  };
}

export default function DashboardShell({ children, user }: DashboardShellProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();
  
  const isRegularUser = user.role === "user";
  const isMainDashboard = pathname === "/dashboard";
  const useSidebar = !isRegularUser;

  if (isRegularUser) {
    return (
      <div className="min-h-screen bg-[#f2f4f8] flex flex-col">
        <Navbar />
        
        {!isMainDashboard && <UserDashboardSubNav />}
        
        <main className="flex-grow max-w-7xl mx-auto w-full p-4 md:p-8">
          {children}
        </main>
        
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f2f4f8]">
      <Sidebar 
        role={user.role} 
        isOpenMobile={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      <div className="lg:ml-[280px] transition-all min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md px-4 md:px-8 py-4 border-b border-gray-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="p-2 lg:hidden hover:bg-white hover:shadow-sm rounded-xl text-gray-500 border border-transparent transition-all"
            >
              <Menu size={20} />
            </button>
            <div className="relative w-40 md:w-96 group hidden sm:block">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={18} />
              <input
                type="text"
                placeholder="Search data..."
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm shadow-sm"
              />
            </div>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <button className="p-2.5 hover:bg-white hover:shadow-sm rounded-xl text-gray-500 border border-transparent transition-all">
              <Bell size={20} />
            </button>
            <div className="h-8 w-px bg-gray-200 mx-1 md:mx-2" />
            <div className="flex items-center gap-2 md:gap-3 pl-1 md:pl-2">
              <div className="text-right hidden md:block">
                <p className="text-sm font-black text-foreground leading-tight tracking-tight">{user.name}</p>
                <p className="text-[10px] uppercase font-extrabold text-primary tracking-widest">{user.role}</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-sm overflow-hidden">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        <main className="p-4 md:p-8 flex-grow">
          {children}
        </main>
      </div>
    </div>
  );
}
