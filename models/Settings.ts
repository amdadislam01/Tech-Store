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
  },
  { timestamps: true }
);

const Settings = mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);
export default Settings;
