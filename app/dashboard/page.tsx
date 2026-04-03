import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { 
  Users, 
  ShoppingBag, 
  DollarSign, 
  Package, 
  Clock,
  TrendingUp
} from "lucide-react";
import SalesChart from "./SalesChart";
import InventoryHealth from "./InventoryHealth";
import UserDashboardStats from "./UserDashboardStats";
import connectDB from "@/lib/db";
import User from "@/models/User";
import Order from "@/models/Order";
import Product from "@/models/Product";

interface Props {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function DashboardPage({ searchParams }: Props) {
  const params = await searchParams;
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
    { 
        label: "Total Users", 
        value: totalUsers.toLocaleString(), 
        icon: Users, 
        change: "+12%", 
        bgColor: "bg-indigo-50", 
        textColor: "text-indigo-600",
        badgeColor: "bg-indigo-100 text-indigo-700"
    },
    { 
        label: "Market Orders", 
        value: totalOrders.toLocaleString(), 
        icon: ShoppingBag, 
        change: "+5%", 
        bgColor: "bg-emerald-50", 
        textColor: "text-emerald-600",
        badgeColor: "bg-emerald-100 text-emerald-700"
    },
    { 
        label: "Node Revenue", 
        value: `$${totalRevenue.toLocaleString()}`, 
        icon: DollarSign, 
        change: "+18%", 
        bgColor: "bg-violet-50", 
        textColor: "text-violet-600",
        badgeColor: "bg-violet-100 text-violet-700"
    },
    { 
        label: "Active Nodes", 
        value: totalProducts.toLocaleString(), 
        icon: Package, 
        change: "Optimal", 
        bgColor: "bg-amber-50", 
        textColor: "text-amber-600",
        badgeColor: "bg-amber-100 text-amber-700"
    },
  ];

  // Low Stock Monitoring (Top 3 lowest)
  const lowStockProducts = await Product.find()
    .sort({ stock: 1 })
    .limit(3)
    .select("name stock")
    .lean();

  // Chart Data Logic (Daily vs Monthly)
  const period = params.period?.toString() || "daily";
  let formattedChartData = [];

  if (period === "daily") {
    const last7DaysDate = new Date();
    last7DaysDate.setDate(last7DaysDate.getDate() - 6);
    last7DaysDate.setHours(0, 0, 0, 0);

    const salesTrend = await Order.aggregate([
        { $match: { createdAt: { $gte: last7DaysDate } } },
        {
          $group: {
            _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
            total: { $sum: "$totalPrice" }
          }
        },
        { $sort: { _id: 1 } }
    ]);

    const daysShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let i = 0; i < 7; i++) {
        const d = new Date();
        d.setDate(d.getDate() - (6 - i));
        const dateStr = d.toISOString().split("T")[0];
        const dayData = salesTrend.find(item => item._id === dateStr);
        formattedChartData.push({
            label: daysShort[d.getDay()],
            value: dayData ? dayData.total : 0
        });
    }
  } else {
    const last6MonthsDate = new Date();
    last6MonthsDate.setMonth(last6MonthsDate.getMonth() - 5);
    last6MonthsDate.setDate(1);
    last6MonthsDate.setHours(0, 0, 0, 0);

    const monthlyTrend = await Order.aggregate([
        { $match: { createdAt: { $gte: last6MonthsDate } } },
        {
            $group: {
                _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
                total: { $sum: "$totalPrice" }
            }
        },
        { $sort: { _id: 1 } }
    ]);

    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    for (let i = 0; i < 6; i++) {
        const d = new Date();
        d.setMonth(d.getMonth() - (5 - i));
        const monthKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`;
        const monthData = monthlyTrend.find(item => item._id === monthKey);
        formattedChartData.push({
            label: monthNames[d.getMonth()],
            value: monthData ? monthData.total : 0
        });
    }
  }

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
          <p className="text-gray-500 mt-1 font-medium italic">Welcome back, <span className="font-bold text-primary not-italic">{session?.user.name}</span>!</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-xl border border-gray-100 shadow-sm text-[10px] font-black uppercase tracking-widest text-gray-400">
          <Clock size={14} className="text-primary/40" />
          <span>Real-time Sync Active</span>
        </div>
      </div>

      {isAdmin ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat, i) => (
            <div key={i} className="bg-white p-6 rounded-[2.5rem] border border-gray-100 shadow-sm hover:shadow-premium-hover transition-all duration-500 group relative overflow-hidden">
               <div className="absolute top-0 left-0 w-2 h-full opacity-0 group-hover:opacity-100 transition-opacity" style={{ backgroundColor: `currentColor` }} />
               <div className="flex items-center justify-between mb-6">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 group-hover:shadow-lg ${stat.bgColor} ${stat.textColor}`}>
                      <stat.icon size={24} />
                  </div>
                  <span className={`text-[10px] font-black px-2.5 py-1 rounded-lg tracking-widest uppercase ${stat.badgeColor}`}>
                      {stat.change}
                  </span>
               </div>
               <p className="text-gray-400 text-[10px] font-black uppercase tracking-widest mb-1.5">{stat.label}</p>
               <h3 className="text-3xl font-black text-foreground tracking-tighter group-hover:text-primary transition-colors">{stat.value}</h3>
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
                <div className="bg-white p-10 rounded-[3rem] border border-gray-100 shadow-sm flex flex-col lg:col-span-1">
                    <div className="flex items-center justify-between mb-10">
                        <h3 className="text-xl font-black text-foreground tracking-tight">Stream Protocol</h3>
                        <span className="px-3 py-1 bg-violet-50 text-violet-600 text-[10px] font-black uppercase tracking-widest rounded-full border border-violet-100">Live Feed</span>
                    </div>
                    <div className="flex-grow space-y-8">
                        {recentOrders.map((order) => (
                        <div key={order._id} className="flex items-start gap-4 group">
                            <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center group-hover:bg-primary/10 transition-colors border border-gray-100/50 shrink-0">
                                <ShoppingBag size={20} className="text-gray-400 group-hover:text-primary transition-colors" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-sm font-black text-foreground group-hover:text-primary transition-colors tracking-tight">Order #{order._id.toString().slice(-8).toUpperCase()}</p>
                                <p className="text-[10px] text-gray-500 font-bold uppercase tracking-wider truncate">{order.user?.name || "Customer"} · ${order.totalPrice.toLocaleString()}</p>
                            </div>
                        </div>
                        ))}
                    </div>
                </div>

                <div className="lg:col-span-2 bg-zinc-900 p-12 rounded-[3.5rem] shadow-2xl shadow-zinc-200 flex flex-col justify-between relative overflow-hidden group min-h-[400px]">
                    <div className="absolute top-0 right-0 p-12 text-white/5 group-hover:scale-125 transition-transform duration-[2s]">
                        <TrendingUp size={240} className="rotate-12" />
                    </div>
                    <div className="relative z-10 max-w-md space-y-6">
                        <div className="w-16 h-16 bg-white/10 rounded-[1.5rem] flex items-center justify-center text-primary border border-white/10 shadow-inner">
                            <ShoppingBag size={32} />
                        </div>
                        <h3 className="text-4xl font-black text-white tracking-tight leading-none">Scaling to New Heights</h3>
                        <p className="text-white/60 text-lg font-medium leading-relaxed">Your catalog now features <span className="text-white font-bold">{totalProducts} premium nodes</span>. Digital transformation metrics indicate strong growth.</p>
                    </div>
                    <div className="flex flex-wrap gap-4 mt-12 relative z-10">
                        <button className="px-10 py-5 bg-primary text-white rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:-translate-y-1 hover:brightness-110 transition-all active:scale-95 border border-primary/20">Add New Product</button>
                        <button className="px-10 py-5 bg-white/5 text-white rounded-2xl text-[10px] font-black uppercase tracking-widest border border-white/10 hover:bg-white/10 transition-all">Expansion Hub</button>
                    </div>
                </div>
            </div>
        </>
      )}
    </div>
  );
}
