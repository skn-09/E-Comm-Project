import { Cart } from "../models/Cart";
import { Product } from "../models/Product";

export class CartServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const addItemToCart = async (
  userId: string,
  productId: string,
  quantity: number
) => {
  if (!productId || !quantity) {
    throw new CartServiceError("productId and quantity are required", 400);
  }

  const product = await Product.findById(productId);
  if (!product) {
    throw new CartServiceError("Product not found", 404);
  }

  if (product.quantity < quantity) {
    throw new CartServiceError("Insufficient stock", 400);
  }

  let cart = await Cart.findOne({ user: userId });
  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
  }

  const existingItem = cart.items.find(
    (item) => item.product.toString() === productId
  );

  if (existingItem) {
    existingItem.quantity += quantity;
  } else {
    cart.items.push({ product: productId, quantity });
  }

  cart.updatedAt = new Date();
  await cart.save();
  await cart.populate("items.product");

  return cart;
};

export const fetchCart = async (userId: string) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
    await cart.save();
    await cart.populate("items.product");
  }

  return cart;
};

export const removeItemFromCart = async (userId: string, productId: string) => {
  if (!productId) {
    throw new CartServiceError("productId is required", 400);
  }

  const cart = await Cart.findOne({ user: userId });
  if (!cart) {
    throw new CartServiceError("Cart not found", 404);
  }

  cart.items = cart.items.filter(
    (item) => item.product.toString() !== productId
  ) as any;
  cart.updatedAt = new Date();

  await cart.save();
  await cart.populate("items.product");

  return cart;
};

export const clearCartItems = async (userId: string) => {
  let cart = await Cart.findOne({ user: userId }).populate("items.product");

  if (!cart) {
    cart = new Cart({ user: userId, items: [] });
    await cart.save();
    await cart.populate("items.product");
    return cart;
  }

  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product) {
      continue;
    }

    const remaining = product.quantity - item.quantity;
    product.quantity = remaining > 0 ? remaining : 0;
    await product.save();
  }

  cart.items.splice(0, cart.items.length);
  cart.updatedAt = new Date();

  await cart.save();
  await cart.populate("items.product");

  return cart;
};

