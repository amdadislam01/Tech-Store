"use client";

import { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { clearCart } from "@/redux/slices/cartSlice";
import { useRouter } from "next/navigation";
import { CreditCard, Truck, CheckCircle2, ArrowLeft, ShieldCheck, Zap } from "lucide-react";
import Image from "next/image";
import toast from "react-hot-toast";
import { motion, AnimatePresence } from "framer-motion";

export default function CheckoutPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const [formData, setFormData] = useState({ name: "", address: "", phone: "" });
  const [loading, setLoading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);
  const router = useRouter();
  const dispatch = useDispatch();

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map(item => ({
            product: item._id,
            name: item.name,
            quantity: item.quantity,
            price: item.price,
          })),
          totalPrice: total,
          shippingInfo: formData,
        }),
      });

      const data = await res.json();
      if (res.ok) {
        setOrderId(data._id);
        dispatch(clearCart());
        toast.success("Order placed successfully!");
      } else {
        toast.error("Failed to place order");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (orderId) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center bg-[#F8FAFC] px-4 py-20">
        <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-xl w-full bg-white p-16 rounded-[50px] text-center shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] border border-gray-100 relative overflow-hidden"
        >
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-green-400 to-green-600" />
          <motion.div 
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-24 h-24 bg-green-100 text-green-600 rounded-[30px] flex items-center justify-center mx-auto mb-8 shadow-inner"
          >
            <CheckCircle2 size={48} />
          </motion.div>
          <h2 className="text-4xl font-black mb-4 tracking-tight">Order Confirmed!</h2>
          <p className="text-gray-500 mb-2 font-medium">Thank you for your purchase. We've received your order.</p>
          <p className="inline-block bg-gray-50 px-4 py-2 rounded-xl text-sm font-bold text-gray-500 border border-gray-100 mb-10">
            Order ID: <span className="text-foreground uppercase tracking-wider">#{orderId.slice(-12)}</span>
          </p>
          <div className="space-y-4">
            <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => router.push("/dashboard/orders")}
                className="w-full bg-primary text-white py-5 rounded-[20px] font-black shadow-xl shadow-primary/30 hover:bg-primary-dark transition-all"
            >
                Track My Order
            </motion.button>
            <button 
                onClick={() => router.push("/")}
                className="w-full bg-white text-gray-500 py-5 rounded-[20px] font-bold border border-gray-100 hover:bg-gray-50 transition-all"
            >
                Continue Shopping
            </button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-16">
      <div className="container-custom">
        <div className="flex items-center gap-4 mb-12">
            <button 
                onClick={() => router.back()}
                className="p-3 bg-white rounded-2xl shadow-sm border border-gray-100 hover:bg-gray-50 transition-all text-gray-500"
            >
                <ArrowLeft size={20} />
            </button>
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tight">Checkout</h1>
                <p className="text-gray-500 mt-1 font-medium">Complete your order details below.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          {/* Shipping Form */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="lg:col-span-7 bg-white p-10 md:p-14 rounded-[45px] shadow-2xl shadow-gray-200/50 border border-gray-100 relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
            <h2 className="text-2xl font-black mb-10 flex items-center gap-4 tracking-tight">
                <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                    <Truck size={24} />
                </div>
                <span>Shipping Details</span>
            </h2>
            <form className="space-y-8" onSubmit={handleSubmit}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Recipient Name</label>
                    <input
                    type="text"
                    required
                    className="w-full px-6 py-4 bg-gray-50 rounded-[20px] border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground placeholder:text-gray-300"
                    placeholder="e.g. Alexander Pierce"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    />
                </div>
                <div className="space-y-2">
                    <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Phone Contact</label>
                    <input
                    type="tel"
                    required
                    className="w-full px-6 py-4 bg-gray-50 rounded-[20px] border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground placeholder:text-gray-300"
                    placeholder="e.g. +1 555 000 0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-widest text-gray-400 ml-1">Delivery Address</label>
                <textarea
                  required
                  rows={3}
                  className="w-full px-6 py-4 bg-gray-50 rounded-[24px] border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all font-bold text-foreground placeholder:text-gray-300"
                  placeholder="Street name, house number, apartment, city, and country..."
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                />
              </div>

              <div className="pt-10">
                 <h2 className="text-2xl font-black mb-8 flex items-center gap-4 tracking-tight">
                    <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20">
                        <CreditCard size={24} />
                    </div>
                    <span>Payment Method</span>
                </h2>
                <div className="relative group cursor-pointer">
                    <div className="p-6 border-2 border-primary bg-primary/5 rounded-[24px] flex items-center justify-between shadow-lg shadow-primary/5 group-hover:bg-primary/10 transition-colors">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
                                <Zap size={22} fill="currentColor" />
                            </div>
                            <div>
                                <span className="block font-black text-foreground">Cash on Delivery</span>
                                <span className="text-xs text-primary font-bold uppercase tracking-widest">Pay upon arrival</span>
                            </div>
                        </div>
                        <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center border-4 border-white shadow-md">
                            <div className="w-2 h-2 bg-white rounded-full"></div>
                        </div>
                    </div>
                </div>

                <div className="mt-12">
                    <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        type="submit"
                        disabled={loading || items.length === 0}
                        className="w-full bg-primary text-white py-6 rounded-[24px] font-black text-xl hover:bg-primary-dark transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 relative overflow-hidden"
                    >
                        <div className="relative z-10 flex items-center justify-center gap-3">
                            {loading ? "Processing Order..." : `Confirm Payment • $${total.toFixed(2)}`}
                        </div>
                        <motion.div 
                            animate={{ opacity: [0.1, 0.2, 0.1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                            className="absolute inset-0 bg-white/20" 
                        />
                    </motion.button>
                </div>
              </div>
            </form>
          </motion.div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-5">
            <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-10 md:p-12 rounded-[45px] shadow-2xl shadow-gray-200/50 border border-gray-100 sticky top-32"
            >
               <h2 className="text-2xl font-black mb-8 pb-8 border-b border-gray-100 tracking-tight">Order Summary</h2>
               <div className="space-y-6 max-h-[350px] overflow-y-auto no-scrollbar mb-10 pr-2">
                    {items.map((item) => (
                        <div key={item._id} className="flex items-center gap-6 group">
                            <div className="relative w-20 h-20 bg-[#F8FAFC] rounded-2xl overflow-hidden shrink-0 border border-gray-50 transition-transform group-hover:scale-110">
                                <Image src={item.images?.[0] || item.image} alt={item.name} fill className="object-contain p-3" />
                            </div>
                            <div className="flex-grow">
                                <h4 className="font-bold text-foreground text-sm line-clamp-1 group-hover:text-primary transition-colors">{item.name}</h4>
                                <p className="text-gray-400 text-xs font-black uppercase tracking-widest mt-1">Quantity: {item.quantity}</p>
                            </div>
                            <div className="text-right">
                                <span className="font-black text-base text-foreground tracking-tight">${(item.price * item.quantity).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
               </div>
               <div className="space-y-5 pt-8 border-t border-gray-100">
                  <div className="flex justify-between items-center text-gray-500 font-medium">
                    <span>Subtotal</span>
                    <span className="font-black text-foreground">${subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between items-center text-gray-500 font-medium">
                    <span>Shipping</span>
                    <span className="font-black text-foreground">$10.00</span>
                  </div>
                  <div className="pt-8 flex justify-between items-end border-t border-dashed border-gray-200">
                    <div>
                        <span className="text-xs text-gray-400 font-black uppercase tracking-widest block mb-1">Total Payable</span>
                        <span className="text-4xl font-black text-primary tracking-tighter">${total.toFixed(2)}</span>
                    </div>
                  </div>
               </div>
               
               <div className="mt-8 pt-8 border-t border-gray-100 flex items-center justify-between text-gray-400">
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <ShieldCheck size={14} className="text-primary" />
                        <span>Encrypted</span>
                    </div>
                    <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest">
                        <span>Reliable Delivery</span>
                        <Truck size={14} className="text-primary" />
                    </div>
               </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
