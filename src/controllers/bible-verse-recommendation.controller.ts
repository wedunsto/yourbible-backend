import { Request, Response } from "express";
import { recommendationRequestAllowed, recommendationCategory, bibleVerseRecommendation } from "../services/bible-verse-recommendation.service";
import { getBibleVerse } from "../middleware/bible-verse-recommendation.middleware";

/**
 * HTTP specific translation layer
 * Used to:
 *  Parse incoming requests
 *  Call the service
 *  Return a result and HTTP response
 */

export const createBibleRecommendation = async (req: Request, res: Response): Promise<void> => {
    const { username, categories } = req.body;

    if (!username || typeof username !== "string") {
        res.status(400).json({ message: "username is required" });
        return;
    }

    if (!Array.isArray(categories) || categories.length === 0) {
        res.status(400).json({ message: "categories is required" });
        return;
    }

    try {
        const allowed = await recommendationRequestAllowed(username);

        if (!allowed) {
            res.status(429).json({ message: "recommendation request limit reached" });
            return;
        }

        const category = recommendationCategory(categories);

        const bibleVerse = await bibleVerseRecommendation(username, category);

        const bibleVerseText = await getBibleVerse(bibleVerse);

        res.status(200).json({
            category,
            bibleVerse,
            bibleVerseText
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({ message: "internal server error" });
    }
}
