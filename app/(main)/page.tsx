import HomePageClient from "./HomePageClient";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export const revalidate = 60; // optionally revalidate every 60 seconds

export default async function Home() {
  await connectDB();
  const rawProducts = await Product.find({}).sort({ createdAt: -1 }).lean();
  
  // Map products to ensure images array exists for old items (matching API logic)
  const initialProducts = rawProducts.map((p: any) => {
    const productObj = { ...p, _id: p._id.toString(), createdAt: p.createdAt?.toISOString(), updatedAt: p.updatedAt?.toISOString() };
    if (!productObj.images || productObj.images.length === 0) {
        productObj.images = productObj.image ? [productObj.image] : [];
    }
    return productObj;
  });

  return (
    <HomePageClient initialProducts={initialProducts} />
  );
}
