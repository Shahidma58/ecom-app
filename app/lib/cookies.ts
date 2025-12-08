// lib/cookies.ts
import { NextResponse } from "next/server";

export function setRefreshTokenCookie(response: NextResponse, token: string) {
  response.cookies.set("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    path: "/",
  });
}

export function clearRefreshTokenCookie(response: NextResponse) {
  response.cookies.set("refreshToken", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 0,
    path: "/",
  });
}
