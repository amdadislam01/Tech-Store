"use client";

import { motion } from "framer-motion";
import { CreditCard, ArrowRight, Download, Filter, Search, BadgeCheck, Clock, ShieldAlert } from "lucide-react";

const transactions = [
  { id: "TX92837", type: "Order Payment", amount: "৳45,000", status: "completed", date: "Apr 05, 2026", method: "Stripe" },
  { id: "TX92812", type: "Store Credit", amount: "৳5,000", status: "pending", date: "Apr 02, 2026", method: "SSLCommerz" },
  { id: "TX92790", type: "Order Refund", amount: "৳1,200", status: "refunded", date: "Mar 28, 2026", method: "Manual" },
  { id: "TX92755", type: "Order Payment", amount: "৳72,500", status: "completed", date: "Mar 15, 2026", method: "COD" },
];

export default function TransactionsPage() {
  return (
    <div className="space-y-8 animate-in fade-in duration-1000">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-1">
          <h1 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Financial Overview</h1>
          <p className="text-gray-500 text-sm font-medium italic">Monitor every transaction within your digital ecosystem.</p>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
          <button className="p-2.5 sm:p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm">
            <Search size={18} />
          </button>
          <button className="p-2.5 sm:p-3 bg-white border border-gray-100 rounded-xl text-gray-400 hover:text-primary transition-all shadow-sm">
            <Filter size={18} />
          </button>
          <button className="flex items-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 bg-primary text-white rounded-xl text-[9px] sm:text-[10px] font-black uppercase tracking-widest shadow-xl shadow-primary/20 hover:brightness-110 active:scale-95 transition-all">
            <Download size={14} /> <span className="hidden xs:inline">Export Table</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 flex items-center justify-center text-emerald-500 group-hover:scale-110 transition-transform">
            <BadgeCheck size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Total Spent</p>
            <p className="text-xl font-black text-foreground">৳123,700</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 flex items-center justify-center text-amber-500 group-hover:scale-110 transition-transform">
            <Clock size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Processing</p>
            <p className="text-xl font-black text-foreground">৳5,000</p>
          </div>
        </div>
        <div className="bg-white p-6 rounded-[2rem] border border-gray-100 shadow-sm flex items-center gap-4 group">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 flex items-center justify-center text-rose-500 group-hover:scale-110 transition-transform">
            <ShieldAlert size={24} />
          </div>
          <div>
            <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Refunded</p>
            <p className="text-xl font-black text-foreground">৳1,200</p>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-[2.5rem] border border-gray-100 shadow-sm overflow-hidden">
        <div className="overflow-x-auto no-scrollbar">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-5 sm:px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Transaction ID</th>
                <th className="px-5 sm:px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Type</th>
                <th className="px-5 sm:px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Method</th>
                <th className="px-5 sm:px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Amount</th>
                <th className="px-5 sm:px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Status</th>
                <th className="px-5 sm:px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest">Date</th>
                <th className="px-5 sm:px-8 py-5 text-[9px] font-black text-gray-400 uppercase tracking-widest"></th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, idx) => (
                <motion.tr 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }} 
                  transition={{ delay: idx * 0.05 }}
                  key={tx.id} 
                  className="border-b border-gray-50 hover:bg-gray-50/50 transition-all group"
                >
                  <td className="px-5 sm:px-8 py-5">
                    <span className="text-xs font-black text-gray-400 group-hover:text-primary transition-colors">#{tx.id}</span>
                  </td>
                  <td className="px-5 sm:px-8 py-5">
                    <p className="text-sm font-black text-foreground tracking-tight">{tx.type}</p>
                  </td>
                  <td className="px-5 sm:px-8 py-5">
                    <span className="px-3 py-1 bg-gray-100 rounded-lg text-[9px] font-black text-gray-500 uppercase tracking-widest">{tx.method}</span>
                  </td>
                  <td className="px-5 sm:px-8 py-5">
                    <p className="text-sm font-black text-foreground tracking-tight">{tx.amount}</p>
                  </td>
                  <td className="px-5 sm:px-8 py-5">
                    <span className={`px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest ${
                      tx.status === 'completed' ? 'bg-emerald-100 text-emerald-600' : 
                      tx.status === 'pending' ? 'bg-amber-100 text-amber-600' : 
                      'bg-rose-100 text-rose-600'
                    }`}>
                      {tx.status}
                    </span>
                  </td>
                  <td className="px-5 sm:px-8 py-5">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-tight">{tx.date}</p>
                  </td>
                  <td className="px-5 sm:px-8 py-5 text-right">
                    <button className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center text-gray-400 hover:bg-primary hover:text-white transition-all">
                      <ArrowRight size={14} />
                    </button>
                  </td>
                </motion.tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
