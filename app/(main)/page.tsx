import HomePageClient from "./HomePageClient";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export const revalidate = 60; // Enable Incremental Static Regeneration (ISR) with a 60-second revalidation period

export default async function Home() {
  await connectDB();
  const rawProducts = await Product.find({}).sort({ createdAt: -1 }).lean();
  
  // Normalize and serialize product data to ensure all nested fields (like reviews) are plain objects
  const initialProducts = rawProducts.map((p: any) => {
    const productObj = { 
        ...p, 
        _id: p._id.toString(), 
        createdAt: p.createdAt?.toISOString(), 
        updatedAt: p.updatedAt?.toISOString() 
    };

    // Standardize 'images' array from legacy 'image' field if necessary
    if (!productObj.images || productObj.images.length === 0) {
        productObj.images = productObj.image ? [productObj.image] : [];
    }

    // Recursively serialize review objects to prevent Next.js Client Component errors
    if (productObj.reviews && Array.isArray(productObj.reviews)) {
        productObj.reviews = productObj.reviews.map((rev: any) => ({
            ...rev,
            _id: rev._id.toString(),
            createdAt: rev.createdAt?.toISOString()
        }));
    }

    return productObj;
  });

  return (
    <HomePageClient initialProducts={initialProducts} />
  );
}
