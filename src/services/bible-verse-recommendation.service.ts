import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { addUserMessage, BibleVerseRecommendationResult, claudeBibleVerseRecommendation } from "../middleware/bible-verse-recommendation.middleware";

// Business logic for gating and generating Bible verse recommendations

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

const DAILY_REQUEST_LIMIT = 10;

// Determine whether a user is allowed to request another recommendation today,
// and if so, record the request (atomically incrementing the daily count or
// resetting it when the last request wasn't today).
export const recommendationRequestAllowed = async (username: string): Promise<boolean> => {
    const user = await prisma.users.findUnique({
        where: { username }
    });

    if (!user) {
        return false;
    }

    const today = new Date();
    const lastRequest = user.last_recommendation_request;

    const isSameDay = !!lastRequest
        && lastRequest.getUTCFullYear() === today.getUTCFullYear()
        && lastRequest.getUTCMonth() === today.getUTCMonth()
        && lastRequest.getUTCDate() === today.getUTCDate();

    if (isSameDay && (user.recommendation_requests ?? 0) >= DAILY_REQUEST_LIMIT) {
        return false;
    }

    await prisma.users.update({
        where: { username },
        data: {
            recommendation_requests: isSameDay ? { increment: 1 } : 1,
            last_recommendation_request: today
        }
    });

    return true;
}

// Randomly select a category to recommend a verse from
export const recommendationCategory = (categories: string[]): string => {
    const randomIndex = Math.floor(Math.random() * categories.length);
    return categories[randomIndex];
}


// Generate a Bible verse based on the selected category
export const bibleVerseRecommendation = async (username: string, category: string): Promise<BibleVerseRecommendationResult> => {
    const prompt = `
    Given the Bible study category: ${category}, provide one Bible verse that matches that category.

    Check the earlier messages in this conversation for any verses you have already recommended.
    Do not recommend a book/chapter/verse you have already given, even if it is the most well-known
    verse for this category. Choose a different, biblically appropriate verse each time so that
    repeated requests for the same category yield variety.

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