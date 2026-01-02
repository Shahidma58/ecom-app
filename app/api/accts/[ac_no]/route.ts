import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
try {
    const { searchParams } = new URL(req.url);
    const ac_no = searchParams.get("ac_no");

    if (!ac_no) {
      return NextResponse.json(
        { success: false, message: "ac_no query parameter is required" },
        { status: 400 }
      );
    }

//  const ac_no = parseInt(params.ac_no);

//    const accountNo = wac_no;
    // if (isNaN(ac_no)) {
    //   return NextResponse.json(
    //     { error: "ac_no must be a valid number" },
    //     { status: 400 }
    //   );
    // }

    // Prisma query
    const account = await prisma.accts_Mod.findFirst({
      where: {
        ac_no: parseInt(ac_no),
        ac_stat: "Active",
      },
      select: {
        ac_title: true,
        ac_gl: true,
        curr_bal: true,
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
