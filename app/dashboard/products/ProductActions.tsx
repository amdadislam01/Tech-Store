"use client";

import { useState } from "react";
import { 
  Trash2, 
  Edit2,
  RefreshCcw,
  Package,
  Eye
} from "lucide-react";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Swal from "sweetalert2";

interface ProductActionsProps {
  productId: string;
  userRole?: string;
}

export default function ProductActions({ productId, userRole }: ProductActionsProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Delete this product from your inventory permanently?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!"
    });
    if (!result.isConfirmed) return;
    setIsDeleting(true);

    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "DELETE",
      });

      if (res.ok) {
        toast.success("Product removed");
        router.refresh();
      } else {
        toast.error("Failed to delete product");
      }
    } catch (error) {
      toast.error("Internal service error");
    } finally {
      setIsDeleting(false);
    }
  };

  const isManager = userRole === "manager";

  return (
    <div className="flex items-center justify-end gap-2">
      <Link 
        href={`/product/${productId}`}
        className="p-2 hover:bg-white hover:shadow-md rounded-xl text-gray-400 hover:text-primary transition-all border border-transparent"
      >
        <Eye size={16} />
      </Link>
      <Link 
        href={`/dashboard/products/edit/${productId}`}
        className="p-2 hover:bg-white hover:shadow-md rounded-xl text-gray-400 hover:text-primary transition-all border border-transparent"
      >
        <Edit2 size={16} />
      </Link>
      {!isManager && (
        <button 
          onClick={handleDelete}
          disabled={isDeleting}
          className="p-2 hover:bg-white hover:shadow-md rounded-xl text-gray-400 hover:text-red-500 transition-all border border-transparent disabled:opacity-50"
        >
          {isDeleting ? <RefreshCcw size={16} className="animate-spin" /> : <Trash2 size={16} />}
        </button>
      )}
    </div>
  );
}
