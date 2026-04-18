import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import { sendResetPasswordEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    const { email: rawEmail } = await req.json();
    const email = rawEmail?.toLowerCase().trim();

    if (!email) {
      return NextResponse.json({ message: "Email is required" }, { status: 400 });
    }

    await connectDB();

    const user = await User.findOne({ email });

    if (!user) {
      // For security reasons, don't confirm if user doesn't exist.
      // But for a better UX in a closed system, we may say "If an account exists..."
      return NextResponse.json({ message: "If an account exists with this email, a reset code has been sent." }, { status: 200 });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    user.resetPasswordOTP = otp;
    user.resetPasswordExpires = expiresAt;
    await user.save();

    // Send reset email
    try {
      await sendResetPasswordEmail(email, otp);
      console.log(`Password Reset OTP for ${email}: ${otp}`); // Debug log
    } catch (emailError) {
      console.error("Email error:", emailError);
      return NextResponse.json({ message: "Failed to send reset email" }, { status: 500 });
    }

    return NextResponse.json({ message: "A reset code has been sent to your email!" }, { status: 200 });
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json({ message: "Error processing request" }, { status: 500 });
  }
}
