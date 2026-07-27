import { Router } from "express";
import { createBibleStudyNotes } from "../controllers/bible-study-notes.controller";

export const bibleStudyNoteRouter = Router();

bibleStudyNoteRouter.post("/create", createBibleStudyNotes);