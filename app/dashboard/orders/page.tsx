import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import User from "@/models/User"; // Ensure User model is loaded for population
import { 
  ShoppingBag, 
  Calendar,
  Eye,
  ArrowRight,
  TrendingUp,
  Clock,
  CheckCircle,
  Copy,
  ReceiptText,
  ShieldCheck
} from "lucide-react";
import Link from "next/link";
import OrdersList from "./OrdersList";
import OrderFilters from "./OrderFilters";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function OrdersPage({ searchParams }: Props) {
  const params = await searchParams;
  const session = await getServerSession(authOptions);
  
  if (!session) return null;

  const role = session.user.role;
  const isAdmin = ["super-admin", "admin", "manager"].includes(role);

  await connectDB();
  
  // Filtering Logic
  const queryParam = params.query?.toString().trim() || "";
  const statusParam = params.status?.toString().toLowerCase() || "all";

  // Base query: restrict to user if not admin
  let filterQuery: any = isAdmin ? {} : { user: session.user.id };

  // Apply search query (ID, Name, Email)
  if (queryParam) {
    filterQuery.$or = [
      { "shippingInfo.name": { $regex: queryParam, $options: "i" } },
      // To filter by ID partial match, we usually need the full ID or specific logic. 
      // Many systems use a string 'orderNumber'. Since we use MongoDB _id, let's try matching specifically if it's a valid ID fragment
      ...(queryParam.length >= 4 ? [{ $expr: { $regexMatch: { input: { $toString: "$_id" }, regex: queryParam, options: "i" } } }] : [])
    ];
  }

  // Apply Status filter
  if (statusParam && statusParam !== "all") {
    // MongoDB stored values are capitalized: "Pending", "Processing", etc.
    const capitalizedStatus = statusParam.charAt(0).toUpperCase() + statusParam.slice(1);
    filterQuery.status = capitalizedStatus;
  }

  const rawOrders = await Order.find(filterQuery)
    .sort({ createdAt: -1 })
    .populate("user", "name email image")
    .lean();
    
  const orders = JSON.parse(JSON.stringify(rawOrders));

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const avatarColors = [
    "bg-blue-100 text-blue-600",
    "bg-purple-100 text-purple-600",
    "bg-orange-100 text-orange-600",
    "bg-teal-100 text-teal-600",
    "bg-pink-100 text-pink-600",
  ];

  return (
    <div className="space-y-10 pb-20 animate-in fade-in slide-in-from-bottom-4 duration-1000">
      {/* Header Section */}
      <div className="relative overflow-hidden p-6 sm:p-8 md:p-12 bg-white rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-sm group">
        <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity">
            <TrendingUp size={160} className="rotate-12" />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 rounded-full border border-primary/10">
                <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-primary">Live Tracking Active</span>
            </div>
            <div className="space-y-1">
              <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-foreground tracking-tight">
                {isAdmin ? "Order Management" : "Purchase History"}
              </h1>
              <p className="text-gray-500 font-medium text-sm sm:text-base max-w-xl leading-relaxed">
                {isAdmin 
                  ? "Oversee platform orders, track logistics, and manage fulfillment status in real-time." 
                  : "Track your technology purchases and view your order history in one place."}
              </p>
            </div>
          </div>
          
          {!isAdmin && (
            <Link href="/" className="px-6 py-3 sm:px-8 sm:py-4 bg-primary text-white font-bold rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-95 flex items-center gap-3 w-fit">
                <span className="text-sm sm:text-base">Shop More</span>
                <ArrowRight size={20} />
            </Link>
          )}
        </div>
      </div>

      {/* Main Container */}
      <div className="bg-white rounded-[2rem] sm:rounded-[3rem] border border-gray-100 shadow-premium overflow-hidden min-h-[60vh] flex flex-col">
        {/* Toolbar (Client Filter Component) */}
        <OrderFilters />

        {/* List Analytics Summary (Mini) */}
        <div className="px-6 sm:px-8 py-4 bg-gray-50/20 border-b border-gray-50 flex items-center justify-between">
            <div className="flex items-center gap-2">
                <ReceiptText size={14} className="text-gray-400" />
                <span className="text-[10px] sm:text-xs font-bold text-gray-400 uppercase tracking-widest">{orders.length} Results Found</span>
            </div>
            <div className="hidden sm:flex items-center gap-4">
                <div className="flex -space-x-2">
                    {[0,1,2].map((_, i) => (
                        <div key={i} className={`w-8 h-8 rounded-lg border-2 border-white ${avatarColors[i]} flex items-center justify-center text-[8px] font-black shadow-sm`}>
                            <Clock size={10} />
                        </div>
                    ))}
                </div>
            </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto no-scrollbar flex-grow bg-white">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b border-gray-50">
                <th className="px-6 sm:px-8 py-6 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] text-left whitespace-nowrap">Order Info</th>
                <th className="px-6 sm:px-8 py-6 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] text-left">Customer</th>
                <th className="px-6 sm:px-8 py-6 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] text-left">Economic Value</th>
                <th className="px-6 sm:px-8 py-6 text-[10px] uppercase font-black text-gray-400 tracking-[0.2em] text-right">Pipeline Status</th>
              </tr>
            </thead>
            <OrdersList orders={orders} isAdmin={isAdmin} avatarColors={avatarColors} />
          </table>

          {orders.length === 0 && (
            <div className="py-32 text-center flex flex-col items-center animate-in fade-in slide-in-from-top-4 duration-1000">
                <div className="relative mb-10 group">
                    <div className="absolute inset-0 bg-primary/20 rounded-[3rem] blur-3xl group-hover:bg-primary/30 transition-all duration-500 scale-90" />
                    <div className="relative w-32 h-32 bg-white rounded-[2.5rem] flex items-center justify-center text-primary shadow-premium border border-gray-100 transform -rotate-6 group-hover:rotate-0 transition-transform duration-500">
                        <ShoppingBag size={56} strokeWidth={1.5} />
                    </div>
                </div>
                <h3 className="text-3xl font-black text-foreground tracking-tight">No Purchases Found</h3>
                <p className="text-gray-400 font-bold mt-2 max-w-sm mx-auto leading-relaxed uppercase text-[10px] tracking-[0.2em]">
                    We couldn't find any orders matching your criteria. Try adjusting your search or filters.
                </p>
                <div className="mt-10 flex gap-4">
                    <Link href="/" className="px-6 py-3 bg-zinc-900 text-white rounded-xl font-bold text-xs hover:bg-black transition-all">Go Store</Link>
                    <Link href="/dashboard/orders" className="px-6 py-3 bg-white border border-gray-100 text-gray-500 rounded-xl font-bold text-xs hover:bg-gray-50 transition-all">Clear Filters</Link>
                </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
