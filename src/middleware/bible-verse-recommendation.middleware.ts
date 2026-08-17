/**
 * Objective: Call the Anthropic API to create Bible verse recommendation
 * based on the category provided
 */

import Anthropic from "@anthropic-ai/sdk";
import "dotenv/config";

type conversationMessage = {
    "role": "user" | "assistant" | "system",
    "content": string
}

// Structured recommendation returned by the record_bible_verse_recommendation tool
export type BibleVerseRecommendationResult = {
    book: string;
    chapter: number;
    verse: string;
}

// Client used to generate Bible verse recommendations
const client = new Anthropic({
    apiKey: process.env['ANTHROPIC_API_KEY'],
});

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