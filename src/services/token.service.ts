import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

// Business logic for issuing and verifying JSON Web Tokens used as bearer tokens

/**
 * The identity carried by a verified access token.
 */
export type AccessTokenClaims = {
    userId: string;
    username: string;
}

/**
 * Thrown when a bearer token is malformed, has a bad signature, or is expired.
 */
export class InvalidAccessTokenError extends Error {
    /**
     * @param message - Why the token was rejected
     */
    constructor(message: string) {
        super(message);
        this.name = "InvalidAccessTokenError";
    }
}

const DEFAULT_EXPIRES_IN = "1h";

/**
 * Thrown when JWT_SECRET is not configured, so tokens cannot be signed safely.
 */
export class MissingJwtSecretError extends Error {
    /**
     * Builds the error with a fixed message.
     */
    constructor() {
        super("JWT_SECRET environment variable is not set");
        this.name = "MissingJwtSecretError";
    }
}

/**
 * Read the JWT signing secret from the environment.
 * @returns The configured secret
 * @throws MissingJwtSecretError when JWT_SECRET is unset or blank
 */
const getJwtSecret = (): string => {
    const secret = process.env.JWT_SECRET;

    if (!secret?.trim()) {
        throw new MissingJwtSecretError();
    }

    return secret;
}

/**
 * Sign an access token identifying a user.
 * The user's id is stored as the standard `sub` claim.
 * @param userId - The authenticated user's id
 * @param username - The authenticated user's username
 * @returns A signed JWT to be sent as `Authorization: Bearer <token>`
 */
export const signAccessToken = (userId: string, username: string): string => {
    const expiresIn = (process.env.JWT_EXPIRES_IN || DEFAULT_EXPIRES_IN) as SignOptions["expiresIn"];

    return jwt.sign({ username }, getJwtSecret(), {
        subject: userId,
        expiresIn,
        algorithm: "HS256"
    });
}

/**
 * Pull the token out of an `Authorization: Bearer <token>` header value.
 * @param authorizationHeader - The raw Authorization header, if any
 * @returns The token, or null when the header is missing or not a bearer header
 */
export const extractBearerToken = (authorizationHeader: string | undefined): string | null => {
    const match = authorizationHeader?.match(/^Bearer\s+(\S+)\s*$/i);
    return match ? match[1] : null;
}

/**
 * Verify an access token's signature and expiry and return its claims.
 * @param token - The raw JWT
 * @returns The user identity stored in the token
 * @throws InvalidAccessTokenError when the token is invalid, expired, or missing claims
 * @throws MissingJwtSecretError when JWT_SECRET is not configured
 */
export const verifyAccessToken = (token: string): AccessTokenClaims => {
    const secret = getJwtSecret();
    let payload: string | JwtPayload;

    try {
        payload = jwt.verify(token, secret, { algorithms: ["HS256"] });
    } catch (err) {
        const message = err instanceof jwt.TokenExpiredError ? "Access token has expired" : "Access token is invalid";
        throw new InvalidAccessTokenError(message);
    }

    if (typeof payload === "string" || !payload.sub || typeof payload.username !== "string") {
        throw new InvalidAccessTokenError("Access token is invalid");
    }

    return { userId: payload.sub, username: payload.username };
}
