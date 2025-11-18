import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
//import { number } from "yup";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ prod_cd: string }> }
) {
  try {
    const { prod_cd } = await context.params; 
    const prd_cod = Number(prod_cd);
    // Validate
    if (!prd_cod) {
      return NextResponse.json(
        { error: "Product Code is required" },
        { status: 400 }
      );
    }
    if (isNaN(prd_cod)) {
      return NextResponse.json(
        { error: "Product Code must be a valid number" },
        { status: 400 }
      );
    }

    // Prisma query
    const prodRec = await prisma.prods_Mod.findFirst({
      where: {
        prd_cd: prd_cod,
//        prd_stat: "Active",
      },
//      select: {
//      },
    });

    if (!prodRec) {
      return NextResponse.json(
        { error: "Product not found or inactive" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: prodRec });
  } catch (error) {
    console.error("Error fetching Product:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}