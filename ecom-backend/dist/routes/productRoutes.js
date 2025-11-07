"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const productController_js_1 = require("../controllers/productController.js");
const router = express_1.default.Router();
router.post("/", productController_js_1.createProduct);
router.get("/", productController_js_1.getProducts);
router.get("/:id", productController_js_1.getProductById);
exports.default = router;
