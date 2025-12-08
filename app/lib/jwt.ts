// lib/jwt.ts
import jwt from "jsonwebtoken";

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;

export interface TokenPayload {
  userId: string;
  email: string;
}

export function generateAccessToken(payload: TokenPayload): string {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: "15m", // 15 minutes
  });
}

export function generateRefreshToken(payload: TokenPayload): string {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, {
    expiresIn: "7d", // 7 days
  });
}

export function verifyAccessToken(token: string): TokenPayload {
  return jwt.verify(token, ACCESS_TOKEN_SECRET) as TokenPayload;
}

export function verifyRefreshToken(token: string): TokenPayload {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as TokenPayload;
}
