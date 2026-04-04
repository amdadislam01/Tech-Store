import { NextResponse } from "next/server";
import Stripe from "stripe";
import connectDB from "@/lib/db";
import Order from "@/models/Order";
import Settings from "@/models/Settings";
import { headers } from "next/headers";

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const headersList = await headers();
    const sig = headersList.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "No signature" }, { status: 400 });
    }

    await connectDB();
    const settings = await Settings.findOne();
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET || settings?.stripeWebhookSecret;
    const stripeSecretKey = process.env.STRIPE_SECRET_KEY || settings?.stripeSecretKey;

    if (!stripeSecretKey) {
        return NextResponse.json({ error: "Stripe not configured" }, { status: 500 });
    }

    const stripe = new Stripe(stripeSecretKey, {
      apiVersion: "2024-12-18.acacia" as any,
    });

    let event: Stripe.Event;

    try {
        if (endpointSecret) {
            event = stripe.webhooks.constructEvent(body, sig, endpointSecret);
        } else {
            // If No webhook secret, only used for local testing if absolutely necessary, 
            // but strongly recommended to use it.
            event = JSON.parse(body);
        }
    } catch (err: any) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        const orderId = paymentIntent.metadata.orderId;

        if (orderId) {
          await Order.findByIdAndUpdate(orderId, {
            status: "Processing",
            paymentStatus: "Paid",
            transactionId: paymentIntent.id,
          });
          console.log(`Payment successful for order ${orderId}`);
        }
        break;

      case "payment_intent.payment_failed":
        const failedIntent = event.data.object as Stripe.PaymentIntent;
        const failedOrderId = failedIntent.metadata.orderId;

        if (failedOrderId) {
          await Order.findByIdAndUpdate(failedOrderId, {
            paymentStatus: "Failed",
          });
          console.log(`Payment failed for order ${failedOrderId}`);
        }
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (error: any) {
    console.error("Webhook Internal Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
