// ============================================================
// API - Change Pswd - app/api/users/chng_pswd[usr_id]/route.js
// ============================================================
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";
const prisma = new PrismaClient();
// PUT - Update User
export async function PUT(request, { params }) {
  try {
    const { usr_id } = await params;
    const body = await request.json();
    const {
      new_pswd
    } = body;

    if (!usr_id || typeof usr_id !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid User ID" },
        { status: 400 }
      );
    }

    // Check if user exists
    // const existingUser = await prisma.users_Mod.findUnique({
    //   where: { usr_id },
    // });

    // if (!existingUser) {
    //   return NextResponse.json(
    //     { success: false, message: "User not found" },
    //     { status: 404 }
    //   );
    // }
  const pass_hash = await bcrypt.hash(new_pswd, 10);
  console.log(pass_hash);

    // Update User
    const updatedUser = await prisma.users_Mod.update({
      where: { usr_id },
      data: {
        pswd_hash: pass_hash
      },
    });

    return NextResponse.json({
      success: true,
      message: "Password updated successfully...",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating Password:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to update user",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
