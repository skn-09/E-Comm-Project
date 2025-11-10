"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrder = exports.countOrdersForUser = exports.fetchOrdersForUser = exports.createOrderFromCart = exports.OrderServiceError = void 0;
const Order_1 = require("../models/Order");
const Cart_1 = require("../models/Cart");
const Product_1 = require("../models/Product");
class OrderServiceError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.statusCode = statusCode;
    }
}
exports.OrderServiceError = OrderServiceError;
const createOrderFromCart = async (userId) => {
    const cart = await Cart_1.Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) {
        throw new OrderServiceError("Cart is empty", 400);
    }
    const orderItems = [];
    let total = 0;
    for (const ci of cart.items) {
        const product = await Product_1.Product.findById(ci.product._id || ci.product);
        if (!product) {
            continue; // skip missing products
        }
        const price = product.price || 0;
        const qty = ci.quantity || 0;
        total += price * qty;
        orderItems.push({
            product: product._id,
            quantity: qty,
            priceAtPurchase: price,
        });
    }
    const order = new Order_1.Order({
        user: userId,
        items: orderItems,
        total,
        status: "created",
    });
    await order.save();
    // decrement product quantities and clear cart
    for (const ci of cart.items) {
        const product = await Product_1.Product.findById(ci.product._id || ci.product);
        if (!product)
            continue;
        const remaining = product.quantity - ci.quantity;
        product.quantity = remaining > 0 ? remaining : 0;
        await product.save();
    }
    cart.items.splice(0, cart.items.length);
    cart.updatedAt = new Date();
    await cart.save();
    await order.populate("items.product");
    return order;
};
exports.createOrderFromCart = createOrderFromCart;
const fetchOrdersForUser = async (userId) => {
    const orders = await Order_1.Order.find({ user: userId })
        .sort({ createdAt: -1 })
        .populate("items.product");
    return orders;
};
exports.fetchOrdersForUser = fetchOrdersForUser;
const countOrdersForUser = async (userId) => {
    // count only non-canceled orders
    return await Order_1.Order.countDocuments({
        user: userId,
        status: { $ne: "canceled" },
    });
};
exports.countOrdersForUser = countOrdersForUser;
const cancelOrder = async (userId, orderId) => {
    const order = await Order_1.Order.findById(orderId);
    if (!order) {
        throw new OrderServiceError("Order not found", 404);
    }
    if (order.user.toString() !== userId) {
        throw new OrderServiceError("Unauthorized", 401);
    }
    if (order.status === "canceled") {
        throw new OrderServiceError("Order already canceled", 400);
    }
    // restore product quantities
    for (const it of order.items) {
        const product = await Product_1.Product.findById(it.product);
        if (!product)
            continue;
        product.quantity = (product.quantity || 0) + (it.quantity || 0);
        await product.save();
    }
    order.status = "canceled";
    order.canceledAt = new Date();
    await order.save();
    await order.populate("items.product");
    return order;
};
exports.cancelOrder = cancelOrder;
