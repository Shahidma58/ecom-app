// /app/api/pos/accts/save_acct/route.ts
import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const data = await req.json();
    const { gl_cd, gl_desc, gl_sdesc, gl_cat, gl_type, gl_stat, inp_by } = data;

    if (!gl_cd) {
      return NextResponse.json({ success: false, message: "GL Code is required" }, { status: 400 });
    }

    const existingAcct = await prisma.gen_Ledg_Mod.findUnique({ where: { gl_cd: Number(gl_cd) } });

    let result;
    if (existingAcct) {
      // 🔄 Update existing account
      result = await prisma.gen_Ledg_Mod.update({
        where: { gl_cd: Number(gl_cd) },
        data: { gl_cd, gl_desc, gl_sdesc, gl_cat, gl_type, gl_stat, inp_by },
      });
    } else {
      // 🆕 Create new account
      result = await prisma.gen_Ledg_Mod.create({
        data: {
          gl_cd, gl_desc, gl_sdesc, gl_cat, gl_type, 
          gl_stat, inp_by
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
