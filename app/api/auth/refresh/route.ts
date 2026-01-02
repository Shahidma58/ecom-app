// app/api/auth/refresh/route.ts
import { setRefreshTokenCookie } from "@/app/lib/cookies";
import {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
} from "@/app/lib/jwt";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const refreshToken = request.cookies.get("refreshToken")?.value;

    if (!refreshToken) {
      return NextResponse.json(
        { error: "Refresh token not found" },
        { status: 401 }
      );
    }

    const payload = verifyRefreshToken(refreshToken);

    // Optional: Check if user still exists and is active
    // const user = await findUserById(payload.userId);
    // if (!user || !user.isActive) {
    //   return NextResponse.json({ error: 'User not found' }, { status: 401 });
    // }
    const tokenPayload = {
      userId: payload.userId,
      email: payload.email,
      branch_code: payload.branch_code,
      username: payload.username
    };
    const newAccessToken = generateAccessToken(tokenPayload);
    const newRefreshToken = generateRefreshToken(tokenPayload);
    const response = NextResponse.json({
      accessToken: newAccessToken,
    });
    setRefreshTokenCookie(response, newRefreshToken);

    return response;
  } catch (error) {
    console.error("Token refresh error:", error);
    return NextResponse.json(
      { error: "Invalid or expired refresh token" },
      { status: 401 }
    );
  }
}
