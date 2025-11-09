import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// POST API to insert a cart record
export async function POST(req) {
  var wTrn_dt = 0;
  try {
    const body = await req.json();
    //  console.log("Body: ", body)
    //    const { tranInfo, cartItems } = body;
    const { tranInfo, tranDr } = body;
    console.log("tranInfo: ", tranInfo, tranDr);

    // if (!user_id || !cart_date || !cart_items) {
    //   return NextResponse.json(
    //     { success: false, message: "Missing required fields" },
    //     { status: 400 }
    //   );
    // }
    //  wmod_id = seq_params['mod_id'];
    //  wtrn_dt = seq_params['trn_dt'];
    //  console.log(wtrn_dt);
    console.log("------------- into API");

    // Step 1: Generate new Cart ID using PostgreSQL function
    const tranSeqResult = await prisma.$queryRawUnsafe(
      `SELECT get_trn_seq(${tranDr["trn_dt"]}, 'FINTR') AS tran_id;`
    );
    console.log(tranSeqResult);

    // Prisma returns an array from raw query
    let wTran_id = tranSeqResult?.[0]?.tran_id;
    if (typeof wTran_id === "bigint") {
      wTran_id = Number(wTran_id); // or cart_id.toString() if it's too large
    }
    //const wCart_id = 250010001
    console.log("------------- into API");
    console.log(wTran_id);
    if (!wTran_id) {
      throw new Error("Failed to generate Cart ID");
    }
    // Step 2: Insert record into carts table

    tranInfo.trn_id = wTran_id;
    // console.log('creating Cart..............');

    // Adds the cart_id property directly to the cartItems
    // cartItems.forEach((item, index) => {
    //   item.cart_id = wTran_id;
    //   item.cart_id_serl =  index + 1;
    // });

    //    console.log("cart_items: ",cartItems)
    const wDrac = tranInfo.drac_no;
    delete tranInfo.drac_no;

    // STORE DRAC and update array for DR TRAN
    //-==========================================================
    const crTran = await prisma.Fin_Tran_Mod.create({
      data: tranInfo,
    });
    //-===========================================================
    tranInfo.ac_no = wDrac;
    tranInfo.gl_cd = tranDr.drgl_cd;
    tranInfo.trn_serl = 2;
    tranInfo.dr_cr = "D";

    console.log(tranInfo);
    const drTran = await prisma.Fin_Tran_Mod.create({
      data: tranInfo,
    });

    // const result = await prisma.Ec_Cart_Items_Mod.createMany({
    //   data: cartItems,
    //   skipDuplicates: true, // optional: avoids error on duplicate post_id
    // });
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
      {
        success: false,
        message: "Error Insert/Update POS Tran",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
