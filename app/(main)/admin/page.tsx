"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Package, Plus, Trash2, Edit, ShoppingCart, ListChecks } from "lucide-react";
import toast from "react-hot-toast";
import Swal from "sweetalert2";

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [tab, setTab] = useState("products");
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newProduct, setNewProduct] = useState({ name: "", price: "", category: "Accessories", description: "", image: "" });

  useEffect(() => {
    if (status === "unauthenticated" || (session?.user as any)?.role !== "admin") {
      router.push("/login");
    }
  }, [status, session, router]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, orderRes] = await Promise.all([
        fetch("/api/products"),
        fetch("/api/orders")
      ]);
      setProducts(await prodRes.json());
      setOrders(await orderRes.json());
    } catch (error) {
      toast.error("Error fetching data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated") fetchData();
  }, [status]);

  const handleAddProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newProduct),
      });
      if (res.ok) {
        toast.success("Product added!");
        setNewProduct({ name: "", price: "", category: "Accessories", description: "", image: "" });
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to add product");
    }
  };

  const handleDeleteProduct = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Yes, delete it!"
    });
    if (!result.isConfirmed) return;
    try {
      const res = await fetch(`/api/products/${id}`, { method: "DELETE" });
      if (res.ok) {
        toast.success("Product deleted");
        fetchData();
      }
    } catch (error) {
      toast.error("Failed to delete");
    }
  };

  if (status === "loading" || loading) return <div className="text-center py-20">Loading Admin Dashboard...</div>;

  return (
    <div className="bg-zinc-50 min-h-screen py-12">
      <div className="container-custom">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div>
            <h1 className="text-4xl font-extrabold text-foreground mb-2">Admin Dashboard</h1>
            <p className="text-gray-500">Manage your products and view store orders</p>
          </div>
          <div className="flex bg-white p-2 rounded-2xl shadow-sm border border-gray-100">
            <button 
              onClick={() => setTab("products")}
              className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${tab === "products" ? "bg-primary text-white shadow-md" : "text-gray-500 hover:text-primary"}`}
            >
              <Package size={18} />
              Products
            </button>
            <button 
              onClick={() => setTab("orders")}
              className={`px-6 py-2.5 rounded-xl font-bold flex items-center gap-2 transition-all ${tab === "orders" ? "bg-primary text-white shadow-md" : "text-gray-500 hover:text-primary"}`}
            >
              <ListChecks size={18} />
              Orders
            </button>
          </div>
        </div>

        {tab === "products" ? (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Add Product Form */}
            <div className="lg:col-span-1">
              <div className="bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100">
                <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-primary">
                  <Plus size={20} />
                  Add New Product
                </h2>
                <form className="space-y-4" onSubmit={handleAddProduct}>
                  <input 
                    type="text" placeholder="Product Name" required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                    value={newProduct.name} onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                  />
                  <input 
                    type="number" placeholder="Price ($)" required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                    value={newProduct.price} onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                  />
                  <select 
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none bg-white"
                    value={newProduct.category} onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                  >
                    <option>Accessories</option>
                    <option>Smartphones</option>
                    <option>Laptops</option>
                    <option>Tablets</option>
                    <option>Audio</option>
                  </select>
                  <textarea 
                    placeholder="Description" required rows={3}
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                    value={newProduct.description} onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                  />
                   <input 
                    type="text" placeholder="Image URL" required
                    className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-primary outline-none"
                    value={newProduct.image} onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                  />
                  <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/20 mt-4">
                    Create Product
                  </button>
                </form>
              </div>
            </div>

            {/* Product List */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                  <thead className="bg-zinc-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-bold text-sm text-gray-400 uppercase tracking-widest">Product</th>
                      <th className="px-6 py-4 font-bold text-sm text-gray-400 uppercase tracking-widest">Category</th>
                      <th className="px-6 py-4 font-bold text-sm text-gray-400 uppercase tracking-widest">Price</th>
                      <th className="px-6 py-4 font-bold text-sm text-gray-400 uppercase tracking-widest text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {products.map((p: any) => (
                      <tr key={p._id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 font-bold">{p.name}</td>
                        <td className="px-6 py-4"><span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-xs font-bold">{p.category}</span></td>
                        <td className="px-6 py-4">${p.price}</td>
                        <td className="px-6 py-4 text-right">
                          <button onClick={() => handleDeleteProduct(p._id)} className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all">
                            <Trash2 size={18} />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        ) : (
          /* Orders List */
          <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
             <table className="w-full text-left">
                  <thead className="bg-zinc-50 border-b border-gray-100">
                    <tr>
                      <th className="px-6 py-4 font-bold text-sm text-gray-400 uppercase tracking-widest">Order ID</th>
                      <th className="px-6 py-4 font-bold text-sm text-gray-400 uppercase tracking-widest">Customer</th>
                      <th className="px-6 py-4 font-bold text-sm text-gray-400 uppercase tracking-widest">Date</th>
                      <th className="px-6 py-4 font-bold text-sm text-gray-400 uppercase tracking-widest">Total</th>
                      <th className="px-6 py-4 font-bold text-sm text-gray-400 uppercase tracking-widest text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {orders.map((o: any) => (
                      <tr key={o._id} className="hover:bg-zinc-50 transition-colors">
                        <td className="px-6 py-4 font-mono text-xs text-gray-400">#{o._id.slice(-8)}</td>
                        <td className="px-6 py-4 font-bold">{o.shippingInfo?.name}</td>
                        <td className="px-6 py-4 text-gray-500 text-sm">{new Date(o.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 font-bold text-primary">${o.totalPrice}</td>
                        <td className="px-6 py-4 text-right">
                          <span className="bg-green-100 text-green-600 px-3 py-1 rounded-full text-xs font-bold">{o.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
          </div>
        )}
      </div>
    </div>
  );
}
