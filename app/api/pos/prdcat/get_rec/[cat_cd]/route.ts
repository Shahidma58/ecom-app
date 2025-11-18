import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ cat_cd: string }> }
) {
//console.log('getting categ');
  try {
    const { cat_cd } = await context.params; 
    const wcat_cd = cat_cd;
//console.log(wcat_cd);

    // Validate
    if (!wcat_cd) {
      return NextResponse.json(
        { error: "Categ Code is required" },
        { status: 400 }
      );
    }

    // Prisma query
    const wRec = await prisma.prod_categ_Mod.findFirst({
      where: {
        cat_cd: wcat_cd,
//        ac_stat: "Active",
      },
      //select: { *
        // ac_title: true,
        // ac_gl: true,
        // curr_bal: true,
      //},
    });
console.log(wRec);
    if (!wRec) {
      return NextResponse.json(
        { error: "Category Desc found or inactive" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: wRec });
  } catch (error) {
    console.error("Error fetching Category Code:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch  Category Code",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
