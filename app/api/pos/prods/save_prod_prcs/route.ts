import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from '@prisma/client';

export async function PUT(req: Request) {
  try {
    const { prd_cd, pur_prc, min_rsp, max_rsp, tax_pct } = await req.json();

    console.log(req.formData);
console.log(max_rsp);
console.log(min_rsp);

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
        ...(pur_prc !== undefined && { pur_prc: Number(pur_prc) }),
        ...(max_rsp !== undefined && { max_rsp: Number(max_rsp) }),
        ...(min_rsp !== undefined && { min_rsp: Number(min_rsp) }),
        ...(tax_pct !== undefined && { tax_pct: Number(tax_pct) }),
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
