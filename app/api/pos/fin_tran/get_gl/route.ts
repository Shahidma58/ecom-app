import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    // Read query parameters
    const { searchParams } = new URL(req.url);

    const gl_cd_param = searchParams.get("gl_cd");
    const brn_cd_param = searchParams.get("brn_cd");

    // Validate GL Code (mandatory)
    if (!gl_cd_param) {
      return NextResponse.json(
        { error: "gl_cd is required" },
        { status: 400 }
      );
    }

    const gl_cd = Number(gl_cd_param);
    if (isNaN(gl_cd)) {
      return NextResponse.json(
        { error: "gl_cd must be a valid number" },
        { status: 400 }
      );
    }

    // Validate Branch Code (optional)
    let brn_cd: number | undefined = undefined;
    if (brn_cd_param !== null) {
      brn_cd = Number(brn_cd_param);
      if (isNaN(brn_cd)) {
        return NextResponse.json(
          { error: "brn_cd must be a valid number" },
          { status: 400 }
        );
      }
    }

    // Build WHERE clause dynamically
    const where: any = {
      gl_cd: gl_cd,
    };

    if (brn_cd !== undefined) {
      where.brn_cd = brn_cd;
    }

    // Prisma query
    const ledger = await prisma.gen_ledg_bals_vw_Mod.findFirst({
      where,
      select: {
        gl_cd: true,
        gl_desc: true,
        curr_bal: true,
        brn_cd: true,
      },
    });

    if (!ledger) {
      return NextResponse.json(
        { error: "Ledger not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: ledger,
    });

  } catch (error) {
    console.error("Error fetching GL:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch GL record",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    // IMPORTANT: In Next.js App Router + Prisma singleton,
    // you may remove this if prisma is globally cached
    await prisma.$disconnect();
  }
}
