import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    images: { type: [String], default: [] },
    image: { type: String }, // Keeping for backward compatibility
    category: { type: String, required: true },
    brand: { type: String },
    modelName: { type: String },
    warranty: { type: String },
    specifications: { type: String },
    stock: { type: Number, default: 10 },
    reviews: [
      {
        userId: { type: String, required: true },
        name: { type: String, required: true },
        email: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String, required: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],
    avgRating: { type: Number, default: 0 },
    numReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Force re-registration if fields are missing (Common Next.js HMR issue)
if (models.Product && !models.Product.schema.path("reviews")) {
  delete models.Product;
}

const Product = models.Product || model("Product", ProductSchema);

export default Product;
