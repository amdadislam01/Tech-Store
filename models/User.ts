import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "manager", "super-admin"], default: "user" },
    image: { type: String },
    addresses: [
      {
        name: { type: String },
        phone: { type: String },
        city: { type: String },
        area: { type: String },
        address: { type: String },
        landmark: { type: String },
        addressType: { type: String, enum: ["Home", "Office"], default: "Home" },
        isDefault: { type: Boolean, default: false },
      }
    ],
    isVerified: { type: Boolean, default: true },
    resetPasswordOTP: { type: String },
    resetPasswordExpires: { type: Date },
  },
  { timestamps: true }
);

// Force re-registration if fields are missing (Common Next.js HMR issue)
if (models.User && (!models.User.schema.path("image") || !models.User.schema.path("resetPasswordOTP"))) {
  delete models.User;
}

const User = models.User || model("User", UserSchema);

export default User;
