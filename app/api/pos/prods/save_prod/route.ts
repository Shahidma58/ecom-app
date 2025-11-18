import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { gVars } from "@/app/app.config";
// Utility: yesterday date
function yesterday() {
  return new Date(Date.now() - 24 * 60 * 60 * 1000);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const {
      prd_cd,
      prd_desc,
      prd_cat,
      prd_brand = "",
      prd_sku = "",
      prd_img_lnk = "",
    } = body;

    if (!prd_cd || !prd_desc || !prd_cat) {
      return NextResponse.json(
        { success: false, error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check if product already exists
    const existing = await prisma.prods_Mod.findUnique({
      where: { prd_cd: Number(prd_cd) },
    });

    if (!existing) {
      // ================================
      //   CREATE NEW PRODUCT
      // ================================
      const created = await prisma.prods_Mod.create({
        data: {
          prd_cd: Number(prd_cd),
          prd_desc,
          prd_cat,
          prd_brand,
          prd_sku,
          prd_img_lnk,
          prd_qoh: 0,
          prd_re_ord: 0,
          max_rsp: 0,
          min_rsp: 0,
          tax_amt: 0,
          pur_prc: 0,
          disc_amt: 0,
          disc_pct: 0,
          max_pur_qty: 0,
          prd_stat: "A",
          disc_st_dt: yesterday(),
          disc_end_dt: yesterday(),
          exp_dt: yesterday(),
          prd_lot_ref: "",
          inp_by: gVars.gUser,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Product created successfully",
        data: created,
      });
    }

    // ================================
    //   UPDATE EXISTING PRODUCT
    // ================================
    const updated = await prisma.prods_Mod.update({
      where: { prd_cd: Number(prd_cd) },
      data: {
        prd_desc,
        prd_cat,
        prd_brand,
        prd_sku,
        prd_img_lnk,
      },
    });

    return NextResponse.json({
      success: true,
      message: "Product updated successfully",
      data: updated,
    });
  } catch (err: any) {
    console.error("Save Product Error:", err);
    return NextResponse.json(
      { success: false, error: "Server error", details: err.message },
      { status: 500 }
    );
  }
}
