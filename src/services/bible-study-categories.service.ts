import { bible_study_categories } from "../generated/prisma/client";
import { BibleStudyCategoryResponseDto } from "../dtos/bible-study-category.dto";
import { prisma } from "./prisma.service";

// Business logic for creating, reading, updating, and deleting Bible study note categories

/**
 * Thrown when a category id does not match an existing category.
 */
export class CategoryNotFoundError extends Error {
    /**
     * @param id - The category id that could not be found
     */
    constructor(id: string) {
        super(`Bible study category ${id} not found`);
        this.name = "CategoryNotFoundError";
    }
}

/**
 * Thrown when a user already has a category with the same name (case-insensitive).
 */
export class CategoryAlreadyExistsError extends Error {
    /**
     * @param category - The duplicate category name
     */
    constructor(category: string) {
        super(`Bible study category "${category}" already exists`);
        this.name = "CategoryAlreadyExistsError";
    }
}

/**
 * Thrown when a category name is empty after trimming whitespace.
 */
export class InvalidCategoryNameError extends Error {
    /**
     * Builds the error with a fixed message.
     */
    constructor() {
        super("Bible study category name cannot be empty");
        this.name = "InvalidCategoryNameError";
    }
}

/**
 * Map a database row to the API response shape.
 * @param row - The bible_study_categories row
 * @returns The category as a camelCase response DTO
 */
const toResponseDto = (row: bible_study_categories): BibleStudyCategoryResponseDto => ({
    id: row.id,
    userId: row.user_id,
    category: row.category,
    createdAt: row.created_at,
    updatedAt: row.updated_at
});

/**
 * Trim a category name and reject it if nothing is left.
 * @param category - The raw category name
 * @returns The trimmed category name
 * @throws InvalidCategoryNameError when the name is blank
 */
const normalizeCategoryName = (category: string): string => {
    const trimmed = category.trim();

    if (!trimmed) {
        throw new InvalidCategoryNameError();
    }

    return trimmed;
}

/**
 * Throw if the user already owns a category with this name, ignoring case.
 * @param userId - The owning user's id
 * @param category - The normalized category name
 * @param excludeId - A category id to ignore (the one being renamed)
 * @throws CategoryAlreadyExistsError when a duplicate exists
 */
const assertCategoryIsUnique = async (userId: string, category: string, excludeId?: string): Promise<void> => {
    const duplicate = await prisma.bible_study_categories.findFirst({
        where: {
            user_id: userId,
            category: { equals: category, mode: "insensitive" },
            ...(excludeId && { id: { not: excludeId } })
        }
    });

    if (duplicate) {
        throw new CategoryAlreadyExistsError(category);
    }
}

/**
 * Look up a category by id or throw.
 * @param id - The category id
 * @returns The category row
 * @throws CategoryNotFoundError when no category matches
 */
const findCategoryOrThrow = async (id: string): Promise<bible_study_categories> => {
    const category = await prisma.bible_study_categories.findUnique({
        where: { id }
    });

    if (!category) {
        throw new CategoryNotFoundError(id);
    }

    return category;
}

/**
 * Create a new Bible study category for a user.
 * @param userId - The owning user's id
 * @param category - The category name
 * @returns The created category
 */
export const createBibleStudyCategory = async (userId: string, category: string): Promise<BibleStudyCategoryResponseDto> => {
    const name = normalizeCategoryName(category);
    await assertCategoryIsUnique(userId, name);

    const created = await prisma.bible_study_categories.create({
        data: {
            user_id: userId,
            category: name
        }
    });

    const user = await prisma.users.findUnique({
        where: {
            id: userId
        }
    });

    if (user?.onboarded === false) {
        await prisma.users.update({
            where: { id: userId },
            data: {
                onboarded: true
            }
        })
    }

    return toResponseDto(created);
}

/**
 * Read a single Bible study category by id.
 * @param id - The category id
 * @returns The matching category
 */
export const readBibleStudyCategory = async (id: string): Promise<BibleStudyCategoryResponseDto> => {
    const category = await findCategoryOrThrow(id);
    return toResponseDto(category);
}

/**
 * Read all Bible study categories owned by a user, sorted alphabetically.
 * @param userId - The owning user's id
 * @returns The user's categories
 */
export const readBibleStudyCategories = async (userId: string): Promise<Array<BibleStudyCategoryResponseDto>> => {
    const categories = await prisma.bible_study_categories.findMany({
        where: { user_id: userId },
        orderBy: { category: "asc" }
    });

    return categories.map(toResponseDto);
}

/**
 * Rename an existing Bible study category.
 * @param id - The category id
 * @param category - The new category name
 * @returns The updated category
 */
export const updateBibleStudyCategory = async (id: string, category: string): Promise<BibleStudyCategoryResponseDto> => {
    const name = normalizeCategoryName(category);
    const existing = await findCategoryOrThrow(id);
    await assertCategoryIsUnique(existing.user_id, name, id);

    const updated = await prisma.bible_study_categories.update({
        where: { id },
        data: {
            category: name,
            updated_at: new Date()
        }
    });

    return toResponseDto(updated);
}

/**
 * Delete a Bible study category.
 * @param id - The category id
 * @returns The id of the deleted category
 */
export const removeBibleStudyCategory = async (id: string): Promise<string> => {
    await findCategoryOrThrow(id);

    const deleted = await prisma.bible_study_categories.delete({
        where: { id }
    });

    return deleted.id;
}
