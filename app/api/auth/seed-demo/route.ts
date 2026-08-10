import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";

export const DEMO_USERS = [
  {
    name: "Demo Customer",
    email: "user@demo.com",
    password: "password123",
    role: "user",
    image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&q=80",
  },
  {
    name: "Demo Manager",
    email: "manager@demo.com",
    password: "password123",
    role: "manager",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&q=80",
  },
  {
    name: "Demo Admin",
    email: "admin@demo.com",
    password: "password123",
    role: "admin",
    image: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&q=80",
  },
  {
    name: "Demo Super Admin",
    email: "superadmin@demo.com",
    password: "password123",
    role: "super-admin",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&q=80",
  },
];

export async function POST() {
  try {
    await connectDB();

    for (const demoUser of DEMO_USERS) {
      const existingUser = await User.findOne({ email: demoUser.email });
      const hashedPassword = await bcrypt.hash(demoUser.password, 10);

      if (!existingUser) {
        await User.create({
          name: demoUser.name,
          email: demoUser.email,
          password: hashedPassword,
          role: demoUser.role,
          image: demoUser.image,
          isVerified: true,
        });
      } else {
        // Ensure password, role, and verification status are up to date
        existingUser.password = hashedPassword;
        existingUser.role = demoUser.role;
        existingUser.isVerified = true;
        await existingUser.save();
      }
    }

    return NextResponse.json({ success: true, message: "Demo accounts seeded successfully" });
  } catch (error: any) {
    console.error("Error seeding demo accounts:", error);
    return NextResponse.json(
      { success: false, message: error.message || "Failed to seed demo accounts" },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
