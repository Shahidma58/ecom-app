import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req) {
  try {
    const body = await req.json();
    const posts = body;
console.log(posts);
    // if (!Array.isArray(posts) || posts.length === 0) {
    //   return NextResponse.json(
    //     { success: false, message: "Posts array is required" },
    //     { status: 400 }
    //   );
    // }

    // Insert multiple records using createMany
    const result = await prisma.posts_Mod.createMany({
      data: body,
      skipDuplicates: true, // optional: avoids error on duplicate post_id
    });

    return NextResponse.json(
      { success: true, message: "Posts inserted successfully", count: result.count },
      { status: 201 }
    );
  } catch (err) {
    console.error("Error inserting posts:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}
