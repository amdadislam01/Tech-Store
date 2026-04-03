"use client";

import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { Search, Filter, X, ChevronDown } from "lucide-react";
import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const statusOptions = [
  { id: "all", label: "All Statuses" },
  { id: "pending", label: "Pending Approval" },
  { id: "processing", label: "Processing" },
  { id: "shipped", label: "Out for Delivery" },
  { id: "delivered", label: "Completed" },
  { id: "cancelled", label: "Cancelled" },
];

export default function OrderFilters() {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const { replace } = useRouter();

  const [searchTerm, setSearchTerm] = useState(searchParams.get("query")?.toString() || "");
  const [showFilters, setShowFilters] = useState(false);
  const currentStatus = searchParams.get("status") || "all";

  const handleSearch = useCallback(
    (term: string) => {
      const params = new URLSearchParams(searchParams);
      if (term) {
        params.set("query", term);
      } else {
        params.delete("query");
      }
      params.set("page", "1");
      replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, replace]
  );

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      handleSearch(searchTerm);
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, handleSearch]);

  const setStatus = (status: string) => {
    const params = new URLSearchParams(searchParams);
    if (status && status !== "all") {
      params.set("status", status);
    } else {
      params.delete("status");
    }
    params.set("page", "1");
    replace(`${pathname}?${params.toString()}`);
    setShowFilters(false);
  };

  const clearFilters = () => {
    setSearchTerm("");
    const params = new URLSearchParams();
    replace(`${pathname}`);
    setShowFilters(false);
  };

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 bg-gray-50/30 p-8 border-b border-gray-50">
      <div className="flex items-center gap-4 w-full lg:w-auto">
        <div className="relative group w-full lg:w-96">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors"
            size={18}
          />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Order ID, Client, or Email..."
            className="w-full pl-12 pr-6 py-3.5 bg-white rounded-2xl border border-gray-100 focus:border-primary/30 focus:ring-8 focus:ring-primary/5 transition-all text-sm font-bold placeholder:text-gray-300 shadow-sm outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm("")}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 rounded-full transition-colors text-gray-400"
            >
              <X size={14} />
            </button>
          )}
        </div>

        <div className="relative shrink-0">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`p-3.5 bg-white text-gray-500 rounded-2xl hover:bg-primary hover:text-white transition-all border border-gray-100 shadow-sm group flex items-center gap-2 ${
                currentStatus !== "all" ? "ring-2 ring-primary border-transparent" : ""
            }`}
          >
            <Filter size={18} className="group-hover:scale-110 transition-transform" />
            <span className={`text-xs font-bold ${currentStatus !== "all" ? "flex" : "hidden md:flex"}`}>
              {statusOptions.find((s) => s.id === currentStatus)?.label || "Filter"}
            </span>
            <ChevronDown size={14} className={`transition-transform duration-300 ${showFilters ? "rotate-180" : ""}`} />
          </button>

          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                className="absolute left-0 mt-3 w-56 bg-white border border-gray-100 rounded-2xl shadow-xl z-50 py-2 overflow-hidden"
              >
                <div className="px-4 py-2 text-[10px] font-black uppercase tracking-widest text-gray-300 border-b border-gray-50 mb-1 flex justify-between items-center">
                    <span>Filter by Status</span>
                    <button onClick={clearFilters} className="text-primary hover:underline text-[9px]">Clear</button>
                </div>
                {statusOptions.map((status) => (
                  <button
                    key={status.id}
                    onClick={() => setStatus(status.id)}
                    className={`w-full text-left px-4 py-3 flex items-center justify-between transition-colors ${
                      currentStatus === status.id
                        ? "bg-primary/5 text-primary cursor-default"
                        : "text-gray-500 hover:bg-gray-50 hover:text-gray-900 group"
                    }`}
                  >
                    <span className="text-xs font-bold">{status.label}</span>
                    {currentStatus === status.id && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                  </button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="flex items-center gap-6">
          {(searchTerm || currentStatus !== "all") && (
              <button onClick={clearFilters} className="text-xs font-bold text-gray-400 hover:text-primary transition-colors border-b border-gray-100 border-dashed pb-0.5">Reset Filters</button>
          )}
          <div className="h-10 w-px bg-gray-200 hidden lg:block" />
          <div className="hidden sm:flex flex-col text-right lg:text-left">
              <span className="text-[10px] font-black text-gray-400 uppercase tracking-widest">Active Filters</span>
              <p className="text-sm font-black text-foreground">
                  {currentStatus === "all" ? "Broad Search" : "Filtered Stream"}
              </p>
          </div>
      </div>
    </div>
  );
}
