// =====================================================
// 1. API - GET ALL & CREATE - app/api/prods/route.js
// =====================================================

import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

// GET - Fetch all Sub Prods with pagination and search
export async function GET(request) {
  try {
    const prd_cd = searchParams.get('prd_cd');
    
    // Build where clause
    const where = {};
    
    // Add prd_cd filter if provided
    if (prd_cd) {
      where.prd_cd = parseInt(prd_cd);
    }
    // Fetch paginated data
    const prod_data= await prisma.Prods_Mod.findMany({
      where,
      orderBy: {
        prd_cd: 'asc'
      },
      skip,
    });
    
    return NextResponse.json({
      success: true,
      data: cart_data,
    });
  } catch (error) {
    console.error('Error fetching Products:', error);
    return NextResponse.json(
      { 
        success: false,
        error: 'Failed to fetch Products',
        details: error.message 
      },
      { status: 500 }
    );
  }
}
