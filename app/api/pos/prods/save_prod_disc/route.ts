import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from '@prisma/client';

export async function PUT(req: Request) {
  try {
    const { prd_cd, disc_amt, disc_pct, disc_st_dt, disc_end_dt } = await req.json();

    if (!prd_cd) {
      return NextResponse.json(
        { success: false, error: "Product code is required." },
        { status: 400 }
      );
    }
    
    console.log({ prd_cd, disc_amt, disc_pct });

    const updatedProduct = await prisma.prod_info_Mod.updateMany({
      where: {
        prd_cd: prd_cd, // Remove the Prisma.Decimal conversion
        brn_cd: 100,
      },
      data: {
        disc_amt: disc_amt ? new Prisma.Decimal(String(disc_amt)) : null,
        disc_pct: disc_pct ? Number(disc_pct) : null,
        // Optionally include date fields if provided
        ...(disc_st_dt && { disc_st_dt: new Date(disc_st_dt) }),
        ...(disc_end_dt && { disc_end_dt: new Date(disc_end_dt) }),
      },
    });

    return NextResponse.json({ success: true, data: updatedProduct });

  } catch (error: any) {
    console.error("Error updating product discount:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}