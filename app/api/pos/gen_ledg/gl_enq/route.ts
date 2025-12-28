import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 

// The entire block of code MUST be wrapped in an exported function.
export async function GET(req: NextRequest) {
  try {
    // Read parameter from URL: ?prd_cd=123 (Commented out, but kept for context)
    const searchParams = req.nextUrl.searchParams;
    const brn_cd = searchParams.get("brn_cod");

    const where: any = {};
//console.log(brn_cd + "brrrrrrrrrrrrrr");
    if (brn_cd) {
      const brnCdNum = Number(brn_cd);
      if (isNaN(brnCdNum)) {
        return NextResponse.json(
          { error: "Invalid branch code" },
          { status: 400 }
        );
      }
      where.brn_cd = brnCdNum;
    }

    // Prisma query
    const gls = await prisma.gen_ledg_bals_vw_Mod.findMany({
      // where: {
      //   ac_no: prdCode
      // },
      where,
      select: {
        gl_cd: true,
        brn_cd: true,
        gl_desc: true,
        curr_bal: true,
        gl_stat: true,
      },
    });

    if (!gls) {
      return NextResponse.json({ error: "No Ledgers found or inactive" },
        { status: 404 });
    }
  
    return NextResponse.json({ success: true, data: gls });
  } catch (error) {
    console.error("Error fetching Ledgers:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch data from GL Table",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }  
    )
  } finally {
    // Ensure you disconnect from the database after the operation
    await prisma.$disconnect();
  }
}