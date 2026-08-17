export type BibleStudyNote = {
    id: string;
    username: string | null;
    book: string;
    chapter: number;
    verses: string;
    study_categories: Array<string>;
    title: string;
    notes: string;
    created_at: Date;
}

export type UpdateBibleStudyNote = {
    username?: string;
    book?: string;
    chapter?: number;
    verses?: string;
    study_categories?: Array<string>;
    title?: string;
    notes?: string;
    created_at?: Date;
}