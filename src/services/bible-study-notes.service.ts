import { PrismaPg } from "@prisma/adapter-pg";
import { BibleStudyNote, UpdateBibleStudyNote } from "../dtos/bible-study-note.dto";
import { PrismaClient } from "../generated/prisma/client";

// Business logic for creating, reading, updating, and deleting Bible study notes

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

export const createBibleStudyNote = async (bibleStudyNote: BibleStudyNote) => {

    if(!bibleStudyNote.created_at){
        bibleStudyNote.created_at = new Date();
    }

    await prisma.bible_study_notes.create({
        data: bibleStudyNote
    });

    // Return the Bible study note
    return bibleStudyNote;
}

export const readBibleStudyNote = async (note_id: string): Promise<BibleStudyNote | null> => {
    const bibleStudyNote = await prisma.bible_study_notes.findFirst({
        where: {
            id: note_id
        }
    });
    
    return bibleStudyNote;
}

export const readBibleStudyNotes = async (username: string): Promise<Array<BibleStudyNote> | null> => {
    const bibleStudyNotes = await prisma.bible_study_notes.findMany({
        where: {
            username: username
        }
    });

    return bibleStudyNotes;
}

export const updateBibleStudyNote = async (id: string, changes: UpdateBibleStudyNote): Promise<BibleStudyNote> => {
    const bibleStudyNote = await prisma.bible_study_notes.update({
        where: { id },
        data: { ...changes }
    });

    return bibleStudyNote;
}

export const removeBibleStudyNote = async (id: string): Promise<strubg> => {
    const bibleStudyNote = await prisma.bible_study_notes.delete({
        where: { id }
    });

    return bibleStudyNote.id;
}