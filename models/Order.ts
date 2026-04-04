import mongoose, { Schema, model, models } from "mongoose";

const OrderSchema = new Schema(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: false },
    items: [
      {
        product: { type: Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    totalPrice: { type: Number, required: true },
    shippingInfo: {
      name: { type: String, required: true },
      phone: { type: String, required: true },
      city: { type: String, required: true },
      area: { type: String, required: true },
      address: { type: String, required: true },
      landmark: { type: String },
      addressType: { type: String, enum: ["Home", "Office"], default: "Home" },
    },
    status: { 
      type: String, 
      enum: ["Pending", "Awaiting Payment", "Processing", "Shipped", "Delivered", "Cancelled", "On Hold"], 
      default: "Pending" 
    },
    paymentMethod: { type: String, required: true },
    paymentStatus: { 
      type: String, 
      enum: ["Pending", "Paid", "Failed"], 
      default: "Pending" 
    },
    transactionId: { type: String },
  },
  { timestamps: true }
);

if (mongoose.models && mongoose.models.Order) {
  delete (mongoose as any).models.Order;
}

const Order = mongoose.models.Order || mongoose.model("Order", OrderSchema);

export default Order;
