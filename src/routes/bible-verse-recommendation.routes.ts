import { Router } from "express";
import { createBibleRecommendation } from "../controllers/bible-verse-recommendation.controller";

export const bibleVerseRecommendationRouter = Router();

bibleVerseRecommendationRouter.post("/", createBibleRecommendation);
