import mongoose, { Schema, model, models } from "mongoose";

const ProductSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    regularPrice: { type: Number },
    images: { type: [String], default: [] },
    image: { type: String }, // Legacy field retained for compatibility with existing product documents
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

// Address potential Hot Module Replacement (HMR) issues by clearing the model if schema components are missing
if (models.Product && !models.Product.schema.path("reviews")) {
  delete models.Product;
}

const Product = models.Product || model("Product", ProductSchema);

export default Product;
