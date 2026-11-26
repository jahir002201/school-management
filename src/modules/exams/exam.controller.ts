import type { Request, Response } from "express";

import { examService } from "./exam.service.js";

import {
    examIdValidation,
    createExamValidation,
    updateExamValidation
} from "./exam.validation.js";

import {
    sendSuccess,
    sendPaginatedSuccess
} from "../../utils/apiResponse.js";

// Get All Exams
const getAllExams = async (
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

        const result = await examService.getAllExams(
            page,
            limit
        );

        return sendPaginatedSuccess(
            res,
            result.data,
            {
                page,
                limit,
                total: result.pagination.totalExams
            },
            "Exams retrieved successfully"
        );

    } catch (error) {
        console.error("Get Exams Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve exams"
        });
    }
};

// Get Single Exam
const getExamById = async (
    req: Request,
    res: Response
) => {
    try {
        const validation =
            examIdValidation.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid exam ID"
            });
        }

        const exam = await examService.getExamById(
            validation.data
        );

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        return sendSuccess(
            res,
            exam,
            "Exam retrieved successfully"
        );

    } catch (error) {
        console.error("Get Single Exam Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve exam"
        });
    }
};

// Create Exam
const createExam = async (
    req: Request,
    res: Response
) => {
    try {
        const validation =
            createExamValidation.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues
            });
        }

        const exam = await examService.createExam(
            validation.data
        );

        return sendSuccess(
            res,
            exam,
            "Exam created successfully",
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

        console.error("Create Exam Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create exam"
        });
    }
};

// Update Exam
const updateExam = async (
    req: Request,
    res: Response
) => {
    try {
        const idValidation =
            examIdValidation.safeParse(req.params.id);

        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid exam ID"
            });
        }

        const validation =
            updateExamValidation.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues
            });
        }

        const exam = await examService.updateExam(
            idValidation.data,
            validation.data
        );

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        return sendSuccess(
            res,
            exam,
            "Exam updated successfully"
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

        console.error("Update Exam Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update exam"
        });
    }
};

// Delete Exam
const deleteExam = async (
    req: Request,
    res: Response
) => {
    try {
        const validation =
            examIdValidation.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid exam ID"
            });
        }

        const exam = await examService.deleteExam(
            validation.data
        );

        if (!exam) {
            return res.status(404).json({
                success: false,
                message: "Exam not found"
            });
        }

        return sendSuccess(
            res,
            exam,
            "Exam deleted successfully"
        );

    } catch (error) {
        console.error("Delete Exam Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete exam"
        });
    }
};

export const examController = {
    getAllExams,
    getExamById,
    createExam,
    updateExam,
    deleteExam
};