import { Router } from "express";
import { createCategory, deleteCategory, getCategory, listCategories, renameCategory } from "../controllers/bible-study-categories.controller";

/**
 * Define the:
 *  Routes
 *  HTTP request types
 *  Controllers called
 */
export const bibleStudyCategoriesRouter = Router();

bibleStudyCategoriesRouter.post("/", createCategory);
bibleStudyCategoriesRouter.get("/", listCategories);
bibleStudyCategoriesRouter.get("/:id", getCategory);
bibleStudyCategoriesRouter.patch("/:id", renameCategory);
bibleStudyCategoriesRouter.delete("/:id", deleteCategory);
