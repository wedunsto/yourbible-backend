import { Router } from "express";
import { createBibleStudyNotes, getBibleStudyNote, getBibleStudyNotes } from "../controllers/bible-study-notes.controller";

export const bibleStudyNoteRouter = Router();

bibleStudyNoteRouter.post("/", createBibleStudyNotes);
bibleStudyNoteRouter.get("/", getBibleStudyNote);
bibleStudyNoteRouter.get("/:noteId", getBibleStudyNotes);