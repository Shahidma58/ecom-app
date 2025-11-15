import { NextRequest, NextResponse } from "next/server";
//import { PrismaClient } from "@prisma/client";
import { prisma } from "@/lib/prisma";
//import { number } from "yup";

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ prod_cd: string }> }
) {
  try {
    const { prod_cd } = await context.params; 
    const prd_cod = Number(prod_cd);
    // Validate
    if (!prd_cod) {
      return NextResponse.json(
        { error: "G/L parameter is required" },
        { status: 400 }
      );
    }

//    const accountNo = wac_no;
    if (isNaN(prd_cod)) {
      return NextResponse.json(
        { error: "GL Code must be a valid number" },
        { status: 400 }
      );
    }

    // Prisma query
    const glRec = await prisma.prods_Mod.findFirst({
      where: {
        prd_cd: prd_cod,
//        prd_stat: "Active",
      },
      select: {
        prd_desc: true,
        pur_prc: true,
        min_rsp: true,
        max_rsp: true,
        tax_amt: true,
      },
      // include: {
      //   gen_ledg: {
      //     select: { gl_desc: true },
      //   }
      // },

    });

    if (!glRec) {
      return NextResponse.json(
        { error: "Product not found or inactive" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: glRec });
  } catch (error) {
    console.error("Error fetching Product:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch Product",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
