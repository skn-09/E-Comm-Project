import { Request, Response } from "express";
import {
  CartServiceError,
  addItemToCart,
  clearCartItems,
  fetchCart,
  removeItemFromCart,
} from "../services/cartService";
import { createOrderFromCart } from "../services/orderService";
import { AuthedRequest } from "../types/requests";

export const addToCart = async (req: Request, res: Response) => {
  try {
    const { productId, quantity } = req.body;
    const { userId } = req as AuthedRequest;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await addItemToCart(userId, productId, quantity);
    res.status(200).json(cart);
  } catch (err) {
    if (err instanceof CartServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error("addToCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const getCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthedRequest;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await fetchCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    console.error("getCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const removeFromCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthedRequest;
    const { productId } = req.params;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const cart = await removeItemFromCart(userId, productId);
    res.status(200).json(cart);
  } catch (err) {
    if (err instanceof CartServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error("removeFromCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

export const clearCart = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthedRequest;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // Create an order from the cart (this will also decrement product stocks and clear the cart)
    try {
      await createOrderFromCart(userId);
    } catch (orderErr) {
      // Log order creation error but continue to return cleared cart if possible
      console.error("Order creation failed:", orderErr);
    }

    // Return the (now empty) cart
    const cart = await fetchCart(userId);
    res.status(200).json(cart);
  } catch (err) {
    if (err instanceof CartServiceError) {
      return res.status(err.statusCode).json({ message: err.message });
    }
    console.error("clearCart error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
