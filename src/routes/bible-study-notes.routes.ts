import { Router } from "express";
import { createBibleStudyNotes, getBibleStudyNote, getBibleStudyNotes } from "../controllers/bible-study-notes.controller";

export const bibleStudyNotesRouter = Router();

bibleStudyNotesRouter.post("/", createBibleStudyNotes);
bibleStudyNotesRouter.get("/", getBibleStudyNotes);