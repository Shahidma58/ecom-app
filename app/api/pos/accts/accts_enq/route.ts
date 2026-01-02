import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; 
// The entire block of code MUST be wrapped in an exported function.
export async function GET(req: NextRequest) {
  try {
    // Read parameter from URL: ?prd_cd=123 (Commented out, but kept for context)
    // const searchParams = req.nextUrl.searchParams;
    // const ac_no = searchParams.get("ac_no");

    // if (!ac_no) {
    //   return NextResponse.json({ error: "Account is required" }, { status: 400 });
    // }

    // const prdCode = parseInt(ac_no);
    // if (isNaN(prdCode)) {
    //   return NextResponse.json({ error: "Account must be a valid number" }, { status: 400 });
    // }

    // Prisma query
    const accts = await prisma.accts_Mod.findMany({
      // where: {
      //   ac_no: prdCode
      // },
      select: {
        ac_no: true,
        ac_title: true,
        curr_bal: true,
        ac_stat: true,
      },
    });

    if (!accts) {
      return NextResponse.json({ error: "Accounts found or inactive" },
        { status: 404 });
    }
  
    return NextResponse.json({ success: true, data: accts });
  } catch (error) {
    console.error("Error fetching Accounts:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Accounts",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }  
    )
  } finally {
    // Ensure you disconnect from the database after the operation
    await prisma.$disconnect();
  }
}