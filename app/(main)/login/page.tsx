"use client";

import { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { 
  LogIn, Mail, Lock, ArrowRight, ShieldCheck, Quote, Eye, EyeOff, 
  User, Briefcase, Shield, Crown, Sparkles, Loader2, KeyRound, CheckCircle2 
} from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import Image from "next/image";

const DEMO_ROLES = [
  {
    role: "user",
    title: "User",
    subtitle: "Customer Access",
    email: "user@demo.com",
    password: "password123",
    icon: User,
    gradient: "from-blue-500/10 via-indigo-500/5 to-transparent",
    border: "border-blue-200/80 hover:border-blue-400",
    iconColor: "text-blue-600 bg-blue-500/10 group-hover:bg-blue-600 group-hover:text-white",
    badge: "bg-blue-100/80 text-blue-700",
  },
  {
    role: "manager",
    title: "Manager",
    subtitle: "Store Manager",
    email: "manager@demo.com",
    password: "password123",
    icon: Briefcase,
    gradient: "from-emerald-500/10 via-teal-500/5 to-transparent",
    border: "border-emerald-200/80 hover:border-emerald-400",
    iconColor: "text-emerald-600 bg-emerald-500/10 group-hover:bg-emerald-600 group-hover:text-white",
    badge: "bg-emerald-100/80 text-emerald-700",
  },
  {
    role: "admin",
    title: "Admin",
    subtitle: "System Admin",
    email: "admin@demo.com",
    password: "password123",
    icon: Shield,
    gradient: "from-amber-500/10 via-orange-500/5 to-transparent",
    border: "border-amber-200/80 hover:border-amber-400",
    iconColor: "text-amber-600 bg-amber-500/10 group-hover:bg-amber-600 group-hover:text-white",
    badge: "bg-amber-100/80 text-amber-700",
  },
  {
    role: "super-admin",
    title: "Super Admin",
    subtitle: "Full Access",
    email: "superadmin@demo.com",
    password: "password123",
    icon: Crown,
    gradient: "from-purple-500/10 via-pink-500/5 to-transparent",
    border: "border-purple-200/80 hover:border-purple-400",
    iconColor: "text-purple-600 bg-purple-500/10 group-hover:bg-purple-600 group-hover:text-white",
    badge: "bg-purple-100/80 text-purple-700",
  },
];

function LoginContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [activeDemo, setActiveDemo] = useState<string | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

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
      router.push(callbackUrl);
      router.refresh();
    }
  };

  const handleDemoLogin = async (demo: typeof DEMO_ROLES[0]) => {
    setActiveDemo(demo.role);
    setEmail(demo.email);
    setPassword(demo.password);

    try {
      await fetch("/api/auth/seed-demo", { method: "POST" });

      const result = await signIn("credentials", {
        email: demo.email,
        password: demo.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(result.error);
      } else {
        toast.success(`Logged in as ${demo.title}!`);
        const targetUrl = callbackUrl !== "/" ? callbackUrl : (demo.role !== "user" ? "/dashboard" : "/");
        router.push(targetUrl);
        router.refresh();
      }
    } catch (err) {
      toast.error("Demo login failed. Please try again.");
    } finally {
      setActiveDemo(null);
    }
  };

  return (
    <div className="min-h-[92vh] w-full flex items-center justify-center bg-slate-50/60 py-10 px-4 sm:px-6 relative overflow-hidden">
        {/* Background Ambient Glows */}
        <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-primary/10 rounded-full blur-[160px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-500/10 rounded-full blur-[160px] pointer-events-none" />

        <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="w-full max-w-5xl bg-white/90 backdrop-blur-xl rounded-[36px] shadow-2xl shadow-slate-200/80 overflow-hidden flex flex-col lg:flex-row relative z-10 border border-slate-200/60"
        >
            {/* Left Side: Login Form */}
            <div className="w-full lg:w-[54%] p-8 sm:p-12 flex flex-col justify-center relative">
                {/* Header */}
                <div className="mb-6">
                    <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4">
                        <KeyRound size={14} />
                        <span>Secure Authentication</span>
                    </div>
                    <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-tight">
                        Welcome <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-blue-600">Back</span>
                    </h2>
                    <p className="text-slate-500 font-medium text-sm mt-1">
                        Sign in to access your dashboard, track orders, and manage settings.
                    </p>
                </div>

                {/* Clean Quick Demo Login Cards */}
                <div className="mb-6">
                    <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-1.5">
                            <Sparkles size={14} className="text-amber-500 fill-amber-500/20" />
                            <span className="text-xs font-bold text-slate-700 uppercase tracking-wider">Demo Accounts</span>
                        </div>
                        <span className="text-[11px] font-semibold text-slate-400">One-click sign in</span>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                        {DEMO_ROLES.map((demo) => {
                          const IconComponent = demo.icon;
                          const isLoadingThis = activeDemo === demo.role;

                          return (
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              key={demo.role}
                              type="button"
                              onClick={() => handleDemoLogin(demo)}
                              disabled={loading || activeDemo !== null}
                              className={`group relative p-3 rounded-2xl border text-left bg-gradient-to-br transition-all duration-200 cursor-pointer shadow-sm hover:shadow-md ${demo.gradient} ${demo.border} disabled:opacity-50`}
                            >
                              <div className="flex items-center justify-between mb-1.5">
                                <div className="flex items-center gap-2">
                                  <div className={`p-1.5 rounded-xl transition-all duration-200 ${demo.iconColor}`}>
                                    <IconComponent size={14} />
                                  </div>
                                  <span className="text-xs font-bold text-slate-900 group-hover:text-primary transition-colors">
                                    {demo.title}
                                  </span>
                                </div>
                                {isLoadingThis ? (
                                  <Loader2 size={13} className="animate-spin text-slate-600" />
                                ) : (
                                  <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-md ${demo.badge}`}>
                                    {demo.role}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 font-medium truncate pl-0.5">{demo.subtitle}</p>
                            </motion.button>
                          );
                        })}
                    </div>
                </div>

                {/* Divider */}
                <div className="relative flex items-center justify-center mb-6">
                    <div className="w-full border-t border-slate-200/80" />
                    <span className="absolute bg-white px-3 text-[11px] font-semibold text-slate-400 uppercase tracking-widest">Or login with email</span>
                </div>

                {/* Main Login Form */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <div>
                        <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500 ml-1 mb-1.5 block">Email Address</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type="email"
                                required
                                className="w-full pl-12 pr-4 py-3.5 bg-slate-50/80 rounded-xl border border-slate-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-sm text-slate-900 placeholder:text-slate-400"
                                placeholder="name@example.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                    </div>

                    <div>
                        <div className="flex items-center justify-between ml-1 mb-1.5">
                            <label className="text-[11px] font-bold uppercase tracking-wider text-slate-500">Password</label>
                            <Link href="/forgot-password" className="text-xs font-bold text-primary hover:underline">Forgot password?</Link>
                        </div>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={18} />
                            <input
                                type={showPassword ? "text" : "password"}
                                required
                                className="w-full pl-12 pr-12 py-3.5 bg-slate-50/80 rounded-xl border border-slate-200 focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/10 transition-all font-semibold text-sm text-slate-900 placeholder:text-slate-400"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors cursor-pointer"
                            >
                                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                            </button>
                        </div>
                    </div>

                    <motion.button
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        type="submit"
                        disabled={loading || activeDemo !== null}
                        className="w-full bg-slate-900 hover:bg-primary text-white py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all shadow-lg shadow-slate-900/10 hover:shadow-primary/25 disabled:opacity-50 flex items-center justify-center gap-2.5 mt-2 cursor-pointer"
                    >
                        {loading ? (
                            <>
                              <Loader2 size={18} className="animate-spin" />
                              <span>Signing in...</span>
                            </>
                        ) : (
                            <>
                              <span>Sign In</span>
                              <ArrowRight size={16} />
                            </>
                        )}
                    </motion.button>
                </form>

                {/* Footer */}
                <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-5">
                    <p className="text-xs text-slate-500 font-medium">
                        Don't have an account?{" "}
                        <Link href="/register" className="font-bold text-primary hover:underline">
                            Register now
                        </Link>
                    </p>
                    <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                        <ShieldCheck size={13} className="text-emerald-500" />
                        <span>SSL Encrypted</span>
                    </div>
                </div>
            </div>

            {/* Right Side: Full Coverage Image */}
            <div className="w-full lg:w-[46%] relative hidden lg:block overflow-hidden">
                <Image 
                    src="https://images.unsplash.com/photo-1498049794561-7780e7231661?auto=format&fit=crop&w=1600&q=80" 
                    alt="Tech Store Setup" 
                    fill
                    priority
                    sizes="50vw"
                    className="object-cover hover:scale-105 transition-all duration-700 ease-out"
                />
                {/* Subtle Gradient Scrim for Contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

                {/* Floating Info Badges */}
                <div className="absolute top-8 left-8 flex flex-col gap-2 z-10">
                    <div className="bg-white/80 backdrop-blur-md border border-white/40 px-3.5 py-1.5 rounded-full flex items-center gap-2 text-slate-900 text-xs font-bold shadow-lg">
                        <CheckCircle2 size={14} className="text-emerald-500" />
                        <span>Role-Based Access Control</span>
                    </div>
                </div>
                
                {/* Testimonial Overlay */}
                <div className="absolute inset-0 p-8 flex flex-col justify-end z-10">
                    <motion.div 
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 }}
                        className="bg-slate-900/40 backdrop-blur-xl border border-white/20 p-6 rounded-2xl shadow-2xl text-white"
                    >
                        <Quote className="text-white/80 mb-3" size={28} />
                        <p className="text-base text-white font-medium leading-relaxed mb-4">
                            "The ecosystem provided by Tech Store completely transformed how our team approaches hardware management."
                        </p>
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-full border border-white/30 relative overflow-hidden">
                                 <Image src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=150&q=80" alt="Sarah J." fill className="object-cover" />
                            </div>
                            <div>
                                <h4 className="text-white text-sm font-bold">Sarah Jenkins</h4>
                                <p className="text-[10px] font-semibold text-white/70 uppercase tracking-wider">Lead Architect, Nexus</p>
                            </div>
                        </div>
                    </motion.div>
                </div>
            </div>
        </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
        <div className="min-h-[90vh] w-full flex items-center justify-center bg-[#fafafa]">
            <div className="animate-pulse flex flex-col items-center gap-4">
                <div className="w-16 h-16 bg-primary/10 rounded-2xl" />
                <div className="h-8 w-48 bg-slate-200 rounded-lg" />
            </div>
        </div>
    }>
      <LoginContent />
    </Suspense>
  );
}

