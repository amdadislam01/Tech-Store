import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { redirect } from "next/navigation";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import { 
  Package, 
  Search, 
  Filter,
  Plus,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import ProductActions from "./ProductActions";
import * as motion from "framer-motion/client";

export default async function ProductsPage() {
  const session = await getServerSession(authOptions);
  
  const allowedRoles = ["super-admin", "admin", "manager"];
  if (!allowedRoles.includes(session?.user.role as string)) {
    redirect("/dashboard");
  }

  await connectDB();
  const products = await Product.find({}).sort({ createdAt: -1 });

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-foreground tracking-tight">Product Inventory</h1>
          <p className="text-gray-500 text-sm font-medium">Manage your catalog, stock levels, and product visibility.</p>
        </div>
        <Link 
            href="/dashboard/products/add"
            className="px-5 py-3.5 sm:px-6 sm:py-3 bg-primary text-white font-black text-[10px] sm:text-sm uppercase tracking-widest rounded-2xl shadow-xl shadow-primary/20 hover:bg-primary-dark transition-all transform active:scale-[0.98] flex items-center justify-center gap-2 w-full md:w-auto"
        >
           <Plus size={20} />
           <span>List New Product</span>
        </Link>
      </div>

      <div className="bg-white rounded-2xl sm:rounded-3xl border border-gray-100 shadow-sm overflow-hidden min-h-[60vh] flex flex-col">
        <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="relative w-full md:w-80 group">
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
                <input 
                    type="text" 
                    placeholder="Search catalog..." 
                    className="w-full pl-10 pr-4 py-2.5 bg-gray-50 rounded-xl border border-transparent focus:bg-white focus:border-primary/20 focus:ring-4 focus:ring-primary/5 transition-all text-sm font-medium outline-none"
                />
            </div>
            <div className="flex items-center justify-between md:justify-end gap-3 w-full md:w-auto">
                <button className="flex items-center gap-2 px-4 py-2.5 bg-gray-50 text-gray-500 rounded-xl hover:bg-white group/filter transition-all border border-transparent hover:border-gray-100">
                    <Filter size={16} className="group-hover/filter:text-primary transition-colors" />
                    <span className="text-[10px] font-black uppercase tracking-widest">Filter</span>
                </button>
                <div className="h-8 w-px bg-gray-100 mx-1 hidden sm:block" />
                <span className="text-[10px] sm:text-sm font-bold text-gray-400 sm:text-gray-500 whitespace-nowrap uppercase tracking-widest sm:normal-case sm:tracking-normal">{products.length} Items</span>
            </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-gray-50/50">
                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest whitespace-nowrap">Product Info</th>
                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest">Category</th>
                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest whitespace-nowrap">Value</th>
                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest text-center">Stock</th>
                <th className="px-4 sm:px-6 py-4 text-[10px] uppercase font-black text-gray-400 tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {products.map((product) => (
                <tr key={product._id} className="hover:bg-gray-50/50 transition-colors group">
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex items-center gap-3 sm:gap-4">
                      <div className="relative w-10 h-10 sm:w-12 sm:h-12 bg-gray-50 rounded-xl sm:rounded-2xl flex items-center justify-center p-2 border border-gray-100/50 group-hover:scale-110 transition-transform flex-shrink-0">
                        <Image 
                            src={product.images?.[0] || product.image} 
                            alt={product.name} 
                            fill 
                            className="object-contain p-1.5"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="font-black text-foreground group-hover:text-primary transition-colors text-sm sm:text-base line-clamp-1 tracking-tight">{product.name}</p>
                        <p className="text-[8px] sm:text-[9px] text-gray-400 mt-0.5 uppercase font-black tracking-widest">SKU-{product._id.toString().slice(-6).toUpperCase()}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="inline-flex items-center gap-1.5 px-2 py-0.5 bg-primary/5 text-primary rounded text-[9px] font-black uppercase tracking-widest border border-primary/10 transition-all group-hover:bg-primary group-hover:text-white">
                      {product.category || "General"}
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <span className="text-sm font-black text-foreground tracking-tight">${product.price.toLocaleString()}</span>
                  </td>
                  <td className="px-4 sm:px-6 py-4">
                    <div className="flex flex-col items-center gap-1.5">
                        <span className={`text-[9px] font-black uppercase tracking-widest ${
                            product.stock > 10 ? "text-green-500" : "text-orange-500"
                        }`}>
                            {product.stock > 0 ? `${product.stock}` : "0"}
                        </span>
                        <div className="w-12 sm:w-16 h-1 bg-gray-100 rounded-full overflow-hidden">
                            <div 
                                className={`h-full rounded-full transition-all duration-1000 ${
                                    product.stock > 10 ? "bg-green-500" : "bg-orange-500"
                                }`}
                                style={{ width: `${Math.min(product.stock * 2, 100)}%` }}
                            />
                        </div>
                    </div>
                  </td>
                  <td className="px-4 sm:px-6 py-4 text-right">
                    <ProductActions productId={product._id.toString()} userRole={session?.user.role as string} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {products.length === 0 && (
            <div className="py-20 text-center flex flex-col items-center">
                <div className="w-20 h-20 bg-gray-50 rounded-[32px] flex items-center justify-center text-gray-300 mb-6 border border-gray-100">
                    <Package size={32} />
                </div>
                <h3 className="text-xl font-black text-foreground">Inventory is currently empty</h3>
                <p className="text-gray-500 font-medium mt-1">Start your journey by listing your first premium product.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
