import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { withAuth } from "@/app/lib/authMiddleware";
//import { Pur_Batch } from "@/app/zu_store/purch_store";

interface purch_Tots {
  pur_id: string;
  brn_cd: number;
  pur_dt: Date | string; // Accept both Date and string
  vnd_id: number;
  tot_itms: number;
  tot_qty: number;
  tot_amt: number;
  amt_paid: number;
  amt_cr: number;
  inp_by: string;
  inp_dt?: Date | string; // Make optional
}
interface purch_Itms {
  itm_cd: number; // BARCODE
  itm_desc: string;
  itm_rsp: number;
  itm_qty: number;
  itm_disc: number;
  itm_net_price: number;
  itm_amt: number;
  itm_cost: number;
  itm_tax?: number;
}


interface RequestBody {
  pur_Tots: purch_Tots;
  pur_Itms: purch_Itms[];
  tran_dt?: number;
  branchCode?: number;
}

let isReturn = false;

export const POST = withAuth(async (req) => {
  try {
    console.log('=== API STARTED ===');
    
    const user = req.user;
    console.log('User:', user);
    
    if (!user?.branch_code) {
      return NextResponse.json(
        { success: false, message: "Branch not assigned to user" },
        { status: 401 }
      );
    }

    const brn_cd = user.branch_code;
    
    // Parse body with error handling
    let body: RequestBody;
    try {
      body = await req.json();
      console.log('Request body:', JSON.stringify(body, null, 2));
    } catch (parseError) {
      console.error('JSON parse error:', parseError);
      return NextResponse.json(
        { success: false, message: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const {
      pur_Tots: purch_Tots,
      pur_Itms: purch_Itms = [],
    } = body;
//=============================================
console.log("BODY:", body);
console.log("pur_Tots:", body.pur_Tots);
//==============================================

    // Validation
    // if (!pur_Tots) {
    //   console.error('Missing purTots');
    //   return NextResponse.json(
    //     { success: false, message: "Missing purchase totals data" },
    //     { status: 400 }
    //   );
    // }
// to be uncommented 
    // if (!purchaseItms || !Array.isArray(purchaseItms) || purchaseItms.length === 0) {
    //   console.error('Invalid purchaseItms:', pur_Itms);
    //   return NextResponse.json(
    //     { success: false, message: "Invalid or empty purchase items" },
    //     { status: 400 }
    //   );
    // }

    // Validate required fields in purTots
    if (!purch_Tots.pur_id || !purch_Tots.vnd_id) {
      console.error('Missing required fields in purTots');
      return NextResponse.json(
        { success: false, message: "Missing required purchase fields (pur_id, vnd_id)" },
        { status: 400 }
      );
    }

    console.log('Starting transaction...');

    const result = await prisma.$transaction(async (tx) => {
      /* ---------------- HEADER ---------------- */
      console.log('Creating purchase batch...');
      
      const purchaseBatch = await tx.purch_batch_Mod.create({
        data: {
          pur_id: purch_Tots.pur_id,
          brn_cd: user.branch_code,
          pur_dt: new Date(purch_Tots.pur_dt),
          vnd_id: purch_Tots.vnd_id,
          tot_itms: purch_Tots.tot_itms || 0,
          tot_qty: purch_Tots.tot_qty || 0,
          tot_amt: new Prisma.Decimal(purch_Tots.tot_amt || 0),
          amt_paid: new Prisma.Decimal(purch_Tots.amt_paid || 0),
          amt_cr: new Prisma.Decimal(purch_Tots.amt_cr || 0),
          inp_by: purch_Tots.inp_by || user.username || 'system',
          inp_dt: new Date(),
        },
      });

//      console.log('Purchase batch created:', purchaseBatch.pur_id);

      /* ---------------- LINE ITEMS ---------------- */
      // await tx.purch_detl_Mod.createMany({
      //   data: purch_Itms.map((item, index) => ({
      //     pur_id: purch_Tots.pur_id,
      //     pur_id_serl: index + 1,

      //     prd_cd: item.itm_cd,
      //     brn_cd: purch_Tots.brn_cd,

      //     prd_desc: item.itm_desc,

      //     pur_qty: new Prisma.Decimal(
      //       isReturn ? -Math.abs(item.itm_qty) : item.itm_qty
      //     ),

      //     pur_prc: new Prisma.Decimal(item.itm_net_price),
      //     new_rsp: new Prisma.Decimal(item.itm_rsp),

      //     cur_rsp: new Prisma.Decimal(item.itm_rsp),       // from product
      // //    cur_pur_prc: new Prisma.Decimal(item.cur_pur_prc),

      //     pur_dt: new Date(purch_Tots.pur_dt),
      //     itm_tot_amt: new Prisma.Decimal(item.itm_amt),
      //     tax_amt: item.itm_tax
      //       ? new Prisma.Decimal(item.itm_tax)
      //       : new Prisma.Decimal(0),

      //     inp_by: purch_Tots.inp_by,
      //     inp_dt: new Date(),
      //   })),
      // });

      /* ---------------- INVENTORY UPDATE ---------------- */
      // await Promise.all(
      //   purchaseItms.map(async (item) => {
      //     const product = await tx.products_vw.findFirst({
      //       where: {
      //         bar_cd: item.itm_cd.toString(),
      //         brn_cd: brn_cd,
      //       },
      //       select: { prd_cd: true },
      //     });

      //     if (!product) return;

      //     const qtyChange = isReturn
      //       ? -Math.abs(item.itm_qty)
      //       : item.itm_qty;
          // await tx.prod_info_Mod.update({
          //   where: {
          //     prd_cd_brn_cd: {
          //       prd_cd: product.prd_cd,
          //       brn_cd: brn_cd,
          //     },
          //   },
          //   data: {
          //     prd_qoh: { increment: qtyChange },
          //     pur_prc: new Prisma.Decimal(item.itm_net_price),
          //     max_rsp: new Prisma.Decimal(item.itm_rsp),
          //   },
          // });
      //   })
      // );

      /* ---------------- VENDOR BALANCE ---------------- */
      // const creditAmount = new Prisma.Decimal(purTots.amt_cr || 0);
      // if (creditAmount.greaterThan(0)) {
      //   await tx.accts_Mod.update({
      //     where: { ac_no: new Prisma.Decimal(purTots.vnd_id) },
      //     data: {
      //       curr_bal: {
      //         increment: isReturn
      //           ? creditAmount.negated().toNumber()
      //           : creditAmount.toNumber(),
      //       },
      //     },
      //   });
      // }

      return purchaseBatch;
    });

    console.log('Transaction completed successfully');

    return NextResponse.json({
      success: true,
      message: isReturn
        ? "Purchase return saved successfully"
        : "Purchase saved successfully",
      pur_id: result.pur_id,
      data: result,
    });
  } catch (error) {
    console.error("=== ERROR SAVING PURCHASE ===");
    console.error("Error details:", error);
    console.error("Error stack:", error instanceof Error ? error.stack : 'No stack');

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code);
      console.error("Prisma error meta:", error.meta);
      
      if (error.code === "P2025") {
        return NextResponse.json(
          { success: false, message: "Product not found for barcode" },
          { status: 404 }
        );
      }
      
      if (error.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "Duplicate purchase ID" },
          { status: 400 }
        );
      }
    }

    return NextResponse.json(
      { 
        success: false, 
        message: "Failed to save purchase",
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
});