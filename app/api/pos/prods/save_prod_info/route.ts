import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from '@prisma/client';

export async function PUT(req: Request) {
  try {
    const { prd_cd, max_pur_qty, prd_lot_ref, prd_qoh, exp_dt, prd_re_ord } = await req.json();
console.log('form data....')
console.log(prd_cd);
console.log(max_pur_qty);
console.log(prd_lot_ref);
console.log(prd_qoh);
console.log(exp_dt);
console.log(prd_re_ord);
    if (!prd_cd) {
      return NextResponse.json(
        { success: false, error: "Product code is required." },
        { status: 400 }
      );
    }
//-------------------- update branch code to be variable
    const updatedProduct = await prisma.prod_info_Mod.update({
where: { 
    prd_cd_brn_cd: {
      prd_cd: new Prisma.Decimal(prd_cd), 
      brn_cd: 100 
    }},
    data: {
        ...(max_pur_qty && { max_pur_qty: Number(max_pur_qty) }),
        ...(prd_lot_ref && { prd_lot_ref: Number(prd_lot_ref) }),
        ...(prd_re_ord && { prd_re_ord: Number(prd_re_ord) })
//        ...(prd_re_ord !== undefined && { prd_re_ord: Number(prd_re_ord) }),
//        ...(prd_qoh !== undefined && { prd_qoh: Number(prd_qoh) }),
//        ...(exp_dt !== undefined && { exp_dt: Number(exp_dt) }),
//        ...(exp_dt && { exp_dt: new Date(exp_dt) }),
      },
    });
    return NextResponse.json({ success: true, data: updatedProduct });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
