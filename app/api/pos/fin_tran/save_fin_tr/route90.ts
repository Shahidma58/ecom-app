import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";
import { jsonSafe } from "../../../../lib/jsonSafe";
const prisma = new PrismaClient();

export async function POST(req: Request) {
//  console.log("------------- into API");
  try {
    // names should be same payload from page   
    const { tranCr } = await req.json();
  // Step 1: Generate new Tran ID using PostgreSQL function
  // ============================================================
    const wTrn_Dt = tranCr.trn_dt;
    const tranSeqResult: any = await prisma.$queryRawUnsafe(
      `SELECT get_trn_seq('${wTrn_Dt}', 'FINTR') AS tran_id;`
    );
    let wTran_id = tranSeqResult?.[0]?.tran_id;
    if (typeof wTran_id === "bigint") wTran_id = Number(wTran_id);
    if (!wTran_id) throw new Error("Failed to generate Tran ID");
//    console.log("-------- Got Tran ID -------", wTran_id);
//    tranDr.trn_id = wTran_id;
    tranCr.trn_id = wTran_id;
    tranCr.trn_serl = 2;
    // ============================================================
    const {drac_no, drgl_cd, drac_curr_bal, trn_dt, ...tranDr} = tranCr;
    tranDr.ac_no = Number(tranCr.drac_no);
    tranDr.ac_curr_bal = parseFloat(tranCr.drac_curr_bal);
    tranDr.dr_cr = "D";
    tranDr.trn_serl = 1;
    // tranDr.gl_cd = Number(tranCr.drgl_cd);
    // tranCr.ac_no = Number(tranCr.ac_no);
    // ============= Delete extra Vars from array
    delete tranCr.drac_no;
    delete tranCr.drgl_cd;
    delete tranCr.drac_curr_bal;
    delete tranCr.trn_dt;
  //============================================
  //======= UPDTE CURR-BAL on transaction to reflect updated balance
  //========== set data types to avoid javascript havocs............
    tranCr.ac_curr_bal = parseFloat(tranCr.ac_curr_bal) + parseFloat(tranCr.trn_amt); 
    tranDr.ac_curr_bal = parseFloat(tranDr.ac_curr_bal) - parseFloat(tranDr.trn_amt); 
  // ============================================================
    console.log("tran-Info after DR mapping:", tranDr, tranCr);
  // ============================================================
  // Step 2: All or none using a single transaction
  // ============================================================
    const result = await prisma.$transaction(async (tx) => {
  // 1️⃣ Insert Debit Leg
      const drTran = await tx.fin_Tran_Mod.create({
        data: tranDr,
      });
      // 2️⃣ Update Debit Account Balances
      if (Number(tranDr.ac_no) > 99999) {
        console.log('updating Account Balance - 1')
        await tx.accts_Mod.update({
          where: { ac_no: Number(tranDr.ac_no) },
          data: {
            curr_bal: { decrement: tranDr.trn_amt },
          },
      });
      console.log('updating G/L Balance - 1')
//    const wDrGl = Number(tranDr.gl_cd);
      await tx.gen_Ledg_Mod.update({
        where: { gl_cd: Number(tranDr.gl_cd) },
        data: {
          curr_bal: { increment: tranDr.trn_amt },
        },
      });
//==================  CREDIT LEGS ========================
//      console.log("tran-Info :", tranCr);
//      console.log('Inserting Credit Leg - 1')
      // 3️⃣ Insert Credit Leg
      const crTran = await tx.fin_Tran_Mod.create({
        data: tranCr,
      });
      // 4️⃣ Update Credit Account Balances
      if (Number(tranCr.ac_no) > 99999) {
        console.log('updating Account Balance - 2')
        await tx.accts_Mod.update({
          where: { ac_no: Number(tranCr.ac_no) },
          data: {
            curr_bal: { increment: tranCr.trn_amt },
          },
        });  
        console.log('updating CUST-GL Balance - 2')
        await tx.gen_Ledg_Mod.update({
          where: { gl_cd: Number(tranCr.gl_cd) },
          data: {
            curr_bal: { increment: tranCr.trn_amt },
          },
        });
      } else { 
        //==================== Credit - Update ONLY G/L Balance"
        console.log('updating GL Balance - 2')
        await tx.gen_Ledg_Mod.update({
          where: { gl_cd:  Number(tranCr.ac_no) },
          data: {
            curr_bal: { increment: tranCr.trn_amt },
          },
        });
      }
      return { drTran };

    }
    });
    // ✅ Return Success Response
    return NextResponse.json({ 
      success: true, 
      message: "Transaction inserted and updated successfully",
      data: jsonSafe(result) 
    });    
  } catch (err: any) {
    console.error("Error inserting transaction:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error Insert/Update POS Tran",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
