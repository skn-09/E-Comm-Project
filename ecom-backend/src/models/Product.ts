import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  price: { type: Number, required: true },
  rating: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  imageUrl: { type: String },
  description: { type: String },
  material: { type: String },
  moreInfo: { type: String },
  category: { type: String, required: true, trim: true },
  quantity: { type: Number, required: true, default: 1 },
  createdAt: { type: Date, default: Date.now },
});

export const Product = mongoose.model("Product", ProductSchema);
