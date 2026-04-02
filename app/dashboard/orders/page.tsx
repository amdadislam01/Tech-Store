import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { 
  ShoppingBag, 
  Search, 
  Filter,
  Calendar,
  DollarSign,
  ArrowRight,
  Eye,
} from "lucide-react";
import OrderActions from "./OrderActions";
import Link from "next/link";

export default async function OrdersPage() {
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  const role = session.user.role;
  const isAdmin = ["super-admin", "admin", "manager"].includes(role);

  await connectDB();
  
  const query = isAdmin ? {} : { user: session.user.id };
  const orders = await Order.find(query).sort({ createdAt: -1 }).populate("user", "name email");

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            {isAdmin ? "Order Fulfillment" : "My Orders"}
          </h1>
          <p className="text-gray-500 mt-1">
            {isAdmin ? "Oversee platform orders, track shipments, and manage fulfillment." : "Track your purchases and view your order history."}
          </p>
        </div>
        {!isAdmin && (
            <Link href="/" className="px-6 py-3 bg-primary text-white font-bold rounded-2xl shadow-lg shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-[0.98] flex items-center gap-2">
                <span>Shop More</span>
                <ArrowRight size={18} />
            </Link>
        )}
      </div>

      <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[60vh]">
        <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Search by Order ID..." 
                    className="w-full pl-10 pr-4 py-2 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium"
                />
            </div>
            <div className="flex items-center gap-3">
                <button className="p-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-gray-100 transition-colors border border-gray-100 shadow-sm">
                    <Filter size={18} />
                </button>
                <div className="h-8 w-px bg-gray-100 mx-1" />
                <span className="text-sm font-black text-gray-500 whitespace-nowrap">{orders.length} Orders Recorded</span>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Order Details</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Customer Info</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Transaction</th>
                <th className="px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest text-right whitespace-nowrap">Pipeline Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {orders.map((order) => (
                <tr key={order._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="space-y-1">
                        <p className="font-black text-foreground group-hover:text-primary transition-colors uppercase tracking-wider text-xs">#{order._id.toString().slice(-8)}</p>
                        <div className="flex items-center gap-1.5 text-xs font-medium text-gray-400">
                            <Calendar size={12} />
                            <span>{new Date(order.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-bold text-foreground text-sm tracking-tight">{order.shippingInfo?.name || order.user?.name || "Client"}</p>
                    <p className="text-[10px] text-gray-400 font-medium truncate max-w-[150px]">{order.user?.email}</p>
                  </td>
                  <td className="px-6 py-4">
                    <div className="space-y-0.5">
                        <p className="text-sm font-black text-foreground">${order.totalAmount || order.totalPrice}</p>
                        <span className="text-[9px] font-black uppercase tracking-widest text-primary bg-primary/5 px-1.5 rounded flex items-center gap-1 w-fit border border-primary/10">
                            Payment Verified
                        </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-3">
                        {isAdmin ? (
                            <OrderActions orderId={order._id.toString()} currentStatus={order.status} />
                        ) : (
                            <div className={`px-3 py-1 rounded-full text-[10px] font-black uppercase border ${
                                order.status === "delivered" ? "bg-green-50 text-green-600 border-green-100" :
                                order.status === "cancelled" ? "bg-red-50 text-red-600 border-red-100" :
                                "bg-orange-50 text-orange-600 border-orange-100"
                            }`}>
                                {order.status}
                            </div>
                        )}
                        <button className="p-2 hover:bg-white hover:shadow-md rounded-xl text-gray-400 hover:text-primary transition-all border border-transparent">
                            <Eye size={18} />
                        </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {orders.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
                    <ShoppingBag size={32} />
                </div>
                <h3 className="text-xl font-black text-foreground">No orders recorded yet</h3>
                <p className="text-gray-500 font-medium mt-1">When clients start buying, they'll appear right here.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
