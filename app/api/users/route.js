// ============================================
// 1. API - GET ALL & CREATE - app/api/users/route.js
// ============================================

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();
// ===================================================
// GET - Fetch all users (with optional is_active filter)
// ===================================================
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const usr_stat = searchParams.get("usr_stat");

    const users = await prisma.users_Mod.findMany({
      where: usr_stat !== null ? { usr_stat: usr_stat == "Active" } : {},
      orderBy: {
        usr_id: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: users,
      count: users.length,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch users",
        details: error.message,
      },
      { status: 500 }
    );
  }
}

// ============================================
// POST - Create new user
// ============================================
export async function POST(request) {
  try {
    const body = await request.json();
    console.log(body);
    console.log('body.........');
    const {
      usr_id,
      usr_name,
      usr_email,
      usr_mbl,
      role_id,
      pswd_hash,
      usr_stat,
      inp_by,
      brn_cd
    } = body;

    // Validate required fields
    if (!usr_id || !usr_name || !usr_email) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID, Name, and Email are required",
        },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.users_Mod.findUnique({
      where: { usr_id },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message: "User ID already exists",
        },
        { status: 409 }
      );
    }
  console.log("password");

  console.log(password);

  const pass_hash = await bcrypt.hash(pswd_hash, 10);
  console.log(pass_hash);
    // Create new user
    const newUser = await prisma.users_Mod.create({
      data: {
        usr_id,
        usr_name,
        usr_email,
        usr_mbl,
        role_id,
        pswd_hash: pass_hash,
        usr_stat,
        inp_by,
        brn_cd
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        data: newUser,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating user:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Failed to create user",
        error: error.message,
      },
      { status: 500 }
    );
  }
}
