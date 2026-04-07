"use client";

import { useState } from "react";
import Image from "next/image";
import { 
  Calendar, 
  Copy, 
  CheckCircle, 
  Clock, 
  ShieldCheck, 
  Eye,
  CreditCard
} from "lucide-react";
import OrderActions from "./OrderActions";
import PaymentModal from "./PaymentModal";
import OrderDetailsModal from "./OrderDetailsModal";

interface OrdersListProps {
  orders: any[];
  isAdmin: boolean;
  avatarColors: string[];
}

export default function OrdersList({ orders, isAdmin, avatarColors }: OrdersListProps) {
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase();
  };

  const openPaymentModal = (order: any) => {
    setSelectedOrder(order);
    setIsModalOpen(true);
  };

  const openDetailsModal = (order: any) => {
    setSelectedOrder(order);
    setIsDetailsOpen(true);
  };

  return (
    <>
      <tbody className="divide-y divide-gray-50/50">
        {orders.map((order, idx) => (
          <tr key={order._id} className="group hover:bg-gray-50/30 transition-all">
            <td className="px-4 sm:px-8 py-4 sm:py-6">
              <div className="space-y-2">
                  <div className="flex items-center gap-2">
                      <span className="p-1 px-2 bg-zinc-100 rounded-lg font-mono text-[10px] font-bold text-zinc-500 uppercase">#{order._id.toString().slice(-8)}</span>
                      <button 
                        onClick={() => {
                            navigator.clipboard.writeText(order._id);
                            // toast.success("Copied to clipboard!"); // Can't use toast easily here unless imported
                        }}
                        className="text-gray-300 hover:text-primary transition-colors focus:outline-none"
                      >
                          <Copy size={12} />
                      </button>
                  </div>
                  <div className="flex items-center gap-2 text-xs font-bold text-gray-400 group-hover:text-gray-600 transition-colors">
                      <Calendar size={14} className="text-primary/40" />
                      <span>{new Date(order.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</span>
                  </div>
              </div>
            </td>
            
            <td className="px-4 sm:px-8 py-4 sm:py-6 text-left">
              <div className="flex items-center gap-4">
                  <div className={`relative w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl flex items-center justify-center font-black text-xs sm:text-sm shadow-sm border border-white shrink-0 overflow-hidden ${avatarColors[idx % avatarColors.length]}`}>
                      {order.user?.image ? (
                          <Image src={order.user.image} alt={order.user?.name || "Customer"} fill className="object-cover" />
                      ) : (
                          <span>{getInitials(order.shippingInfo?.name || order.user?.name || "Client")}</span>
                      )}
                  </div>
                  <div className="min-w-0">
                      <p className="font-black text-foreground text-sm tracking-tight truncate group-hover:text-primary transition-colors">
                          {order.shippingInfo?.name || order.user?.name || "Customer"}
                      </p>
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider truncate">
                          {order.shippingInfo?.city && order.shippingInfo?.area 
                              ? `${order.shippingInfo.city}, ${order.shippingInfo.area}` 
                              : order.user?.email || "Guest Purchase"}
                      </p>
                  </div>
              </div>
            </td>
            
            <td className="px-4 sm:px-8 py-4 sm:py-6">
              <div className="space-y-1.5">
                  <p className="text-base sm:text-lg font-black text-foreground tracking-tight">
                      ৳{(order.totalAmount || order.totalPrice).toLocaleString()}
                  </p>
                  <span className={`inline-flex items-center gap-1.5 text-[9px] font-black uppercase tracking-[0.1em] px-2 py-1 rounded-lg border ${
                      order.paymentStatus === "Paid" ? "text-green-600 bg-green-50 border-green-100" : 
                      order.paymentStatus === "Failed" ? "text-red-600 bg-red-50 border-red-100" :
                      "text-primary bg-primary/5 border-primary/10"
                  }`}>
                      {order.paymentStatus === "Paid" ? <CheckCircle size={10} /> : <Clock size={10} />}
                      {order.paymentMethod?.toUpperCase() || "COD"} • {order.paymentStatus || "Pending"}
                  </span>
                  {order.transactionId && (
                      <div className="flex items-center gap-1.5 mt-2 px-2 py-1 bg-gray-50 border border-gray-100 rounded-lg w-fit">
                          <ShieldCheck size={10} className="text-primary" />
                          <span className="text-[9px] font-bold text-gray-500 font-mono tracking-tight">{order.transactionId}</span>
                      </div>
                  )}
              </div>
            </td>
            
            <td className="px-8 py-6">
              <div className="flex items-center justify-end gap-3">
                  {!isAdmin && order.status === "Awaiting Payment" && order.paymentMethod !== "cod" && (
                    <button 
                        onClick={() => openPaymentModal(order)}
                        className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all scale-100 active:scale-95"
                    >
                        <CreditCard size={14} />
                        Pay Now
                    </button>
                  )}
                  
                  {isAdmin ? (
                      <OrderActions 
                          orderId={order._id.toString()} 
                          currentStatus={order.status} 
                          paymentMethod={order.paymentMethod}
                          transactionId={order.transactionId}
                      />
                  ) : (
                      <div className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest border transition-all ${
                          order.status.toLowerCase() === "delivered" ? "bg-green-50 text-green-600 border-green-100 shadow-sm shadow-green-100" :
                          order.status.toLowerCase() === "cancelled" ? "bg-red-50 text-red-600 border-red-100 shadow-sm shadow-red-100" :
                          "bg-orange-50 text-orange-600 border-orange-100 shadow-sm shadow-orange-100"
                      }`}>
                          {order.status}
                      </div>
                  )}
                  <button 
                    onClick={() => openDetailsModal(order)}
                    className="w-10 h-10 flex items-center justify-center bg-white rounded-xl text-gray-300 hover:text-primary hover:shadow-lg hover:border-primary/20 transition-all border border-gray-100 shadow-sm group/btn"
                  >
                      <Eye size={18} className="group-hover/btn:scale-110 transition-transform" />
                  </button>
              </div>
            </td>
          </tr>
        ))}
      </tbody>

      {selectedOrder && (
        <>
            <PaymentModal 
                order={selectedOrder}
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
            />
            <OrderDetailsModal
                order={selectedOrder}
                isOpen={isDetailsOpen}
                onClose={() => setIsDetailsOpen(false)}
            />
        </>
      )}
    </>
  );
}
