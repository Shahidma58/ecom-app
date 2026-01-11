// app/api/pos/get_purchase/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { withAuth } from "@/app/lib/authMiddleware";

export const GET = withAuth(async (req) => {
  try {
    const user = req.user;
    if (!user?.branch_code) {
      return NextResponse.json(
        { success: false, message: "Branch not assigned to user" },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(req.url);
    const purId = searchParams.get("pur_id");

    if (!purId) {
      return NextResponse.json(
        { success: false, message: "Purchase ID is required" },
        { status: 400 }
      );
    }

    // Fetch purchase header
    const purchaseHeader = await prisma.purch_batch.findUnique({
      where: { pur_id: new Prisma.Decimal(purId) },
    });

    if (!purchaseHeader) {
      return NextResponse.json(
        { success: false, message: "Purchase not found" },
        { status: 404 }
      );
    }

    // Fetch purchase details (line items)
    const purchaseDetails = await prisma.purch_detl.findMany({
      where: { pur_id: new Prisma.Decimal(purId) },
      orderBy: { pur_id_serl: "asc" },
    });

    // Fetch vendor information
    const vendor = await prisma.accts_Mod.findUnique({
      where: { ac_no: new Prisma.Decimal(purchaseHeader.vnd_id) },
      include: {
        generalLedger: {
          select: {
            gl_desc: true,
          },
        },
      },
    });

    // Format the response
    const formattedHeader = {
      pur_id: purchaseHeader.pur_id.toString(),
      brn_cd: purchaseHeader.brn_cd,
      vnd_id: purchaseHeader.vnd_id,
      tot_itms: purchaseHeader.tot_itms,
      tot_qty: purchaseHeader.tot_qty,
      tot_amt: purchaseHeader.tot_amt.toString(),
      amt_paid: purchaseHeader.amt_paid?.toString() || "0",
      amt_cr: purchaseHeader.amt_cr?.toString() || "0",
      inp_by: purchaseHeader.inp_by,
      inp_dt: purchaseHeader.inp_dt?.toISOString() || null,
      pur_dt: purchaseHeader.pur_dt?.toISOString() || null,
    };

    const formattedDetails = purchaseDetails.map((item) => ({
      pur_id: item.pur_id.toString(),
      pur_id_serl: item.pur_id_serl,
      prd_cd: item.prd_cd.toString(),
      prd_desc: item.prd_desc,
      pur_qty: item.pur_qty.toString(),
      pur_prc: item.pur_prc.toString(),
      new_rsp: item.new_rsp?.toString() || "0",
      cur_rsp: item.cur_rsp.toString(),
      cur_pur_prc: item.cur_pur_prc?.toString() || "0",
      itm_tot_amt: item.itm_tot_amt?.toString() || "0",
      tax_amt: item.tax_amt?.toString() || "0",
    }));

    const formattedVendor = vendor
      ? {
          ac_no: vendor.ac_no.toString(),
          ac_title: vendor.ac_title,
          ac_contact: vendor.ac_contact,
          ac_addr: vendor.ac_addr,
          ac_gl: vendor.ac_gl.toString(),
          curr_bal: vendor.curr_bal.toString(),
          generalLedger: vendor.generalLedger
            ? {
                gl_desc: vendor.generalLedger.gl_desc,
              }
            : undefined,
        }
      : null;

    return NextResponse.json({
      success: true,
      data: {
        header: formattedHeader,
        items: formattedDetails,
        vendor: formattedVendor,
      },
    });
  } catch (error) {
    console.error("Error fetching purchase:", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, message: "Purchase not found" },
          { status: 404 }
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to fetch purchase",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
});