// lib/authMiddleware.ts
import { NextRequest, NextResponse } from "next/server";
import { verifyAccessToken, TokenPayload } from "./jwt";

export interface AuthenticatedRequest extends NextRequest {
  user?: TokenPayload;
}

export function withAuth(
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    try {
      const authHeader = req.headers.get("authorization");

      if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return NextResponse.json(
          { error: "Unauthorized - No token provided" },
          { status: 401 }
        );
      }

      const token = authHeader.substring(7);
      const payload = verifyAccessToken(token);

      // Attach user info to request
      const authenticatedReq = req as AuthenticatedRequest;
      authenticatedReq.user = payload;

      return handler(authenticatedReq);
    } catch (error) {
      console.error("Auth middleware error:", error);
      return NextResponse.json(
        { error: "Unauthorized - Invalid token" },
        { status: 401 }
      );
    }
  };
}

// Example usage in a protected route:
// export const GET = withAuth(async (req: AuthenticatedRequest) => {
//   const userId = req.user?.userId;
//   // Your protected logic here
//   return NextResponse.json({ data: 'protected data' });
// });
