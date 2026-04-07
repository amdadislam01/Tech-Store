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
  Globe,
  LayoutDashboard,
  ShieldAlert
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
        toast.success("Profile image updated.");
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
        toast.success("Security settings updated.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      } else {
        toast.error(data.error || "Update failed.");
      }
    } catch (err) {
      toast.error("Verification error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Premium Header */}
      <div className="sticky top-0 z-30 border-b border-gray-100 mb-8 px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/dashboard" className="p-2 sm:p-2.5 bg-gray-50 rounded-xl hover:bg-primary/5 hover:text-primary transition-all shadow-sm">
             <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">Profile Settings</h1>
            <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest italic leading-none">Identity & Security</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full border border-emerald-100">
           <BadgeCheck size={14} className="text-emerald-500" />
           <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Active Member</span>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Content Areas */}
          <div className="lg:col-span-8 space-y-10">
            {/* Identity Form */}
             <motion.div 
                id="personal-info"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-white rounded-3xl sm:rounded-[3rem] p-8 sm:p-10 md:p-14 border border-gray-100 shadow-2xl shadow-gray-200/50 relative overflow-hidden scroll-mt-32"
             >
                 <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl" />
                 
                 <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12 relative z-10">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
                         <User size={20} className="sm:w-6 sm:h-6" />
                     </div>
                     <div>
                         <h3 className="text-lg sm:text-2xl font-black text-foreground tracking-tighter">Personal Information</h3>
                         <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest">Update your name and photo</p>
                     </div>
                 </div>

                <form onSubmit={handleProfileUpdate} className="space-y-8 relative z-10">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Full Name</label>
                            <div className="relative group">
                                <input 
                                    type="text" 
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                    placeholder="Enter your name"
                                    className="w-full px-8 py-5 bg-gray-50 rounded-[24px] border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-black text-foreground placeholder:text-gray-300"
                                />
                            </div>
                        </div>
                        <div className="space-y-3 opacity-60">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Email Address (Read-only)</label>
                            <div className="relative group">
                                <input 
                                    type="email" 
                                    disabled
                                    value={session?.user?.email || ""}
                                    className="w-full px-8 py-5 bg-gray-100 rounded-[24px] border border-transparent cursor-not-allowed font-black text-gray-400"
                                />
                                <Mail size={18} className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-300" />
                            </div>
                        </div>
                    </div>

                     <div className="pt-4">
                         <button 
                             type="submit" 
                             disabled={loading}
                             className="w-full sm:w-auto px-10 py-4 sm:px-12 sm:py-5 bg-primary text-white rounded-2xl sm:rounded-[24px] font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-2xl shadow-primary/30 hover:brightness-110 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                         >
                             {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                             Update Profile
                         </button>
                     </div>
                </form>
            </motion.div>

            {/* Security Center */}
             <motion.div 
                id="security-center"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-[#081621] rounded-3xl sm:rounded-[3rem] p-8 sm:p-10 md:p-14 text-white relative overflow-hidden shadow-2xl shadow-gray-200/50 scroll-mt-32"
             >
                 <div className="absolute top-0 right-0 p-12 text-primary/5">
                     <Lock size={200} className="rotate-12" />
                 </div>
                 
                 <div className="flex items-center gap-3 sm:gap-4 mb-8 sm:mb-12 relative z-10">
                     <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-white/10 flex items-center justify-center text-primary border border-white/10 backdrop-blur-md">
                         <ShieldAlert size={20} className="sm:w-6 sm:h-6" />
                     </div>
                     <div>
                         <h3 className="text-lg sm:text-2xl font-black tracking-tighter">Security Center</h3>
                         <p className="text-[9px] sm:text-[10px] text-white/40 font-bold uppercase tracking-widest">Keep your account safe</p>
                     </div>
                 </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-8 relative z-10">
                    <div className="space-y-3">
                        <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Current Password</label>
                        <input 
                            type="password" 
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            required
                            placeholder="Enter current password"
                            className="w-full px-8 py-5 bg-white/5 rounded-[24px] border border-white/10 focus:bg-white/10 focus:border-primary transition-all font-black text-white placeholder:text-white/20"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">New Password</label>
                            <input 
                                type="password" 
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                                placeholder="Min. 8 characters"
                                className="w-full px-8 py-5 bg-white/5 rounded-[24px] border border-white/10 focus:bg-white/10 focus:border-primary transition-all font-black text-white placeholder:text-white/20"
                            />
                        </div>
                        <div className="space-y-3">
                            <label className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 ml-1">Confirm New Password</label>
                            <input 
                                type="password" 
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                                placeholder="Re-type password"
                                className="w-full px-8 py-5 bg-white/5 rounded-[24px] border border-white/10 focus:bg-white/10 focus:border-primary transition-all font-black text-white placeholder:text-white/20"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={loading}
                            className="w-full sm:w-auto px-10 py-4 sm:px-12 sm:py-5 bg-white text-black rounded-2xl sm:rounded-[24px] font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-2xl hover:bg-gray-100 active:scale-95 transition-all flex items-center justify-center gap-3 disabled:opacity-50"
                        >
                            {loading ? <Loader2 className="animate-spin" size={18} /> : <Lock size={18} />}
                            Update Password
                        </button>
                    </div>
                </form>
            </motion.div>
          </div>

          {/* Sidebar Area */}
          <div className="lg:col-span-4 flex flex-col gap-8">
            {/* Profile Card */}
             <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-3xl sm:rounded-[3rem] p-8 sm:p-10 border border-gray-100 shadow-2xl shadow-gray-200/50 flex flex-col items-center text-center relative overflow-hidden"
             >
               <div className="absolute top-0 inset-x-0 h-32 bg-gradient-to-br from-primary/20 via-primary/5 to-transparent -z-0" />
               
               <div className="relative z-10 mb-6 sm:mb-8 group/avatar">
                  <div className="w-32 h-32 sm:w-40 sm:h-40 rounded-2xl sm:rounded-[3rem] overflow-hidden border-4 sm:border-8 border-white shadow-2xl relative">
                    {image ? (
                        <Image src={image} alt={name} fill className="object-cover group-hover/avatar:scale-110 transition-transform duration-700" />
                    ) : (
                        <div className="w-full h-full bg-zinc-50 flex items-center justify-center text-gray-300">
                            <User size={64} />
                        </div>
                    )}
                    {uploading && (
                        <div className="absolute inset-0 bg-white/80 backdrop-blur-md flex items-center justify-center">
                            <Loader2 className="text-primary animate-spin" size={32} />
                        </div>
                    )}
                  </div>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute bottom-1 right-1 w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-xl hover:scale-110 active:scale-90 transition-all border-4 border-white"
                  >
                    <Camera size={18} />
                  </button>
                  <input type="file" ref={fileInputRef} onChange={handleImageUpload} className="hidden" accept="image/*" />
               </div>

               <div className="relative z-10 w-full">
                  <h2 className="text-xl sm:text-2xl font-black text-foreground tracking-tighter truncate px-4">{name || "Tech Explorer"}</h2>
                  <p className="text-[9px] sm:text-[10px] font-black text-primary uppercase tracking-widest mt-2 bg-primary/5 inline-block px-4 py-1.5 rounded-full border border-primary/10 italic">
                    {session?.user?.role || "Member"}
                  </p>
                  
                  <div className="mt-10 py-8 border-y border-gray-50 grid grid-cols-2 gap-4">
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Status</p>
                        <p className="text-xs font-black text-emerald-500">Verified</p>
                     </div>
                     <div>
                        <p className="text-[9px] font-black text-gray-400 uppercase tracking-widest mb-1">Location</p>
                        <p className="text-xs font-black text-foreground">Global</p>
                     </div>
                  </div>

                  <p className="mt-8 text-xs font-medium text-gray-400 italic">"Technology is best when it brings people together."</p>
               </div>
            </motion.div>

            {/* Quick Links Card */}
            <motion.div 
               initial={{ opacity: 0, y: 20 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: 0.2 }}
               className="bg-zinc-900 rounded-[2.5rem] p-8 text-white flex items-center justify-between group cursor-pointer hover:bg-black transition-all"
            >
               <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                     <LayoutDashboard size={20} />
                  </div>
                  <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-white/30">Quick Access</p>
                     <p className="text-sm font-black tracking-tight">Main Dashboard</p>
                  </div>
               </div>
               <ArrowLeft size={18} className="rotate-180 opacity-20 group-hover:opacity-100 transition-all" />
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}