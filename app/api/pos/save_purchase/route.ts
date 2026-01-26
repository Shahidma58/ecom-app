import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { withAuth } from "@/app/lib/authMiddleware";
import { getNextTranSeq } from "@/app/lib/get_next_Trseq";

interface purch_Tots {
  brn_cd: number;
  pur_dt: Date | string;
  vnd_id: number;
  tot_itms: number;
  tot_qty: number;
  tot_amt: number;
  amt_paid: number;
  amt_cr: number;
  inp_by: string;
}

interface purch_Itms {
  prd_cd: number;
  itm_cd: string;
  itm_desc: string;
  itm_rsp: number;
  itm_qty: number;
  itm_disc: number;
  itm_prc: number;
  itm_tot_amt: number;
  itm_tax?: number;
}

interface RequestBody {
  purTots: purch_Tots;
  purchaseItms: purch_Itms[];
}

let isReturn = false;

const cleanString = (val?: string | null) =>
  val ? val.replace(/\u0000/g, "").trim() : "";

export const POST = withAuth(async (req) => {
  try {
    console.log("=== API STARTED ===");

    const user = req.user;
    if (!user?.branch_code) {
      return NextResponse.json(
        { success: false, message: "Branch not assigned to user" },
        { status: 401 },
      );
    }

    const brn_cd = user.branch_code;

    /* -------- TRAN DATE YYMMDD -------- */
    const now = new Date();
    const trn_dt = Number(
      `${now.getFullYear() % 100}${String(now.getMonth() + 1).padStart(2, "0")}${String(
        now.getDate(),
      ).padStart(2, "0")}`,
    );

    /* -------- SEQUENCE -------- */
    const trn_seq = await getNextTranSeq(brn_cd, trn_dt);

    console.log("seq: ", trn_seq);

    /* -------- PARSE BODY -------- */
    const body: RequestBody = await req.json();
    console.log("Request body:", JSON.stringify(body, null, 2));
    const { purTots, purchaseItms = [] } = body;
    console.log("BODY:", body);

    if (!purTots || !purTots.vnd_id) {
      return NextResponse.json(
        { success: false, message: "Missing required purchase fields" },
        { status: 400 },
      );
    }

    /* -------- PUR ID -------- */
    const pur_id = String(trn_seq);
    console.log("Generated pur_id:", pur_id);

    console.log("pur_id:", JSON.stringify(cleanString(pur_id)));
    console.log("inp_by:", JSON.stringify(cleanString(purTots.inp_by)));

    /* -------- TRANSACTION -------- */
    const result = await prisma.$transaction(async (tx: any) => {
      /* ===== HEADER ===== */
      const batch = await tx.purch_batch_Mod.create({
        data: {
          pur_id: cleanString(pur_id),
          brn_cd: brn_cd,
          pur_dt: new Date(purTots.pur_dt),
          vnd_id: String(purTots.vnd_id), // ✅ just pass string
          tot_itms: purTots.tot_itms || purchaseItms.length, // ✅ number
          tot_qty: purTots.tot_qty || 0, // ✅ number
          tot_amt: new Prisma.Decimal(String(purTots.tot_amt || 0)),
          amt_paid: new Prisma.Decimal(String(purTots.amt_paid || 0)),
          amt_cr: new Prisma.Decimal(String(purTots.amt_cr || 0)),
          inp_by:
            cleanString(purTots.inp_by) ||
            cleanString(user.username) ||
            "system",
          inp_dt: new Date(),
        },
      });

      console.log("batch doen");

      /* ===== DETAILS ===== */
      if (purchaseItms.length > 0) {
        await tx.purch_detl_Mod.createMany({
          data: purchaseItms.map((item, index) => ({
            pur_id: cleanString(pur_id),
            prd_cd: cleanString(item.itm_cd), // removes any hidden non-digits
            brn_cd: new Prisma.Decimal(String(brn_cd)),
            prd_desc: cleanString(item.itm_desc),
            pur_qty: new Prisma.Decimal(
              isReturn ? -Math.abs(item.itm_qty) : item.itm_qty,
            ),
            pur_prc: new Prisma.Decimal(item.itm_prc),
            new_rsp: new Prisma.Decimal(item.itm_rsp),
            cur_rsp: new Prisma.Decimal(item.itm_rsp),
            pur_dt: new Date(purTots.pur_dt),
            itm_tot_amt: new Prisma.Decimal(item.itm_tot_amt),
            tax_amt: new Prisma.Decimal(item.itm_tax || 0),
            inp_by:
              cleanString(purTots.inp_by) ||
              cleanString(user.username) ||
              "system",
            inp_dt: new Date(),
          })),
        });
      }
      /* ===== UPDATE PRODUCT QOH ===== */
      for (const item of purchaseItms) {
        await tx.prod_info_Mod.update({
          where: {
            prd_cd_brn_cd: {
              prd_cd: new Prisma.Decimal(item.prd_cd), // ✅ correct
              brn_cd: brn_cd, // ✅ correct
            },
          },
          data: {
            prd_qoh: {
              increment: new Prisma.Decimal(
                isReturn ? -Math.abs(item.itm_qty) : item.itm_qty,
              ),
            },
            inp_by:
              cleanString(purTots.inp_by) ||
              cleanString(user.username) ||
              "system",
            inp_dt: new Date(),
          },
        });
      }

      return batch;
    });

    return NextResponse.json({
      success: true,
      message: isReturn
        ? "Purchase return saved successfully"
        : "Purchase saved successfully",
      pur_id,
      data: result,
    });
  } catch (error) {
    console.error("=== ERROR SAVING PURCHASE ===", error);

    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        return NextResponse.json(
          { success: false, message: "Duplicate purchase ID" },
          { status: 400 },
        );
      }
    }

    return NextResponse.json(
      {
        success: false,
        message: "Failed to save purchase",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  } finally {
    await prisma.$disconnect();
  }
});
