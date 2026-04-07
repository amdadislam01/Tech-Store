"use client";

import { useState, useEffect } from "react";
import { Plus, Home, Briefcase, MapPin, Trash2, Edit2, CheckCircle2, ArrowLeft, Loader2, Sparkles } from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import Swal from "sweetalert2";

interface Address {
  _id?: string;
  name: string;
  phone: string;
  city: string;
  area: string;
  address: string;
  landmark?: string;
  addressType: "Home" | "Office";
  isDefault: boolean;
}

export default function AddressesPage() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<Address>({
    name: "",
    phone: "",
    city: "",
    area: "",
    address: "",
    landmark: "",
    addressType: "Home",
    isDefault: false
  });

  useEffect(() => {
    fetchAddresses();
  }, []);

  const fetchAddresses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/user/addresses");
      const data = await res.json();
      if (res.ok) setAddresses(data);
    } catch (error) {
      toast.error("Failed to load addresses.");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch("/api/user/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address: formData, id: editingId })
      });
      if (res.ok) {
        toast.success(editingId ? "Address updated!" : "New address added!");
        setIsFormOpen(false);
        fetchAddresses();
      }
    } catch (error) {
      toast.error("Synchronization failed.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    });

    if (result.isConfirmed) {
      try {
        const res = await fetch(`/api/user/addresses?id=${id}`, { method: "DELETE" });
        if (res.ok) {
          Swal.fire(
            "Deleted!",
            "Your address has been deleted.",
            "success"
          );
          fetchAddresses();
        }
      } catch (error) {
        toast.error("Deletion failed.");
      }
    }
  };

  const openEdit = (address: Address) => {
    setEditingId(address._id!);
    setFormData(address);
    setIsFormOpen(true);
  };

  const openAdd = () => {
    setEditingId(null);
    setFormData({
      name: "",
      phone: "",
      city: "",
      area: "",
      address: "",
      landmark: "",
      addressType: "Home",
      isDefault: false
    });
    setIsFormOpen(true);
  };

  return (
    <div className="min-h-screen pb-20">
      {/* Premium Header */}
      <div className="sticky top-0 z-30 border-b border-gray-100 mb-8 px-4 sm:px-8 py-4 sm:py-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link href="/dashboard" className="p-2 sm:p-2.5 bg-gray-50 rounded-xl hover:bg-primary/5 hover:text-primary transition-all shadow-sm">
             <ArrowLeft size={18} />
          </Link>
          <div>
            <h1 className="text-lg sm:text-2xl font-black text-foreground tracking-tight">Saved Addresses</h1>
            <p className="text-[9px] sm:text-xs text-gray-400 font-bold uppercase tracking-widest italic leading-none">Shipping & Delivery</p>
          </div>
        </div>
        <button 
          onClick={openAdd}
          className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all"
        >
          <Plus size={16} /> Add Address
        </button>
      </div>

      <div className="max-w-6xl mx-auto px-4">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 gap-4">
             <Loader2 className="animate-spin text-primary" size={40} />
             <p className="text-gray-400 font-black text-xs uppercase tracking-widest animate-pulse">Synchronizing Data...</p>
          </div>
        ) : addresses.length === 0 ? (
          <div className="bg-white rounded-3xl sm:rounded-[3rem] p-8 sm:p-16 text-center border-dashed border-2 border-gray-100 flex flex-col items-center">
             <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl sm:rounded-3xl bg-gray-50 flex items-center justify-center text-gray-200 mb-4 sm:mb-6">
                <MapPin size={32} />
             </div>
             <h3 className="text-xl sm:text-2xl font-black text-foreground mb-2 sm:mb-4">No Addresses Found</h3>
             <p className="text-gray-400 max-w-sm mb-8 sm:mb-10 font-medium text-sm sm:text-base">Save your shipping details now for a faster, 1-click checkout experience later.</p>
             <button onClick={openAdd} className="w-full sm:w-auto px-10 py-4 bg-primary text-white rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110 transform transition">
                Add New Address
             </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
            {addresses.map((addr) => (
              <motion.div 
                layout
                key={addr._id}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={`bg-white p-5 sm:p-8 rounded-3xl sm:rounded-[2.5rem] border transition-all duration-300 group relative overflow-hidden ${
                  addr.isDefault ? "border-primary/50 shadow-xl shadow-primary/5 ring-1 ring-primary/10" : "border-gray-100 hover:border-gray-200"
                }`}
              >
                <div className="absolute top-0 right-0 p-6 md:p-8 text-primary/5 opacity-0 group-hover:opacity-20 transition-all">
                    {addr.addressType === "Home" ? <Home size={100} className="md:w-[120px] md:h-[120px]" /> : <Briefcase size={100} className="md:w-[120px] md:h-[120px]" />}
                </div>

                <div className="flex justify-between items-start mb-8 relative z-10">
                  <div className={`p-4 rounded-2xl shadow-inner ${addr.isDefault ? "bg-primary text-white" : "bg-gray-50 text-primary"}`}>
                    {addr.addressType === "Home" ? <Home size={24} /> : <Briefcase size={24} />}
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => openEdit(addr)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-primary transition-all"><Edit2 size={16} /></button>
                    <button onClick={() => handleDelete(addr._id!)} className="p-3 bg-gray-50 rounded-xl text-gray-400 hover:text-rose-500 transition-all"><Trash2 size={16} /></button>
                  </div>
                </div>

                <div className="space-y-6 relative z-10">
                  <div>
                    <h3 className="text-xl font-black text-foreground tracking-tight flex items-center gap-2">
                        {addr.name}
                        {addr.isDefault && <CheckCircle2 size={14} className="text-emerald-500" />}
                    </h3>
                    <p className="text-sm font-bold text-gray-400">{addr.phone}</p>
                  </div>
                  
                  <div className="h-px bg-gray-50" />

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Region</p>
                        <p className="text-xs font-black text-foreground italic">{addr.city}, {addr.area}</p>
                    </div>
                    <div>
                        <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Type</p>
                        <p className="text-xs font-black text-foreground uppercase">{addr.addressType}</p>
                    </div>
                  </div>

                  <div>
                     <p className="text-[9px] font-black uppercase tracking-widest text-gray-400 mb-1">Shipping Address</p>
                     <p className="text-sm font-medium text-gray-600 line-clamp-2 leading-relaxed">{addr.address}</p>
                     {addr.landmark && <p className="text-[10px] text-primary font-black mt-2 uppercase tracking-widest">Near: {addr.landmark}</p>}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Address Form Modal */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
             <motion.div 
               initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
               className="absolute inset-0 bg-[#081621]/40 backdrop-blur-md" 
               onClick={() => setIsFormOpen(false)}
             />
             <motion.div 
               initial={{ opacity: 0, y: 100, scale: 0.95 }}
               animate={{ opacity: 1, y: 0, scale: 1 }}
               exit={{ opacity: 0, y: 100, scale: 0.95 }}
               className="relative bg-white w-full max-w-2xl max-h-[90vh] overflow-y-auto no-scrollbar rounded-[2rem] sm:rounded-[3rem] shadow-2xl p-6 sm:p-10 md:p-12"
             >
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl pointer-events-none" />
                
                <h2 className="text-xl sm:text-3xl font-black text-foreground mb-6 sm:mb-8 tracking-tighter flex items-center gap-3 sm:gap-4">
                   <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl sm:rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20">
                        <MapPin size={20} className="sm:w-6 sm:h-6" />
                   </div>
                   {editingId ? "Edit Address" : "Add New Address"}
                </h2>

                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Full Name</label>
                        <input required type="text" className="w-full px-5 py-3.5 sm:px-6 sm:py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary transition-all font-black" 
                          value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Phone Number</label>
                        <input required type="tel" className="w-full px-5 py-3.5 sm:px-6 sm:py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary transition-all font-black"
                          value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})}
                        />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">City / Region</label>
                        <input required type="text" className="w-full px-5 py-3.5 sm:px-6 sm:py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary transition-all font-black"
                          value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})}
                        />
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Area / Sub-district</label>
                        <input required type="text" className="w-full px-5 py-3.5 sm:px-6 sm:py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary transition-all font-black"
                          value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})}
                        />
                    </div>
                  </div>

                  <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Detailed Shipping Address</label>
                      <input required type="text" className="w-full px-5 py-3.5 sm:px-6 sm:py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary transition-all font-black"
                        value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})}
                      />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2 text-primary">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Address Type</label>
                        <div className="flex gap-4">
                            {["Home", "Office"].map(type => (
                                <button key={type} type="button" onClick={() => setFormData({...formData, addressType: type as any})}
                                  className={`flex-1 py-3.5 sm:py-4 rounded-2xl font-black text-[10px] sm:text-xs uppercase tracking-widest transition-all border-2 ${formData.addressType === type ? "bg-primary text-white border-primary" : "bg-gray-50 text-gray-400 border-transparent hover:border-gray-100"}`}
                                >{type}</button>
                            ))}
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Landmark (Optional)</label>
                        <input type="text" className="w-full px-5 py-3.5 sm:px-6 sm:py-4 bg-gray-50 rounded-2xl border border-transparent focus:bg-white focus:border-primary transition-all font-black"
                          value={formData.landmark} onChange={e => setFormData({...formData, landmark: e.target.value})}
                        />

                    </div>
                  </div>

                  <div className="flex items-center gap-2 pt-2">
                      <input type="checkbox" id="isDefault" checked={formData.isDefault} onChange={e => setFormData({...formData, isDefault: e.target.checked})} className="w-5 h-5 accent-primary" />
                      <label htmlFor="isDefault" className="text-xs font-black text-gray-500 uppercase tracking-widest cursor-pointer">Set as Primary Address</label>
                  </div>

                  <div className="pt-6 grid grid-cols-2 gap-4">
                     <button type="button" onClick={() => setIsFormOpen(false)} className="py-5 bg-gray-50 text-gray-400 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-gray-100 transition-all">Cancel</button>
                     <button disabled={submitting} type="submit" className="py-5 bg-primary text-white rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110 transform transition">
                        {submitting ? "Saving..." : editingId ? "Update Address" : "Save Address"}
                     </button>
                  </div>
                </form>
             </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
