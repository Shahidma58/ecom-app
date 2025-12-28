import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function GET() {
  try {
    const data = await prisma.$queryRawUnsafe(`
      select h.gl_cd as ac_no,gl_desc,
            h.curr_bal - today_mvmnt AS open_bal,
	          today_mvmnt as trn_amt, h.curr_bal
        from gl_bals_hist h, gen_ledg g where h.gl_cd = g.gl_cd
            and buss_dt = '12-Nov-2025'
    `);
//      SELECT ac_no, gl_desc, curr_bal - trn_amt AS open_bal, trn_amt, curr_bal
//      FROM public.fin_tran_vw, public.gen_ledg
//      WHERE ac_no = gen_ledg.gl_cd

    //  and gen_ledg.gl_cd != 10001
    return NextResponse.json({ success: true, data });
  } catch (error) {
    console.error("Error fetching dashboard data:", error);
    return NextResponse.json({ success: false, message: "Failed to fetch data" }, { status: 500 });
  } finally {
    await prisma.$disconnect();
  }
}
