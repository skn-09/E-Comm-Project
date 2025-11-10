import { User } from "../models/User";
import type { UserDocument } from "../models/User";
import {
  comparePasswords,
  generateAccessToken,
  generateRefreshToken,
  hashPassword,
  verifyRefreshToken,
} from "../utils/auth";

interface SignupPayload {
  name: string;
  email: string;
  password: string;
  contact: string;
}

export class AuthServiceError extends Error {
  statusCode: number;

  constructor(message: string, statusCode = 400) {
    super(message);
    this.statusCode = statusCode;
  }
}

const buildUserResponse = (user: UserDocument) => {
  return {
    id: user._id.toString(),
    name: user.name,
    email: user.email,
    contact: user.contact,
  };
};

export const registerUser = async (payload: SignupPayload) => {
  const existingUser = await User.findOne({ email: payload.email });
  if (existingUser) {
    throw new AuthServiceError("Email already exists", 409);
  }

  const hashedPassword = await hashPassword(payload.password);
  const newUser = new User({
    name: payload.name,
    email: payload.email,
    password: hashedPassword,
    contact: payload.contact,
  });

  await newUser.save();
  return buildUserResponse(newUser);
};

export const authenticateUser = async (email: string, password: string) => {
  const user = await User.findOne({ email });
  if (!user) {
    throw new AuthServiceError("User not found", 404);
  }

  const isPasswordValid = await comparePasswords(password, user.password);
  if (!isPasswordValid) {
    throw new AuthServiceError("Invalid password", 401);
  }

  const payload = { userId: user._id.toString() };
  const accessToken = generateAccessToken(payload);
  const refreshToken = generateRefreshToken(payload);

  user.refreshToken = refreshToken;
  await user.save();

  return {
    user: buildUserResponse(user),
    token: accessToken,
    refreshToken,
  };
};

export const rotateTokens = async (refreshToken: string) => {
  const decodedToken = verifyRefreshToken(refreshToken);
  const user = await User.findById(decodedToken.userId);

  if (!user || user.refreshToken !== refreshToken) {
    throw new AuthServiceError("Invalid refresh token. Please login again.", 401);
  }

  const payload = { userId: user._id.toString() };
  const newAccessToken = generateAccessToken(payload);
  const newRefreshToken = generateRefreshToken(payload);

  user.refreshToken = newRefreshToken;
  await user.save();

  return {
    token: newAccessToken,
    refreshToken: newRefreshToken,
  };
};

