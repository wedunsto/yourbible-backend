import { RegisterResponse } from "../dtos/register-response.dto";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { AccountStatus } from "../dtos/account-status.enum";

const bcrypt = require('bcrypt');
const saltRounds = 10;
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL});
const prisma = new PrismaClient({ adapter });

export const userExists = async (username: string): Promise<boolean> => {
    const result = await prisma.users.findUnique({
        where: {
            username: username
        }
    });

    return result !== null;
}

export const registerUser = async (username: string, password: string): Promise<RegisterResponse> => {
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    await prisma.users.create({
        data: {
            username: username,
            password: hashedPassword
        }
    });

    const response: RegisterResponse = {
        username,
        accountStatus: AccountStatus.NEW
    }

    return response;
}