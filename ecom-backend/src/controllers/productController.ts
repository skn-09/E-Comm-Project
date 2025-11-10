import { Request, Response } from "express";
import {
  ProductServiceError,
  createProductRecord,
  findProductById,
  listProducts,
} from "../services/productService";
export const createProduct = async (req: Request, res: Response) => {
  try {
    const {
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
    } = req.body;

    if (!name || typeof name !== "string" || !name.trim()) {
      return res.status(400).json({ message: "Name is required" });
    }
    if (price === undefined || typeof price !== "number" || price <= 0) {
      return res
        .status(400)
        .json({ message: "Price must be a positive number" });
    }
    if (
      rating !== undefined &&
      (typeof rating !== "number" || rating < 0 || rating > 5)
    ) {
      return res
        .status(400)
        .json({ message: "Rating must be a number between 0 and 5" });
    }
    if (
      discount !== undefined &&
      (typeof discount !== "number" || discount < 0)
    ) {
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

    const prod = await createProductRecord({
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
  } catch (err) {
    if (err instanceof ProductServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error("createProduct error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//Get /api/products  (Get All Products)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const products = await listProducts(
      typeof category === "string" ? category : undefined
    );
    return res.status(200).json({ products });
  } catch (err) {
    console.error("getProducts error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//Get /api/products/:id    (Get products by id)
export const getProductById = async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const product = await findProductById(id);
    return res.status(200).json({ product });
  } catch (err) {
    if (err instanceof ProductServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error("getProductById error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
