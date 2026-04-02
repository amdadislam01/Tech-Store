"use client";

import { useState } from "react";
import { 
  Trash2, 
  ShieldAlert, 
  ChevronDown,
  RefreshCcw,
  UserPlus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Swal from "sweetalert2";

interface UserActionsProps {
  userId: string;
  currentRole: string;
  canManage: boolean;
}

const roles = ["user", "manager", "admin", "super-admin"];

export default function UserActions({ userId, currentRole, canManage }: UserActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const router = useRouter();

  if (!canManage) {
    return (
        <div className="flex items-center justify-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-300 italic">View Only</span>
        </div>
    );
  }

  const handleRoleChange = async (newRole: string) => {
    if (newRole === currentRole) return;
    setIsUpdating(true);
    setShowRoleMenu(false);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        toast.success(`Role updated to ${newRole}`);
        router.refresh();
      } else {
        toast.error("Failed to update role");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this user permanently?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!"
    });
    if (!result.isConfirmed) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("User deleted successfully");
        router.refresh();
      } else {
        toast.error("Failed to delete user");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="flex items-center justify-end gap-2 relative">
      {/* Role Switcher */}
      <div className="relative">
        <button
          onClick={() => setShowRoleMenu(!showRoleMenu)}
          disabled={isUpdating}
          className={`flex items-center gap-2 px-3 py-1.5 bg-white border border-gray-100 rounded-xl shadow-sm text-xs font-bold text-gray-600 hover:border-primary hover:text-primary transition-all disabled:opacity-50`}
        >
          {isUpdating ? <RefreshCcw className="animate-spin" size={14} /> : <UserPlus size={14} />}
          <span className="capitalize">{currentRole}</span>
          <ChevronDown size={12} className={`transition-transform duration-300 ${showRoleMenu ? "rotate-180" : ""}`} />
        </button>

        <AnimatePresence>
          {showRoleMenu && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className="absolute right-0 mt-2 w-36 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 overflow-hidden"
            >
              {roles.map((role) => (
                <button
                  key={role}
                  onClick={() => handleRoleChange(role)}
                  className={`w-full text-left px-4 py-2 text-xs font-black uppercase tracking-widest transition-colors ${
                    currentRole === role 
                        ? "text-primary bg-primary/5" 
                        : "text-gray-500 hover:bg-gray-50 hover:text-foreground"
                  }`}
                >
                  {role}
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Delete Action */}
      <button
        onClick={handleDelete}
        disabled={isDeleting}
        className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-red-500 hover:border-red-100 transition-all disabled:opacity-50 group"
      >
        {isDeleting ? (
          <RefreshCcw className="animate-spin" size={16} />
        ) : (
          <Trash2 size={16} className="group-hover:scale-110 transition-transform" />
        )}
      </button>

      {/* Ban Toggle (Mock functionality for now) */}
      <button
        onClick={() => toast.error("Ban feature coming soon!")}
        className="p-2 bg-white border border-gray-100 rounded-xl shadow-sm text-gray-400 hover:text-orange-500 hover:border-orange-100 transition-all group"
      >
        <ShieldAlert size={16} className="group-hover:scale-110 transition-transform" />
      </button>
    </div>
  );
}
