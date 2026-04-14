import HomePageClient from "./HomePageClient";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Settings from "@/models/Settings";

export const revalidate = 60; // Enable Incremental Static Regeneration (ISR) with a 60-second revalidation period

export default async function Home() {
  await connectDB();
  const rawProducts = await Product.find({}).sort({ createdAt: -1 }).lean();
  
  // Fetch site settings for dynamic hero and configuration
  let settings = await Settings.findOne().lean();
  if (!settings) {
    settings = await Settings.create({});
  }

  // Serialize settings to plain object
  const serializedSettings = JSON.parse(JSON.stringify(settings));
  
  // Robustly serialize all product data (including Category ObjectIds and Dates) to plain objects
  const serializedProducts = JSON.parse(JSON.stringify(rawProducts));
  
  // Normalize product fields and ensure image arrays are valid
  const initialProducts = serializedProducts.map((p: any) => {
    // Ensure images array exists
    if (!p.images || p.images.length === 0) {
      p.images = p.image ? [p.image] : [];
    }
    return p;
  });

  return (
    <HomePageClient initialProducts={initialProducts} settings={serializedSettings} />
  );
}
