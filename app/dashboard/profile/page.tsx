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
  Mail,
  BadgeCheck,
  Globe
} from "lucide-react";
import Link from "next/link";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

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
      return toast.error("Image must be under 2MB.");
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
        toast.success("Avatar updated successfully.");
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
        await update({ name, image });
        toast.success("Profile updated successfully!");
      } else {
        toast.error(data.error || "Update failed.");
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
    <div className="bg-[#F9FAFB] min-h-screen pb-20">
      {/* Subtle Top Header */}
      <div className="bg-white/70 backdrop-blur-lg sticky top-0 z-30 border-b border-gray-100 mb-6 sm:mb-8">
        <div className="container-custom max-w-6xl py-4 sm:py-5 flex items-center justify-between px-4 sm:px-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-gray-400 hover:text-primary transition-all font-bold text-[10px] sm:text-sm group">
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            <span>Dashboard</span>
          </Link>
          <div className="text-[9px] sm:text-[10px] font-black text-gray-400 uppercase tracking-[0.15em] sm:tracking-[0.2em]">Account Protocols</div>
        </div>
      </div>

      <div className="container-custom max-w-6xl">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Sidebar Profile Card */}
          <div className="lg:col-span-4 px-4 sm:px-0">
            <div className="bg-white rounded-[2rem] sm:rounded-[2.5rem] p-6 sm:p-8 shadow-sm border border-gray-100 sticky top-24 overflow-hidden">
              <div className="absolute top-[-10%] right-[-10%] text-primary/5 rotate-12">
                <Sparkles size={160} />
              </div>

              <div className="relative flex flex-col items-center">
                <div className="relative group/avatar mb-6">
                  <div className="w-32 h-32 rounded-[2.5rem] overflow-hidden ring-4 ring-gray-50 shadow-inner relative transition-transform duration-500 group-hover/avatar:scale-105">
                    {image ? (
                      <Image src={image} alt={name} fill className="object-cover" />
                    ) : (
                      <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-gray-300">
                        <User size={50} strokeWidth={1.5} />
                      </div>
                    )}
                    {uploading && (
                      <div className="absolute inset-0 bg-white/80 backdrop-blur-sm flex items-center justify-center">
                        <Loader2 className="text-primary animate-spin" size={24} />
                      </div>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute -bottom-2 -right-2 bg-primary text-white p-3 rounded-2xl shadow-xl hover:scale-110 active:scale-95 transition-all border-4 border-white"
                  >
                    <Camera size={18} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
                </div>

                <div className="text-center space-y-1">
                  <h2 className="text-xl font-bold text-gray-900 tracking-tight">{name || "Explorer"}</h2>
                  <div className="flex items-center justify-center gap-1.5 py-1 px-3 bg-primary/5 rounded-full inline-flex">
                    <BadgeCheck size={14} className="text-primary" />
                    <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{session?.user?.role || "Member"}</span>
                  </div>
                  <p className="text-sm font-medium text-gray-400 pt-3 flex items-center justify-center gap-2">
                    <Mail size={14} />
                    {session?.user?.email}
                  </p>
                </div>

                <div className="w-full mt-10 pt-8 border-t border-gray-50 grid grid-cols-2 gap-3">
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Status</p>
                    <p className="text-xs font-bold text-green-600">Verified</p>
                  </div>
                  <div className="bg-gray-50/50 p-4 rounded-2xl border border-gray-100 text-center">
                    <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mb-1">Network</p>
                    <p className="text-xs font-bold text-gray-700 uppercase">Global</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Main Settings Forms */}
          <div className="lg:col-span-8 space-y-6 sm:space-y-8 px-4 sm:px-0">
            
            {/* Identity Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-gray-50 flex items-center gap-4">
                <div className="w-10 h-10 bg-primary/10 rounded-xl flex items-center justify-center text-primary">
                  <User size={20} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Identity Details</h3>
              </div>
              
              <div className="p-6 sm:p-10">
                <form onSubmit={handleProfileUpdate} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Full Name</label>
                    <input 
                      type="text" 
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      required
                      placeholder="e.g. Alex Quantum"
                      className="w-full bg-gray-50 border border-transparent rounded-[20px] px-6 py-3.5 sm:py-4 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none font-medium text-gray-900 text-sm"
                    />
                  </div>
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white px-8 py-3.5 sm:py-4 rounded-[20px] font-bold text-sm shadow-lg shadow-primary/20 transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    Save Changes
                  </button>
                </form>
              </div>
            </motion.div>

            {/* Security Card */}
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-[2rem] sm:rounded-[2.5rem] shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-6 sm:px-10 py-6 sm:py-8 border-b border-gray-50 flex items-center gap-4">
                <div className="w-10 h-10 bg-zinc-100 rounded-xl flex items-center justify-center text-zinc-900">
                  <ShieldCheck size={20} />
                </div>
                <h3 className="text-base sm:text-lg font-bold text-gray-900 tracking-tight">Security & Password</h3>
              </div>
              
              <div className="p-6 sm:p-10">
                <form onSubmit={handlePasswordUpdate} className="space-y-8">
                  <div className="space-y-2">
                    <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Current Password</label>
                    <div className="relative group">
                      <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-gray-300 group-focus-within:text-primary transition-colors" size={18} />
                      <input 
                        type="password" 
                        value={currentPassword}
                        onChange={(e) => setCurrentPassword(e.target.value)}
                        required
                        placeholder="••••••••••••"
                        className="w-full bg-gray-50 border border-transparent rounded-[20px] py-3.5 sm:py-4 pl-14 pr-6 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none font-medium text-sm"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">New Password</label>
                      <input 
                        type="password" 
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        placeholder="Min. 8 characters"
                        className="w-full bg-gray-50 border border-transparent rounded-[20px] px-6 py-3.5 sm:py-4 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none font-medium text-sm"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest ml-1">Confirm New Password</label>
                      <input 
                        type="password" 
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        placeholder="Repeat password"
                        className="w-full bg-gray-50 border border-transparent rounded-[20px] px-6 py-3.5 sm:py-4 focus:bg-white focus:ring-4 focus:ring-primary/5 focus:border-primary/20 transition-all outline-none font-medium text-sm"
                      />
                    </div>
                  </div>
                  
                  <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full sm:w-auto bg-zinc-900 hover:bg-black text-white px-8 py-3.5 sm:py-4 rounded-[20px] font-bold text-sm shadow-xl transition-all flex items-center justify-center gap-2 active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                    Update Security
                  </button>
                </form>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}