"use client";

import { X, Package, Truck, User, CreditCard, ShieldCheck } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface OrderDetailsModalProps {
  order: any;
  isOpen: boolean;
  onClose: () => void;
}

export default function OrderDetailsModal({ order, isOpen, onClose }: OrderDetailsModalProps) {
  if (!order) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm cursor-pointer"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-white rounded-[40px] shadow-2xl overflow-hidden pt-2"
          >
            <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-primary to-primary-dark" />
            
            <div className="p-8 md:p-12 max-h-[85vh] overflow-y-auto no-scrollbar">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-2xl font-black text-foreground tracking-tight">Order Details</h2>
                  <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">#{order._id.toString().slice(-12).toUpperCase()}</p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Items Section */}
                <div className="space-y-6 md:col-span-2">
                  <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2 border-b border-gray-50 pb-3">
                    <Package size={16} />
                    Items Purchased
                  </h3>
                  <div className="space-y-4">
                    {order.items.map((item: any) => (
                      <div key={item._id} className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center font-black text-xs border border-gray-100">
                             {item.name[0]}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{item.name}</p>
                            <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                          </div>
                        </div>
                        <p className="font-black text-sm text-primary">${(item.price * item.quantity).toFixed(2)}</p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Shipping info */}
                <div className="space-y-6">
                   <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2 border-b border-gray-50 pb-3">
                    <Truck size={16} />
                    Shipping Info
                  </h3>
                  <div className="space-y-1.5">
                     <p className="font-bold text-sm text-foreground">{order.shippingInfo?.name}</p>
                     <p className="text-xs text-gray-500">{order.shippingInfo?.phone}</p>
                     <p className="text-xs text-gray-500 leading-relaxed max-w-[200px]">
                        {order.shippingInfo?.city}, {order.shippingInfo?.area}<br/>
                        {order.shippingInfo?.address}<br/>
                        {order.shippingInfo?.landmark && `Landmark: ${order.shippingInfo.landmark}`}
                     </p>
                  </div>
                </div>

                {/* Payment info */}
                <div className="space-y-6">
                   <h3 className="text-sm font-black uppercase tracking-widest text-primary flex items-center gap-2 border-b border-gray-50 pb-3">
                    <CreditCard size={16} />
                    Payment Method
                  </h3>
                  <div className="space-y-3">
                    <div className="px-4 py-2 bg-gray-50 rounded-xl inline-block">
                        <span className="text-xs font-black text-foreground uppercase tracking-widest italic">{order.paymentMethod?.toUpperCase()}</span>
                    </div>
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status:</span>
                        <span className={`text-[10px] font-black uppercase tracking-widest ${order.paymentStatus === "Paid" ? "text-green-500" : "text-orange-500"}`}>
                            {order.paymentStatus}
                        </span>
                    </div>
                    {order.transactionId && (
                        <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl space-y-1">
                            <span className="text-[9px] text-primary font-black uppercase tracking-[0.2em] block">Transaction ID Verified</span>
                            <div className="flex items-center gap-2 text-primary font-mono text-xs font-black group cursor-pointer">
                                <ShieldCheck size={14} />
                                <span>{order.transactionId}</span>
                            </div>
                        </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="mt-12 flex items-center justify-between p-6 bg-zinc-900 rounded-[30px] text-white shadow-2xl shadow-zinc-900/20">
                <div>
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-40">Grand Total</p>
                   <p className="text-3xl font-black tracking-tighter">${(order.totalAmount || order.totalPrice).toFixed(2)}</p>
                </div>
                <div className={`px-5 py-2.5 rounded-2xl text-[10px] font-black uppercase tracking-widest ${
                    order.status === "Delivered" ? "bg-green-500/10 text-green-400" : "bg-white/10 text-white/60"
                }`}>
                    Status • {order.status}
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
