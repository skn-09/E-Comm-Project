"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Product = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const ProductSchema = new mongoose_1.default.Schema({
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
exports.Product = mongoose_1.default.model("Product", ProductSchema);
