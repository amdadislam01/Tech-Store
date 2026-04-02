"use client";

import { useState, useEffect } from "react";
import { 
  CreditCard, 
  Trash2, 
  Plus, 
  ShieldCheck, 
  Zap,
  Loader2,
  DollarSign,
  Truck,
  CheckCircle2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

const paymentGateways = [
    { id: "cod", name: "Cash on Delivery", icon: Truck, description: "Allow customers to pay upon receipt of goods." },
    { id: "stripe", name: "Stripe Checkout", icon: CreditCard, description: "Secure credit & debit card payments globally." },
    { id: "sslcommerz", name: "SSLCommerz", icon: ShieldCheck, description: "Popular local payment gateway for Bangladesh." },
];

export default function PaymentsPage() {
  const [settings, setSettings] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/admin/settings")
      .then((res) => res.json())
      .then((data) => {
        setSettings(data);
        setLoading(false);
      });
  }, []);

  const togglePaymentMethod = async (methodId: string) => {
    setUpdating(methodId);
    const newMethods = settings.activePaymentMethods.includes(methodId)
        ? settings.activePaymentMethods.filter((id: string) => id !== methodId)
        : [...settings.activePaymentMethods, methodId];

    try {
      const res = await fetch("/api/admin/settings", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ activePaymentMethods: newMethods }),
      });

      if (res.ok) {
        setSettings({ ...settings, activePaymentMethods: newMethods });
        toast.success(`${methodId.toUpperCase()} status updated`);
      } else {
        toast.error("Failed to update payment status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setUpdating(null);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-4">
        <Loader2 className="animate-spin text-primary" size={40} />
        <p className="text-gray-500 font-bold animate-pulse">Loading payment infrastructure...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-foreground tracking-tight">Payment Gateways</h1>
          <p className="text-gray-500 mt-1 font-medium">Toggle and configure secure payment options for your store.</p>
        </div>
        <div className="px-5 py-2.5 bg-green-50 rounded-2xl border border-green-100 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-green-600">
            <CheckCircle2 size={16} />
            <span>Secure 256-bit SSL</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {paymentGateways.map((gateway, idx) => {
          const isActive = settings.activePaymentMethods.includes(gateway.id);
          const isProcessing = updating === gateway.id;

          return (
            <motion.div
              key={gateway.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: idx * 0.1 }}
              className={`bg-white p-8 rounded-[40px] border transition-all duration-500 flex flex-col justify-between h-full group ${
                isActive ? "border-primary/50 shadow-xl shadow-primary/5" : "border-gray-100 hover:border-gray-200"
              }`}
            >
              <div>
                <div className={`w-16 h-16 rounded-[24px] flex items-center justify-center mb-6 transition-all duration-500 ${
                    isActive ? "bg-primary text-white shadow-lg shadow-primary/30" : "bg-gray-50 text-gray-400 grayscale group-hover:grayscale-0"
                }`}>
                    <gateway.icon size={32} />
                </div>
                <h3 className={`text-xl font-black mb-3 ${isActive ? "text-foreground" : "text-gray-400 font-bold"}`}>{gateway.name}</h3>
                <p className="text-sm text-gray-500 leading-relaxed font-medium mb-8">
                    {gateway.description}
                </p>
              </div>

              <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                <span className={`text-[10px] font-black uppercase tracking-widest ${isActive ? "text-green-500" : "text-gray-300"}`}>
                    {isActive ? "Connected" : "Inactive"}
                </span>
                <button
                    onClick={() => togglePaymentMethod(gateway.id)}
                    disabled={isProcessing}
                    className={`relative w-14 h-7 rounded-full transition-colors duration-300 outline-none ${
                        isActive ? "bg-primary" : "bg-gray-200"
                    }`}
                >
                    <motion.div
                        animate={{ x: isActive ? 28 : 4 }}
                        className="absolute top-1 w-5 h-5 bg-white rounded-full shadow-md flex items-center justify-center"
                    >
                        {isProcessing && <Loader2 className="animate-spin text-primary" size={10} />}
                    </motion.div>
                </button>
              </div>
            </motion.div>
          );
        })}
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-primary/5 border border-primary/10 rounded-[32px] p-8 mt-12 flex flex-col md:flex-row items-center gap-6"
      >
        <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center text-primary shrink-0">
            <Zap size={28} fill="currentColor" />
        </div>
        <div className="flex-grow text-center md:text-left">
            <h4 className="text-lg font-black text-foreground">Next-Gen Payment Smart Routing</h4>
            <p className="text-gray-500 text-sm font-medium mt-1">Our platform automatically routes payments during peak traffic to ensure 99.9% uptime for your store.</p>
        </div>
        <button className="px-6 py-3 bg-white text-primary rounded-xl font-black text-xs uppercase tracking-widest shadow-sm hover:shadow-md transition-all">
            Advanced Config
        </button>
      </motion.div>
    </div>
  );
}
