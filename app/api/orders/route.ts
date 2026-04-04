import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const { items, totalPrice, shippingInfo, paymentMethod, paymentStatus } = body;
    const { name, phone, city, area, address, landmark, addressType } = shippingInfo;

    const order = await Order.create({
      items,
      totalPrice,
      shippingInfo: {
        name,
        phone,
        city,
        area,
        address,
        landmark,
        addressType,
      },
      paymentMethod: paymentMethod || "cod",
      paymentStatus: paymentStatus || "Pending",
      status: (paymentMethod === "cod" || !paymentMethod) ? "Pending" : "Awaiting Payment",
      user: session?.user?.id || null, // Optional for guest
    });

    return NextResponse.json(order, { status: 201 });
  } catch (error) {
    return NextResponse.json({ message: "Error creating order" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    await connectDB();
    const session = await getServerSession(authOptions);
    
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const isAdmin = ["super-admin", "admin", "manager"].includes(session.user.role as string);

    if (isAdmin) {
      const orders = await Order.find().sort({ createdAt: -1 });
      return NextResponse.json(orders);
    }

    // Regular users only see their own orders
    const orders = await Order.find({ user: session.user.id }).sort({ createdAt: -1 });
    return NextResponse.json(orders);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
  }
}
