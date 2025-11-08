// ============================================
// 1. API - GET one Prod-Detail 
// ============================================
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"; //    ../../../lib/prisma";
// ✅ GET - Fetch one Product by prd_cd (pk)
export async function GET(request, { params }) {
  try {
    const { prd_cd } = await params; 
    // Validate post_id
    const prd_code = parseInt(prd_cd);
    if (isNaN(prd_code)) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid post_id parameter",
        },
        { status: 400 }
      );
    }

    // ✅ Prisma query - findUnique requires an exact match object
    const row_data = await prisma.Prods_Mod.findUnique({
      where: { prd_cd: prd_code },
    });

    if (!row_data) {
      return NextResponse.json(
        {
          success: false,
          message: `No Post found with ID ${prd_code}`,
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: row_data,
    });
  } catch (error) {
    console.error("Error fetching Products info:", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to fetch Product Info",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
