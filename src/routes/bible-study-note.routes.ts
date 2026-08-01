import { Router } from "express";
import { deleteBibleStudyNote, getBibleStudyNote, patchBibleStudyNote } from "../controllers/bible-study-notes.controller";

export const bibleStudyNoteRouter = Router();

bibleStudyNoteRouter.get("/", getBibleStudyNote);
bibleStudyNoteRouter.patch("/", patchBibleStudyNote);
bibleStudyNoteRouter.delete("/", deleteBibleStudyNote);