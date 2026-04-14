import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  try {
    await connectDB();
    
    // Aggregation to get categories with product counts
    const categoriesWithCounts = await Category.aggregate([
      {
        $lookup: {
          from: "products",
          localField: "_id",
          foreignField: "category",
          as: "products"
        }
      },
      {
        $project: {
          name: 1,
          slug: 1,
          icon: 1,
          parent: 1,
          productCount: { $size: "$products" }
        }
      },
      {
        $sort: { name: 1 }
      }
    ]);
    
    return NextResponse.json(categoriesWithCounts);
  } catch (error) {
    console.error("Error fetching categories:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as any)?.role;

    if (!session || (role !== "admin" && role !== "super-admin")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { name, icon, parent } = await req.json();

    if (!name) {
      return NextResponse.json({ error: "Category name is required" }, { status: 400 });
    }

    await connectDB();

    const slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
    
    const existing = await Category.findOne({ slug });
    if (existing) {
      return NextResponse.json({ error: "Category with this name already exists" }, { status: 400 });
    }

    const newCategory = await Category.create({
      name,
      slug,
      icon: icon || "LayoutGrid",
      parent: parent || null
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error("Error creating category:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function PUT(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      const role = (session?.user as any)?.role;
  
      if (!session || (role !== "admin" && role !== "super-admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const data = await req.json();
      const { id, name, icon, parent } = data;
  
      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }
  
      await connectDB();
  
      const updateData: any = {};
      if (name) {
        updateData.name = name;
        updateData.slug = name.toLowerCase().replace(/ /g, "-").replace(/[^\w-]+/g, "");
      }
      if (icon) updateData.icon = icon;
      if (parent !== undefined) updateData.parent = parent || null;
  
      const updatedCategory = await Category.findByIdAndUpdate(id, updateData, { new: true });
  
      if (!updatedCategory) {
        return NextResponse.json({ error: "Category not found" }, { status: 404 });
      }
  
      return NextResponse.json(updatedCategory);
    } catch (error: any) {
      console.error("Error updating category:", error);
      return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
    }
  }

export async function DELETE(req: Request) {
    try {
      const session = await getServerSession(authOptions);
      const role = (session?.user as any)?.role;
  
      if (!session || (role !== "admin" && role !== "super-admin")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
  
      const { searchParams } = new URL(req.url);
      const id = searchParams.get("id");
  
      if (!id) {
        return NextResponse.json({ error: "ID is required" }, { status: 400 });
      }
  
      await connectDB();
  
      // Check if it's used by products
      const productsCount = await Product.countDocuments({ category: id });
      if (productsCount > 0) {
        return NextResponse.json({ error: "Cannot delete category with associated products" }, { status: 400 });
      }
  
      // Check if it's a parent of other categories
      const childrenCount = await Category.countDocuments({ parent: id });
      if (childrenCount > 0) {
        return NextResponse.json({ error: "Cannot delete category with associated sub-categories" }, { status: 400 });
      }
  
      await Category.findByIdAndDelete(id);
      return NextResponse.json({ message: "Category deleted successfully" });
    } catch (error: any) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
  }
