
import prisma from "../../lib/prisma";

export async function GET() {
  const rows = await prisma.$queryRaw`SELECT 1`;
  return Response.json(rows);
}