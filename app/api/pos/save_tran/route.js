import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { withAuth } from "@/app/lib/authMiddleware";

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
    const body = await req.json();
    const { salTots, salItms, tran_dt, isReturn } = body;

    // Normalize customer mobile (optional)
    if (salTots?.sal_mbl) {
      salTots.sal_mbl = Number(salTots.sal_mbl);
    }

    // Generate transaction ID
    const tranSeqResult = await prisma.$queryRaw`
      SELECT get_trn_seq(${tran_dt}::integer, ${BigInt(brn_cd)}::bigint, 'POS'::varchar) AS tran_id;
    `;

    if (!tranSeqResult || tranSeqResult.length === 0) {
      throw new Error("Failed to generate Transaction ID");
    }

    const wTran_id = tranSeqResult[0].tran_id.toString(); // ensure string
    salTots.sal_id = wTran_id;


    // Prepare sales batch
    salTots.sal_id = wTran_id;
    salTots.brn_cd = brn_cd;
    salTots.sal_qty = Number(salTots.sal_qty);
    salTots.sal_amt = Number(salTots.sal_amt);
    salTots.sal_disc = Number(salTots.sal_disc);
    salTots.sal_items = Number(salTots.sal_items);
    salTots.inp_by = user.username ?? "SYSTEM";

    if (isReturn) {
      salTots.sal_qty *= -1;
      salTots.sal_amt *= -1;
      salTots.sal_disc *= -1;
    }

    // Prepare sale items and remove frontend-only fields
    const dbSalItms = salItms.map((item) => {
      // Create a clean object with only database fields
      const dbItem = {
        sal_id: wTran_id,
        itm_cd: Number(item.itm_cd),
        itm_desc: item.itm_desc ?? "",
        itm_qty: Number(item.itm_qty),
        itm_rsp: Number(item.itm_rsp),
        itm_disc: Number(item.itm_disc),
        itm_tax: Number(item.itm_tax),
        itm_amt: Number(item.itm_amt),
        itm_cost: Number(item.itm_cost),
        itm_stat: item.itm_stat ?? "A",
      };

      if (isReturn) {
        dbItem.itm_qty *= -1;
        dbItem.itm_amt *= -1;
        dbItem.itm_disc *= -1;
      }

      return dbItem;
    });

    // Transaction (Atomic)
    await prisma.$transaction(async (tx) => {
      // Save batch
      await tx.sales_batch_Mod.create({
        data: salTots,
      });

      // Save items
      await tx.sales_detl_Mod.createMany({
        data: dbSalItms,
        skipDuplicates: true,
      });

      // Deduct stock from prod_info_Mod
      for (const item of dbSalItms) {
  // Lookup product code from barcode
  const prod = await tx.products_vw.findFirst({
    where: {
      brn_cd: brn_cd,
      bar_cd: item.itm_cd.toString(), // assuming itm_cd is barcode
    },
    select: { prd_cd: true, prd_qoh: true },
  });

  if (!prod) {
    continue; // skip this item
  }


  const updateResult = await tx.prod_info_Mod.updateMany({
    where: {
      prd_cd: prod.prd_cd,
      brn_cd: brn_cd,
    },
    data: {
      prd_qoh: {
        decrement: BigInt(Math.abs(item.itm_qty)),
      },
    },
  });
}
    });

    return NextResponse.json(
      {
        success: true,
        message: isReturn
          ? "Return transaction saved successfully"
          : "Transaction saved successfully",
        tran_id: wTran_id,
      },
      { status: 201 }
    );
  } catch (err) {
    console.error("POS Tran Error:", err);
    return NextResponse.json(
      {
        success: false,
        message: "Error Insert/Update POS Transaction",
        error: err.message,
      },
      { status: 500 }
    );
  }
});


export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const tran_dt = searchParams.get("tran_dt");
    const sal_id = searchParams.get("sal_id");

    // Build dynamic where clause
    const whereClause = {};
    if (tran_dt) {
      whereClause.sal_dt = new Date(Number(tran_dt)); // use sal_dt instead of tran_dt
    }
    if (sal_id) {
      whereClause.sal_id = sal_id.toString();
    }

    // Fetch sales batch
    const salTots = await prisma.sales_batch_Mod.findMany({
      where: whereClause,
      orderBy: { sal_id: "desc" },
    });

    // Fetch sales details
    const salItms = await prisma.sales_detl_Mod.findMany({
      where: sal_id ? { sal_id: sal_id.toString() } : {},
      orderBy: { sal_id: "desc" },
    });

    // Convert BigInt to number safely
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