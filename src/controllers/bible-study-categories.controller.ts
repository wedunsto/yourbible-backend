import { Request, Response } from "express";
import { authenticateRequest } from "./authenticate-request";
import {
    CategoryAlreadyExistsError,
    CategoryNotFoundError,
    InvalidCategoryNameError,
    createBibleStudyCategory,
    readBibleStudyCategories,
    readBibleStudyCategory,
    removeBibleStudyCategory,
    updateBibleStudyCategory
} from "../services/bible-study-categories.service";
import { ErrorResponseDto } from "../dtos/error.dto";

/**
 * HTTP specific translation layer
 * Used to:
 *  Parse incoming requests
 *  Call the service
 *  Return a result and HTTP response
 */

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/**
 * Check whether a value is a UUID string.
 * @param value - The value to check
 * @returns True when the value is a well-formed UUID
 */
const isUuid = (value: unknown): value is string =>
    typeof value === "string" && UUID_PATTERN.test(value);

/**
 * Check whether a value is a non-blank string.
 * @param value - The value to check
 * @returns True when the value is a string with non-whitespace content
 */
const isNonBlankString = (value: unknown): value is string =>
    typeof value === "string" && value.trim().length > 0;

/**
 * Send an error response using the shared ErrorResponseDto shape.
 * @param res - The Express response
 * @param statusCode - The HTTP status code
 * @param name - A short error name
 * @param message - A client-safe error message
 */
const sendError = (res: Response, statusCode: number, name: string, message: string): void => {
    const body: ErrorResponseDto = { statusCode, name, message };
    res.status(statusCode).json(body);
}

/**
 * Map a thrown error to an HTTP error response.
 * Known domain errors get specific status codes; anything else is a generic 500.
 * @param res - The Express response
 * @param err - The caught error
 */
const handleServiceError = (res: Response, err: unknown): void => {
    if (err instanceof CategoryNotFoundError) {
        sendError(res, 404, err.name, err.message);
        return;
    }

    if (err instanceof CategoryAlreadyExistsError) {
        sendError(res, 409, err.name, err.message);
        return;
    }

    if (err instanceof InvalidCategoryNameError) {
        sendError(res, 400, err.name, err.message);
        return;
    }

    console.log(err);
    sendError(res, 500, "InternalServerError", "internal server error");
}

/**
 * POST / — create a category for a user.
 * Body: { userId, category }
 */
export const createCategory = async (req: Request, res: Response): Promise<void> => {
    if (!authenticateRequest(req, res)) {
        return;
    }

    const { userId, category } = req.body ?? {};

    if (!isUuid(userId)) {
        sendError(res, 400, "ValidationError", "A valid userId is required");
        return;
    }

    if (!isNonBlankString(category)) {
        sendError(res, 400, "ValidationError", "category is required");
        return;
    }

    try {
        const result = await createBibleStudyCategory(userId, category);
        res.status(201).json(result);
    } catch (err) {
        handleServiceError(res, err);
    }
}

/**
 * GET /?userId= — list all categories for a user.
 */
export const listCategories = async (req: Request, res: Response): Promise<void> => {
    if (!authenticateRequest(req, res)) {
        return;
    }

    const { userId } = req.query;

    if (!isUuid(userId)) {
        sendError(res, 400, "ValidationError", "A valid userId is required");
        return;
    }

    try {
        const result = await readBibleStudyCategories(userId);
        res.status(200).json(result);
    } catch (err) {
        handleServiceError(res, err);
    }
}

/**
 * GET /:id — read a single category.
 */
export const getCategory = async (req: Request, res: Response): Promise<void> => {
    if (!authenticateRequest(req, res)) {
        return;
    }

    const { id } = req.params;

    if (!isUuid(id)) {
        sendError(res, 400, "ValidationError", "A valid category id is required");
        return;
    }

    try {
        const result = await readBibleStudyCategory(id);
        res.status(200).json(result);
    } catch (err) {
        handleServiceError(res, err);
    }
}

/**
 * PATCH /:id — rename a category.
 * Body: { category }
 */
export const renameCategory = async (req: Request, res: Response): Promise<void> => {
    if (!authenticateRequest(req, res)) {
        return;
    }

    const { id } = req.params;
    const { category } = req.body ?? {};

    if (!isUuid(id)) {
        sendError(res, 400, "ValidationError", "A valid category id is required");
        return;
    }

    if (!isNonBlankString(category)) {
        sendError(res, 400, "ValidationError", "category is required");
        return;
    }

    try {
        const result = await updateBibleStudyCategory(id, category);
        res.status(200).json(result);
    } catch (err) {
        handleServiceError(res, err);
    }
}

/**
 * DELETE /:id — delete a category.
 */
export const deleteCategory = async (req: Request, res: Response): Promise<void> => {
    if (!authenticateRequest(req, res)) {
        return;
    }

    const { id } = req.params;

    if (!isUuid(id)) {
        sendError(res, 400, "ValidationError", "A valid category id is required");
        return;
    }

    try {
        const deletedId = await removeBibleStudyCategory(id);
        res.status(200).json({ id: deletedId });
    } catch (err) {
        handleServiceError(res, err);
    }
}
