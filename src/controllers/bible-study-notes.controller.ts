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
    const { user_id, note_id } = req.query;

    if (!user_id || !note_id) {
        res.status(400).json({ messages: "User id and note id are required"});
        return;
    }

    if(typeof(user_id) !== "string" || typeof(note_id) !== "string") {
        res.status(400).json({ messages: "User id and note id must be strings"});
        return;
    }

    try {
        const result = await readBibleStudyNote(BigInt(user_id), BigInt(note_id));
        res.status(200).json(result);
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "internal server error" });
    }
}

export const getBibleStudyNotes = async (req: Request, res: Response): Promise<void> => {
    const { user_id } = req.query;

    if (!user_id) {
        res.status(400).json({ messages: "User id is required"});
        return;
    }

    if(typeof(user_id) !== "string") {
        res.status(400).json({ messages: "User id must be a string"});
        return;
    }

    try {
        const result = await readBibleStudyNotes(BigInt(user_id));
        res.status(200).json(result);
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "internal server error" });
    }
}