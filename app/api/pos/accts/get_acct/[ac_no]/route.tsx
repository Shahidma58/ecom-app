import { NextRequest, NextResponse } from "next/server";
//import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ ac_no: string }> }
) {
  try {
    const { ac_no } = await context.params; 
    const wac_no = new Prisma.Decimal(ac_no);
    // Validate
    if (!wac_no) {
      return NextResponse.json(
        { error: "ac_no parameter is required" },
        { status: 400 }
      );
    }
    if (!ac_no) {
  return NextResponse.json(
    { error: "ac_no parameter is required" },
    { status: 400 }
  );
}

//    const accountNo = wac_no;
    // if (isNaN(wac_no)) {
    //   return NextResponse.json(
    //     { error: "ac_no must be a valid number" },
    //     { status: 400 }
    //   );
    // }

    // Prisma query
    

    const account = await prisma.accts_Mod.findFirst({
  where: {
    ac_no: wac_no,
  },
  include: {
    generalLedger: {
      select: {
        gl_desc: true,
      },
    },
  },
});


    if (!account) {
      return NextResponse.json(
        { error: "Account not found or inactive" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: account });
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
