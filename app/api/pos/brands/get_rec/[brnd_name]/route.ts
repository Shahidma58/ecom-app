import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ brnd_name: string }> }
) {
  try {
    const { brnd_name } = await context.params; 
    const wbrnd_name = brnd_name;
    // Validate
    if (!wbrnd_name) {
      return NextResponse.json(
        { error: "Brand Name parameter is required" },
        { status: 400 }
      );
    }

    // if (wbrnd_name) {
    //   return NextResponse.json(
    //     { error: "Brand Name must be a valid number" },
    //     { status: 400 }
    //   );
    // }

    // Prisma query
    const wRec = await prisma.brands_Mod.findFirst({
      where: {
        brand_name: wbrnd_name,
//        ac_stat: "Active",
      },
      //select: { *
        // ac_title: true,
        // ac_gl: true,
        // curr_bal: true,
      //},
    });

    if (!wRec) {
      return NextResponse.json(
        { error: "Account not found or inactive" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: wRec });
  } catch (error) {
    console.error("Error fetching account:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch account",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
