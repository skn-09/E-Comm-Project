"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.cancelOrderController = exports.getOrdersCount = exports.getOrders = void 0;
const orderService_1 = require("../services/orderService");
const getOrders = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const orders = await (0, orderService_1.fetchOrdersForUser)(userId);
        return res.status(200).json(orders);
    }
    catch (err) {
        console.error("getOrders error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getOrders = getOrders;
const getOrdersCount = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const count = await (0, orderService_1.countOrdersForUser)(userId);
        return res.status(200).json({ count });
    }
    catch (err) {
        console.error("getOrdersCount error:", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getOrdersCount = getOrdersCount;
const cancelOrderController = async (req, res) => {
    try {
        const { userId } = req;
        if (!userId)
            return res.status(401).json({ message: "Unauthorized" });
        const { id } = req.params;
        const updated = await (0, orderService_1.cancelOrder)(userId, id);
        return res.status(200).json(updated);
    }
    catch (err) {
        console.error("cancelOrder error:", err);
        if (err instanceof Error && err.statusCode) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        return res.status(500).json({ message: "Server error" });
    }
};
exports.cancelOrderController = cancelOrderController;
