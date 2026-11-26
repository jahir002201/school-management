import type { Request, Response } from "express";

import { classService } from "./class.service.js";

import {
    classIdValidation,
    createClassValidation,
    updateClassValidation
} from "./class.validation.js";

import {
    sendSuccess,
    sendPaginatedSuccess
} from "../../utils/apiResponse.js";

// Get All Classes
const getAllClasses = async (
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
                message: "Invalid pagination parameters"
            });
        }

        const result = await classService.getAllClasses(
            page,
            limit
        );

        return sendPaginatedSuccess(
            res,
            result.data,
            {
                page,
                limit,
                total: result.pagination.totalClasses
            },
            "Classes retrieved successfully"
        );

    } catch (error) {
        console.error("Get All Classes Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve classes"
        });
    }
};

// Get Single Class
const getClassById = async (
    req: Request,
    res: Response
) => {
    try {
        const validation = classIdValidation.safeParse(
            req.params.id
        );

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID"
            });
        }

        const result = await classService.getClassById(
            validation.data
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        return sendSuccess(
            res,
            result,
            "Class retrieved successfully"
        );

    } catch (error) {
        console.error("Get Class Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve class"
        });
    }
};

// Create Class
const createClass = async (
    req: Request,
    res: Response
) => {
    try {
        const validation = createClassValidation.safeParse(
            req.body
        );

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues
            });
        }

        const result = await classService.createClass(
            validation.data
        );

        return sendSuccess(
            res,
            result,
            "Class created successfully",
            201
        );

    } catch (error) {
        if (
            error instanceof Error &&
            error.message.includes("already exist")
        ) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23503"
        ) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        console.error("Create Class Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create class"
        });
    }
};

// Update Class
const updateClass = async (
    req: Request,
    res: Response
) => {
    try {
        const idValidation = classIdValidation.safeParse(
            req.params.id
        );

        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID"
            });
        }

        const bodyValidation = updateClassValidation.safeParse(
            req.body
        );

        if (!bodyValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: bodyValidation.error.issues
            });
        }

        const result = await classService.updateClass(
            idValidation.data,
            bodyValidation.data
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        return sendSuccess(
            res,
            result,
            "Class updated successfully"
        );

    } catch (error) {
        if (
            error instanceof Error &&
            error.message.includes("already exist")
        ) {
            return res.status(409).json({
                success: false,
                message: error.message
            });
        }

        console.error("Update Class Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update class"
        });
    }
};

// Delete Class
const deleteClass = async (
    req: Request,
    res: Response
) => {
    try {
        const validation = classIdValidation.safeParse(
            req.params.id
        );

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid class ID"
            });
        }

        const result = await classService.deleteClass(
            validation.data
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Class not found"
            });
        }

        return sendSuccess(
            res,
            null,
            "Class deleted successfully"
        );

    } catch (error) {
        console.error("Delete Class Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete class"
        });
    }
};

// Export Controller
export const classController = {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
};