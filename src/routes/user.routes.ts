import { Router } from "express";
import { register, login, existingUser } from "../controllers/user.controller";
/**
 * Define the:
 *  Routes
 *  HTTP request types
 *  Controllers called
 */
export const userRouter = Router();

userRouter.get("/userExists", existingUser)
userRouter.post("/register", register);
userRouter.post("/login", login);