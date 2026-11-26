import type { Request, Response } from "express";

import { enrollmentService } from "./enrollment.service.js";

import {
    enrollmentIdValidation,
    createEnrollmentValidation,
    updateEnrollmentValidation
} from "./enrollment.validation.js";

import {
    sendSuccess,
    sendPaginatedSuccess
} from "../../utils/apiResponse.js";

// Get All Enrollments
const getAllEnrollments = async (
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

        const result = await enrollmentService.getAllEnrollments(
            page,
            limit
        );

        return sendPaginatedSuccess(
            res,
            result.data,
            {
                page,
                limit,
                total: result.pagination.totalEnrollments
            },
            "Enrollments retrieved successfully"
        );

    } catch (error) {
        console.error("Get All Enrollments Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve enrollments"
        });
    }
};

// Get Single Enrollment
const getEnrollmentById = async (
    req: Request,
    res: Response
) => {
    try {
        const validation = enrollmentIdValidation.safeParse(
            req.params.id
        );

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid enrollment ID"
            });
        }

        const result = await enrollmentService.getEnrollmentById(
            validation.data
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }

        return sendSuccess(
            res,
            result,
            "Enrollment retrieved successfully"
        );

    } catch (error) {
        console.error("Get Enrollment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve enrollment"
        });
    }
};

// Create Enrollment
const createEnrollment = async (
    req: Request,
    res: Response
) => {
    try {
        const validation = createEnrollmentValidation.safeParse(
            req.body
        );

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues
            });
        }

        const result = await enrollmentService.createEnrollment(
            validation.data
        );

        return sendSuccess(
            res,
            result,
            "Student enrolled successfully",
            201
        );

    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("already enrolled")) {
                return res.status(409).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === "Student or class not found") {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }
        }

        console.error("Create Enrollment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create enrollment"
        });
    }
};

// Update Enrollment
const updateEnrollment = async (
    req: Request,
    res: Response
) => {
    try {
        const idValidation = enrollmentIdValidation.safeParse(
            req.params.id
        );

        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid enrollment ID"
            });
        }

        const bodyValidation = updateEnrollmentValidation.safeParse(
            req.body
        );

        if (!bodyValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: bodyValidation.error.issues
            });
        }

        const result = await enrollmentService.updateEnrollment(
            idValidation.data,
            bodyValidation.data
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }

        return sendSuccess(
            res,
            result,
            "Enrollment updated successfully"
        );

    } catch (error) {
        if (error instanceof Error) {
            if (error.message.includes("already enrolled")) {
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

        console.error("Update Enrollment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update enrollment"
        });
    }
};

// Delete Enrollment
const deleteEnrollment = async (
    req: Request,
    res: Response
) => {
    try {
        const validation = enrollmentIdValidation.safeParse(
            req.params.id
        );

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid enrollment ID"
            });
        }

        const result = await enrollmentService.deleteEnrollment(
            validation.data
        );

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Enrollment not found"
            });
        }

        return sendSuccess(
            res,
            null,
            "Enrollment deleted successfully"
        );

    } catch (error) {
        console.error("Delete Enrollment Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete enrollment"
        });
    }
};

// Export Controller
export const enrollmentController = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
};