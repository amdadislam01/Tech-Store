import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

export async function POST(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { rating, comment } = await req.json();

    if (!rating || !comment) {
      return NextResponse.json({ error: "Missing rating or comment" }, { status: 400 });
    }

    await connectDB();
    const product = await Product.findById(id);

    if (!product) {
      return NextResponse.json({ error: "Product not found" }, { status: 404 });
    }

    if (!product.reviews) product.reviews = [];

    const alreadyReviewed = product.reviews.find(
      (r: any) => r.email === session.user.email
    );

    if (alreadyReviewed) {
      return NextResponse.json({ error: "One review per email allowed per product" }, { status: 400 });
    }

    const review = {
      name: session.user.name || "Anonymous",
      email: session.user.email,
      rating: Number(rating),
      comment: comment,
      userId: session.user.id,
      createdAt: new Date(),
    };

    // Use findByIdAndUpdate with $push for better persistence in Next.js/Mongoose (avoids dirty-tracking issues)
    const updatedProduct = await Product.findByIdAndUpdate(
      id,
      {
        $push: { reviews: review },
        $inc: { numReviews: 1 },
      },
      { new: true, runValidators: true }
    );

    if (!updatedProduct) {
       return NextResponse.json({ error: "Failed to update product" }, { status: 500 });
    }

    // Recalculate average rating safely
    const reviews = updatedProduct.reviews || [];
    const totalRating = reviews.reduce((acc: number, item: any) => item.rating + acc, 0);
    updatedProduct.avgRating = reviews.length > 0 ? totalRating / reviews.length : 0;
    updatedProduct.numReviews = reviews.length;
    
    await updatedProduct.save();

    return NextResponse.json({ message: "Review added successfully", product: updatedProduct.toObject() });
  } catch (error: any) {
    console.error("Review Error:", error);
    return NextResponse.json({ error: error.message || "Internal Server Error" }, { status: 500 });
  }
}
