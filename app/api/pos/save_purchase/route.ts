import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";
import { withAuth } from "@/app/lib/authMiddleware";

interface PurchaseItem {
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

interface PurchaseTotals {
  sal_id: number;
  sal_dt: Date;
  sal_qty: number;
  sal_amt: number;
  sal_items: number;
  sal_disc: number;
  inp_by: string;
  vendor_ac_no: string;
  vendor_name: string;
}

interface VendorData {
  ac_no: string;
  ac_title: string;
  ac_gl: string;
  ac_contact: string;
  ac_addr: string;
  curr_bal: string;
}

interface RequestBody {
  purchaseTots: PurchaseTotals;
  purchaseItms: PurchaseItem[];
  tran_dt: number;
  isReturn: boolean;
  vendor: VendorData;
  branchCode?: number;
  amountPaid?: number;
}

export const POST = withAuth(async (req) => {
  try {
    const user = req.user;
        if (!user?.branch_code) {
          return NextResponse.json(
            { success: false, message: "Branch not assigned to user" },
            { status: 401 }
          );
        }
    
    const brn_cd = user.branch_code;
    const body: RequestBody = await req.json();

    const {
      purchaseTots,
      purchaseItms,
      isReturn,
      vendor,
      amountPaid = 0,
    } = body;

    if (!purchaseTots || !purchaseItms?.length) {
      return NextResponse.json(
        { success: false, message: "Invalid purchase data" },
        { status: 400 }
      );
    }

    const purId = new Prisma.Decimal(Date.now());
    const totalAmount = new Prisma.Decimal(purchaseTots.sal_amt);
    const paidAmount = new Prisma.Decimal(amountPaid);
    const creditAmount = totalAmount.minus(paidAmount);

    const result = await prisma.$transaction(async (tx) => {
      /* ---------------- HEADER ---------------- */
      const purchaseBatch = await tx.purch_batch.create({
        data: {
          pur_id: purId,
          brn_cd: brn_cd,
          vnd_id: vendor.ac_no,
          tot_itms: purchaseTots.sal_items,
          tot_qty: purchaseTots.sal_qty,
          tot_amt: totalAmount,
          amt_paid: paidAmount,
          amt_cr: creditAmount,
          inp_by: purchaseTots.inp_by,
          inp_dt: new Date(),
          pur_dt: new Date(purchaseTots.sal_dt),
        },
      });

      /* ---------------- LINE ITEMS ---------------- */
      const purchaseDetails = await Promise.all(
        purchaseItms.map(async (item, index) => {
          /* 🔑 Resolve product via BARCODE */
          const product = await tx.products_vw.findFirst({
            where: {
              bar_cd: item.itm_cd.toString(),
              brn_cd: brn_cd,
            },
            select: {
              prd_cd: true,
              max_rsp: true,
              pur_prc: true,
            },
          });

          if (!product) {
            throw new Prisma.PrismaClientKnownRequestError(
              `Product not found for barcode ${item.itm_cd}`,
              { code: "P2025", clientVersion: "4.16.2" }
            );
          }

          return tx.purch_detl.create({
            data: {
              pur_id: purId,
              pur_id_serl: index + 1,
              prd_cd: product.prd_cd,
              brn_cd: new Prisma.Decimal(brn_cd),
              prd_desc: item.itm_desc,
              pur_qty: new Prisma.Decimal(
                isReturn ? -Math.abs(item.itm_qty) : item.itm_qty
              ),
              pur_prc: new Prisma.Decimal(item.itm_net_price),
              new_rsp: new Prisma.Decimal(item.itm_rsp),
              cur_rsp: product.max_rsp,
              cur_pur_prc: product.pur_prc,
              pur_dt: new Date(purchaseTots.sal_dt),
              itm_tot_amt: new Prisma.Decimal(item.itm_amt),
              tax_amt: item.itm_tax
                ? new Prisma.Decimal(item.itm_tax)
                : new Prisma.Decimal(0),
              inp_by: purchaseTots.inp_by,
              inp_dt: new Date(),
            },
          });
        })
      );

      /* ---------------- INVENTORY UPDATE ---------------- */
      await Promise.all(
        purchaseItms.map(async (item) => {
          const product = await tx.products_vw.findFirst({
            where: {
              bar_cd: item.itm_cd.toString(),
              brn_cd: brn_cd,
            },
            select: { prd_cd: true },
          });

          if (!product) return;

          const qtyChange = isReturn
            ? -Math.abs(item.itm_qty)
            : item.itm_qty;

          await tx.prod_info_Mod.update({
            where: {
              prd_cd: product.prd_cd,
            },
            data: {
              prd_qoh: { increment: qtyChange },
              pur_prc: new Prisma.Decimal(item.itm_net_price),
              max_rsp: new Prisma.Decimal(item.itm_rsp),
            },
          });
        })
      );

      /* ---------------- VENDOR BALANCE ---------------- */
      if (creditAmount.greaterThan(0)) {
        await tx.accts_Mod.update({
          where: { ac_no: new Prisma.Decimal(vendor.ac_no) },
          data: {
            curr_bal: {
              increment: isReturn
                ? creditAmount.negated().toNumber()
                : creditAmount.toNumber(),
            },
          },
        });
      }

      return purchaseBatch;
    });

    return NextResponse.json({
      success: true,
      message: isReturn
        ? "Purchase return saved successfully"
        : "Purchase saved successfully",
      pur_id: result.pur_id.toString(),
    });
  } catch (error) {
    console.error("Error saving purchase:", error);

    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2025"
    ) {
      return NextResponse.json(
        { success: false, message: "Product not found for barcode" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: false, message: "Failed to save purchase" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
});
