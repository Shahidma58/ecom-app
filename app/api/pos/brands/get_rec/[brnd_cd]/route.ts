import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ brnd_cd: string }> }
) {
  try {
    // Await params in Next.js 15+
    const { brnd_cd } = await params;
    console.log("Received ID:", brnd_cd);

    // Convert string to number
    const wbrnd_code = Number(brnd_cd);
    console.log("Converted brand_code:", wbrnd_code);
  
    // Validate - check if conversion resulted in valid number
    if (isNaN(wbrnd_code)) {
      return NextResponse.json(
        { error: "Invalid Brand Code - must be a number" },
        { status: 400 }
      );
    }
    
    // Prisma query
    const wRec = await prisma.brands_Mod.findFirst({
      where: {
        brand_code: wbrnd_code,
        // ac_stat: "Active",
      },
    });

    if (!wRec) {
      return NextResponse.json(
        { error: "Record not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: wRec });
    
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch record",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
  // Don't disconnect here - it causes issues in serverless environments
  // Prisma manages connections automatically
}

/*
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest,
  context: { params: { id: string } }
) {
  try {
    const { id } = context.params; 
    console.log(id);

    const wbrnd_code = id; //Number(id);
    console.log(wbrnd_code);
  
    // Validate
    if (isNaN(wbrnd_code)) {
      return NextResponse.json(
        { error: "Brand Code parameter is required" },
        { status: 400 }
      );
    }
    // Prisma query
    const wRec = await prisma.brands_Mod.findFirst({
      where: {
        brand_code: wbrnd_code,
//        ac_stat: "Active",
      },
    });

    if (!wRec) {
      return NextResponse.json(
        { error: "Record not found...." },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: wRec });
  } catch (error) {
    console.error("Error fetching record:", error);
    return NextResponse.json(
      {
        error: "Failed to fetch record",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
*/