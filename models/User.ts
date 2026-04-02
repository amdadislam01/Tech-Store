import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin", "manager", "super-admin"], default: "user" },
    image: { type: String },
  },
  { timestamps: true }
);

// Force re-registration if fields are missing (Common Next.js HMR issue)
if (models.User && !models.User.schema.path("image")) {
  delete models.User;
}

const User = models.User || model("User", UserSchema);

export default User;
