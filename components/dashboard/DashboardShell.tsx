"use client";

import { useState } from "react";
import Sidebar from "./Sidebar";
import { Menu, Bell, Search, User, X } from "lucide-react";

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

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <Sidebar 
        role={user.role} 
        isOpenMobile={isMobileMenuOpen} 
        onClose={() => setIsMobileMenuOpen(false)} 
      />
      
      <div className="lg:ml-[280px] transition-all bg-[#F8FAFC]">
        {/* Header */}
        <header className="sticky top-0 z-30 bg-[#F8FAFC]/80 backdrop-blur-md px-4 md:px-8 py-4 border-b border-gray-100 flex items-center justify-between">
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
                className="w-full pl-12 pr-4 py-2.5 rounded-xl border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
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
                <p className="text-sm font-bold text-foreground leading-tight">{user.name}</p>
                <p className="text-[10px] uppercase font-extrabold text-primary tracking-wider">{user.role}</p>
              </div>
              <div className="w-9 h-9 md:w-10 md:h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary border border-primary/20 shadow-sm overflow-hidden">
                <User size={20} />
              </div>
            </div>
          </div>
        </header>

        {/* Mobile Search - Only visible on very small screens where the main search is hidden */}
        <div className="p-4 sm:hidden bg-white border-b border-gray-100">
           <div className="relative group">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
              <input
                type="text"
                placeholder="Search data..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-gray-200 bg-gray-50 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all text-sm"
              />
            </div>
        </div>

        {/* Main Content */}
        <main className="p-4 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
