// app/api/auth/login/route.ts
import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";

interface UserFromDB {
  usr_id: string;
  pswd_hash: string;
}

export async function POST(request: NextRequest) {
  try {
    const { user_id, password } = await request.json();

    if (!user_id || !password) {
      return NextResponse.json(
        { error: "User ID and password are required" },
        { status: 400 }
      );
    }

    const user = await findUserById(user_id);

    if (!user) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    const isValidPassword = await bcrypt.compare(
      password,
      user.pswd_hash
    );

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Invalid credentials" },
        { status: 401 }
      );
    }

    // 🟢 SUCCESS
    return NextResponse.json({
      success: true,
      user: { usr_id: user.usr_id },
    });
  } catch (error) {
    console.error("Login error:", error);

    return NextResponse.json(
      { error: "Something went wrong" },
      { status: 500 }
    );
  }
}

async function findUserById(user_id: string): Promise<UserFromDB | null> {
  try {
    const user = await prisma.users_Mod.findFirst({
      where: {
        usr_id: user_id,
      },
    });

    if (!user) return null;

    return {
      usr_id: user.usr_id,
      pswd_hash: user.pswd_hash ?? "",
    };
  } catch (error) {
    console.error("Database query error:", error);
    return null;
  }
}
