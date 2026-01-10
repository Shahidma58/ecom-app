import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { AuthenticatedRequest, withAuth } from "@/app/lib/authMiddleware";

export const GET = withAuth(async (req: AuthenticatedRequest) => {
  try {
    const user = req.user;
    const searchParams = req.nextUrl.searchParams;
    const prd_cd = searchParams.get("prd_cd");

    console.log(user?.branch_code)

    if (!prd_cd) {
      return NextResponse.json(
        { error: "prd_cd parameter is required" },
        { status: 400 }
      );
    }

    const product = await prisma.products_vw.findFirst({
      where: {
        bar_cd: prd_cd,
        prd_qoh: { gt: 0 },
        brn_cd: user?.branch_code,
        // prd_stat: true,
      },
      select: {
        prd_desc: true,
        max_rsp: true,
        min_rsp: true,
        pur_prc: true,
        disc_amt: true,
        disc_pct: true,
        disc_st_dt: true,
        disc_end_dt: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found or inactive" },
        { status: 404 }
      );
    }

    const today = new Date();

    const isDiscountValid =
      product.disc_st_dt &&
      product.disc_end_dt &&
      today >= product.disc_st_dt &&
      today <= product.disc_end_dt;

    const responseData = {
  prd_desc: product.prd_desc,
  max_rsp: product.max_rsp.toString(), // convert BigInt/Decimal to string
  min_rsp: product.min_rsp.toString(),
  pur_prc: product.pur_prc.toString(),
  discount_amt: isDiscountValid ? product.disc_amt?.toString() : null,
  discount_pct: isDiscountValid ? product.disc_pct?.toString() : null,
};


    return NextResponse.json({ success: true, data: responseData });
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
});
