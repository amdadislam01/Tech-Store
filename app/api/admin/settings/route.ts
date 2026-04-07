export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";
import { revalidatePath } from "next/cache";

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne();
    if (!settings) {
      settings = await Settings.create({});
    }
    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (!session || !["super-admin", "admin"].includes(session.user.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const { _id, createdAt, updatedAt, ...updateData } = await req.json();
    await connectDB();
    
    const settings = await Settings.findOneAndUpdate({}, updateData, {
      new: true,
      upsert: true,
    });

    try {
      revalidatePath("/");
    } catch (e) {
      console.error("Revalidation error:", e);
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
