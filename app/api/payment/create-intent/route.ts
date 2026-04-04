import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Settings from "@/models/Settings";

export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();

    if (!orderId) {
      return NextResponse.json({ error: "Order ID is required" }, { status: 400 });
    }

    await connectDB();
    
    // Fetch order details
    const order = await Order.findById(orderId);
    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    // Fetch Stripe settings and fallback to .env
    const settings = await Settings.findOne();
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || settings?.stripeSecretKey;

    if (!stripeSecretKey) {
        return NextResponse.json({ error: "Stripe Secret Key is not configured" }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia" as any,
    });

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(order.totalPrice * 100), // Stripe expects amounts in cents
      currency: "usd", // You can make this dynamic if needed
      metadata: {
        orderId: order._id.toString(),
      },
      automatic_payment_methods: {
        enabled: true,
      },
    });

    return NextResponse.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error: any) {
    console.error("Stripe Intent Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
