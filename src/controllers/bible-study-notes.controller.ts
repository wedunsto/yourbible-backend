import { Request, Response } from "express";
import { createBibleStudyNote, readBibleStudyNote, readBibleStudyNotes, removeBibleStudyNote, updateBibleStudyNote } from "../services/bible-study-notes.service";
import { Prisma } from "../generated/prisma/client";

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
    const { username } = req.query;

    if (!username) {
        res.status(400).json({ messages: "User id is required"});
        return;
    }

    if(typeof(username) !== "string") {
        res.status(400).json({ messages: "User id must be a string"});
        return;
    }

    try {
        const result = await readBibleStudyNotes(username);
        res.status(200).json(result);
    } catch(err) {
        console.log(err)
        res.status(500).json({ message: "internal server error" });
    }
}

export const patchBibleStudyNote = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.query;
    const changes = req.body;

    if (!id) {
        res.status(400).json({ messages: "Note id is required"});
        return;
    }

    if (typeof(id) !== "string") {
        res.status(400).json({ messages: "Note id must be a string"});
        return;
    }

    try {
        const result = await updateBibleStudyNote(BigInt(id), changes);
        res.status(200).json(result);
    } catch(err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).json({ message: "Bible study note not found" });
            return;
        }
        console.log(err)
        res.status(500).json({ message: "internal server error" });
    }
}

export const deleteBibleStudyNote = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.query;

    if (!id) {
        res.status(400).json({ messages: "Note id is required"});
        return;
    }

    if (typeof(id) !== "string") {
        res.status(400).json({ messages: "Note id must be a string"});
        return;
    }

    try {
        const result = await removeBibleStudyNote(id);
        res.status(200).json(result);
    } catch(err) {
        if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === "P2025") {
            res.status(404).json({ message: "Bible study note not found" });
            return;
        }
        console.log(err)
        res.status(500).json({ message: "internal server error" });
    }
}