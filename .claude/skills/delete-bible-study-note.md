name: delete-bible-study-note
description: Create the associated service in bible-study-notes.service.ts, controller in bible-study-notes.controller.ts, and route in bible-study-note.ts, and wires the route into server.ts. The service deletes an existing Bible study note by id via Prisma against the PostgreSQL bible_study_notes table. The controller parses the bible-study-note id from the request query. The controller returns the bible-study-note id. This skill only writes/modifies code - it never calls the running API or mutates data directly, even if the request is phrased as an action on a specific note.

## Stack conventions
- Node.js / Express backend
- Prisma as the only data-access layer — no raw SQL
- Model: `prisma.bible_study_notes`
- Layering: route → controller → service (service holds the Prisma call, controller handles req/res, route wires the path)
- IDs are `bigint` in Prisma; convert from the string query/param before calling the service

## Pattern to follow
Match the style of the existing read functions in `bible-study-notes.service.ts` and `bible-study-notes.controller.ts` (async/await, typed params and return values, `BigInt()` conversion at the controller boundary, try/catch with a logged error). Don't invent a different structure — reuse whatever's already there.

Shape of a service function (illustrative, not literal — check the actual file for exact style):

​```typescript
export const exampleRead = async (id: bigint): Promise<SomeType | null> => {
    const result = await prisma.bible_study_notes.findUnique({ where: { id } });
    return result;
}
​```

## Process
1. Create `removeBibleStudyNote(id: bigint)` in `bible-study-notes.service.ts`:
   - Call `prisma.bible_study_notes.delete({ where: { id } })`. Delete the Bible study note with the given note id
   - Return the updated note id.
1. Create `deleteBibleStudyNote(req, res)` in `bible-study-notes.controller.ts`:
   - Read `id` from `req.query`.
   - Return 400 if `id` is missing or not a string.
   - Convert `id` with `BigInt(id)` before calling the service.
   - Call `removeBibleStudyNote`, wrapped in try/catch.
   - In the catch block: if the error is a Prisma `PrismaClientKnownRequestError` with code `P2025` (record not found), return 404. Otherwise log the error and return 500.
   - On success, return the updated note with status 200.
1. Add the route in `bible-study-notes.route.ts`: `bibleStudyNoteRouter.delete("/", deleteBibleStudyNote)`.
2. Import the router in `server.ts` and register it with `app.use(...)`, following the pattern used for the existing routers there.

## Response conventions
- Error responses use `{ message: "..." }` (singular key) — match whatever convention is already used in the codebase for existing endpoints, and use that consistently for this endpoint too.