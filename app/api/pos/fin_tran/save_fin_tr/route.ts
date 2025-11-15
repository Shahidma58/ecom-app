import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jsonSafe } from "../../../../lib/jsonSafe";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {
    const { tranCr } = await req.json();

    if (!tranCr) {
      return NextResponse.json(
        { success: false, message: "Missing transaction payload" },
        { status: 400 }
      );
    }

    // Step 1️⃣: Generate new Tran ID using PostgreSQL function
    const wTrn_Dt = tranCr.trn_dt;
    const tranSeqResult: any = await prisma.$queryRawUnsafe(
      `SELECT get_trn_seq('${wTrn_Dt}', 'FINTR') AS tran_id;`
    );

    let wTran_id = tranSeqResult?.[0]?.tran_id;
    if (typeof wTran_id === "bigint") wTran_id = Number(wTran_id);
    if (!wTran_id) throw new Error("Failed to generate Tran ID");

    tranCr.trn_id = wTran_id;
    tranCr.trn_serl = 2;
    tranCr.trn_amt = parseFloat(tranCr.trn_amt);
    tranCr.ac_no = Number(tranCr.ac_no);
    tranCr.drac_curr_bal = Number(tranCr.drac_curr_bal);
//console.log(tranCr);
    // Step 2️⃣: Prepare DR and CR transaction objects
    const { drac_no, drgl_cd, drac_curr_bal, trn_dt, ...tranDr } = tranCr;

    tranDr.ac_no = Number(tranCr.drac_no);
    tranDr.gl_cd = Number(tranCr.drgl_cd);
    tranDr.ac_curr_bal = parseFloat(tranCr.drac_curr_bal);
    tranDr.dr_cr = "D";
    tranDr.trn_serl = 1;

    // Clean up unnecessary props
    delete tranCr.drac_no;
    delete tranCr.drgl_cd;
    delete tranCr.drac_curr_bal;
    delete tranCr.trn_dt;

    // Step 3️⃣: Adjust balances
    tranCr.ac_curr_bal =
      parseFloat(tranCr.ac_curr_bal) + parseFloat(tranCr.trn_amt);
    tranDr.ac_curr_bal =
      parseFloat(tranDr.ac_curr_bal) - parseFloat(tranDr.trn_amt);

    // console.log("tran-Info after DR mapping:", tranDr, tranCr);

    // Step 4️⃣: Run all or none transaction
    const result = await prisma.$transaction(async (tx) => {
      // 🔹 Debit Leg
      const drTran = await tx.fin_Tran_Mod.create({ data: tranDr });

      if (Number(tranDr.ac_no) > 99999) {
        // Update Customer Account
        await tx.accts_Mod.update({
          where: { ac_no: Number(tranDr.ac_no) },
          data: { curr_bal: { decrement: tranDr.trn_amt } },
        });
        // Update G/L 
        await tx.gen_Ledg_Mod.update({
          where: { gl_cd: Number(tranDr.gl_cd) },
          data: { curr_bal: { decrement: tranDr.trn_amt } },
        });
      } else {
        // Debit Leg only updates G/L
        await tx.gen_Ledg_Mod.update({
          where: { gl_cd: Number(tranDr.ac_no) },
          data: { curr_bal: { decrement: tranDr.trn_amt } },
        });
      }
      // 🔹 Credit Leg
      const crTran = await tx.fin_Tran_Mod.create({ data: tranCr });
      if (Number(tranCr.ac_no) > 99999) {
        // Update Customer Account
        await tx.accts_Mod.update({
          where: { ac_no: Number(tranCr.ac_no) },
          data: { curr_bal: { increment: tranCr.trn_amt } },
        });
        // Update Customer G/L
        await tx.gen_Ledg_Mod.update({
          where: { gl_cd: Number(tranCr.gl_cd) },
          data: { curr_bal: { increment: tranCr.trn_amt } },
        });
      } else {
        // Credit Leg only updates G/L
        await tx.gen_Ledg_Mod.update({
          where: { gl_cd: Number(tranCr.ac_no) },
          data: { curr_bal: { increment: tranCr.trn_amt } },
        });
      }
      // Always return something valid
//      return { tran_id: wTran_id };
    });

    // ✅ Success Response (safe JSON)
    return NextResponse.json({
      tran_id: wTran_id,  
      success: true,
      message: "Transaction inserted and updated successfully",
      data: jsonSafe(result ?? {}),
    });
  } catch (err: any) {
    console.error("Error inserting transaction:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error inserting/updating POS transaction",
        error: err.message,
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
