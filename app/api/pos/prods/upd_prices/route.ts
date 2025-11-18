import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { prd_cd, pur_prc, min_rsp, max_rsp, tax_amt } = await req.json();
console.log(req.body);
console.log(max_rsp);
console.log(min_rsp);

    if (!prd_cd) {
      return NextResponse.json(
        { success: false, error: "Product code is required." },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.prods_Mod.update({
      where: { prd_cd: Number(prd_cd) },
      data: {
        ...(pur_prc !== undefined && { pur_prc: Number(pur_prc) }),
        ...(max_rsp !== undefined && { max_rsp: Number(max_rsp) }),
        ...(min_rsp !== undefined && { min_rsp: Number(min_rsp) }),
        ...(tax_amt !== undefined && { tax_amt: Number(tax_amt) }),
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
