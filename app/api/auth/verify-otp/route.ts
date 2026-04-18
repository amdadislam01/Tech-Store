import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";

export async function POST(req: Request) {
  try {
    const { email: rawEmail, otp } = await req.json();
    const email = rawEmail?.toLowerCase().trim();

    if (!email || !otp) {
      return NextResponse.json({ message: "Missing email or OTP" }, { status: 400 });
    }

    await connectDB();

    // 1. Find the pending registration
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return NextResponse.json({ message: "No pending registration found for this email" }, { status: 404 });
    }

    // 2. Check if OTP matches
    if (pendingUser.otp !== otp) {
      return NextResponse.json({ message: "Invalid verification code" }, { status: 400 });
    }

    // 3. Check if OTP is expired
    if (pendingUser.expiresAt < new Date()) {
      return NextResponse.json({ message: "Verification code has expired" }, { status: 400 });
    }

    // 4. Create real User in the permanent collection
    await User.create({
      name: pendingUser.name,
      email: pendingUser.email,
      password: pendingUser.password,
      isVerified: true
    });

    // 5. Delete from PendingUser collection
    await PendingUser.deleteOne({ email });

    return NextResponse.json({ message: "Email verified successfully! You can now login." }, { status: 200 });
  } catch (error) {
    console.error("OTP verification error:", error);
    return NextResponse.json({ message: "Error verifying OTP" }, { status: 500 });
  }
}
