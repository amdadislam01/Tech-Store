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
import ProductCatalog from "@/components/Sections/ProductCatalog";

export default function HomePageClient({ 
  initialProducts, 
  settings 
}: { 
  initialProducts: any[]; 
  settings: any; 
}) {
  const router = useRouter();
  const [products, setProducts] = useState(initialProducts);
  const [categories, setCategories] = useState(["All"]);
  const [loading, setLoading] = useState(false);
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [isFirstLoad, setIsFirstLoad] = useState(true);

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && search.trim()) {
      router.push(`/products?search=${encodeURIComponent(search)}`);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (Array.isArray(data)) setCategories(data);
    } catch (error) {
      console.error("Error fetching categories:", error);
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
      setProducts(data.products || []);
    } catch (error) {
      console.error("Error fetching products:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

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
        settings={settings}
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
            categories={categories}
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
            columns={5}
            limit={10}
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

        {/* Structured SEO/Shop Description Section - Star Tech Style */}
        <motion.div
           initial={{ opacity: 1 }}
           className="mt-10 pt-10 border-t border-gray-200"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-12 text-sm text-gray-600 leading-relaxed">
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-l-4 border-primary pl-3">Top Laptop Gallery in Bangladesh</h3>
              <p>
                Whether you're looking for a high-performance gaming laptop or a sleek ultrabook for work, we offer the latest models from top brands like HP, Asus, Dell, and Apple. Our collection is curated for durability and power.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-l-4 border-primary pl-3">Premium PC Components</h3>
              <p>
                Build your dream rig with our wide range of processors, motherboards, graphics cards, and storage solutions. We provide genuine components that ensure your system runs at peak performance for years to come.
              </p>
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-bold text-slate-900 border-l-4 border-primary pl-3">Next-Gen Audio & Gadgets</h3>
              <p>
                Experience superior sound with our premium headphones and speakers. From professional studio gear to portable Bluetooth speakers, we've got something for every audiophile and gadget enthusiast.
              </p>
            </div>
          </div>
          
          <div className="mt-16 bg-white p-8 rounded-xl border border-gray-100 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900 mb-6 uppercase tracking-wider">Leading Computer, Laptop & Gadget Shop in Bangladesh</h2>
            <div className="space-y-4 text-justify">
              <p>
                Welcome to our tech store, your one-stop destination for all things technology. Since our inception, we have been committed to providing our customers with the best quality products at the most affordable prices. Whether you are a professional gamer, a creative designer, or just a tech enthusiast, we have the right gear for you.
              </p>
              <p>
                We specialize in **Laptops**, **Desktops**, **Graphics Cards**, and **Gaming Peripherals**. Our after-sales service is what sets us apart, ensuring that you have peace of mind with every purchase. Explore our flagship collection today and join our growing community of satisfied customers.
              </p>
            </div>
          </div>
        </motion.div>
      </motion.section>
    </div>
  );
}
