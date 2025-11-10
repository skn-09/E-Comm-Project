import express from "express";
import { authMiddleware } from "../middleware/authMiddleware";
import {
  getOrders,
  getOrdersCount,
  cancelOrderController,
} from "../controllers/ordersController";

const router = express.Router();

router.get("/", authMiddleware, getOrders);
router.get("/count", authMiddleware, getOrdersCount);
router.post("/:id/cancel", authMiddleware, cancelOrderController);

export default router;
