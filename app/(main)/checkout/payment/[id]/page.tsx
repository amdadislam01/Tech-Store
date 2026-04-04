"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { 
  CreditCard, 
  CheckCircle2, 
  ArrowRight, 
  ShieldCheck, 
  Zap, 
  Loader2,
  Copy,
  Info
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

export default function PaymentPage() {
  const params = useParams();
  const id = params.id as string;
  const router = useRouter();
  
  const [order, setOrder] = useState<any>(null);
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [transactionId, setTransactionId] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [orderRes, settingsRes] = await Promise.all([
          fetch(`/api/orders/${id}`),
          fetch("/api/settings")
        ]);
        
        const orderData = await orderRes.json();
        const settingsData = await settingsRes.json();
        
        setOrder(orderData);
        setSettings(settingsData);
        setLoading(false);
      } catch (error) {
        toast.error("Failed to load payment details");
        setLoading(false);
      }
    };
    
    fetchData();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transactionId) return;
    setSubmitting(true);

    try {
      const res = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            transactionId,
            status: "Pending" // Move to 'Awaiting Review' after proof submission
        }),
      });

      if (res.ok) {
        toast.success("Payment proof submitted!");
        router.push("/dashboard/orders");
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

  if (loading) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-gray-500 font-bold animate-pulse uppercase tracking-widest text-xs">Initializing Secure Payment Gateway...</p>
      </div>
    );
  }

  if (!order) return <div className="text-center py-20 font-black">Order Not Found</div>;

  const paymentMethod = order.paymentMethod;
  const getMFSNumber = () => {
    if (paymentMethod === "bkash") return settings?.bkashNumber;
    if (paymentMethod === "nagad") return settings?.nagadNumber;
    if (paymentMethod === "rocket") return settings?.rocketNumber;
    return null;
  };

  const mfsNumber = getMFSNumber();

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-20">
      <div className="max-w-2xl mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[40px] p-10 md:p-14 shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-primary-dark" />
          
          <div className="flex justify-between items-start mb-12">
            <div>
              <h1 className="text-3xl font-black text-foreground tracking-tight mb-2">Complete Payment</h1>
              <p className="text-gray-400 font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                <ShieldCheck size={14} className="text-primary" />
                Order #{id.slice(-8).toUpperCase()}
              </p>
            </div>
            <div className="text-right">
              <span className="text-gray-400 text-[10px] font-black uppercase tracking-widest block mb-1">Total Amount</span>
              <span className="text-3xl font-black text-primary tracking-tighter">${order.totalPrice.toFixed(2)}</span>
            </div>
          </div>

          <div className="bg-primary/5 rounded-[30px] p-8 border border-primary/10 mb-10 space-y-6">
            <div className="flex items-center justify-between border-b border-primary/10 pb-4 mb-2">
                <h2 className="text-xl font-black flex items-center gap-3 text-primary">
                <Zap size={22} fill="currentColor" />
                Payment Instructions
                </h2>
                <div className="flex items-center gap-2 px-4 py-1.5 bg-primary rounded-full text-white text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20">
                    <ShieldCheck size={12} />
                    {(paymentMethod || "Payment").toUpperCase()} SECURE
                </div>
            </div>
            
            <div className="space-y-4">
              <p className="text-gray-600 font-medium leading-relaxed">
                {settings?.paymentInstructions || `Please send the total amount to the following ${(paymentMethod || "payment").toUpperCase()} number and provide the transaction ID below.`}
              </p>
              
              <div className="p-6 bg-white rounded-3xl border border-primary/20 shadow-sm relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                      <CreditCard size={80} />
                  </div>
                  
                  <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                      <div>
                          <span className="text-[10px] text-gray-400 font-black uppercase tracking-widest block mb-2">{(paymentMethod || "Payment").toUpperCase()} Merchant Number</span>
                          {mfsNumber ? (
                              <span className="text-2xl md:text-3xl font-black text-foreground tracking-tight select-all">{mfsNumber}</span>
                          ) : (
                              <span className="text-xl font-black text-red-400 tracking-tight italic">Number not configured by admin</span>
                          )}
                      </div>
                      
                      {mfsNumber && (
                        <button 
                            type="button"
                            onClick={() => copyToClipboard(mfsNumber)}
                            className="flex items-center gap-2 px-6 py-3 bg-gray-50 hover:bg-primary hover:text-white rounded-2xl transition-all font-black text-xs uppercase tracking-widest border border-gray-100 hover:border-primary group/copy"
                        >
                            <Copy size={16} className="group-hover/copy:scale-110 transition-transform" />
                            Copy Number
                        </button>
                      )}
                  </div>
              </div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1 flex items-center gap-2">
                <Info size={14} />
                Transaction ID (ট্রানজেকশন আইডি)
              </label>
              <input
                type="text"
                required
                className="w-full px-8 py-5 bg-gray-50 rounded-3xl border-2 border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-black text-xl text-foreground placeholder:text-gray-300 shadow-inner"
                placeholder="TRX123456789"
                value={transactionId}
                onChange={(e) => setTransactionId(e.target.value)}
              />
              <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest ml-1">Example: A1B2C3D4 (Find this in your SMS confirmation)</p>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={submitting}
              type="submit"
              className="w-full bg-primary text-white py-6 rounded-[28px] font-black text-xl shadow-2xl shadow-primary/30 hover:bg-primary-dark transition-all disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {submitting ? <Loader2 className="animate-spin" size={24} /> : <CheckCircle2 size={24} />}
              {submitting ? "Verifying..." : "Verify Payment Proof"}
            </motion.button>
          </form>

          {paymentMethod === "cod" && (
            <button 
                onClick={() => router.push("/dashboard/orders")}
                className="w-full py-6 mt-4 text-gray-400 font-bold hover:text-foreground transition-all flex items-center justify-center gap-2 group"
            >
                <span>Skip for now, pay later</span>
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </button>
          )}
        </motion.div>
      </div>
    </div>
  );
}
