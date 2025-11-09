// API Route: /api/pos/fin_tran/get_gl/[gl_cd]/route.ts
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ gl_cd: string }> }
) {
  try {
    // Await params before accessing properties
    const { gl_cd } = await params;
    const wGl_Cd = parseInt(gl_cd);

    if (isNaN(wGl_Cd)) {
      return NextResponse.json({ error: "Invalid G/L" }, { status: 400 });
    }

    const wGenLedg = await prisma.gen_Ledg_Mod.findFirst({
      where: {
        gl_cd: wGl_Cd,
        //gl_stat: "Active"
      },
      select: {
        gl_desc: true,
        curr_bal: true,
      },
    });

    if (!wGenLedg) {
      return NextResponse.json({ error: "G/L not found" }, { status: 404 });
    }
console.log(wGenLedg);
    return NextResponse.json({ success: true, data: wGenLedg });
  } catch (error) {
    console.error("Error fetching Account:", error);
    return NextResponse.json(
      { error: "Failed to fetch Ledger" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}