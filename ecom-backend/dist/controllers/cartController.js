"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeFromCart = exports.getCart = exports.addToCart = void 0;
const cartService_1 = require("../services/cartService");
const orderService_1 = require("../services/orderService");
const addToCart = async (req, res) => {
    try {
        const { productId, quantity } = req.body;
        const { userId } = req;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const cart = await (0, cartService_1.addItemToCart)(userId, productId, quantity);
        res.status(200).json(cart);
    }
    catch (err) {
        if (err instanceof cartService_1.CartServiceError) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error("addToCart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.addToCart = addToCart;
const getCart = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const cart = await (0, cartService_1.fetchCart)(userId);
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
        const { userId } = req;
        const { productId } = req.params;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        const cart = await (0, cartService_1.removeItemFromCart)(userId, productId);
        res.status(200).json(cart);
    }
    catch (err) {
        if (err instanceof cartService_1.CartServiceError) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error("removeFromCart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.removeFromCart = removeFromCart;
const clearCart = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId) {
            return res.status(401).json({ message: "Unauthorized" });
        }
        // Create an order from the cart (this will also decrement product stocks and clear the cart)
        try {
            await (0, orderService_1.createOrderFromCart)(userId);
        }
        catch (orderErr) {
            // Log order creation error but continue to return cleared cart if possible
            console.error("Order creation failed:", orderErr);
        }
        // Return the (now empty) cart
        const cart = await (0, cartService_1.fetchCart)(userId);
        res.status(200).json(cart);
    }
    catch (err) {
        if (err instanceof cartService_1.CartServiceError) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error("clearCart error:", err);
        res.status(500).json({ message: "Server error" });
    }
};
exports.clearCart = clearCart;
