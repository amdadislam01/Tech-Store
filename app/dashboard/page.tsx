import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  TrendingUp, 
  Clock,
  Heart,
  Sparkles
} from "lucide-react";
import SalesChart from "./SalesChart";
import InventoryHealth from "./InventoryHealth";
import UserDashboardStats from "./UserDashboardStats";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Product from "@/models/Product";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  if (!session) return null;

  await connectDB();
  
  const role = session.user.role;
  const isAdmin = ["super-admin", "admin", "manager"].includes(role as string);

  // Dynamic Data Fetching
  const totalUsers = await User.countDocuments();
  const totalOrders = await Order.countDocuments();
  const totalProducts = await Product.countDocuments();
  
  // Total Revenue Aggregation
  const revenueData = await Order.aggregate([
    { $group: { _id: null, total: { $sum: "$totalPrice" } } }
  ]);
  const totalRevenue = revenueData[0]?.total || 0;

  // Personal User Data
  const myOrdersCount = !isAdmin ? await Order.countDocuments({ user: session.user.id }) : 0;

  const stats = [
    { label: "Total Users", value: totalUsers.toLocaleString(), icon: Users, change: "+12%", color: "blue" },
    { label: "Orders", value: totalOrders.toLocaleString(), icon: ShoppingBag, change: "+5%", color: "green" },
    { label: "Revenue", value: `$${totalRevenue.toLocaleString()}`, icon: DollarSign, change: "+18%", color: "purple" },
    { label: "Active Products", value: totalProducts.toLocaleString(), icon: Package, change: "0%", color: "orange" },
  ];

  // Low Stock Monitoring (Top 3 lowest)
  const lowStockProducts = await Product.find()
    .sort({ stock: 1 })
    .limit(3)
    .select("name stock")
    .lean();

  // Sales Trend Aggregation (Last 7 Days)
  const last7Days = new Date();
  last7Days.setDate(last7Days.getDate() - 7);

  const salesTrend = await Order.aggregate([
    { $match: { createdAt: { $gt: last7Days } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
        total: { $sum: "$totalPrice" }
      }
    },
    { $sort: { _id: 1 } }
  ]);

  // Format data for chart
  const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const formattedChartData = salesTrend.map(item => ({
    label: days[new Date(item._id).getDay()],
    value: item.total
  }));

  // Recent Activity Feed
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(5)
    .populate("user", "name email");

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground tracking-tight">
            {isAdmin ? "Dashboard Overview" : "Account Hub"}
          </h1>
          <p className="text-gray-500 mt-1 font-medium">Welcome back, <span className="font-bold text-primary">{session?.user.name}</span>! {isAdmin ? "Here's what's happening today." : "Track your orders and discover new tech."}</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-sm font-medium text-gray-600">
          <Clock size={16} />
          <span>Last Updated: Today</span>
        </div>
      </div>

      {isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group">
               <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 rounded-2xl bg-${stat.color}-50 text-${stat.color}-500 transform group-hover:scale-110 transition-transform`}>
                      <stat.icon size={24} />
                  </div>
                  <span className={`text-xs font-black px-2 py-1 rounded-lg ${stat.color === 'red' ? 'bg-red-50 text-red-500' : 'bg-green-50 text-green-500'}`}>
                      {stat.change}
                  </span>
               </div>
               <p className="text-gray-400 text-xs font-black uppercase tracking-widest mb-1">{stat.label}</p>
               <h3 className="text-3xl font-black text-foreground tracking-tighter">{stat.value}</h3>
            </div>
          ))}
        </div>
      ) : (
        <UserDashboardStats myOrdersCount={myOrdersCount} />
      )}

      {isAdmin && (
        <>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <SalesChart chartData={formattedChartData} />
                <InventoryHealth products={lowStockProducts} />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="bg-white p-8 rounded-[40px] border border-gray-100 shadow-sm flex flex-col lg:col-span-1">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="text-xl font-black text-foreground tracking-tight">Recent Activity</h3>
                        <span className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black uppercase tracking-widest rounded-full border border-primary/10">Live Feed</span>
                    </div>
                    <div className="flex-grow space-y-6">
                        {recentOrders.map((order) => (
                        <div key={order._id} className="flex items-start gap-4 group">
                            <div className="w-10 h-10 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors border border-gray-100/50 shrink-0">
                                <ShoppingBag size={18} className="text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="truncate">
                                <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight">Order #{order._id.toString().slice(-6).toUpperCase()}</p>
                                <p className="text-xs text-gray-500 font-medium truncate">{order.user?.name || "Customer"} · ${order.totalPrice}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-primary p-10 rounded-[40px] shadow-2xl shadow-primary/20 flex flex-col justify-between relative overflow-hidden group min-h-[350px]">
                    <div className="absolute -top-10 -right-10 w-80 h-80 bg-white/5 rounded-full group-hover:scale-110 transition-transform duration-1000" />
                    <div className="relative z-10 max-w-md">
                        <h3 className="text-3xl font-black text-white tracking-tight">Scaling to New Heights</h3>
                        <p className="text-white/70 text-base font-medium mt-4 leading-relaxed">Your catalog now features <span className="text-white font-bold">{totalProducts} premium products</span>. Every metric indicates strong growth. Ready to expand your reach?</p>
                    </div>
                    <div className="flex gap-4 mt-12 relative z-10">
                        <button className="px-10 py-4 bg-white text-primary rounded-2xl text-xs font-black uppercase tracking-widest shadow-xl hover:-translate-y-1 transition-all active:scale-95">Add New Product</button>
                        <button className="px-10 py-4 bg-white/10 text-white rounded-2xl text-xs font-black uppercase tracking-widest border border-white/20 hover:bg-white/20 transition-all">Expansion Hub</button>
                    </div>
                </div>
            </div>
        </>
      )}
    </div>
  );
}
