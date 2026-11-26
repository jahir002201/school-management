import type { Request, Response } from "express";

import { resultService } from "./result.service.js";

import {
    resultIdValidation,
    createResultValidation,
    updateResultValidation
} from "./result.validation.js";

import {
    sendSuccess,
    sendPaginatedSuccess
} from "../../utils/apiResponse.js";

// Get All Results
const getAllResults = async (
    req: Request,
    res: Response
) => {
    try {
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit) || 10;

        if (
            !Number.isInteger(page) ||
            !Number.isInteger(limit) ||
            page < 1 ||
            limit < 1 ||
            limit > 100
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid pagination values"
            });
        }

        const result = await resultService.getAllResults(
            page,
            limit
        );

        return sendPaginatedSuccess(
            res,
            result.data,
            {
                page,
                limit,
                total: result.pagination.totalResults
            },
            "Results retrieved successfully"
        );

    } catch (error) {
        console.error("Get Results Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve results"
        });
    }
};

// Get Single Result
const getResultById = async (
    req: Request,
    res: Response
) => {
    try {
        const validation =
            resultIdValidation.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid result ID"
            });
        }

        const result = await resultService.getResultById(
            validation.data
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        return sendSuccess(
            res,
            result,
            "Result retrieved successfully"
        );

    } catch (error) {
        console.error("Get Single Result Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve result"
        });
    }
};

// Create Result
const createResult = async (
    req: Request,
    res: Response
) => {
    try {
        const validation =
            createResultValidation.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues
            });
        }

        const result = await resultService.createResult(
            validation.data
        );

        return sendSuccess(
            res,
            result,
            "Result created successfully",
            201
        );

    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Something went wrong";

        if (message.includes("not found")) {
            return res.status(404).json({
                success: false,
                message
            });
        }

        if (
            message.includes("cannot exceed total marks")
        ) {
            return res.status(400).json({
                success: false,
                message
            });
        }

        if (message.includes("already exists")) {
            return res.status(409).json({
                success: false,
                message
            });
        }

        console.error("Create Result Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create result"
        });
    }
};

// Update Result
const updateResult = async (
    req: Request,
    res: Response
) => {
    try {
        const idValidation =
            resultIdValidation.safeParse(req.params.id);

        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid result ID"
            });
        }

        const validation =
            updateResultValidation.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues
            });
        }

        const result = await resultService.updateResult(
            idValidation.data,
            validation.data
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        return sendSuccess(
            res,
            result,
            "Result updated successfully"
        );

    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Something went wrong";

        if (
            message.includes("cannot exceed total marks")
        ) {
            return res.status(400).json({
                success: false,
                message
            });
        }

        console.error("Update Result Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update result"
        });
    }
};

// Delete Result
const deleteResult = async (
    req: Request,
    res: Response
) => {
    try {
        const validation =
            resultIdValidation.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid result ID"
            });
        }

        const result = await resultService.deleteResult(
            validation.data
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Result not found"
            });
        }

        return sendSuccess(
            res,
            result,
            "Result deleted successfully"
        );

    } catch (error) {
        console.error("Delete Result Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete result"
        });
    }
};

// Export Controller
export const resultController = {
    getAllResults,
    getResultById,
    createResult,
    updateResult,
    deleteResult
};