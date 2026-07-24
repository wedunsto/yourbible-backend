// src/testConnection.ts
import "dotenv/config";
import { PrismaClient } from "./generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { login } from "./services/user.service";

const prisma = new PrismaClient({
    adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL })
})

async function main() {
  const users = await prisma.users.findMany();
  // console.log('Connected! Users:', users);
  const loginResults = await login('wedunsto', 'AggiePride1030!');
  console.log(loginResults)
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());