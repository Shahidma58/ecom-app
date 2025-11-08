// API Route: /api/ecom/fin_tran/get_gl_account
// File: app/api/ecom/fin_tran/get_gl_account/route.ts

import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: { gl_cd: string } }
) {
  try {
    const glCode = parseInt(params.gl_cd);

    if (isNaN(glCode)) {
      return NextResponse.json({ error: "Invalid gl_cd" }, { status: 400 });
    }

    const glAccount = await prisma.gen_Ledg_Mod.findFirst({
      where: {
        gl_cd: glCode,
        gl_stat: "Active",
        gl_type: "GL",
      },
      select: {
        gl_desc: true,
        curr_bal: true,
      },
    });

    if (!glAccount) {
      return NextResponse.json({ error: "GL Account not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: glAccount });
  } catch (error) {
    console.error("Error fetching GL Account:", error);
    return NextResponse.json({ error: "Failed to fetch GL Account" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
