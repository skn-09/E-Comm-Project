import { Request, Response } from "express";
import {
  validateEmail,
  validatePassword,
  validateContact,
} from "../utils/validators";
import {
  AuthServiceError,
  authenticateUser,
  registerUser,
  rotateTokens,
} from "../services/authService";

export const signupUser = async (req: Request, res: Response) => {
  try {
    const { name, email, password, contact } = req.body;

    if (!name || !email || !password || !contact) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    if (!validatePassword(password)) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters long" });
    }

    if (!validateContact(contact)) {
      return res
        .status(400)
        .json({ message: "Contact must be a 10-digit number" });
    }

    await registerUser({ name, email, password, contact });

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error: unknown) {
    if (error instanceof AuthServiceError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("signupUser error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Both email and password are required" });
    }

    if (!validateEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    const { token, refreshToken, user } = await authenticateUser(email, password);

    return res.status(200).json({
      message: "Login successful",
      token,
      refreshToken,
      user,
    });
  } catch (error: unknown) {
    if (error instanceof AuthServiceError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("loginUser error", error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const refreshAuthToken = async (req: Request, res: Response) => {
  try {
    const { refreshToken } = req.body as { refreshToken?: string };

    if (!refreshToken) {
      return res.status(400).json({ message: "Refresh token is required" });
    }

    const tokens = await rotateTokens(refreshToken);

    return res.status(200).json({
      message: "Token refreshed successfully",
      ...tokens,
    });
  } catch (error: unknown) {
    if (error instanceof AuthServiceError) {
      return res.status(error.statusCode).json({ message: error.message });
    }
    console.error("refreshAuthToken error", error);
    return res.status(500).json({ message: "Server error" });
  }
};
