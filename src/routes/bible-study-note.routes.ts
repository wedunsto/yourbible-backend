import { Router } from "express";
import { getBibleStudyNote } from "../controllers/bible-study-notes.controller";

export const bibleStudyNoteRouter = Router();

bibleStudyNoteRouter.get("/", getBibleStudyNote);