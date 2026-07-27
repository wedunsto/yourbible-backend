import { PrismaPg } from "@prisma/adapter-pg";
import { BibleStudyNote } from "../dtos/bible-study-note.dto";
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

export const readBibleStudyNote = async (user_id: bigint, note_id: bigint): Promise<BibleStudyNote | null> => {
    const bibleStudyNote = await prisma.bible_study_notes.findFirst({
        where: {
            user_id: user_id,
            id: note_id
        }
    });
    
    return bibleStudyNote;
}

export const readBibleStudyNotes = async (user_id: bigint): Promise<Array<BibleStudyNote> | null> => {
    const bibleStudyNotes = await prisma.bible_study_notes.findMany({
        where: {
            user_id: user_id
        }
    });

    return bibleStudyNotes;
}