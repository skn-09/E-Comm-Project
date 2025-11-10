import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
}

const getAccessTokenSecret = (): string => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined in environment variables");
  }
  return secret;
};

const getRefreshTokenSecret = (): string => {
  const secret = process.env.JWT_REFRESH_SECRET;
  if (!secret) {
    throw new Error("JWT_REFRESH_SECRET is not defined in environment variables");
  }
  return secret;
};

export const hashPassword = (password: string): Promise<string> => {
  return bcrypt.hash(password, 10);
};

export const comparePasswords = (password: string, hashedPassword: string): Promise<boolean> => {
  return bcrypt.compare(password, hashedPassword);
};

export const generateAccessToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getAccessTokenSecret(), { expiresIn: "1h" });
};

export const generateRefreshToken = (payload: TokenPayload): string => {
  return jwt.sign(payload, getRefreshTokenSecret(), { expiresIn: "7d" });
};

export const verifyAccessToken = (token: string): TokenPayload & jwt.JwtPayload => {
  return jwt.verify(token, getAccessTokenSecret()) as TokenPayload & jwt.JwtPayload;
};

export const verifyRefreshToken = (token: string): TokenPayload & jwt.JwtPayload => {
  return jwt.verify(token, getRefreshTokenSecret()) as TokenPayload & jwt.JwtPayload;
};

