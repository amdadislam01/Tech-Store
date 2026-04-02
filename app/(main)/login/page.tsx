"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LogIn, Mail, Lock, ArrowRight, ShieldCheck, Quote } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Image from "next/image";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);

    if (result?.error) {
      toast.error(result.error);
    } else {
      toast.success("Logged in successfully!");
      router.push("/");
      router.refresh();
    }
  };

  return (
    <div className="min-h-[90vh] w-full flex items-center justify-center bg-[#fafafa] py-12 px-4 sm:px-6 relative overflow-hidden">
        {/* Abstract Background Orbs */}
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

        <motion.div 
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-6xl bg-white rounded-[40px] shadow-2xl shadow-gray-200/60 overflow-hidden flex flex-col lg:flex-row relative z-10 border border-white/50"
        >
            {/* Left Side: Form Area */}
            <div className="w-full lg:w-1/2 p-10 sm:p-16 lg:p-20 flex flex-col justify-center relative">
                <div className="mb-12">
                    <motion.div 
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.3 }}
                        className="w-16 h-16 bg-primary/10 text-primary rounded-2xl mb-8 flex items-center justify-center"
                    >
                        <LogIn size={28} />
                    </motion.div>
                    <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[1.1] mb-4">
                        Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600 italic font-serif">Back</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-lg leading-relaxed">Sign in to your account to track orders, save favorites, and discover the latest tech.</p>
                </div>

                <form className="space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="email"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-medium"
                                placeholder="you@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <div className="flex items-center justify-between ml-1 mb-1">
                            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">Password</label>
                            <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-primary hover:text-primary-dark transition-colors">Forgot password?</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                            <input
                                type="password"
                                required
                                className="w-full pl-14 pr-6 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 placeholder:text-slate-300"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01, translateY: -2 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading}
                        className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-base uppercase tracking-wider hover:bg-primary transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
                    >
                        {loading ? "Signing in..." : "Sign In"}
                        {!loading && <ArrowRight size={18} />}
                    </motion.button>
                </form>

                <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-8">
                    <p className="text-sm text-slate-500 font-medium">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-bold text-primary hover:text-primary-dark transition-colors inline-block group border-b border-primary/30 pb-0.5">
                            Create an account
                        </Link>
                    </p>
                    <div className="flex items-center gap-1.5 text-[10px] font-black uppercase tracking-[0.2em] text-slate-300">
                        <ShieldCheck size={14} />
                        <span>Secure</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Immersive Visuals */}
            <div className="w-full lg:w-1/2 relative hidden lg:block bg-slate-950 p-3">
                <div className="relative w-full h-full rounded-[30px] overflow-hidden">
                    <Image 
                        src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=80" 
                        alt="Tech Store Premium Setup" 
                        fill
                        sizes="50vw"
                        className="object-cover opacity-80 mix-blend-luminosity hover:mix-blend-normal hover:scale-105 transition-all duration-1000 ease-out"
                    />
                    {/* Gradients */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                    <div className="absolute inset-0 bg-primary/10 mix-blend-overlay" />
                    
                    {/* Content Overlay */}
                    <div className="absolute inset-0 p-12 flex flex-col justify-end">
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 0.6 }}
                            className="bg-white/10 backdrop-blur-2xl border border-white/20 p-8 rounded-3xl"
                        >
                            <Quote className="text-primary/60 mb-4" size={32} />
                            <p className="text-xl md:text-2xl text-white font-medium leading-relaxed mb-6">
                                "The ecosystem provided by Tech Store completely transformed how our studio approaches hardware deployment."
                            </p>
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 rounded-full border-2 border-white/20 relative overflow-hidden">
                                     <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Sarah J." fill className="object-cover" />
                                </div>
                                <div>
                                    <h4 className="text-white font-black">Sarah Jenkins</h4>
                                    <p className="text-[10px] font-black uppercase tracking-widest text-white/50">Lead Architect, Nexus</p>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </div>
            </div>
        </motion.div>
    </div>
  );
}
