// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { generateAccessToken, generateRefreshToken } from "@/app/lib/jwt";
import { setRefreshTokenCookie } from "@/app/lib/cookies";
import { prisma } from "@/lib/prisma";

interface UserFromDB {
  id: string;
  email: string;
  password: string;
  name: string;
  branch_code: number
}

async function findUserByEmail(email: string): Promise<UserFromDB | null> {
  try {
    const user = await prisma.users_Mod.findFirst({
      where: {
        usr_email: email,
      },
    });

    if (!user) {
      return null;
    }

    // Map Prisma fields to our interface
    return {
      id: user.usr_id,
      email: user.usr_email,
      password: user.pswd_hash || "",
      name: user.usr_name,
      branch_code: user.br_cd
    };
  } catch (error) {
    console.error("Database query error:", error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user in database
    const user = await findUserByEmail(email);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

   

    // Check if password is set
    // if (!user.password) {
    //   return NextResponse.json(
    //     { error: "Password not set for this account" },
    //     { status: 401 }
    //   );
    // }

    // // Verify password
    // const isValidPassword = await bcrypt.compare(password, user.password);

    // if (!isValidPassword) {
    //   return NextResponse.json(
    //     { error: "Invalid credentials" },
    //     { status: 401 }
    //   );
    // }

    // Generate tokens
    const tokenPayload = {
      userId: user.id,
      email: user.email,
      branch_code: user.branch_code,
      username: user.name
    };

    const accessToken = generateAccessToken(tokenPayload);
    const refreshToken = generateRefreshToken(tokenPayload);

    // Update last login time
    await prisma.users_Mod.update({
      where: { usr_id: user.id },
      data: { last_login: new Date() },
    });

    // Send response with tokens
    const response = NextResponse.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        branch_code: user.branch_code
      },
    });

    setRefreshTokenCookie(response, refreshToken);

    return response;
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
