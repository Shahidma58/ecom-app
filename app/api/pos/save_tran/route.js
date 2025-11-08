import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// POST API to insert a cart record
export async function POST(req) {
//  var wTrn_dt = 0;
  try {
  console.log('------------- into save tran API');
    const body = await req.json();
//  console.log("Body: ", body)
//    const { tranInfo, cartItems } = body;
    const { salTots, salItms, tran_dt } = body;
 console.log("Batch Info: ",salTots, salItms,tran_dt );

    // if (!user_id || !cart_date || !cart_items) {
    //   return NextResponse.json(
    //     { success: false, message: "Missing required fields" },
    //     { status: 400 }
    //   );
    // }
//  wmod_id = seq_params['mod_id'];
//  wtrn_dt = seq_params['trn_dt'];

    // Step 1: Generate new Cart ID using PostgreSQL function
    const tranSeqResult = await prisma.$queryRawUnsafe(
      `SELECT get_trn_seq(${tran_dt}, 'POS') AS tran_id;`
//      `SELECT get_trn_seq(${tran_dt['trn_dt']}, 'POS') AS tran_id;`
    );
  console.log(tranSeqResult);
    // Prisma returns an array from raw query
   let wTran_id = tranSeqResult?.[0]?.tran_id;
  if (typeof wTran_id === 'bigint') {
    wTran_id = Number(wTran_id); 
  }
  console.log('------------- into API');
  console.log(wTran_id);
    if (!wTran_id) {
      throw new Error("Failed to generate Transaction ID");
    }
    // Step 2: Insert record into carts table    
    salTots.sal_id = wTran_id;
  // Adds the cart_id property directly to the cartItems
    // salItms.forEach((item, index) => {
    //   item.sal_id = wTran_id;
    //   item.sal_id_serl =  index + 1; 
    // });
// delete tranInfo.drac_no;
//-==============  Save ============================================
    const crTran = await prisma.Sales_Batch_Mod.create({
      data: salTots,
    });
//-===========================================================
//    delete salItms.itm_desc;
  // Adds the sal_id property directly to the sal_Itms
    salItms.forEach((item, index) => {
      item.sal_id = wTran_id;
    });


console.log("Sale_items: ",salItms)
    const result = await prisma.Sales_Tran_Mod.createMany({
      data: salItms,
      skipDuplicates: true, 
    });
    return NextResponse.json(
      {
        success: true,
        message: "Transaction inserted and Updated successfully",
        // data: newCart,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error inserting cart:", err);
    return NextResponse.json(
      { success: false, message: "Error Insert/Update POS Tran", error: err.message },
      { status: 500 }
    );
  }
}

