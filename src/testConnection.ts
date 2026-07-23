// src/testConnection.ts
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

async function main() {
  const users = await prisma.users.findMany();
  console.log('Connected! Users:', users);
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());