"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCartItems = exports.removeItemFromCart = exports.fetchCart = exports.addItemToCart = exports.CartServiceError = void 0;
const Cart_1 = require("../models/Cart");
const Product_1 = require("../models/Product");
class CartServiceError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.CartServiceError = CartServiceError;
const addItemToCart = async (userId, productId, quantity) => {
    if (!productId || !quantity) {
        throw new CartServiceError("productId and quantity are required", 400);
    }
    const product = await Product_1.Product.findById(productId);
    if (!product) {
        throw new CartServiceError("Product not found", 404);
    }
    if (product.quantity < quantity) {
        throw new CartServiceError("Insufficient stock", 400);
    }
    let cart = await Cart_1.Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart_1.Cart({ user: userId, items: [] });
    }
    const existingItem = cart.items.find((item) => item.product.toString() === productId);
    if (existingItem) {
        existingItem.quantity += quantity;
    }
    else {
        cart.items.push({ product: productId, quantity });
    }
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product");
    return cart;
};
exports.addItemToCart = addItemToCart;
const fetchCart = async (userId) => {
    let cart = await Cart_1.Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
        cart = new Cart_1.Cart({ user: userId, items: [] });
        await cart.save();
        await cart.populate("items.product");
    }
    return cart;
};
exports.fetchCart = fetchCart;
const removeItemFromCart = async (userId, productId) => {
    if (!productId) {
        throw new CartServiceError("productId is required", 400);
    }
    const cart = await Cart_1.Cart.findOne({ user: userId });
    if (!cart) {
        throw new CartServiceError("Cart not found", 404);
    }
    cart.items = cart.items.filter((item) => item.product.toString() !== productId);
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product");
    return cart;
};
exports.removeItemFromCart = removeItemFromCart;
const clearCartItems = async (userId) => {
    let cart = await Cart_1.Cart.findOne({ user: userId }).populate("items.product");
    if (!cart) {
        cart = new Cart_1.Cart({ user: userId, items: [] });
        await cart.save();
        await cart.populate("items.product");
        return cart;
    }
    for (const item of cart.items) {
        const product = await Product_1.Product.findById(item.product);
        if (!product) {
            continue;
        }
        const remaining = product.quantity - item.quantity;
        product.quantity = remaining > 0 ? remaining : 0;
        await product.save();
    }
    cart.items.splice(0, cart.items.length);
    cart.updatedAt = new Date();
    await cart.save();
    await cart.populate("items.product");
    return cart;
};
exports.clearCartItems = clearCartItems;
