---
name: gate-recommendation-requests
description: Create the `bible-verse-recommendation.service.ts` service in `src/services/`. The recommendationRequestAllowed function takes a username string as an input, and uses prisma to find the user record. If the user record's recommendation_requests value is greater than or equal to ten, the user record's recommendation last_recommendation_request value is compared with today's date. If today's date does not match the last_recommendation_request date, allowRecommendationRequest return true. Create the recommendationCategory function in `bible-verse-recommendation.service.ts`. This function takes an array of category strings as an input, generates a random number from [0 - inputArrayLength-1], and returns the value in the array with that index. Create the `bible-verse-recommendation.controller.ts` controller in `src/controllers`. createBibleRecommendation gets a category string array and a username string from the request body and checks if allowRecommendationRequest is true. If it is, return the randomly selected category string. Create the bibleVerseRecommendation Router in `src/routes/bible-verse-recommendation.routes.ts`. Create the post("/") request using the createBibleRecommendation controller. Use the "/yourbible/recommend" route in `server.ts`, using the bibleVerseRecommendation route.
---

## Stack conventions
- Node.js / Express backend
- Prisma as the only data-access layer — no raw SQL
- Models: `prisma.bible_study_notes` and `prisma.users`
- Layering: route → controller → service (service holds the Prisma call, controller handles req/res, route wires the path)

## Pattern to follow
Match the style of the functions in `bible-study-notes.service.ts` and `bible-study-notes.controller.ts` (async/await, typed params and return values, try/catch with a logged error). Don't invent a different structure — reuse whatever's already there.

Shape of a service function (illustrative, not literal — check the actual file for exact style):

​```typescript
export const exampleRead = async (id: bigint): Promise<SomeType | null> => {
    const result = await prisma.bible_study_notes.findUnique({ where: { id } });
    return result;
}
​```

## Process
1. Create `recommendationRequestAllowed(username: string): boolean` in `bible-verse-recommendation.service.ts`
   - Call `prisma.users.findUnique({ where: { username: username} })`
   - Check if the user record's recommendation_requests are less than 10
   - If recommendation_requests is greater or equal to 10, check if the user record's last_recommendation_request and today's Date value match. If they match return true. If they do not match return false
2. Create `recommendationCategory(categories: string[]): string` in `bible-verse-recommendation.service.ts`
   - Generate a random number between 0 and the length of the categories array minus 1
   - Return the category string with the index of the random number
3. Create `createBibleRecommendation(req, res)` in `bible-verse-recommendation.controller.ts`
   - Read `username` and `categories` from the request body
   - Call `recommendationRequestAllowed` using the username
   - Call `recommendationCategory` using the categories array
   - On success, return the category string
4. Create `bibleVerseRecommendation` in `src/routes/bible-verse-recommendation.routes.ts`
   - Create the post("/") request using the createBibleRecommendation controller
5. Use the "/yourbible/recommend" route in `server.ts`, using the bibleVerseRecommendation route

## Response conventions
- Error responses use `{ message: "..." }` (singular key) — match whatever convention is already used in the codebase for existing endpoints, and use that consistently for this endpoint too.