import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { 
  Search, 
  Mail,
  Shield,
} from "lucide-react";
import UserActions from "./UserActions";

export default async function UsersPage() {
  const session = await getServerSession(authOptions);
  
  const allowedRoles = ["super-admin", "admin"];
  if (!allowedRoles.includes(session?.user.role as string)) {
    redirect("/dashboard");
  }

  const canManage = session?.user.role === "super-admin";

  await connectDB();
  const users = await User.find({}).sort({ createdAt: -1 });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">User Management</h1>
          <p className="text-gray-500 text-sm font-medium">Manage platform users, roles, and account statuses.</p>
        </div>
        <div className="w-fit flex items-center gap-2 px-4 py-2.5 sm:px-6 sm:py-3 bg-white border border-gray-100 rounded-2xl shadow-sm text-[10px] sm:text-sm font-bold text-gray-500">
           <span className="w-2.5 h-2.5 bg-green-500 rounded-full animate-pulse shadow-sm shadow-green-500/50" />
           <span>{users.length} Active Platform Users</span>
        </div>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[60vh] flex flex-col">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Search users..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium outline-none"
                />
            </div>
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-widest text-gray-400">Sort By: Recent</span>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">User Profile</th>
                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Digital ID</th>
                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest text-right whitespace-nowrap">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {users.map((user) => (
                <tr key={user._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative">
                        <div className="w-10 h-10 sm:w-11 sm:h-11 bg-primary/10 rounded-xl sm:rounded-2xl flex items-center justify-center text-primary font-black shadow-sm group-hover:scale-110 transition-transform">
                          {user.name.charAt(0)}
                        </div>
                        <div className="absolute -bottom-1 -right-1 w-3.5 h-3.5 sm:w-4 sm:h-4 bg-white rounded-full flex items-center justify-center shadow-sm">
                            <div className="w-2 h-2 bg-green-500 rounded-full" />
                        </div>
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-foreground group-hover:text-primary transition-colors tracking-tight text-sm sm:text-base truncate">{user.name}</p>
                        <div className={`mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md text-[8px] sm:text-[9px] font-black uppercase tracking-widest ${
                        user.role === "super-admin" 
                            ? "bg-purple-100 text-purple-600 border border-purple-200" 
                            : user.role === "admin"
                            ? "bg-blue-100 text-blue-600 border border-blue-200"
                            : user.role === "manager"
                            ? "bg-orange-100 text-orange-600 border border-orange-200"
                            : "bg-gray-100 text-gray-600 border border-gray-200"
                        }`}>
                        <Shield size={8} className="sm:w-2.5 sm:h-2.5" />
                        {user.role}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="space-y-1">
                        <div className="flex items-center gap-1.5 text-[10px] sm:text-xs font-bold text-gray-600 truncate max-w-[150px] sm:max-w-none">
                            <Mail size={12} className="text-gray-400 shrink-0" />
                            <span className="truncate">{user.email}</span>
                        </div>
                        <p className="text-[8px] sm:text-[10px] text-gray-400 font-medium ml-4 sm:ml-5">
                            {new Date(user.createdAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
                        </p>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <UserActions userId={user._id.toString()} currentRole={user.role} canManage={canManage} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
