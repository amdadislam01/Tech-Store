"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Mail, ArrowRight, HelpCircle, ArrowLeft } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Reset code sent! Check your inbox.");
        router.push(`/reset-password?email=${encodeURIComponent(email)}`);
      } else {
        toast.error(data.message || "Something went wrong");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] w-full flex items-center justify-center bg-[#fafafa] py-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] -translate-x-1/2 -translate-y-1/2 pointer-events-none" />
      
      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-gray-200/60 p-10 sm:p-12 relative z-10 border border-white/50 text-center"
      >
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl mx-auto mb-8 flex items-center justify-center">
          <HelpCircle size={32} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight leading-tight">Forgot Password?</h2>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed italic">
          No worries. Enter your email and we'll send you a 6-digit code to reset your password.
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-left">
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

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-base uppercase tracking-wider hover:bg-primary transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? "Sending..." : "Send Reset Code"}
            {!loading && <ArrowRight size={18} />}
          </motion.button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 italic">
          <Link href="/login" className="flex items-center justify-center gap-2 mx-auto font-bold text-slate-400 hover:text-primary transition-colors group">
            <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
            Back to Sign In
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
