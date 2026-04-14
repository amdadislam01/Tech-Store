import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import Order from "@/models/Order";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const order = await Order.findById(id).populate("user", "name email");

    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    return NextResponse.json({ message: "Error fetching order" }, { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id } = await params;
    const body = await req.json();
    const { transactionId, status, paymentStatus } = body;

    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const order = await Order.findById(id);
    if (!order) {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }

    // Security check: only admin can change status/paymentStatus
    // User can only update transactionId for their own order
    const isAdmin = ["super-admin", "admin", "manager"].includes(session.user.role as string);
    const isOwner = order.user?.toString() === session.user.id || !order.user; // Allow guest for now if session exists? Usually users are logged in if they have a session.

    if (!isAdmin && !isOwner) {
      return NextResponse.json({ message: "Forbidden" }, { status: 403 });
    }

    const updateData: any = {};
    if (transactionId !== undefined) updateData.transactionId = transactionId;
    
    if (isAdmin) {
        if (status) updateData.status = status;
        if (paymentStatus) updateData.paymentStatus = paymentStatus;
    }

    const updatedOrder = await Order.findByIdAndUpdate(id, updateData, { new: true });

    return NextResponse.json(updatedOrder);
  } catch (error) {
    return NextResponse.json({ message: "Error updating order" }, { status: 500 });
  }
}
