import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// POST API to insert a cart record
export async function POST(req) {
  try {
    console.log("------------- into save tran API");
    const body = await req.json();
    const { salTots, salItms, tran_dt, isReturn } = body;
    console.log("Batch Info: ", salTots, salItms, tran_dt, "Return:", isReturn);

    // Step 1: Generate new Cart ID using PostgreSQL function
    const tranSeqResult = await prisma.$queryRawUnsafe(
      `SELECT get_trn_seq(${tran_dt}, 'POS') AS tran_id;`
    );
    console.log(tranSeqResult);

    // Prisma returns an array from raw query
    let wTran_id = tranSeqResult?.[0]?.tran_id;
    if (typeof wTran_id === "bigint") {
      wTran_id = Number(wTran_id);
    }
    console.log("------------- into API");
    console.log(wTran_id);

    if (!wTran_id) {
      throw new Error("Failed to generate Transaction ID");
    }

    // Step 2: Prepare salTots with negative amounts if return
    salTots.sal_id = wTran_id;

    // Convert to proper number types
    salTots.sal_qty = Number(salTots.sal_qty);
    salTots.sal_amt = Number(salTots.sal_amt);
    salTots.sal_disc = Number(salTots.sal_disc);
    salTots.sal_items = Number(salTots.sal_items);

    if (isReturn) {
      salTots.sal_qty = Math.abs(salTots.sal_qty) * -1;
      salTots.sal_amt = Math.abs(salTots.sal_amt) * -1;
      salTots.sal_disc = Math.abs(salTots.sal_disc) * -1;
    }

    // Step 3: Save Sales Batch
    const crTran = await prisma.Sales_Batch_Mod.create({
      data: salTots,
    });

    // Step 4: Prepare salItms with negative amounts if return
    salItms.forEach((item, index) => {
      item.sal_id = wTran_id;

      // Convert string/number values to proper types
      item.itm_cd = Number(item.itm_cd);
      item.itm_rsp = Number(item.itm_rsp);
      item.itm_qty = Number(item.itm_qty);
      item.itm_disc = Number(item.itm_disc);
      item.itm_tax = Number(item.itm_tax);
      item.itm_cost = Number(item.itm_cost);
      item.itm_amt = Number(item.itm_amt);

      if (isReturn) {
        item.itm_qty = Math.abs(item.itm_qty) * -1;
        item.itm_amt = Math.abs(item.itm_amt) * -1;
        item.itm_disc = Math.abs(item.itm_disc) * -1;
      }
    });

    console.log("Sale_items: ", salItms);

    const result = await prisma.Sales_Tran_Mod.createMany({
      data: salItms,
      skipDuplicates: true,
    });

    return NextResponse.json(
      {
        success: true,
        message: `${isReturn ? "Return" : "Transaction"} inserted successfully`,
        tran_id: wTran_id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error inserting cart:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error Insert/Update POS Tran",
        error: err.message,
      },
      { status: 500 }
    );
  }
}

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tran_dt = searchParams.get("tran_dt");
    const sal_id = searchParams.get("sal_id");

    let whereClause = {};

    if (tran_dt) {
      whereClause.tran_dt = Number(tran_dt);
    }
    if (sal_id) {
      whereClause.sal_id = Number(sal_id);
    }

    const salTots = await prisma.Sales_Batch_Mod.findMany({
      where: whereClause,
      orderBy: { sal_id: "desc" },
    });

    const salItms = await prisma.Sales_Tran_Mod.findMany({
      where: whereClause,
      orderBy: { sal_id: "desc" },
    });

    const convertBigInt = (obj) =>
      JSON.parse(
        JSON.stringify(obj, (_, value) =>
          typeof value === "bigint" ? Number(value) : value
        )
      );

    const safeSalTots = convertBigInt(salTots);
    const safeSalItms = convertBigInt(salItms);

    return NextResponse.json(
      {
        success: true,
        message: "Transactions fetched successfully",
        data: { salTots: safeSalTots, salItms: safeSalItms },
      },
      { status: 200 }
    );
  } catch (err) {
    console.error("Error fetching transactions:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error fetching transactions",
        error: err.message,
      },
      { status: 500 }
    );
  }
}
