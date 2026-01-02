import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
//import { AuthenticatedRequest, withAuth } from "@/app/lib/authMiddleware";
//const prisma = new PrismaClient();
//export const GET = withAuth(async (req: AuthenticatedRequest) => {
export async function GET(
  req: NextRequest,
  context: { searchParams: Promise<{ prod_cd: string }> })
{
  try {
    // const userId = req.user?.userId;
    // console.log(userId);
    // Read parameter from URL: ?prd_cd=123
    const searchParams = req.nextUrl.searchParams;
    const prd_cd = searchParams.get("prd_cd");

    if (!prd_cd) {
      return NextResponse.json(
        { error: "prd_cd parameter is required" },
        { status: 400 }
      );
    }

    const prdCode = prd_cd;
    if (prdCode === undefined) {
      return NextResponse.json(
        { error: "prd_cd must be a valid number" },
        { status: 400 }
      );
    }

    // Prisma query
    const product = await prisma.prod_info_Mod.findFirst({
      where: {
        prd_cd: prdCode,
        brn_cd: 100,
//        prd_qoh: { gt: 0 },
//        prd_stat: "Active",
      },
      select: {
        prd_cd: true,
        prd_lot_ref: true,
        max_pur_qty: true,
        exp_dt: true,
        prd_re_ord: true,
        prd_qoh: true,
        max_rsp: true,
        disc_pct: true,
        disc_amt: true,
        disc_st_dt: true,
        disc_end_dt: true,
        pur_prc: true,
        tax_pct: true,
        min_rsp: true
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found or inactive" },
        { status: 400 }
      );
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
};
