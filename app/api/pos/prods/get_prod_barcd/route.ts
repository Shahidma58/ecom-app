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
    // Read parameter from URL: ?bar_cd=123
    const searchParams = req.nextUrl.searchParams;
    const bar_cd = searchParams.get("bar_cd");

    if (!bar_cd) {
      return NextResponse.json(
        { error: "bar_cd parameter is required" },
        { status: 400 }
      );
    }

    const prdCode = bar_cd;
    if (prdCode === undefined) {
      return NextResponse.json(
        { error: "bar_cd must be a valid number" },
        { status: 400 }
      );
    }

    // Prisma query
    const product = await prisma.prod_mast_Mod.findFirst({
      where: {
        bar_cd: prdCode,
//        prd_qoh: { gt: 0 },
//        prd_stat: "Active",
      },
      select: {
        prd_cd: true,
        prd_desc: true,
        prd_cat: true,
        prd_brand: true,
//        tax_pct: true
      },
    });
    if (!product) {
      return NextResponse.json(
        { error: "Product not found or inactive" },
        { status: 400 }
      );
    }
//console.log(product);
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
