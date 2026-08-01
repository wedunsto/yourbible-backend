import { RegisterResponse } from "../dtos/register-response.dto";
import { PrismaClient } from "../generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { AccountStatus } from "../dtos/account-status.enum";
import { LoginResponse } from "../dtos/login-response.dto";

// Business log for handling authentication and authorization of users

const bcrypt = require('bcrypt');
const saltRounds = 10;
const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL});
const prisma = new PrismaClient({ adapter });

// Confirm if a user exists on the application
export const userExists = async (username: string): Promise<boolean> => {
    const result = await prisma.users.findUnique({
        where: {
            username: username
        }
    });

    return result !== null;
}

/**
 * Register a new user to the application
 * Return the username and the account status
 * Front-end will pre-populate the username in the login page
*/
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

/**
 * Authenticate an existing user in the application
 * Return the reponse code
 * Front-end will route based on the response code
 */
export const loginUser = async (username: string, password: string): Promise<LoginResponse | null> => {
    const user = await prisma.users.findUnique({
        where: {
            username: username
        }
    });
    
    if (!user) {
        return null;
    }
    
    // Validate existing user's password
    const passwordsMatch = await bcrypt.compare(password, user?.password);

    if (passwordsMatch) {
        const successfulLogin: LoginResponse = {
            username: username,
            accountStatus: user!.account_status as AccountStatus,
            accessToken: 'temp'
        }
        return successfulLogin;
    }
    else {
        return null;
    }
}