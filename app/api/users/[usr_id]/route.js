// ============================================
// API - GET ONE, UPDATE, DELETE - app/api/users/[usr_id]/route.js
// ============================================

import { NextResponse } from "next/server";
//import prisma from "@/lib/prisma";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

// GET - Fetch single User by ID
export async function GET(request, { params }) {
  try {
    const { usr_id } = await params;

    if (!usr_id || typeof usr_id !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid User ID" },
        { status: 400 }
      );
    }

    const user = await prisma.users_Mod.findUnique({
      where: { usr_id },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Err: User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch user",
        error: error.message,
      },
      { status: 500 }
    );
  }
}

// PUT - Update User
export async function PUT(request, { params }) {
  try {
    const { usr_id } = await params;
    const body = await request.json();
    const {
      usr_name,
      usr_email,
      usr_mbl,
      pswd_hash,
      last_login,
      usr_stat,
      inp_by,
      brn_cd,
    } = body;

    if (!usr_id || typeof usr_id !== "string") {
      return NextResponse.json(
        { success: false, message: "Invalid User ID" },
        { status: 400 }
      );
    }

    // Check if user exists
    const existingUser = await prisma.users_Mod.findUnique({
      where: { usr_id },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "Err: User not found" },
        { status: 404 }
      );
    }

    // Update User
    const updatedUser = await prisma.users_Mod.update({
      where: { usr_id },
      data: {
        usr_name: usr_name ?? existingUser.usr_name,
        usr_email: usr_email ?? existingUser.usr_email,
        usr_mbl: usr_mbl ?? existingUser.usr_mbl,
        pswd_hash: pswd_hash ?? existingUser.pswd_hash,
        last_login: last_login ?? existingUser.last_login,
        usr_stat: usr_stat ?? existingUser.usr_stat,
        inp_by: inp_by ?? existingUser.inp_by,
        brn_cd: brn_cd ?? existingUser.brn_cd,

      },
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Error updating user:", error);
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

// DELETE - Delete User
// export async function DELETE(request, { params }) {
//   try {
//     const { usr_id } = await params;

//     if (!usr_id || typeof usr_id !== "string") {
//       return NextResponse.json(
//         { success: false, message: "Invalid User ID" },
//         { status: 400 }
//       );
//     }

//     // Check if user exists
//     const existingUser = await prisma.Users_Mod.findUnique({
//       where: { usr_id },
//     });

//     if (!existingUser) {
//       return NextResponse.json(
//         { success: false, message: "User not found" },
//         { status: 404 }
//       );
//     }

//     // Delete User
//     await prisma.Users_Mod.delete({
//       where: { usr_id },
//     });

//     return NextResponse.json({
//       success: true,
//       message: "User deleted successfully",
//     });
//   } catch (error) {
//     console.error("Error deleting user:", error);
//     return NextResponse.json(
//       {
//         success: false,
//         message: "Failed to delete user",
//         error: error.message,
//       },
//       { status: 500 }
//     );
//   }
// }
