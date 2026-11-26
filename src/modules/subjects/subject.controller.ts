import type { Request, Response } from "express";

import { subjectService } from "./subject.service.js";

import {
    subjectIdValidation,
    createSubjectValidation,
    updateSubjectValidation
} from "./subject.validation.js";

import {
    sendSuccess,
    sendPaginatedSuccess
} from "../../utils/apiResponse.js";

// Get All Subjects
const getAllSubjects = async (
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

        const result = await subjectService.getAllSubjects(
            page,
            limit
        );

        return sendPaginatedSuccess(
            res,
            result.data,
            {
                page,
                limit,
                total: result.pagination.totalSubjects
            },
            "Subjects retrieved successfully"
        );

    } catch (error) {
        console.error("Get All Subjects Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve subjects"
        });
    }
};

// Get Single Subject
const getSubjectById = async (
    req: Request,
    res: Response
) => {
    try {
        const validation = subjectIdValidation.safeParse(
            req.params.id
        );

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid subject ID"
            });
        }

        const result = await subjectService.getSubjectById(
            validation.data
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        return sendSuccess(
            res,
            result,
            "Subject retrieved successfully"
        );

    } catch (error) {
        console.error("Get Subject Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve subject"
        });
    }
};

// Create Subject
const createSubject = async (
    req: Request,
    res: Response
) => {
    try {
        const validation = createSubjectValidation.safeParse(
            req.body
        );

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues
            });
        }

        const result = await subjectService.createSubject(
            validation.data
        );

        return sendSuccess(
            res,
            result,
            "Subject created successfully",
            201
        );

    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("already exists")) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === "Class not found") {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
        }

        console.error("Create Subject Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create subject"
        });
    }
};

// Update Subject
const updateSubject = async (
    req: Request,
    res: Response
) => {
    try {
        const idValidation = subjectIdValidation.safeParse(
            req.params.id
        );

        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid subject ID"
            });
        }

        const bodyValidation = updateSubjectValidation.safeParse(
            req.body
        );

        if (!bodyValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: bodyValidation.error.issues
            });
        }

        const result = await subjectService.updateSubject(
            idValidation.data,
            bodyValidation.data
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        return sendSuccess(
            res,
            result,
            "Subject updated successfully"
        );

    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("already exists")) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === "Class not found") {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
        }

        console.error("Update Subject Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update subject"
        });
    }
};

// Delete Subject
const deleteSubject = async (
    req: Request,
    res: Response
) => {
    try {
        const validation = subjectIdValidation.safeParse(
            req.params.id
        );

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid subject ID"
            });
        }

        const result = await subjectService.deleteSubject(
            validation.data
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Subject not found"
            });
        }

        return sendSuccess(
            res,
            null,
            "Subject deleted successfully"
        );

    } catch (error) {
        console.error("Delete Subject Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete subject"
        });
    }
};

// Export Controller
export const subjectController = {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
};