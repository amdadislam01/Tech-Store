"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

import Hero from "@/components/Sections/Hero";
import BrandPartners from "@/components/Sections/BrandPartners";
import CategoryGrid from "@/components/Sections/CategoryGrid";
import BenefitCards from "@/components/Sections/BenefitCards";
import InnovationSpotlight from "@/components/Sections/InnovationSpotlight";
import MembershipRewards from "@/components/Sections/MembershipRewards";
import TechInsights from "@/components/Sections/TechInsights";
import CommunityPulse from "@/components/Sections/CommunityPulse";
import ProductCatalog from "@/components/Sections/ProductCatalog";

export default function HomePageClient({ initialProducts }: { initialProducts: any[] }) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search)}`);
    }
  };

  const fetchProducts = async () => {
    if (isFirstLoad && category === "All" && search === "") {
        setIsFirstLoad(false);
        return;
    }
    
    setLoading(true);
    try {
      const res = await fetch(`/api/products?category=${category}&search=${search}`);
      const data = await res.json();
      setProducts(data);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
        fetchProducts();
    }, 300); // Delay execution to prevent frequent API calls during rapid typing
    return () => clearTimeout(timer);
  }, [category, search]);

  return (
    <div className="bg-[#F8FAFC] min-h-screen">
      <Hero 
        search={search} 
        setSearch={setSearch} 
        handleSearch={handleSearch} 
      />
      
      <BrandPartners />

      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="container-custom py-12 lg:py-16 relative z-20 flex flex-col gap-12 lg:gap-16"
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <CategoryGrid 
            category={category} 
            setCategory={setCategory} 
          />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.2 }}
        >
          <ProductCatalog 
            products={products}
            loading={loading}
            category={category}
            search={search}
            setCategory={setCategory}
            setSearch={setSearch}
          />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          <BenefitCards />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <InnovationSpotlight />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.5 }}
        >
          <MembershipRewards />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.6 }}
        >
          <TechInsights />
        </motion.div>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: 0.7 }}
        >
          <CommunityPulse />
        </motion.div>
      </motion.section>
    </div>
  );
}
