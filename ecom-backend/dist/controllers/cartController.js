"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.getCart = exports.addToCart = void 0;
const Cart_js_1 = require("../models/Cart.js");
const Product_js_1 = require("../models/Product.js");
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!productId || !quantity) {
            return res
                .status(400)
                .json({ message: "productId and quantity are required" });
        }
        const product = await Product_js_1.Product.findById(productId);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }
        if (product.quantity < quantity) {
            return res.status(400).json({ message: "Insufficient stock" });
        }
        let cart = await Cart_js_1.Cart.findOne({ user: userId });
        if (!cart) {
            cart = new Cart_js_1.Cart({ user: userId, items: [] });
        }
        const existingItem = cart.items.find((i) => i.product.toString() === productId);
        if (existingItem) {
            existingItem.quantity += quantity;
        }
        else {
            cart.items.push({ product: productId, quantity });
        }
        cart.updatedAt = new Date();
        await cart.save();
        await cart.populate("items.product");
        res.status(200).json(cart);
    }
    catch (err) {
        console.error("addToCart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.addToCart = addToCart;
const getCart = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        let cart = await Cart_js_1.Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            cart = new Cart_js_1.Cart({ user: userId, items: [] });
            await cart.save();
            await cart.populate("items.product");
        }
        res.status(200).json(cart);
    }
    catch (err) {
        console.error("getCart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.getCart = getCart;
const removeFromCart = async (req, res) => {
    try {
        const userId = req.userId;
        const { productId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        if (!productId) {
            return res.status(400).json({ message: "productId is required" });
        }
        const cart = await Cart_js_1.Cart.findOne({ user: userId });
        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }
        cart.items = cart.items.filter((item) => item.product.toString() !== productId);
        cart.updatedAt = new Date();
        await cart.save();
        await cart.populate("items.product");
        res.status(200).json(cart);
    }
    catch (err) {
        console.error("removeFromCart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.removeFromCart = removeFromCart;
const clearCart = async (req, res) => {
    try {
        const userId = req.userId;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        let cart = await Cart_js_1.Cart.findOne({ user: userId }).populate("items.product");
        if (!cart) {
            cart = new Cart_js_1.Cart({ user: userId, items: [] });
            await cart.save();
            await cart.populate("items.product");
            return res.status(200).json(cart);
        }
        for (const item of cart.items) {
            try {
                const product = await Product_js_1.Product.findById(item.product);
                if (!product) {
                    continue;
                }
                const remaining = product.quantity - item.quantity;
                product.quantity = remaining > 0 ? remaining : 0;
                await product.save();
            }
            catch (err) {
                console.error("clearCart update product error", err);
            }
        }
        cart.items.splice(0, cart.items.length);
        cart.updatedAt = new Date();
        await cart.save();
        await cart.populate("items.product");
        res.status(200).json(cart);
    }
    catch (err) {
        console.error("clearCart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.clearCart = clearCart;
