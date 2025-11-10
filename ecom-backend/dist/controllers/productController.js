"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const productService_1 = require("../services/productService");
const createProduct = async (req, res) => {
    try {
        const { name, price, rating, discount, imageUrl, description, material, moreInfo, category, quantity, } = req.body;
        if (!name || typeof name !== "string" || !name.trim()) {
            return res.status(400).json({ message: "Name is required" });
        }
        if (price === undefined || typeof price !== "number" || price <= 0) {
            return res
                .status(400)
                .json({ message: "Price must be a positive number" });
        }
        if (rating !== undefined &&
            (typeof rating !== "number" || rating < 0 || rating > 5)) {
            return res
                .status(400)
                .json({ message: "Rating must be a number between 0 and 5" });
        }
        if (discount !== undefined &&
            (typeof discount !== "number" || discount < 0)) {
            return res
                .status(400)
                .json({ message: "Discount must be a non-negative number" });
        }
        if (!category || typeof category !== "string" || !category.trim()) {
            return res.status(400).json({ message: "Category is required" });
        }
        if (quantity == undefined || typeof quantity !== "number" || quantity < 0) {
            return res
                .status(400)
                .json({ message: "Quantity must be a non-negative number" });
        }
        const prod = await (0, productService_1.createProductRecord)({
            name,
            price,
            rating,
            discount,
            imageUrl,
            description,
            material,
            moreInfo,
            category,
            quantity,
        });
        return res.status(201).json({ message: "Product created", product: prod });
    }
    catch (err) {
        if (err instanceof productService_1.ProductServiceError) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error("createProduct error", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.createProduct = createProduct;
//Get /api/products  (Get All Products)
const getProducts = async (req, res) => {
    try {
        const { category } = req.query;
        const products = await (0, productService_1.listProducts)(typeof category === "string" ? category : undefined);
        return res.status(200).json({ products });
    }
    catch (err) {
        console.error("getProducts error", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getProducts = getProducts;
//Get /api/products/:id    (Get products by id)
const getProductById = async (req, res) => {
    try {
        const id = req.params.id;
        const product = await (0, productService_1.findProductById)(id);
        return res.status(200).json({ product });
    }
    catch (err) {
        if (err instanceof productService_1.ProductServiceError) {
            return res.status(err.statusCode).json({ message: err.message });
        }
        console.error("getProductById error", err);
        return res.status(500).json({ message: "Server error" });
    }
};
exports.getProductById = getProductById;
