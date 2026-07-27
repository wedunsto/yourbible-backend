import { Request, Response } from "express";
import { BibleStudyNote } from "../dtos/bible-study-note.dto";
import { createBibleStudyNote } from "../services/bible-study-notes.service";

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