"use client";

import { useState, useEffect } from "react";
import { 
  X, 
  Copy, 
  ShieldCheck, 
  Zap, 
  CheckCircle2, 
  Loader2, 
  Info,
  CreditCard
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface PaymentModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function PaymentModal({ order, isOpen, onClose }: PaymentModalProps) {
  const router = useRouter();
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (isOpen) {
      fetch("/api/settings")
        .then(res => res.json())
        .then(data => {
          setSettings(data);
          setLoading(false);
        });
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/orders/${order._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            transactionId,
            status: "Pending" // Move to 'Awaiting Review' after proof submission
        }),
      });

      if (res.ok) {
        toast.success("Payment proof submitted!");
        onClose();
        router.refresh();
      } else {
        toast.error("Failed to submit and verify transaction");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setSubmitting(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success("Copied to clipboard!");
  };

  const paymentMethod = order.paymentMethod;
  const getMFSNumber = () => {
    if (paymentMethod === "bkash") return settings?.bkashNumber;
    if (paymentMethod === "nagad") return settings?.nagadNumber;
    if (paymentMethod === "rocket") return settings?.rocketNumber;
    return null;
  };

  const mfsNumber = getMFSNumber();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-xl bg-white rounded-[40px] shadow-2xl overflow-hidden pt-2"
          >
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-primary-dark" />
            
            <div className="p-8 md:p-12">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">Complete Payment</h2>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1 flex items-center gap-1.5">
                    <ShieldCheck size={12} className="text-primary" />
                    Order Proof Submission
                  </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"
                >
                  <X size={24} />
                </button>
              </div>

              {loading ? (
                <div className="py-12 flex flex-col items-center justify-center gap-3">
                  <Loader2 className="animate-spin text-primary" size={32} />
                  <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest">Loading Gateway...</p>
                </div>
              ) : (
                <div className="space-y-8">
                  <div className="bg-primary/5 rounded-[32px] p-6 border border-primary/10">
                    <div className="flex items-center justify-between mb-4">
                        <span className="text-[10px] text-primary font-black uppercase tracking-widest bg-primary/10 px-3 py-1 rounded-full">
                            Pay via {paymentMethod.toUpperCase()}
                        </span>
                        <span className="text-xl font-black text-primary">৳{order.totalPrice.toFixed(2)}</span>
                    </div>
                    
                    <p className="text-gray-600 text-sm font-medium leading-relaxed mb-6">
                        {settings?.paymentInstructions || `Please send the total amount to the ${paymentMethod.toUpperCase()} merchant number below.`}
                    </p>

                    <div className="p-5 bg-white rounded-2xl border border-primary/20 shadow-sm flex items-center justify-between group">
                        <div>
                            <span className="text-[9px] text-gray-400 font-bold uppercase tracking-widest block mb-1">Send money to</span>
                            {mfsNumber ? (
                                <span className="text-xl font-black text-foreground tracking-tight">{mfsNumber}</span>
                            ) : (
                                <span className="text-sm font-black text-red-500 italic">No number set</span>
                            )}
                        </div>
                        {mfsNumber && (
                            <button 
                                onClick={() => copyToClipboard(mfsNumber)}
                                className="p-3 bg-gray-50 hover:bg-primary hover:text-white rounded-xl transition-all"
                            >
                                <Copy size={18} />
                            </button>
                        )}
                    </div>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-2.5">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                        <Info size={12} />
                        Transaction ID (ট্রানজেকশন আইডি)
                      </label>
                      <input
                        type="text"
                        required
                        className="w-full px-6 py-4 bg-gray-50 rounded-2xl border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-black text-lg text-foreground placeholder:text-gray-300"
                        placeholder="TRX123456789"
                        value={transactionId}
                        onChange={(e) => setTransactionId(e.target.value)}
                      />
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.99 }}
                      disabled={submitting}
                      type="submit"
                      className="w-full bg-primary text-white py-5 rounded-2xl font-black text-lg shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      {submitting ? <Loader2 className="animate-spin" size={20} /> : <CheckCircle2 size={20} />}
                      {submitting ? "Verifying..." : "Verify Payment"}
                    </motion.button>
                  </form>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
