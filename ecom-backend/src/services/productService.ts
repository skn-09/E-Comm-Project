import { Product } from "../models/Product";

export class ProductServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

export interface CreateProductPayload {
  name: string;
  price: number;
  rating?: number;
  discount?: number;
  imageUrl?: string;
  description?: string;
  material?: string;
  moreInfo?: string;
  category: string;
  quantity: number;
}

export const createProductRecord = async (payload: CreateProductPayload) => {
  const product = new Product({
    name: payload.name.trim(),
    price: payload.price,
    rating: payload.rating,
    discount: payload.discount,
    imageUrl:
      payload.imageUrl && payload.imageUrl.trim()
        ? payload.imageUrl.trim()
        : undefined,
    description: payload.description,
    material: payload.material,
    moreInfo: payload.moreInfo,
    category: payload.category.trim().toLowerCase(),
    quantity:
      payload.quantity !== undefined && payload.quantity !== null
        ? payload.quantity
        : 1,
  });

  await product.save();
  return product;
};

export const listProducts = async (category?: string) => {
  const filter: Record<string, unknown> = {};

  if (category) {
    filter.category = { $regex: new RegExp(`^${category}$`, "i") };
  }

  return Product.find(filter).sort({ createdAt: -1 });
};

export const findProductById = async (id: string) => {
  const product = await Product.findById(id);

  if (!product) {
    throw new ProductServiceError("Product not found", 404);
  }

  return product;
};

