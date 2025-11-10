"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authMiddleware = void 0;
const auth_1 = require("../utils/auth");
const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "Authorization token missing" });
    }
    try {
        const token = authHeader.split(" ")[1];
        const decoded = (0, auth_1.verifyAccessToken)(token);
        req.userId = decoded.userId;
        next();
    }
    catch (error) {
        console.error("authMiddleware error", error);
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};
exports.authMiddleware = authMiddleware;
