import mongoose, { Schema, model, models } from "mongoose";

const PendingUserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    otp: { type: String, required: true },
    expiresAt: { type: Date, required: true, index: { expires: 0 } }, // TTL index
  },
  { timestamps: true }
);

const PendingUser = models.PendingUser || model("PendingUser", PendingUserSchema);

export default PendingUser;
