import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    const { prd_cd, max_rsp, pur_prc } = await req.json();

    if (!prd_cd) {
      return NextResponse.json(
        { success: false, error: "Product code is required." },
        { status: 400 }
      );
    }

    const updatedProduct = await prisma.prods_Mod.update({
      where: { prd_cd: Number(prd_cd) },
      data: {
        ...(max_rsp !== undefined && { max_rsp: Number(max_rsp) }),
        ...(pur_prc !== undefined && { pur_prc: Number(pur_prc) }),
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
