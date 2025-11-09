import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function POST(req: Request) {
  try {    console.log('------------- into API');
// POST API to insert a cart record    const body = await req.json();
//  console.log("Body: ", body)
    const { tranCr, tranDbt } = await req.json();
    console.log("tran-Info: ",tranCr, tranDbt)
    const tranDr = tranCr;
//    tranDr.ac_no = tranCr.drac_no;
//    tranDr.ac_curr_bal = tranCr.drAc_Bal;
//    tranDr.dr_cr = 'D';
    // delete tranCr.drac_no;
    // delete tranCr.drAc_Bal;
    //================================================
    console.log("tran-Info: ",tranCr, tranDr, tranDbt)
  try {
    console.log('------------- into API-2');
    //================================================
//===================================================
    // Step 1: Generate new Cart ID using PostgreSQL function
    const tranSeqResult = await prisma.$queryRawUnsafe(
      `SELECT get_trn_seq(${tranDbt['trn_dt']}, 'FINTR') AS tran_id;`
    );
//  console.log(tranSeqResult);
// Prisma returns an array from raw query
    let wTran_id = tranSeqResult?.[0]?.tran_id;
    if (typeof wTran_id === 'bigint') {
      wTran_id = Number(wTran_id); 
    }
    if (!wTran_id) {
      throw new Error("Failed to generate Cart ID");
    }
    console.log('-------- Got Tran ID-------');
    console.log(wTran_id);
    tranDr.trn_id = wTran_id;
    tranDr.trn_serl = 1;
    tranCr.trn_id = wTran_id;
    tranCr.trn_serl = 2;
// Step 2: Insert record into carts table    
//-==========================================================
//             All or none using a single transaction
//-==========================================================
    const result = await prisma.$transaction(async (tx) => {
//-=================  Debit Leg and Updates ===================
    const drTran = await tx.Fin_Tran_Mod.create({
      data: tranDr,
    });
      // 4 Update Credit Account balances
      if (tranDr.ac_no > 99999) {
        await tx.accts_Mod.update({
          where: { ac_no: tranDr.ac_no },
          data: {
            curr_bal: { decrement: tranDr.trn_amt }, // decr for Credit
          },
        });
      }    
      if (tranDr.gl_cd > 0 || tranDr.ac_no <= 99999) {
        const wDrGl = tranDr.gl_cd > 0 ? tranDr.gl_cd  : tranDr.ac_no;         
        await tx.gen_Ledg_Mod.update({
          where: { gl_cd: wDrGl },
          data: {
            curr_bal: { increment: tranDr.trn_amt }, // decr for Credit
          },
        });
      }    
//============================================================
    const crTran = await tx.fin_Tran_Mod.create({
      data: tranCr,
    });
      // 3️⃣ Update Account balances
      if (tranCr.ac_no > 99999) {
        await tx.accts_Mod.update({
          where: { ac_no: tranCr.ac_no },
          data: {
            curr_bal: { increment: tranCr.trn_amt }, // Add for Credit
          },
        });
      }    
      if (tranCr.gl_cd > 0 || tranCr.ac_no <= 99999) {
        const wCrGl = tranCr.ac_no < 100000 ? tranCr.gl_cd  : tranCr.ac_no;         
        await tx.gen_Ledg_Mod.update({
          where: { gl_cd: wCrGl },
          data: {
            curr_bal: { increment: tranCr.trn_amt }, // Add for Credit
          },
        });
      }    
//======================================================    
    return NextResponse.json(
      {
        success: true,
        message: "Transaction inserted and Updated successfully",
        // data: newCart,
      },
      { status: 201 }
    );
//      return { drInsert, crInsert };
    });
    return NextResponse.json({ success: true, data: result });
  } catch (err) {
    console.error("Error inserting cart:", err);
    return NextResponse.json(
      { success: false, message: "Error Insert/Update POS Tran", error: err.message },
      { status: 500 }
    );
  }
}

//  wmod_id = seq_params['mod_id'];
//  wtrn_dt = seq_params['trn_dt'];
//  console.log(wtrn_dt);

    // if (!user_id || !cart_date || !cart_items) {
    //   return NextResponse.json(
    //     { success: false, message: "Missing required fields" },
    //     { status: 400 }
    //   );
    // }


// Adds the cart_id property directly to the cartItems
    // cartItems.forEach((item, index) => {
    //   item.cart_id = wTran_id;
    //   item.cart_id_serl =  index + 1; 
    // });

    // const result = await prisma.Ec_Cart_Items_Mod.createMany({
    //   data: cartItems,
    //   skipDuplicates: true, // optional: avoids error on duplicate post_id
    // });


//    var wTrn_dt = tranDr.trn_dt;
//     let wCrac = 0, wCrgl = 0, wDrac = 0, wDrgl = 0;
//     //==================================================
//     if (tranCr.ac_no > 99999) {
//       const wCrac = tranCr.ac_no; 
//       const wCrGl = tranCr.gl_cd; // will be zero if ac_no itself is GL
//     } else {
//       const wCrac = 0;       
//       const wCrGl = tranCr.ac_no;
//     }
// //=================================================
//     if (tranCr.drac_no > 99999) {
//       const wDrac = tranCr.drac_no; 
//       const wDrGl = tranDr.drgl_cd; // will be zero if ac_no itself is GL
//     } else {
//       const wDrac = 0;       
//       const wDrGl = tranCr.drac_no;
//     }
//     wDrac =  tranCr.drac_no;
