import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import connectDB from "@/lib/db";
import User from "@/models/User";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    await connectDB();
    const user = await User.findById(session.user.id).select("addresses");
    return NextResponse.json(user?.addresses || []);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { address, id } = await req.json();
    await connectDB();

    const user = await User.findById(session.user.id);
    if (!user) return NextResponse.json({ error: "User not found" }, { status: 404 });

    if (id) {
      // Update existing address
      const addressIndex = user.addresses.findIndex((a: any) => a._id.toString() === id);
      if (addressIndex === -1) return NextResponse.json({ error: "Address not found" }, { status: 404 });
      
      // If setting as default, unset others
      if (address.isDefault) {
        user.addresses.forEach((a: any) => a.isDefault = false);
      }
      
      user.addresses[addressIndex] = { ...user.addresses[addressIndex], ...address };
    } else {
      // Add new address
      if (address.isDefault) {
        user.addresses.forEach((a: any) => a.isDefault = false);
      }
      user.addresses.push(address);
    }

    await user.save();
    return NextResponse.json({ message: "Addresses updated", addresses: user.addresses });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) return NextResponse.json({ error: "ID required" }, { status: 400 });

    await connectDB();
    await User.findByIdAndUpdate(session.user.id, {
      $pull: { addresses: { _id: id } }
    });

    return NextResponse.json({ message: "Address deleted" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
