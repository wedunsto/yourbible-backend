// Shared shape for every error response body
export type ErrorResponseDto = {
    statusCode: number;
    name: string;
    message: string;
}
