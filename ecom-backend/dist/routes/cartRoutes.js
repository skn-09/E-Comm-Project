"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cartController_js_1 = require("../controllers/cartController.js");
const authMiddleware_js_1 = require("../middleware/authMiddleware.js");
const router = express_1.default.Router();
router.post("/add", authMiddleware_js_1.authMiddleware, cartController_js_1.addToCart);
router.get("/", authMiddleware_js_1.authMiddleware, cartController_js_1.getCart);
router.delete("/remove/:productId", authMiddleware_js_1.authMiddleware, cartController_js_1.removeFromCart);
router.delete("/clear", authMiddleware_js_1.authMiddleware, cartController_js_1.clearCart);
exports.default = router;
