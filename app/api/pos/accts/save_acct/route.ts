// /app/api/pos/accts/save_acct/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { ac_no, ac_gl, ac_title, ac_contact, ac_addr, curr_bal, yy_op_bal, ac_stat, inp_by } = data;

    if (!ac_no) {
      return NextResponse.json({ success: false, message: "Account number is required" }, { status: 400 });
    }

    const existingAcct = await prisma.accts_Mod.findUnique({ where: { ac_no: Number(ac_no) } });

    let result;
    if (existingAcct) {
      // 🔄 Update existing account
      result = await prisma.accts_Mod.update({
        where: { ac_no: Number(ac_no) },
        data: { ac_gl, ac_title, ac_contact, ac_addr, curr_bal, yy_op_bal, ac_stat, inp_by },
      });
    } else {
      // 🆕 Create new account
      result = await prisma.accts_Mod.create({
        data: {
          ac_no,
          ac_gl,
          ac_title,
          ac_contact,
          ac_addr,
          curr_bal,
          yy_op_bal,
          ac_stat,
          inp_by,
        },
      });
    }

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error("Error saving account:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
