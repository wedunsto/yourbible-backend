/**
 * Central listener that receives client requests, processes data, and sends back responses
 */
import "dotenv/config";
import cors from "cors";
import express from "express";
import { userRouter } from "./src/routes/user.routes";
import { bibleStudyNoteRouter } from "./src/routes/bible-study-note.routes.ts";
import { bibleStudyNotesRouter } from "./src/routes/bible-study-notes.routes.ts";
import { bibleVerseRecommendationRouter } from "./src/routes/bible-verse-recommendation.routes.ts";
import { allowedOrigins } from "./src/middleware/cors.middleware.ts";

// Prisma returns bigint for BIGINT columns, but JSON.stringify can't serialize bigint natively
(BigInt.prototype as any).toJSON = function (): string {
    return this.toString();
};

// Create web server, build RESTful APIs, handle the backend request-response cycles
const app = express();
const PORT = process.env.SERVER_PORT;

// Tell the browser which origins are permitted
app.use(cors({
    origin: allowedOrigins, credentials: true
}));

// Parse incoming JSON requests
app.use(express.json());

// Access authentication and authorization routes
app.use("/yourbible/users", userRouter);

// Access Bible study notes routes
app.use("/yourbible/notes", bibleStudyNotesRouter);

// Access Bible study note routes
app.use("/yourbible/note", bibleStudyNoteRouter)

// Access Bible verse recommendation routes
app.use("/yourbible/recommend", bibleVerseRecommendationRouter);

// Test route
app.get('/api/health', (req, res) => {
    res.json({
        status: "Server is running perfectly!"
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});