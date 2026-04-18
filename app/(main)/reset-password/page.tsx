"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, Lock, KeyRound, Eye, EyeOff } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function ResetPasswordContent() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const emailParam = searchParams.get("email");
    if (!emailParam) {
      router.push("/forgot-password");
      return;
    }
    setEmail(emailParam);
  }, [searchParams, router]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;
    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);
    if (element.nextSibling && element.value !== "") {
      (element.nextSibling as HTMLInputElement).focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (otp[index] === "" && e.currentTarget.previousSibling) {
        (e.currentTarget.previousSibling as HTMLInputElement).focus();
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const otpCode = otp.join("").trim();

    if (otpCode.length !== 6) {
      toast.error("Please enter the full 6-digit reset code");
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    if (newPassword.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode, newPassword }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Password reset successful! Please login.");
        router.push("/login");
      } else {
        toast.error(data.message || "Invalid code or expired");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[90vh] w-full flex items-center justify-center bg-[#fafafa] py-12 px-4 sm:px-6 relative overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[150px] translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-gray-200/60 p-10 sm:p-12 relative z-10 border border-white/50 text-center"
      >
        <div className="w-16 h-16 bg-primary/10 text-primary rounded-2xl mx-auto mb-8 flex items-center justify-center">
          <KeyRound size={32} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight leading-tight">Reset Password</h2>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed italic">
          Set a new password for your account <br /><span className="text-slate-900 font-bold not-italic">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2 text-left">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Verification Code</label>
            <div className="flex justify-between gap-2 sm:gap-3">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength={1}
                  className="w-10 h-12 sm:w-12 sm:h-14 text-center text-xl font-black bg-slate-50 border-2 border-transparent rounded-xl focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-slate-900"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                />
              ))}
            </div>
          </div>

          <div className="space-y-4 text-left">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">New Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type={showNewPassword ? "text" : "password"}
                  required
                  className="w-full pl-14 pr-14 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-medium"
                  placeholder="••••••••"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowNewPassword(!showNewPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                >
                  {showNewPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 ml-1 block">Confirm Password</label>
              <div className="relative group">
                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  required
                  className="w-full pl-14 pr-14 py-4 bg-slate-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all font-bold text-slate-900 placeholder:text-slate-300 placeholder:font-medium"
                  placeholder="••••••••"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-base uppercase tracking-wider hover:bg-primary transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? "Resetting..." : "Update Password"}
            {!loading && <ArrowRight size={18} />}
          </motion.button>
        </form>
      </motion.div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-primary animate-pulse italic uppercase tracking-widest">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
