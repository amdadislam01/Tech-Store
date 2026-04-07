"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import { removeFromCart, updateQuantity } from "@/redux/slices/cartSlice";
import Link from "next/link";
import Image from "next/image";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, ShieldCheck, Zap } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function CartPage() {
  const { items } = useSelector((state: RootState) => state.cart);
  const dispatch = useDispatch();

  const subtotal = items.reduce((total, item) => total + item.price * item.quantity, 0);
  const shipping = items.length > 0 ? 10 : 0;
  const total = subtotal + shipping;

  return (
    <div className="bg-[#F8FAFC] min-h-screen py-16">
      <div className="container-custom">
        <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center justify-between mb-12"
        >
            <div>
                <h1 className="text-4xl font-black text-foreground tracking-tight flex items-center gap-4">
                    Your <span className="text-primary italic">Cart</span>
                </h1>
                <p className="text-gray-500 mt-2 font-medium">Review your selected items and proceed to checkout.</p>
            </div>
            <div className="hidden md:flex items-center gap-3 px-5 py-2.5 bg-white rounded-2xl shadow-sm border border-gray-100 text-sm font-bold text-gray-500">
                <Zap size={16} className="text-primary" />
                <span>Fast Checkout Available</span>
            </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-6">
            <AnimatePresence mode="popLayout">
            {items.length === 0 ? (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-white p-20 rounded-[40px] text-center border border-gray-100 shadow-2xl shadow-gray-200/50"
              >
                <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-50 rounded-[30px] mb-8 shadow-inner">
                    <ShoppingBag size={40} className="text-gray-300" />
                </div>
                <h2 className="text-3xl font-black mb-4">Your cart is empty</h2>
                <p className="text-gray-500 mb-10 max-w-sm mx-auto font-medium">Start exploring our collection and add your favorite tech gadgets.</p>
                <Link href="/" className="inline-flex items-center gap-2 bg-primary text-white px-10 py-5 rounded-2xl font-bold hover:bg-primary-dark transition-all shadow-xl shadow-primary/20 transform hover:-translate-y-1 active:translate-y-0">
                  Browse Shop <ArrowRight size={20} />
                </Link>
              </motion.div>
            ) : (
              items.map((item, idx) => (
                <motion.div 
                    layout
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, x: -100 }}
                    transition={{ delay: idx * 0.05 }}
                    key={item._id} 
                    className="bg-white p-6 rounded-[32px] border border-gray-100 flex flex-col md:flex-row items-center gap-8 shadow-sm hover:shadow-xl hover:shadow-gray-200/50 transition-all group"
                >
                  <div className="relative w-32 h-32 bg-[#F8FAFC] rounded-2xl overflow-hidden shrink-0 group-hover:scale-105 transition-transform duration-500">
                    <Image src={item.images?.[0] || item.image} alt={item.name} fill className="object-contain p-4" />
                  </div>
                  <div className="flex-grow text-center md:text-left">
                    <span className="text-[10px] bg-primary/10 text-primary px-3 py-1 rounded-lg font-black uppercase tracking-widest mb-2 inline-block italic">New Generation</span>
                    <h3 className="text-xl font-bold mb-1 group-hover:text-primary transition-colors">{item.name}</h3>
                    <p className="text-primary font-black text-xl">৳{item.price}</p>
                  </div>
                  <div className="flex items-center gap-4 bg-[#F8FAFC] p-2 rounded-2xl border border-gray-100">
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => item.quantity > 1 && dispatch(updateQuantity({ id: item._id, quantity: item.quantity - 1 }))}
                      className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:text-primary shadow-sm transition-all disabled:opacity-30"
                      disabled={item.quantity <= 1}
                    >
                      <Minus size={18} />
                    </motion.button>
                    <span className="w-10 text-center font-black text-lg">{item.quantity}</span>
                    <motion.button 
                      whileTap={{ scale: 0.9 }}
                      onClick={() => dispatch(updateQuantity({ id: item._id, quantity: item.quantity + 1 }))}
                      className="w-10 h-10 bg-white rounded-xl flex items-center justify-center hover:text-primary shadow-sm transition-all"
                    >
                      <Plus size={18} />
                    </motion.button>
                  </div>
                  <motion.button 
                    whileHover={{ scale: 1.1, color: "#EF4444" }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => dispatch(removeFromCart(item._id))}
                    className="p-4 text-gray-300 hover:bg-red-50 rounded-2xl transition-all"
                  >
                    <Trash2 size={24} />
                  </motion.button>
                </motion.div>
              ))
            )}
            </AnimatePresence>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-white p-10 rounded-[40px] border border-gray-100 shadow-2xl shadow-gray-200/50 sticky top-32"
            >
              <h2 className="text-2xl font-black mb-8 pb-8 border-b border-gray-100 text-foreground tracking-tight">Order Summary</h2>
              <div className="space-y-6 mb-10">
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Subtotal</span>
                  <span className="text-foreground font-black">৳{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center text-gray-500 font-medium">
                  <span>Standard Shipping</span>
                  <span className="text-foreground font-black">৳{shipping.toFixed(2)}</span>
                </div>
                <div className="pt-8 border-t border-gray-100 flex justify-between items-end">
                  <div>
                    <span className="text-sm text-gray-400 font-black uppercase tracking-widest block mb-1">Total Amount</span>
                    <span className="text-3xl font-black text-primary tracking-tighter">৳{total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                <Link
                    href="/checkout"
                    className={`w-full block py-5 text-center rounded-[20px] font-black transition-all shadow-xl text-lg ${
                    items.length === 0 
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed shadow-none" 
                    : "bg-primary text-white hover:bg-primary-dark shadow-primary/30"
                    }`}
                >
                    Checkout Now
                </Link>
              </motion.div>
              <div className="mt-8 flex items-center justify-center gap-3 text-xs text-gray-400 uppercase tracking-widest font-black">
                 <div className="w-6 h-6 bg-green-50 text-green-500 rounded-lg flex items-center justify-center border border-green-100">
                    <ShieldCheck size={14} />
                 </div>
                 <span>Secure 256-bit SSL Checkout</span>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}
