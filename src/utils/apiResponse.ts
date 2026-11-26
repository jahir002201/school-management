import type { Response } from "express";

// Pagination Interface
interface Pagination {
    page: number;
    limit: number;
    total: number;
}

// Standard Success Response
export const sendSuccess = <T>(
    res: Response,
    data: T,
    message: string = "Request successful",
    statusCode: number = 200
) => {
    return res.status(statusCode).json({
        success: true,
        message,
        data
    });
};

// Standard Paginated Response
export const sendPaginatedSuccess = <T>(
    res: Response,
    data: T[],
    pagination: Pagination,
    message: string = "Data retrieved successfully"
) => {
    const totalPages = Math.ceil(
        pagination.total / pagination.limit
    );

    return res.status(200).json({
        success: true,
        message,
        data,
        pagination: {
            page: pagination.page,
            limit: pagination.limit,
            total: pagination.total,
            totalPages,
            hasNextPage: pagination.page < totalPages,
            hasPreviousPage: pagination.page > 1
        }
    });
};