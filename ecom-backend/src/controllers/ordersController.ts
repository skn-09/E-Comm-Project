import { Request, Response } from "express";
import { AuthedRequest } from "../types/requests";
import {
  fetchOrdersForUser,
  countOrdersForUser,
  cancelOrder,
} from "../services/orderService";

export const getOrders = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthedRequest;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const orders = await fetchOrdersForUser(userId);
    return res.status(200).json(orders);
  } catch (err) {
    console.error("getOrders error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getOrdersCount = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthedRequest;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const count = await countOrdersForUser(userId);
    return res.status(200).json({ count });
  } catch (err) {
    console.error("getOrdersCount error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const cancelOrderController = async (req: Request, res: Response) => {
  try {
    const { userId } = req as AuthedRequest;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const { id } = req.params;
    const updated = await cancelOrder(userId, id);
    return res.status(200).json(updated);
  } catch (err: any) {
    console.error("cancelOrder error:", err);
    if (err instanceof Error && (err as any).statusCode) {
      return res.status((err as any).statusCode).json({ message: err.message });
    }
    return res.status(500).json({ message: "Server error" });
  }
};
