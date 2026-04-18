import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email: rawEmail } = await req.json();
    const email = rawEmail?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ message: "Missing email" }, { status: 400 });
    }

    await connectDB();

    // 1. Check if user is already in the permanent collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "Email is already verified and registered" }, { status: 400 });
    }

    // 2. Find the pending registration
    const pendingUser = await PendingUser.findOne({ email });

    if (!pendingUser) {
      return NextResponse.json({ message: "No pending registration found. Please register first." }, { status: 404 });
    }

    // 3. Generate new 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    pendingUser.otp = otp;
    pendingUser.expiresAt = expiresAt;
    await pendingUser.save();

    // 4. Send new verification email
    try {
      await sendVerificationEmail(email, otp);
      console.log(`Resent OTP for ${email}: ${otp}`); // Debug log
    } catch (emailError) {
      console.error("Email error:", emailError);
      return NextResponse.json({ message: "Failed to send email" }, { status: 500 });
    }

    return NextResponse.json({ message: "A new OTP has been sent to your email!" }, { status: 200 });
  } catch (error) {
    console.error("Resend OTP error:", error);
    return NextResponse.json({ message: "Error resending OTP" }, { status: 500 });
  }
}
