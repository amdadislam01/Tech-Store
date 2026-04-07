"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { User, LogOut, LayoutDashboard, ChevronDown, Shield, UserCircle } from "lucide-react";
import { signOut } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

interface ProfileDropdownProps {
  user: {
    name?: string | null;
    email?: string | null;
    role?: string | null;
    image?: string | null;
  };
}

const ProfileDropdown = ({ user }: ProfileDropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-3 p-1.5 hover:bg-zinc-100 rounded-2xl transition-all group"
      >
        <div className="w-10 h-10 rounded-xl overflow-hidden shadow-sm border border-black/5 flex items-center justify-center bg-primary/10 text-primary transition-all group-hover:scale-105">
          {user.image ? (
            <Image src={user.image} alt={user.name || ""} width={40} height={40} className="object-cover w-full h-full" />
          ) : (
            <User size={20} />
          )}
        </div>
        <div className="hidden sm:block text-left">
          <p className="text-[11px] font-black text-foreground leading-tight truncate max-w-[100px] tracking-tight">{user.name}</p>
          <p className="text-[9px] uppercase font-bold text-primary tracking-[0.2em] mt-0.5">{user.role}</p>
        </div>
        <ChevronDown size={14} className={`text-gray-300 transition-transform duration-500 ${isOpen ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.95 }}
            className="absolute right-0 mt-4 w-[280px] max-w-[calc(100vw-1.5rem)] sm:w-80 bg-white rounded-[24px] sm:rounded-[32px] shadow-[0_30px_90px_rgba(0,0,0,0.12)] border border-gray-100 p-2 sm:p-3 z-50 overflow-hidden"
          >
            <div className="px-4 py-4 sm:px-5 sm:py-6 bg-zinc-50/50 rounded-[22px] sm:rounded-[28px] mb-2 sm:mb-3 border border-gray-50">
                <div className="flex items-center gap-3 sm:gap-4 mb-4">
                    <div className="w-11 h-11 sm:w-14 sm:h-14 rounded-xl sm:rounded-2xl overflow-hidden border-2 sm:border-4 border-white shadow-lg bg-white flex items-center justify-center text-primary">
                        {user.image ? (
                            <Image src={user.image} alt={user.name || ""} width={56} height={56} className="object-cover w-full h-full" />
                        ) : (
                            <UserCircle size={32} strokeWidth={1} />
                        )}
                    </div>
                    <div className="flex-1 min-w-0">
                        <p className="text-xs sm:text-sm font-black text-foreground truncate tracking-tighter">{user.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold truncate tracking-tight">{user.email}</p>
                    </div>
                </div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/10 text-primary rounded-lg text-[8px] sm:text-[9px] font-black uppercase tracking-[0.2em] border border-primary/10">
                    <Shield size={10} className="fill-primary/20" />
                    {user.role}
                </div>
            </div>
 
            <div className="px-1 sm:px-2 space-y-1">
                <Link
                href="/dashboard"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl text-gray-600 hover:bg-zinc-50 hover:text-primary transition-all group"
                >
                    <div className="flex items-center gap-3 sm:gap-4">
                        <LayoutDashboard size={18} className="group-hover:scale-110 transition-transform" />
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest leading-none">Dashboard</span>
                    </div>
                    <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
                
                <Link
                href="/dashboard/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-between px-4 py-3 sm:px-5 sm:py-4 rounded-xl sm:rounded-2xl text-gray-600 hover:bg-zinc-50 hover:text-primary transition-all group"
                >
                    <div className="flex items-center gap-3 sm:gap-4">
                        <User size={18} className="group-hover:rotate-10 transition-transform" />
                        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-widest leading-none">Profile</span>
                    </div>
                    <ChevronDown size={14} className="-rotate-90 opacity-0 group-hover:opacity-100 transition-all" />
                </Link>
            </div>
 
            <div className="h-px bg-gray-50 my-2 sm:my-4 mx-4 sm:mx-6" />
 
            <div className="px-1 sm:px-2">
                <button
                onClick={() => {
                    setIsOpen(false);
                    signOut({ callbackUrl: "/login" });
                }}
                className="w-full flex items-center gap-3 sm:gap-4 px-4 py-3.5 sm:px-5 sm:py-4 rounded-xl sm:rounded-[22px] text-red-500 hover:bg-red-50 transition-all font-black text-[10px] sm:text-[11px] uppercase tracking-[0.2em] cursor-pointer"
                >
                <LogOut size={18} />
                Log Out
                </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfileDropdown;
