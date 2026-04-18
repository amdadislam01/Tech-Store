import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import PendingUser from "@/models/PendingUser";
import bcrypt from "bcryptjs";
import { sendVerificationEmail } from "@/lib/email";

export async function POST(req: Request) {
  try {
    await connectDB();
    const { name, email: rawEmail, password } = await req.json();
    const email = rawEmail.toLowerCase().trim();

    // 1. Check if user already exists in permanent collection
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ message: "User already exists" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    
    // 2. Generate 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes

    // 3. Save to PendingUser collection (Upsert if already pending)
    await PendingUser.findOneAndUpdate(
      { email },
      { name, email, password: hashedPassword, otp, expiresAt },
      { upsert: true, new: true }
    );

    // 4. Send verification email
    try {
      await sendVerificationEmail(email, otp);
      console.log(`Registration OTP for ${email}: ${otp}`); // Server log for debugging
    } catch (emailError) {
      console.error("Email error:", emailError);
    }

    return NextResponse.json({ 
      message: "Registration successful! Please check your email for the verification code.",
      email: email 
    }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ message: "Error registering user" }, { status: 500 });
  }
}


