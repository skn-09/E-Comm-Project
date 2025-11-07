import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
} from "../controllers/productController";

const router = express.Router();

router.post("/", createProduct);
router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;
