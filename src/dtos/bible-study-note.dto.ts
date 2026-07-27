export type BibleStudyNote = {
    user_id: bigint;
    book: string;
    chapter: number;
    verses: string;
    study_categories: Array<string>;
    title: string;
    notes: string;
    created_at: Date;
}