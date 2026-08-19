/**
 * Objective: Call the Anthropic API to create Bible verse recommendation
 * based on the category provided
 */

import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";
import { bibleBookNames } from "../dtos/bible-book-names.enum";

const { createBibleClient } = require('@americanbible/api-bible-sdk')

type conversationMessage = {
    "role": "user" | "assistant" | "system",
    "content": string
}

// Structured recommendation returned by the record_bible_verse_recommendation tool
export type BibleVerseRecommendationResult = {
    book: string;
    chapter: number;
    verse: number;
}

// Client used to generate Bible verse recommendations
const client = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'],
});

// Client used to get the Bible verse 
const bibleClient = createBibleClient({
    apiKey: process.env['API_BIBLE_API_KEY'],
})

// System prompt customizes how Claude responds to user input
const systemPrompt = "You are a thoughtful, pastoral theologian whose sole task is to recommend Bible verses based on a user's Bible study categories.";

// Forces Claude to return the recommendation as structured input instead of free-form text
const bibleVerseRecommendationTool: Anthropic.Tool = {
    name: "record_bible_verse_recommendation",
    description: "Record the recommended Bible verse's book, chapter, and verse.",
    input_schema: {
        type: "object",
        properties: {
            book: { type: "string", description: "The Bible book name" },
            chapter: { type: "integer", description: "The chapter number" },
            verse: { type: "integer", description: "The verse number" }
        },
        required: ["book", "chapter", "verse"]
    }
};

//Prompt engineering rules for generating Bible verse recommendations
const bibleVersePromptRules = "Rules:\
- Return only valid JSON\
- Only return the Bible verse Book name, Chapter number, and Verse number\
- Do not use markdown\
- Do not include comments\
- Do not include explanations\
- After the plain text, write END_OF_COMMANDS";

// Stop sequence tells the model when to stop generating text
const stopSequence = "END_OF_COMMANDS"

// persist each user's conversation history separately so concurrent requests don't cross-contaminate
const conversationHistoryByUser = new Map<string, conversationMessage[]>();

const getConversationHistory = (username: string): conversationMessage[] => {
    if (!conversationHistoryByUser.has(username)) {
        conversationHistoryByUser.set(username, []);
    }
    return conversationHistoryByUser.get(username)!;
}

export const addUserMessage = (username: string, userMessage: string) => {
    const extendedUserMessage = `${userMessage}

    ${bibleVersePromptRules}`;
    getConversationHistory(username).push(
        {
            "role": "user",
            "content": extendedUserMessage
        }
    );
}

export const addAssistantMessage = (username: string, assistantMessage: string) => {
    getConversationHistory(username).push({
        "role": "assistant",
        "content": assistantMessage
    });
}

export const claudeBibleVerseRecommendation = async (username: string): Promise<BibleVerseRecommendationResult> => {
    const message = await client.messages.create({
        model: "claude-sonnet-5",
        max_tokens: 1024,
        messages: getConversationHistory(username),
        system: systemPrompt,
        stop_sequences: [stopSequence],
        tools: [bibleVerseRecommendationTool],
        tool_choice: { type: "tool", name: bibleVerseRecommendationTool.name }
    });

    const toolUseBlock = message.content.find(
        (block): block is Anthropic.ToolUseBlock => block.type === "tool_use"
    );

    if (!toolUseBlock) {
        throw new Error("Claude did not return a Bible verse recommendation");
    }

    const recommendation = toolUseBlock.input as BibleVerseRecommendationResult;

    addAssistantMessage(username, JSON.stringify(recommendation));

    return recommendation;
};

// Build a lookup map once, keyed by lowercase name for case-insensitive matching
const bookNameToCode = new Map<string, string>(
  bibleBookNames.map((book) => [book.name.toLowerCase(), book.code])
);

const getBookCode = (name: string): string | undefined => {
  return bookNameToCode.get(name.trim().toLowerCase());
}

const cleanVerseText = (html: string): string => {
    return html
        // Remove the verse-number span entirely (e.g. <span data-number="4" ...>4</span>)
        .replace(/<span[^>]*class="v"[^>]*>.*?<\/span>/g, '')
        // Strip any remaining HTML tags (<p>, </p>, etc.)
        .replace(/<[^>]+>/g, '')
        // Collapse extra whitespace and trim
        .replace(/\s+/g, ' ')
        .trim();
}

export const getBibleVerse = async (bibleVerse: BibleVerseRecommendationResult): Promise<string> => {
    const bookCode = getBookCode(bibleVerse.book);
    const { data: passage } = await bibleClient.passages.get(
        '78a9f6124f344018-01',
        `${bookCode}.${bibleVerse.chapter}.${bibleVerse.verse}`
    )

    return cleanVerseText(passage.content);
}