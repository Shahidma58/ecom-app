import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    // Pagination
    const page = Number(searchParams.get("page")) || 1;
    const limit = Number(searchParams.get("limit")) || 10;
    const skip = (page - 1) * limit;

    // Search filters
    const prd_desc = searchParams.get("prd_desc") || "";
    const prd_brand = searchParams.get("prd_brand") || "";
    const brn_cd = searchParams.get("brn_code") || "";

    console.log(brn_cd + '   bbbbbbbbbbbbbrrrrrrrr');
    // Sorting
    const sort_by = searchParams.get("sort_by"); 
    const sort_order = searchParams.get("sort_order") === "desc" ? "desc" : "asc";

    // Build Prisma "where" clause
    const where: any = {
      AND: [
        brn_cd
          ? { brn_cd: Number(brn_cd) }
          : {},
        prd_desc
          ? { prd_desc: { contains: prd_desc, mode: "insensitive" } }
          : {},
        prd_brand
          ? { prd_brand: { contains: prd_brand, mode: "insensitive" } }
          : {},
        ],
    };

    // Build sorting (orderBy)
    let orderBy: any = undefined;

    if (sort_by) {
      orderBy = {
        [sort_by]: sort_order,
      };
    }

    // Get total results for pagination
    const total = await prisma.prods_vw_Mod.count({ where });

    // Main Query
    const prdcts = await prisma.prods_vw_Mod.findMany({
      where,
      skip,
      take: limit,
      orderBy,
      select: {
        brn_cd: true,
        prd_cd: true,
        prd_desc: true,
        prd_brand: true,
        prd_qoh: true,
        pur_prc: true,
        min_rsp: true,
        max_rsp: true,
        prd_stat: true,
      },
    });
//console.log('fetched data');
//console.log(total);
//console.log(prdcts);
    return NextResponse.json({
      success: true,
      data: prdcts,
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
    });

  } catch (error) {
    console.error("Error fetching products:", error);
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
