// app/api/auth/logout/route.ts
import { clearRefreshTokenCookie } from "@/app/lib/cookies";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const response = NextResponse.json(
      { message: "Logged out successfully" },
      { status: 200 }
    );

    clearRefreshTokenCookie(response);

    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
