import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const ac_no = parseInt(searchParams.get("ac_no") || "0");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  try {
    const where: any = {};
    if (ac_no) where.ac_no = ac_no;
    if (from && to)
      where.trn_date = { gte: new Date(from), lte: new Date(to) };

    const data = await prisma.fin_Tran_Mod.findMany({
      where,
      orderBy: { trn_date: "asc" },
    });

    let ac_title = "";
    if (ac_no)
      ac_title =
        (
          await prisma.accts_Mod.findUnique({
            where: { ac_no },
            select: { ac_title: true },
          })
        )?.ac_title || "";

    return NextResponse.json({ success: true, data, ac_title });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ success: false, error: "Failed to fetch" });
  } finally {
    await prisma.$disconnect();
  }
}
