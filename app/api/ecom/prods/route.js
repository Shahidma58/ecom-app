// =====================================================
// 1. API - GET ALL & CREATE - app/api/prods/route.js
// =====================================================
import { NextResponse } from "next/server";
import  prisma from "../../../lib/prisma";


// GET - Fetch all Sub Posts with pagination and search
export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Pagination parameters
    const page = parseInt(searchParams.get('page')) || 1;
    const limit = parseInt(searchParams.get('limit')) || 10;
    const skip = (page - 1) * limit;
    
    // Search parameter
    const search = searchParams.get('q') || searchParams.get('search') || '';
    
    // Filter parameter (if you want to filter by prd_cd)
    const prd_cd = searchParams.get('prd_cd');
    
    // Build where clause
    const where = {};
    
    // Add prd_cd filter if provided
    if (prd_cd) {
      where.prd_cd = parseInt(prd_cd);
    }
    
    // Add search filter if provided
    if (search) {
      where.OR = [
        { prd_desc: { contains: search, mode: 'insensitive' } },
        // Add more searchable fields here if needed
      ];
    }
    
    // Get total count for pagination
    const total = await prisma.Posts_Mod.count({ where });
    
    // Fetch paginated data
    const prod_data= await prisma.Prods_Mod.findMany({
      where,
      orderBy: {
        prd_cd: 'asc'
      },
      skip,
      take: limit
    });
    
    // Calculate pagination info
    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPrevPage = page > 1;
//    console.log(prod_data);
    return NextResponse.json({
     success: true,
      data: prod_data,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNextPage,
        hasPrevPage
     },
      count: prod_data.length
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
