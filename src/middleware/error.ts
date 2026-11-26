import type {
    Request,
    Response,
    NextFunction
} from "express";

import { ZodError } from "zod";

// Custom API Error Class
export class ApiError extends Error {
    statusCode: number;

    constructor(
        statusCode: number,
        message: string
    ) {
        super(message);

        this.statusCode = statusCode;
        this.name = "ApiError";

        Error.captureStackTrace(this, this.constructor);
    }
}

// Global Error Handler
export const globalErrorHandler = (
    error: unknown,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    console.error("Global Error:", error);

    // Default Error
    let statusCode = 500;
    let message = "Internal Server Error";

    // Custom API Error
    if (error instanceof ApiError) {
        statusCode = error.statusCode;
        message = error.message;
    }

    // Zod Validation Error
    else if (error instanceof ZodError) {
        statusCode = 400;
        message = "Validation failed";

        return res.status(statusCode).json({
            success: false,
            message,
            errors: error.issues.map((issue) => ({
                field: issue.path.join("."),
                message: issue.message
            }))
        });
    }

    // PostgreSQL Duplicate Entry
    else if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23505"
    ) {
        statusCode = 409;
        message = "Duplicate record already exists";
    }

    // PostgreSQL Foreign Key Error
    else if (
        typeof error === "object" &&
        error !== null &&
        "code" in error &&
        error.code === "23503"
    ) {
        statusCode = 400;
        message = "Related record does not exist";
    }

    // Send Error Response
    return res.status(statusCode).json({
        success: false,
        message
    });
};