import { Order } from "../models/Order";
import { Cart } from "../models/Cart";
import { Product } from "../models/Product";

export class OrderServiceError extends Error {
  statusCode: number;
  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const createOrderFromCart = async (userId: string) => {
  const cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart || cart.items.length === 0) {
    throw new OrderServiceError("Cart is empty", 400);
  }

  const orderItems: any[] = [];
  let total = 0;

  for (const ci of cart.items) {
    const product = await Product.findById(ci.product._id || ci.product);
    if (!product) {
      continue; // skip missing products
    }

    const price = product.price || 0;
    const qty = ci.quantity || 0;
    total += price * qty;

    orderItems.push({
      product: product._id,
      quantity: qty,
      priceAtPurchase: price,
    });
  }

  const order = new Order({
    user: userId,
    items: orderItems,
    total,
    status: "created",
  });
  await order.save();

  // decrement product quantities and clear cart
  for (const ci of cart.items) {
    const product = await Product.findById(ci.product._id || ci.product);
    if (!product) continue;
    const remaining = product.quantity - ci.quantity;
    product.quantity = remaining > 0 ? remaining : 0;
    await product.save();
  }

  cart.items.splice(0, cart.items.length);
  cart.updatedAt = new Date();
  await cart.save();

  await order.populate("items.product");
  return order;
};

export const fetchOrdersForUser = async (userId: string) => {
  const orders = await Order.find({ user: userId })
    .sort({ createdAt: -1 })
    .populate("items.product");
  return orders;
};

export const countOrdersForUser = async (userId: string) => {
  // count only non-canceled orders
  return await Order.countDocuments({
    user: userId,
    status: { $ne: "canceled" },
  });
};

export const cancelOrder = async (userId: string, orderId: string) => {
  const order = await Order.findById(orderId);
  if (!order) {
    throw new OrderServiceError("Order not found", 404);
  }

  if (order.user.toString() !== userId) {
    throw new OrderServiceError("Unauthorized", 401);
  }

  if (order.status === "canceled") {
    throw new OrderServiceError("Order already canceled", 400);
  }

  // restore product quantities
  for (const it of order.items) {
    const product = await Product.findById(it.product);
    if (!product) continue;
    product.quantity = (product.quantity || 0) + (it.quantity || 0);
    await product.save();
  }

  order.status = "canceled";
  order.canceledAt = new Date();
  await order.save();

  await order.populate("items.product");
  return order;
};
