"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ShieldCheck, ArrowRight, RefreshCw, Mail } from "lucide-react";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

function VerifyOTPContent() {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [timer, setTimer] = useState(60);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  useEffect(() => {
    if (!email) {
      router.push("/register");
      return;
    }

    const interval = setInterval(() => {
      setTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(interval);
  }, [email, router]);

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (isNaN(Number(element.value))) return false;

    setOtp([...otp.map((d, idx) => (idx === index ? element.value : d))]);

    // Focus next input
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
      toast.error("Please enter the full 6-digit code");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp: otpCode }),
      });
      const data = await res.json();

      if (res.ok) {
        toast.success("Email verified! You can now login.");
        router.push("/login?verified=true");
      } else {
        toast.error(data.message || "Invalid code");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (timer > 0) return;

    setResending(true);
    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (res.ok) {
        toast.success("New code sent to your email!");
        setTimer(60);
        setOtp(["", "", "", "", "", ""]);
      } else {
        const data = await res.json();
        toast.error(data.message || "Failed to resend code");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-[90vh] w-full flex items-center justify-center bg-[#fafafa] py-12 px-4 sm:px-6 relative overflow-hidden font-sans">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary/10 rounded-full blur-[150px] translate-x-1/3 -translate-y-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-indigo-500/10 rounded-full blur-[150px] -translate-x-1/3 translate-y-1/3 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md bg-white rounded-[40px] shadow-2xl shadow-gray-200/60 p-10 sm:p-12 relative z-10 border border-white/50 text-center"
      >
        <div className="w-20 h-20 bg-primary/10 text-primary rounded-3xl mx-auto mb-8 flex items-center justify-center">
          <ShieldCheck size={40} />
        </div>

        <h2 className="text-3xl font-black text-slate-900 mb-4 uppercase tracking-tight">Verify Email</h2>
        <p className="text-slate-500 font-medium mb-10 leading-relaxed">
          We've sent a 6-digit code to <br />
          <span className="text-slate-900 font-bold">{email}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((data, index) => (
              <input
                key={index}
                type="text"
                maxLength={1}
                className="w-12 h-14 sm:w-14 sm:h-16 text-center text-2xl font-black bg-slate-50 border-2 border-transparent rounded-2xl focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-slate-900"
                value={data}
                onChange={(e) => handleChange(e.target, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
              />
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            className="w-full bg-slate-950 text-white py-5 rounded-2xl font-black text-base uppercase tracking-wider hover:bg-primary transition-all shadow-xl shadow-slate-900/10 hover:shadow-primary/20 disabled:opacity-50 flex items-center justify-center gap-3"
          >
            {loading ? "Verifying..." : "Verify Account"}
            {!loading && <ArrowRight size={18} />}
          </motion.button>
        </form>

        <div className="mt-10 pt-8 border-t border-slate-100 italic">
          <p className="text-sm text-slate-400 font-medium mb-4">
            Didn't receive the code?
          </p>
          <button
            onClick={handleResend}
            disabled={timer > 0 || resending}
            className="flex items-center justify-center gap-2 mx-auto font-bold text-primary disabled:text-slate-300 transition-colors group"
          >
            {resending ? (
              <RefreshCw size={18} className="animate-spin" />
            ) : (
              <Mail size={18} className="group-hover:scale-110 transition-transform" />
            )}
            {timer > 0 ? `Resend code in ${timer}s` : "Resend New Code"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function VerifyOTPPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center font-black text-primary animate-pulse">LOADING...</div>}>
      <VerifyOTPContent />
    </Suspense>
  );
}
