import { Request, Response } from "express";
import { registerUser, loginUser, userExists } from "../services/user.service";
import { Prisma } from "../generated/prisma/client";

/**
 * HTTP specific translation layer
 * Used to:
 *  Parse incoming requests
 *  Call the service
 *  Return an result and HTTP response
 */

export const existingUser = async (req: Request, res: Response): Promise<void> => {
    const { username } = req.params;

    if (!username || typeof username !== "string") {
        res.status(400).json({ message: "username is required" });
        return;
    }

    try {
        const result = await userExists(username);

        // User doesnt exist: Route to registration page
        if (result) {
            res.status(200).json("/login");
            return;
        }

        // User does exist: Route to login page
        res.status(200).json("/register");
    } catch (err) {
        res.status(500).json({ message: "internal server error" });
    }
}

export const register = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
        res.status(400).json({ message: "username and password are required" });
        return;
    }

    try {
        const result = await registerUser(username, password);
        res.status(201).json(result);
    } catch (err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2002") {
            res.status(409).json({ message: "username already taken" });
            return;
        }
        res.status(500).json({ message: "internal server error" });
    }
}

export const login = async (req: Request, res: Response): Promise<void> => {
    const { username, password } = req.body;

    if (!username || !password || typeof username !== "string" || typeof password !== "string") {
        res.status(400).json({ message: "username and password are required" });
        return;
    }

    try {
        const result = await loginUser(username, password);

        if (result === null) {
            res.status(401).json({ message: "invalid username or password" });
            return;
        }

        res.status(200).json(result);
    } catch (err) {
        res.status(500).json({ message: "internal server error" });
    }
}
