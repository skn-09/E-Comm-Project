import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth";
import { AuthedRequest } from "../types/requests";

export const authMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Authorization token missing" });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = verifyAccessToken(token);
    (req as AuthedRequest).userId = decoded.userId;
    next();
  } catch (error) {
    console.error("authMiddleware error", error);
    return res.status(401).json({ message: "Invalid or expired token" });
  }
};

