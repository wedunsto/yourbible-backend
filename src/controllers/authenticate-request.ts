import { Request, Response } from "express";
import { AccessTokenClaims, InvalidAccessTokenError, extractBearerToken, verifyAccessToken } from "../services/token.service";
import { ErrorResponseDto } from "../dtos/error.dto";

/**
 * Verify the request's bearer token before a controller calls any service.
 * On failure the error response is sent here, so the caller only needs to `return`.
 *  401 - missing, malformed, invalid, or expired token
 *  500 - server misconfiguration (e.g. JWT_SECRET not set)
 * @param req - The Express request
 * @param res - The Express response
 * @returns The authenticated user's claims, or null when a response was already sent
 */
export const authenticateRequest = (req: Request, res: Response): AccessTokenClaims | null => {
    const token = extractBearerToken(req.headers.authorization);

    if (!token) {
        const body: ErrorResponseDto = { statusCode: 401, name: "UnauthorizedError", message: "Bearer token is required" };
        res.status(401).set("WWW-Authenticate", "Bearer").json(body);
        return null;
    }

    try {
        return verifyAccessToken(token);
    } catch (err) {
        if (err instanceof InvalidAccessTokenError) {
            const body: ErrorResponseDto = { statusCode: 401, name: err.name, message: err.message };
            res.status(401).set("WWW-Authenticate", 'Bearer error="invalid_token"').json(body);
            return null;
        }

        console.log(err);
        const body: ErrorResponseDto = { statusCode: 500, name: "InternalServerError", message: "internal server error" };
        res.status(500).json(body);
        return null;
    }
}
