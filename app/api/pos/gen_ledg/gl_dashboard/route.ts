import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const brn_cd = searchParams.get("brn_cd");

    const branchCode = brn_cd ? Number(brn_cd) : null;
    // Branch code to be optional - For Display all
    // if (brn_cd && isNaN(branchCode!)) {
    //   return NextResponse.json(
    //     { error: "Invalid brn_cd" },
    //     { status: 400 }
    //   );
    // }

    const data = await prisma.dash_board_gls.findMany({
      select: {
        gl_cd: true,
        db_title: true,
        gl_bals: {
          where: branchCode ? { brn_cd: branchCode } : {},
          select: {
            dd_op_bal: true,
            curr_bal: true,
            brn_cd: true,
          },
        },
      },
       orderBy: {
    gl_cd: 'asc'
  }          

    });

    // flatten + calculate difference
    const result = data.flatMap((row) =>
      row.gl_bals.map((bal) => ({
        gl_cd: row.gl_cd,
        db_title: row.db_title,
        brn_cd: bal.brn_cd,
        dd_op_bal: bal.dd_op_bal ?? 0,
        curr_bal: bal.curr_bal ?? 0,
        today_mvmnt:
          (bal.dd_op_bal.toNumber() ?? 0) - (bal.curr_bal.toNumber() ?? 0),
      }))
    );

    return NextResponse.json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Dashboard GL Summary Error:", error);
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    );
  }
}
