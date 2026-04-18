import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Product from "@/models/Product";
import Category from "@/models/Category";

export async function GET(req: Request) {
  try {
    await connectDB();
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const search = searchParams.get("search");
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "12");
    const skip = (page - 1) * limit;
    const sort = searchParams.get("sort") || "newest";
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const query: any = {};
    if (category && category !== "All") {
      // Fetch sub-categories if any
      const subCategories = await Category.find({ parent: category }).select("_id").lean();
      const categoryIds = [category, ...subCategories.map(c => c._id)];
      query.category = { $in: categoryIds };
    }
    if (search) {
      query.name = { $regex: search, $options: "i" };
    }

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = parseFloat(minPrice);
      if (maxPrice) query.price.$lte = parseFloat(maxPrice);
    }

    let sortOption: any = { createdAt: -1 };
    if (sort === "price-asc") sortOption = { price: 1 };
    else if (sort === "price-desc") sortOption = { price: -1 };
    else if (sort === "newest") sortOption = { createdAt: -1 };

    const totalProducts = await Product.countDocuments(query);
    const products = await Product.find(query)
      .populate("category")
      .sort(sortOption)
      .skip(skip)
      .limit(limit);
    
    // Make sure all products have a consistent image format, even for older items
    const migratedProducts = products.map(p => {
        const productObj = p.toObject();
        if (!productObj.images || productObj.images.length === 0) {
            productObj.images = productObj.image ? [productObj.image] : [];
        }
        return productObj;
    });

    const totalPages = Math.ceil(totalProducts / limit);

    return NextResponse.json({
        products: migratedProducts,
        totalPages,
        currentPage: page,
        totalProducts
    });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const allowedRoles = ["super-admin", "admin", "manager"];
    if (!session || !allowedRoles.includes(session.user.role as string)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const data = await req.json();
    await connectDB();
    
    const newProduct = await Product.create(data);
    return NextResponse.json(newProduct, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
