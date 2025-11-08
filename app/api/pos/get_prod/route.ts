import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

export async function GET(req: NextRequest) {
  try {
    // Read parameter from URL: ?prd_cd=123
    const searchParams = req.nextUrl.searchParams;
    const prd_cd = searchParams.get("prd_cd");

    if (!prd_cd) {
      return NextResponse.json({ error: "prd_cd parameter is required" }, { status: 400 });
    }

    const prdCode = parseInt(prd_cd);
    if (isNaN(prdCode)) {
      return NextResponse.json({ error: "prd_cd must be a valid number" }, { status: 400 });
    }

    // Prisma query
    const product = await prisma.Prods_Mod.findFirst({
      where: {
        prd_cd: prdCode,
        prd_qoh: { gt: 0 },
        prd_stat: "Active",
      },
      select: {
        prd_desc: true,
        max_rsp: true,
        min_rsp: true,
        pur_prc: true,
      },
    });

    if (!product) {
      return NextResponse.json({ error: "Product not found or inactive" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: product });
  } catch (error) {
    console.error("Error fetching product:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
