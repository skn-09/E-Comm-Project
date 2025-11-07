import { Request, Response } from "express";
import { Product } from "../models/Product.js";
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

    const prod = new Product({
      name: name.trim(),
      price,
      rating: rating,
      discount: discount,
      imageUrl: imageUrl && imageUrl.trim() ? imageUrl.trim() : undefined,
      description: description,
      material: material,
      moreInfo: moreInfo,
      category: category.trim().toLowerCase(),
      quantity: quantity !== undefined ? quantity : 1,
    });

    await prod.save();
    return res.status(201).json({ message: "Product created", product: prod });
  } catch (err) {
    console.error("createProduct error", err);
    return res.status(500).json({ message: "Server error" });
  }
};

//Get /api/products  (Get All Products)
export const getProducts = async (req: Request, res: Response) => {
  try {
    const { category } = req.query;
    const filter: any = {};

    if (category) {
      filter.category = { $regex: new RegExp(`^${category}$`, "i") };
    }

    const products = await Product.find(filter).sort({ createdAt: -1 });

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
    const product = await Product.findById(id);
    if (!product) return res.status(404).json({ message: "Product not found" });
    return res.status(200).json({ product });
  } catch (err) {
    console.error("getProductById error", err);
    return res.status(500).json({ message: "Server error" });
  }
};
