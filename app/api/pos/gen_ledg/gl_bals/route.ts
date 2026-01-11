import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/**
 * GET — read record
 * URL:
 * /api/ecom/fin_tran/get_gl_account?gl_cd=1001&brn_cd=1
 */
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const gl_cd = searchParams.get("gl_code");
    const brn_cd = searchParams.get("brn_cod");

    if (!gl_cd || !brn_cd) {
      return NextResponse.json(
        { error: "gl_cd and brn_cd are required" },
        { status: 400 }
      );
    }

    const glCode = Number(gl_cd);
    const branchCode = Number(brn_cd);

    if (isNaN(glCode) || isNaN(branchCode)) {
      return NextResponse.json(
        { error: "Invalid gl_cd or brn_cd" },
        { status: 400 }
      );
    }

    const record = await prisma.gl_bals_Mod.findFirst({
      where: {
        gl_cd: glCode,
        brn_cd: branchCode,
      },
    });

    // if (!record) {
    //   return NextResponse.json(
    //     { error: "Record not found" },
    //     { status: 404 }
    //   );
    // }

    return NextResponse.json({ success: true, data: record });
  } catch (error) {
    console.error("Error fetching GL Balance:", error);
    return NextResponse.json(
      { error: "Failed to fetch GL Account" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

/**
 * POST — insert record
 * Body JSON example:
 * {
 *   "gl_cd": 1001,
 *   "brn_cd": 1,
 *   "curr_bal": 500,
 *   "yy_op_bal": 300,
 *   "inp_by": "admin"
 * }
 */
export async function POST(req: NextRequest) {
  try {
    const { gl_cd, brn_cd, curr_bal, yy_op_bal, inp_by } = await req.json();

    if (!gl_cd || !brn_cd) {
      return NextResponse.json(
        { success: false, message: "gl_cd and brn_cd are required" },
        { status: 400 }
      );
    }

    const result = await prisma.gl_bals_Mod.create({
      data: {
        gl_cd,
        brn_cd,
        curr_bal,
        yy_op_bal,
        inp_by,
      },
    });

    return NextResponse.json({ success: true, data: result });
  } catch (err: any) {
    console.error("Error saving account:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}


// import { NextRequest, NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

// export async function GET(req: NextRequest) {
//   try {
//     const { searchParams } = new URL(req.url);

//     const gl_cd = searchParams.get("gl_code");
//     const brn_cd = searchParams.get("brn_cod");

//     if (!gl_cd || !brn_cd) {
//       return NextResponse.json(
//         { error: "gl_cd and brn_cd are required" },
//         { status: 400 }
//       );
//     }

//     const glCode = parseInt(gl_cd);
//     const branchCode = parseInt(brn_cd);

//     if (isNaN(glCode) || isNaN(branchCode)) {
//       return NextResponse.json(
//         { error: "Invalid gl_cd or brn_cd" },
//         { status: 400 }
//       );
//     }

//     const record = await prisma.gl_bals_Mod.findFirst({
//       where: {
//         gl_cd: glCode,
//         brn_cd: branchCode,
//       },
//     });

//     if (!record) {
//       return NextResponse.json(
//         { error: "Record not found" },
//         { status: 404 }
//       );
//     }

//     return NextResponse.json({ success: true, data: record });
//   } catch (error) {
//     console.error("Error fetching GL Balance:", error);
//     return NextResponse.json(
//       { error: "Failed to fetch GL Account" },
//       { status: 500 }
//     );
//   } finally {
//     await prisma.$disconnect();
//   }

// async function POST(req: Request) {
//   try {
//     const data = await req.json();
//     const { gl_cd, brn_cd, curr_bal, yy_op_bal, inp_by } = data;
//     //console.log(data);
//     // if (!gl_cd) {
//     //   return NextResponse.json({ success: false, message: "GL Code is required" }, { status: 400 });
//     // }
// //    const existingAcct = await prisma.gen_Ledg_Mod.findUnique({ where: { gl_cd: Number(gl_cd) } });
//     let result;
//       result = await prisma.gl_bals_Mod.create({
//         data: {
//           gl_cd, brn_cd,curr_bal,yy_op_bal,inp_by
//         },
//       });
    
//     return NextResponse.json({ success: true, data: result });
//   } catch (err: any) {
//     console.error("Error saving account:", err);
//     return NextResponse.json({ success: false, message: err.message }, { status: 500 });
//   } finally {
//     await prisma.$disconnect();
//   }
// }
// }
