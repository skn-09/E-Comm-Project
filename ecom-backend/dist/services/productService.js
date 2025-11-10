"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.findProductById = exports.listProducts = exports.createProductRecord = exports.ProductServiceError = void 0;
const Product_1 = require("../models/Product");
class ProductServiceError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.ProductServiceError = ProductServiceError;
const createProductRecord = async (payload) => {
    const product = new Product_1.Product({
        name: payload.name.trim(),
        price: payload.price,
        rating: payload.rating,
        discount: payload.discount,
        imageUrl: payload.imageUrl && payload.imageUrl.trim()
            ? payload.imageUrl.trim()
            : undefined,
        description: payload.description,
        material: payload.material,
        moreInfo: payload.moreInfo,
        category: payload.category.trim().toLowerCase(),
        quantity: payload.quantity !== undefined && payload.quantity !== null
            ? payload.quantity
            : 1,
    });
    await product.save();
    return product;
};
exports.createProductRecord = createProductRecord;
const listProducts = async (category) => {
    const filter = {};
    if (category) {
        filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }
    return Product_1.Product.find(filter).sort({ createdAt: -1 });
};
exports.listProducts = listProducts;
const findProductById = async (id) => {
    const product = await Product_1.Product.findById(id);
    if (!product) {
        throw new ProductServiceError("Product not found", 404);
    }
    return product;
};
exports.findProductById = findProductById;
