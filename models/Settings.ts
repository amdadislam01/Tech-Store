import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    siteName: { type: String, default: "TechStore" },
    siteLogo: { type: String, default: "" },
    siteDescription: { type: String, default: "Modern E-commerce Platform" },
    activePaymentMethods: {
      type: [String],
      enum: ["cod", "stripe", "sslcommerz", "bkash", "nagad", "rocket"],
      default: ["cod"],
    },
    contactEmail: { type: String, default: "support@techstore.com" },
    footerText: { type: String, default: "© 2026 TechStore. All rights reserved." },
    bkashNumber: { type: String, default: "" },
    nagadNumber: { type: String, default: "" },
    rocketNumber: { type: String, default: "" },
    stripePublishableKey: { type: String, default: "" },
    stripeSecretKey: { type: String, default: "" },
    stripeWebhookSecret: { type: String, default: "" },
    paymentInstructions: { type: String, default: "Please make manual payment and provider transaction ID." },
    heroBadge: { type: String, default: "Hand-Picked Tech Just for You" },
    heroHeadlinePrimary: { type: String, default: "Stop Settling for" },
    heroHeadlineSecondary: { type: String, default: "Cheap Gear." },
    heroDescription: { type: String, default: "Get the tech that actually works for you—from high-performance laptops to the headphones you'll never want to take off. We only stock the good stuff." },
    heroImage: { type: String, default: "https://i.ibb.co.com/svSnsb6F/tech-removebg-preview.png" },
    heroSlides: [
      {
        badge: String,
        headlinePrimary: String,
        headlineSecondary: String,
        description: String,
        image: String,
      }
    ],
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.Settings) {
  delete (mongoose as any).models.Settings;
}

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
export default Settings;
