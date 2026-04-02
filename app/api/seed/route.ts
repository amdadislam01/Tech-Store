import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

const dummyProducts = [
  {
    name: "iPhone 15 Pro",
    description: "The latest iPhone with Titanium design and A17 Pro chip.",
    price: 999,
    image: "https://images.unsplash.com/photo-1696446701796-da61225697cc?q=80&w=1000",
    category: "Smartphones",
    stock: 50
  },
  {
    name: "MacBook Air M3",
    description: "Supercharged by M3, incredibly thin and fast.",
    price: 1099,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1000",
    category: "Laptops",
    stock: 20
  },
  {
    name: "Sony WH-1000XM5",
    description: "Industry-leading noise canceling headphones.",
    price: 399,
    image: "https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?q=80&w=1000",
    category: "Audio",
    stock: 30
  },
  {
    name: "iPad Pro M2",
    description: "The ultimate iPad experience with astonishing performance.",
    price: 799,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?q=80&w=1000",
    category: "Tablets",
    stock: 15
  },
  {
    name: "Samsung Galaxy S24 Ultra",
    description: "AI-powered smartphone with 200MP camera.",
    price: 1299,
    image: "https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?q=80&w=1000",
    category: "Smartphones",
    stock: 40
  },
  {
    name: "Dell XPS 15",
    description: "Powerful performance for creators.",
    price: 1499,
    image: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?q=80&w=1000",
    category: "Laptops",
    stock: 10
  }
];

export async function GET() {
  try {
    await connectDB();
    const count = await Product.countDocuments();
    if (count === 0) {
      await Product.insertMany(dummyProducts);
    }
    return NextResponse.json({ message: "Seeded successfully" });
  } catch (error) {
    return NextResponse.json({ message: "Error seeding" }, { status: 500 });
  }
}
