// API Route: /api/pos/fin_tran/get_gl_account

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ ac_no: string }> }
) {
  try {
        const { ac_no } = await params;
    const acct_no = parseInt(ac_no);
    if (isNaN(acct_no)) {
      return NextResponse.json({ error: "Invalid Account No" }, { status: 400 });
    }

    const acct = await prisma.accts_Mod.findFirst({
      where: {
        ac_no: acct_no,
        ac_stat: "Active"
      },
      select: {
        ac_title: true,
        curr_bal: true,
        ac_gl: true
      },
    });

    if (!acct) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: acct });
  } catch (error) {
    console.error("Error fetching Account:", error);
    return NextResponse.json({ error: "Failed to fetch Account" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
