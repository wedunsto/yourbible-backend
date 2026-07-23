import { RegisterResponse } from "../dtos/register-response.dto";
import { PrismaClient } from "../generated/prisma/client"
import { PrismaPg } from "@prisma/adapter-pg"

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

const generateSalt = () => {
    bcrypt.generateSalt(saltRounds, (err, salt) => {
        if (err) {
            return;
        }
    })
}

export const registerUser = async (username: string, password: string): RegisterResponse => {
    let hashedPassword = "";
    bcrypt.hash(password, saltRounds, (err, hash) => {
        if (err) {
            return;
        }

        hashedPassword = hash;
    });

    await prisma.users.create({
        username: username,
        password: hashedPassword
    })
}