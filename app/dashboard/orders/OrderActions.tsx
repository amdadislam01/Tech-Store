"use client";

import { useState } from "react";
import { 
  CheckCircle2, 
  XCircle, 
  Truck, 
  Package,
  Loader2,
  ChevronDown
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";

interface OrderActionsProps {
  orderId: string;
  currentStatus: string;
}

const statusWorkflow = [
    { id: "pending", label: "Pending Approval", icon: Package, color: "text-orange-500", bg: "bg-orange-50" },
    { id: "processing", label: "Processing", icon: Loader2, color: "text-blue-500", bg: "bg-blue-50" },
    { id: "shipped", label: "Out for Delivery", icon: Truck, color: "text-purple-500", bg: "bg-purple-50" },
    { id: "delivered", label: "Completed", icon: CheckCircle2, color: "text-green-500", bg: "bg-green-50" },
    { id: "cancelled", label: "Cancelled", icon: XCircle, color: "text-red-500", bg: "bg-red-50" },
];

export default function OrderActions({ orderId, currentStatus }: OrderActionsProps) {
  const [isUpdating, setIsUpdating] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const router = useRouter();

  const handleStatusUpdate = async (newStatus: string) => {
    if (newStatus === currentStatus) return;
    setIsUpdating(true);
    setShowMenu(false);

    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        toast.success(`Order status: ${newStatus}`);
        router.refresh();
      } else {
        toast.error("Update failed");
      }
    } catch (error) {
      toast.error("Internal error");
    } finally {
      setIsUpdating(false);
    }
  };

  const current = statusWorkflow.find(s => s.id === currentStatus) || statusWorkflow[0];

  return (
    <div className="relative">
      <button
        onClick={() => setShowMenu(!showMenu)}
        disabled={isUpdating}
        className={`flex items-center gap-2 px-4 py-2 border border-gray-100 rounded-xl shadow-sm text-xs font-black uppercase tracking-widest transition-all ${current.bg} ${current.color} hover:shadow-md transform active:scale-95 disabled:opacity-50`}
      >
        {isUpdating ? <Loader2 className="animate-spin" size={14} /> : <current.icon size={14} />}
        <span>{current.label}</span>
        <ChevronDown size={14} className={`transition-transform duration-300 ${showMenu ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {showMenu && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute right-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 overflow-hidden"
          >
            <p className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-300 border-b border-gray-50 mb-1">
                Advance Pipeline State
            </p>
            {statusWorkflow.map((status) => (
              <button
                key={status.id}
                onClick={() => handleStatusUpdate(status.id)}
                className={`w-full text-left px-4 py-3 flex items-center gap-3 transition-colors ${
                  currentStatus === status.id 
                      ? "bg-gray-50 text-foreground cursor-default" 
                      : "text-gray-500 hover:bg-primary/5 hover:text-primary group"
                }`}
              >
                <status.icon size={16} className={currentStatus === status.id ? status.color : "group-hover:scale-110 transition-transform"} />
                <span className="text-xs font-bold">{status.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
