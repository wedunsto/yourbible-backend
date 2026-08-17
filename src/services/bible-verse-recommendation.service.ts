import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { addUserMessage, claudeBibleVerseRecommendation } from "../middleware/bible-verse-recommendation.middleware";

// Business logic for gating and generating Bible verse recommendations

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DAILY_REQUEST_LIMIT = 10;

// Determine whether a user is allowed to request another recommendation today
export const recommendationRequestAllowed = async (username: string): Promise<boolean> => {
    const user = await prisma.users.findUnique({
        where: { username }
    });

    if (!user) {
        return false;
    }

    if ((user.recommendation_requests ?? 0) < DAILY_REQUEST_LIMIT) {
        return true;
    }

    if (!user.last_recommendation_request) {
        return true;
    }

    const today = new Date();
    const lastRequest = user.last_recommendation_request;

    const isSameDay = lastRequest.getUTCFullYear() === today.getUTCFullYear()
        && lastRequest.getUTCMonth() === today.getUTCMonth()
        && lastRequest.getUTCDate() === today.getUTCDate();

    // Limit reached: only allow again once the last request wasn't today
    return !isSameDay;
}

// Randomly select a category to recommend a verse from
export const recommendationCategory = (categories: string[]): string => {
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
}


// Generate a Bible verse based on the selected category
export const bibleVerseRecommendation = (username: string, category: string) => {
    const prompt = `
    Given the Bible study category: ${category}, provide one Bible verse that matches that category.

    Here is an example category with an ideal response
    <sample_category>
    courage
    </sample_category>

    <ideal_output>
    {
        "book": "Joshuah",
        "chapter": 1,
        "verse": "9"
    }
    </ideal_output>
    `

    addUserMessage(username, prompt);

    return claudeBibleVerseRecommendation(username);
}