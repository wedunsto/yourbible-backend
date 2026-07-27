import { Request, Response } from "express";
import { BibleStudyNote } from "../dtos/bible-study-note.dto";
import { createBibleStudyNote, readBibleStudyNote, readBibleStudyNotes } from "../services/bible-study-notes.service";

/**
 * HTTP specific translation layer
 * Used to:
 *  Parse incoming requests
 *  Call the service
 *  Return a result and HTTP response
 */

export const createBibleStudyNotes = async (req: Request, res: Response): Promise<void> => {
    const { bibleStudyNote } = req.body;

    if (!bibleStudyNote) {
        res.status(400).json({ messages: "Bible study note is required"});
        return;
    }

    try {
        const result = await createBibleStudyNote(bibleStudyNote);
        res.status(201).json(result);
    } catch(err) {
        console.log(err)
        // TODO: need better error handling
        res.status(500).json({ message: "internal server error" });
    }
}

export const getBibleStudyNote = async (req: Request, res: Response): Promise<void> => {
    const { noteId } = req.query;

    if (!noteId) {
        res.status(400).json({ messages: "Note id is required"});
        return;
    }

    if(typeof(noteId) !== "string") {
        res.status(400).json({ messages: "Note id must be a string"});
        return;
    }

    try {
        const result = await readBibleStudyNote(BigInt(noteId));
        res.status(200).json(result);
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: err });
    }
}

export const getBibleStudyNotes = async (req: Request, res: Response): Promise<void> => {
    const { userId } = req.query;

    if (!userId) {
        res.status(400).json({ messages: "User id is required"});
        return;
    }

    if(typeof(userId) !== "string") {
        res.status(400).json({ messages: "User id must be a string"});
        return;
    }

    try {
        const result = await readBibleStudyNotes(BigInt(userId));
        res.status(200).json(result);
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "internal server error" });
    }
}