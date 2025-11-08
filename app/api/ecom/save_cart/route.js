import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
// POST API to insert a cart record
export async function POST(req) {
  var wmod_id = '';
  var wtrn_dt = 0;
  try {
    const body = await req.json();
  console.log("Body: ", body)
    const { cartInfo,cartItems, totals, seq_params } = body;
// console.log("totals: ",totals)
    // if (!user_id || !cart_date || !cart_items) {
    //   return NextResponse.json(
    //     { success: false, message: "Missing required fields" },
    //     { status: 400 }
    //   );
    // }
//  wmod_id = seq_params['mod_id'];
  wtrn_dt = seq_params['trn_dt'];
  console.log(wtrn_dt);
  console.log('------------- into API');

    // Step 1: Generate new Cart ID using PostgreSQL function
    const cartSeqResult = await prisma.$queryRawUnsafe(
      `SELECT get_cart_seq(${seq_params['trn_dt']}) AS cart_id;`
    );
//  console.log(cartSeqResult);

    // Prisma returns an array from raw query
   let wCart_id = cartSeqResult?.[0]?.cart_id;
if (typeof wCart_id === 'bigint') {
  wCart_id = Number(wCart_id); // or cart_id.toString() if it's too large
}
   //const wCart_id = 250010001
  console.log('------------- into API');
  console.log(wCart_id);
    if (!wCart_id) {
      throw new Error("Failed to generate Cart ID");
    }
    // Step 2: Insert record into carts table
    
    cartInfo.cart_id = wCart_id;
    // console.log('creating Cart..............');

    // Adds the cart_id property directly to the cartItems
    cartItems.forEach((item, index) => {
      item.cart_id = wCart_id;
      item.cart_id_serl =  index + 1; 
    });

    console.log("cart_items: ",cartItems)

    const newCart = await prisma.Ec_Carts_Mod.create({
      data: cartInfo,
    });

    const result = await prisma.Ec_Cart_Items_Mod.createMany({
      data: cartItems,
      skipDuplicates: true, // optional: avoids error on duplicate post_id
    });
    return NextResponse.json(
      {
        success: true,
        message: "Cart inserted successfully",
        // data: newCart,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error inserting cart:", err);
    return NextResponse.json(
      { success: false, message: "Error inserting cart", error: err.message },
      { status: 500 }
    );
  }
}

