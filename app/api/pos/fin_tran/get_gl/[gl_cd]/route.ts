// API Route: /api/pos/fin_tran/get_gl_account

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { gl_cd: string } }
) {
  try {
    const acct_no = parseInt(params.gl_cd);

    if (isNaN(acct_no)) {
      return NextResponse.json({ error: "Invalid G/L" }, { status: 400 });
    }

    const acct = await prisma.gen_Ledg_Mod.findFirst({
      where: {
        gl_cd: acct_no,
//        gl_stat: "Active"
      },
      select: {
        gl_desc: true,
        curr_bal: true
//        ac_gl: true
      },
    });

    if (!acct) {
      return NextResponse.json({ error: "G/L not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: acct });
  } catch (error) {
    console.error("Error fetching Account:", error);
    return NextResponse.json({ error: "Failed to fetch Ledger" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
