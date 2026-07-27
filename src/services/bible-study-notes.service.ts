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