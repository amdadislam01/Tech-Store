export const dynamic = 'force-dynamic';
import { NextResponse } from "next/server";
import connectDB from "@/lib/db";
import Settings from "@/models/Settings";

export async function GET() {
  try {
    await connectDB();
    let settings = await Settings.findOne({}, { 
      siteName: 1, 
      siteLogo: 1, 
      activePaymentMethods: 1,
      siteDescription: 1,
      contactEmail: 1,
      footerText: 1,
      bkashNumber: 1,
      nagadNumber: 1,
      rocketNumber: 1,
      paymentInstructions: 1,
    });

    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
