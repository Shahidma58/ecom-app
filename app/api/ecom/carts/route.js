import { NextResponse } from "next/server";
import { prisma }  from "@/lib/prisma";

// ========================================================
// GET - Fetch all cart records
// ========================================================
export async function GET() {
  try {
    const carts = await prisma.Ec_Carts_Mod.findMany({
      orderBy: { cart_dt: "desc" },
    });

    return NextResponse.json({
      success: true,
      data: carts,
    });
  } catch (error) {
    console.error("GET Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch carts", details: error.message },
      { status: 500 }
    );
  }
}

// ========================================================
// POST - Create a new cart record
// ========================================================
export async function POST(request) {
  try {
    const body = await request.json();
console.log(body);
console.log('creating Cart..............');
    const newCart = await prisma.Ec_Carts_Mod.create({
      data: {
        cust_mbl: body.cust_mbl,
        cart_id: body.cart_id,
        cust_email: body.cust_email,
        cust_fname: body.cust_fname,
        cust_lname: body.cust_lname,
        cust_addr_1: body.cust_addr_1,
        cust_addr_2: body.cust_addr_2,
        cust_city: body.cust_city,
        cust_ctry: body.cust_ctry,
        tot_amt: body.tot_amt,
        tot_tax: body.tot_tax,
        tot_itms: body.tot_itms,
        cart_stat: body.cart_stat,
        dlvy_chgs: body.dlvy_chgs,
        cust_comp: body.cust_comp,
        inp_by: body.inp_by,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cart created successfully",
      data: newCart,
    });
  } catch (error) {
    console.error("POST Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to create cart", details: error.message },
      { status: 500 }
    );
  }
}

// ========================================================
// PUT - Update an existing cart (by cust_mbl & cart_id)
// ========================================================
export async function PUT(request) {
  try {
    const body = await request.json();

    const updatedCart = await prisma.Ec_Carts_Mod.update({
      where: {
        cust_mbl_cart_id: {
          cust_mbl: body.cust_mbl,
          cart_id: body.cart_id,
        },
      },
      data: {
        cust_email: body.cust_email,
        cust_fname: body.cust_fname,
        cust_lname: body.cust_lname,
        cust_addr_1: body.cust_addr_1,
        cust_addr_2: body.cust_addr_2,
        cust_city: body.cust_city,
        cust_ctry: body.cust_ctry,
        tot_amt: body.tot_amt,
        tot_tax: body.tot_tax,
        tot_itms: body.tot_itms,
        cart_stat: body.cart_stat,
        dlvy_chgs: body.dlvy_chgs,
        cust_comp: body.cust_comp,
        inp_by: body.inp_by,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cart updated successfully",
      data: updatedCart,
    });
  } catch (error) {
    console.error("PUT Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to update cart", details: error.message },
      { status: 500 }
    );
  }
}

// ========================================================
// DELETE - Remove a cart (by cust_mbl & cart_id)
// ========================================================
export async function DELETE(request) {
  try {
    const { searchParams } = new URL(request.url);
    const cust_mbl = searchParams.get("cust_mbl");
    const cart_id = parseInt(searchParams.get("cart_id"));

    if (!cust_mbl || isNaN(cart_id)) {
      return NextResponse.json(
        { success: false, error: "cust_mbl and cart_id are required" },
        { status: 400 }
      );
    }

    await prisma.Ec_Carts_Mod.delete({
      where: {
        cust_mbl_cart_id: {
          cust_mbl,
          cart_id,
        },
      },
    });

    return NextResponse.json({
      success: true,
      message: "Cart deleted successfully",
    });
  } catch (error) {
    console.error("DELETE Error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete cart", details: error.message },
      { status: 500 }
    );
  }
}
