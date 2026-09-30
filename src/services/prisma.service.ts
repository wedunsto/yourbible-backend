import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";

// Shared Prisma client so every service reuses a single connection pool

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });

/**
 * Application-wide Prisma client instance.
 * Import this instead of creating a new PrismaClient in each service.
 */
export const prisma = new PrismaClient({ adapter });
