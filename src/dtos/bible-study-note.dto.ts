export type BibleStudyNote = {
    id: string;
    user_id: string | null;
    book: string;
    chapter: number;
    verses: string;
    study_categories: Array<string>;
    title: string;
    notes: string;
    study_date: Date;
}

export type UpdateBibleStudyNote = {
    username?: string;
    book?: string;
    chapter?: number;
    verses?: string;
    study_categories?: Array<string>;
    title?: string;
    notes?: string;
    study_date?: Date | string;
    created_at?: Date;
}