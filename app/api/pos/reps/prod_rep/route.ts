// app/api/pos/products/print/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brn_cd = searchParams.get("brn_cd");

    const branchCode = brn_cd ? Number(brn_cd) : undefined;

    const products = await prisma.products_vw.findMany({
      where: branchCode ? { brn_cd: branchCode } : {},
      select: {
        prd_cd: true,
        prd_cat: true,
        brn_cd: true,
        prd_qoh: true,
        prd_re_ord: true,
        max_rsp: true,
        pur_prc: true,
        bar_cd: true,
        prd_desc: true,
      },
      orderBy: {
//        prd_cat: "asc",
        prd_cd: "asc",
      },
    });

    return NextResponse.json({
      success: true,
      data: products,
    });
  } catch (error) {
    console.error("Product print error:", error);
    return NextResponse.json(
      { success: false, message: "Failed to load products" },
      { status: 500 }
    );
  }
}
