import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();
// to test route
// http://localhost:3000/api/pos/accts/stmt?ac_no=210003&from_date=2025-11-01&to_date=2025-11-09

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const ac_no = searchParams.get("ac_no");
    const from_date = searchParams.get("from_date");
    const to_date = searchParams.get("to_date");

    const whereClause: any = {};

    if (ac_no) {
      const acNum = parseInt(ac_no);
      if (isNaN(acNum)) {
        return NextResponse.json({ error: "Invalid account number" }, { status: 400 });
      }
      whereClause.ac_no = acNum;
    }

    if (from_date && to_date) {
      whereClause.trn_date = {
        gte: new Date(from_date),
        lte: new Date(to_date),
      };
    }

    const transactions = await prisma.fin_Tran_Mod.findMany({
      where: whereClause,
      orderBy: { trn_date: "asc" },
      select: {
        ac_no: true,
        trn_id: true,
        trn_date: true,
        trn_desc: true,
        dr_cr: true,
        trn_amt: true,
        ac_curr_bal: true
      },
    });

    return NextResponse.json({ success: true, data: transactions });
  } catch (error: any) {
    console.error("Error fetching statement:", error);
    return NextResponse.json(
      { error: "Failed to fetch statement", details: error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
