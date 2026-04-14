import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;
    if (!session || (role !== "super-admin" && role !== "admin")) {
      return NextResponse.json({ error: "Unauthorized. Admin access required." }, { status: 401 });
    }

    await connectDB();

    const idPattern = /^[0-9a-fA-F]{24}$/;

    // 1. Cleanup: Remove "garbage" categories created by technical IDs
    const deletedCount = await Category.deleteMany({ name: idPattern });

    // 2. Refresh product data
    const products = await Product.find({});
    
    // Find products with legacy string categories (excluding those that are already valid IDs)
    const productsToFix = products.filter(p => 
        typeof p.category === 'string' && !idPattern.test(p.category)
    );
    
    // Also find products that have an ID-string and ensure they are cast to proper ObjectIds
    const productsWithStrIds = products.filter(p => 
        typeof p.category === 'string' && idPattern.test(p.category)
    );

    // Ensure valid IDs are properly linked as ObjectIds
    let idFixCount = 0;
    for (const prod of productsWithStrIds) {
        await Product.updateOne({ _id: prod._id }, { $set: { category: prod.category } });
        idFixCount++;
    }

    const uniqueCategoryNames = Array.from(new Set(productsToFix.map(p => p.category as unknown as string)));

    const createdCategories = [];

    // Ensure all legitimate names have a Category document
    for (const name of uniqueCategoryNames) {
      if (!name || idPattern.test(name)) continue;
      
      // Simple exact match first to avoid regex special character issues
      let category = await Category.findOne({ name });
      
      if (!category) {
        const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
        category = await Category.create({
          name,
          slug,
          icon: "LayoutGrid"
        });
      }
      createdCategories.push(category);
    }

    // Link products to standard IDs
    let reassignedCount = 0;
    for (const product of productsToFix) {
      const matchingCategory = createdCategories.find(c => c.name === product.category as unknown as string);
      if (matchingCategory) {
        await Product.updateOne({ _id: product._id }, { $set: { category: matchingCategory._id } });
        reassignedCount++;
      }
    }

    return NextResponse.json({ 
      status: "Success",
      message: "Data integrity restored", 
      garbagePurged: deletedCount.deletedCount || 0,
      idsCorrected: idFixCount,
      labelsMigrated: uniqueCategoryNames,
      productsReassigned: reassignedCount 
    });

  } catch (error: any) {
    console.error("Seed error:", error);
    return NextResponse.json({ 
        error: error.message || "An internal error occurred",
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    }, { status: 500 });
  }
}
