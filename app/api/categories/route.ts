import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function GET() {
  try {
    await connectDB();
    
    // Fetch unique categories from the Product collection
    const categories = await Product.distinct("category");
    
    // Ensure "All" is always at the start
    const result = ["All", ...categories.filter(cat => cat !== "All")];
    
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
