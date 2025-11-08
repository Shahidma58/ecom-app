// lib/prisma.ts

import { PrismaClient } from '@prisma/client';

// 1. Declare a global variable for PrismaClient (for development use)
const globalForPrisma = global as unknown as { prisma: PrismaClient };

// 2. Initialize the client
export const prisma =
  globalForPrisma.prisma ||
  new PrismaClient({
//    log: ['query', 'info', 'warn', 'error'], // Optional: logs database queries
    log: ['warn', 'error'], // Optional: logs database queries
  });

// 3. Prevent hot-reloading from creating new instances in development
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;