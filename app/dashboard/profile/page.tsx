"use client";

import { useState, useRef, useEffect } from "react";
import { useSession } from "next-auth/react";
import Image from "next/image";
import { 
  Camera, 
  User, 
  Lock, 
  ShieldCheck, 
  Save, 
  ArrowLeft,
  Loader2,
  Sparkles,
  Mail
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function ProfileSettings() {
  const { data: session, update } = useSession();
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  
  // Profile States
  const [name, setName] = useState("");
  const [image, setImage] = useState("");
  
  // Sync state with session on load and updates
  useEffect(() => {
    if (session?.user) {
      if (session.user.name) setName(session.user.name);
      if (session.user.image) setImage(session.user.image);
    }
  }, [session]);
  
  // Password States
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 2 * 1024 * 1024) {
      return toast.error("Identity signature must be under 2MB.");
    }

    setUploading(true);
    const formData = new FormData();
    formData.append("image", file);

    try {
      const res = await fetch(`https://api.imgbb.com/1/upload?key=${process.env.NEXT_PUBLIC_IMGBB_API_KEY}`, {
        method: "POST",
        body: formData,
      });
      const data = await res.json();
      if (data.success) {
        setImage(data.data.url);
        toast.success("Identity visual updated.");
      } else {
        toast.error("Cloud synchronization failed.");
      }
    } catch (error) {
      toast.error("An error occurred during upload.");
    } finally {
      setUploading(false);
    }
  };

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, image }),
      });
      const data = await res.json();

      if (res.ok) {
        // Force session update
        await update({ name, image });
        toast.success("Profile synthesized successfully!");
      } else {
        toast.error(data.error || "Synthesis failed.");
      }
    } catch (err) {
      toast.error("A core error occurred.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setLoading(true);
    try {
      const res = await fetch("/api/user/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Security protocols updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Security update failed.");
      }
    } catch (err) {
      toast.error("Verification error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#FCFCFD] min-h-screen py-12">
      <div className="container-custom max-w-5xl">
        <Link href="/dashboard" className="inline-flex items-center gap-3 text-gray-400 hover:text-primary transition-all mb-12 group font-black text-[10px] uppercase tracking-widest">
          <ArrowLeft size={16} className="group-hover:-translate-x-2 transition-transform" />
          <span>Exit Settings</span>
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Dashboard Profile Sidebar */}
          <div className="lg:col-span-4">
             <div className="bg-white p-10 rounded-[3rem] shadow-2xl shadow-gray-100 border border-white sticky top-12 overflow-hidden group">
                <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
                    <Sparkles size={120} />
                </div>

                <div className="relative mb-10 group/avatar">
                    <div className="relative w-40 h-40 mx-auto bg-zinc-50 rounded-[4rem] overflow-hidden border-8 border-white shadow-2xl transition-transform duration-700 group-hover/avatar:scale-105">
                        {image ? (
                            <Image src={image} alt={name} fill className="object-cover" />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-200">
                                <User size={80} strokeWidth={1} />
                            </div>
                        )}
                        {uploading && (
                            <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                                <Loader2 className="text-primary animate-spin" size={32} />
                            </div>
                        )}
                    </div>
                    <button 
                        onClick={() => fileInputRef.current?.click()}
                        className="absolute bottom-2 right-1/4 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white"
                    >
                        <Camera size={20} />
                    </button>
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleImageUpload} 
                        className="hidden" 
                        accept="image/*" 
                    />
                </div>

                <div className="text-center space-y-2">
                    <h2 className="text-2xl font-black text-foreground tracking-tighter">{name || "Explorer"}</h2>
                    <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary">{session?.user?.role || "USER"}</p>
                    <p className="text-sm font-medium text-gray-400 mt-4 flex items-center justify-center gap-2">
                        <Mail size={14} />
                        {session?.user?.email}
                    </p>
                </div>

                <div className="mt-12 pt-10 border-t border-gray-50 grid grid-cols-2 gap-4">
                    <div className="bg-[#F8FAFC] p-4 rounded-2xl text-center border border-white">
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Status</p>
                        <p className="text-[10px] font-black text-primary uppercase">Active</p>
                    </div>
                    <div className="bg-[#F8FAFC] p-4 rounded-2xl text-center border border-white">
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-400 mb-1">Verified</p>
                        <p className="text-[10px] font-black text-foreground uppercase tracking-widest">Global</p>
                    </div>
                </div>
             </div>
          </div>

          {/* Settings Manifest */}
          <div className="lg:col-span-8 flex flex-col gap-12">
            {/* Profile Information Card */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-100 border border-white relative overflow-hidden"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary border border-primary/5">
                        <User size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-foreground tracking-tighter">Identity Core</h3>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-10">
                    <div className="group">
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-4 ml-2">Public Name</label>
                        <input 
                            type="text" 
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            placeholder="Quantum User"
                            className="w-full bg-[#F8FAFC] border border-white rounded-[2.5rem] p-8 focus:bg-white focus:ring-8 focus:ring-primary/5 transition-all outline-none font-bold text-lg tracking-tight"
                        />
                    </div>
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-foreground text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-primary transition-all duration-500 flex items-center gap-4 active:scale-95 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        <Save size={16} />
                        Synthesize Identity
                    </button>
                </form>
            </motion.div>

            {/* Security Manifest Card */}
            <motion.div 
               initial={{ opacity: 0, x: 20 }}
               animate={{ opacity: 1, x: 0 }}
               transition={{ delay: 0.1 }}
               className="bg-white p-12 rounded-[3.5rem] shadow-2xl shadow-gray-100 border border-white"
            >
                <div className="flex items-center gap-4 mb-10">
                    <div className="w-12 h-12 bg-zinc-50 rounded-2xl flex items-center justify-center text-foreground border border-zinc-100">
                        <ShieldCheck size={24} />
                    </div>
                    <h3 className="text-2xl font-black text-foreground tracking-tighter">Security Protocols</h3>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-8">
                    <div>
                        <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-4 ml-2">Current Authorization Code</label>
                        <div className="relative group/input">
                            <Lock className="absolute left-8 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within/input:text-primary transition-colors" size={20} />
                            <input 
                                type="password" 
                                value={currentPassword}
                                onChange={(e) => setCurrentPassword(e.target.value)}
                                required
                                className="w-full bg-[#F8FAFC] border border-white rounded-[2.5rem] py-8 pl-18 pr-8 focus:bg-white focus:ring-8 focus:ring-primary/5 transition-all outline-none font-bold text-lg tracking-widest"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-4 ml-2">New Protocol</label>
                            <input 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                className="w-full bg-[#F8FAFC] border border-white rounded-[2.5rem] p-8 focus:bg-white focus:ring-8 focus:ring-primary/5 transition-all outline-none font-bold text-lg tracking-widest"
                                placeholder="••••••••"
                            />
                        </div>
                        <div>
                            <label className="text-[10px] font-black uppercase tracking-[0.3em] text-gray-400 block mb-4 ml-2">Final Verification</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                className="w-full bg-[#F8FAFC] border border-white rounded-[2.5rem] p-8 focus:bg-white focus:ring-8 focus:ring-primary/5 transition-all outline-none font-bold text-lg tracking-widest"
                                placeholder="••••••••"
                            />
                        </div>
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="bg-zinc-900 text-white px-10 py-5 rounded-[2rem] font-black text-[10px] uppercase tracking-[0.3em] shadow-xl hover:bg-primary transition-all duration-500 flex items-center gap-4 active:scale-95 disabled:opacity-50"
                    >
                        {loading && <Loader2 className="animate-spin" size={16} />}
                        <Lock size={16} />
                        Update Security
                    </button>
                </form>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
