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
      heroBadge: 1,
      heroHeadlinePrimary: 1,
      heroHeadlineSecondary: 1,
      heroDescription: 1,
      heroImage: 1,
    });

    if (!settings) {
      settings = await Settings.create({});
    }

    return NextResponse.json(settings);
  } catch (error) {
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
