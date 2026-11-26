import type { Request, Response } from "express";

import { teacherService } from "./teacher.service.js";

import {
    teacherIdValidation,
    createTeacherValidation,
    updateTeacherValidation
} from "./teacher.validation.js";

import {
    sendSuccess,
    sendPaginatedSuccess
} from "../../utils/apiResponse.js";

// Get All Teachers
const getAllTeachers = async (req: Request, res: Response) => {
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

        const result = await teacherService.getAllTeachers(page, limit);

        return sendPaginatedSuccess(
            res,
            result.data,
            {
                page,
                limit,
                total: result.pagination.totalTeachers
            },
            "Teachers fetched successfully"
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch teachers"
        });
    }
};

// Get Single Teacher
const getTeacherById = async (req: Request, res: Response) => {
    try {
        const validation = teacherIdValidation.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacher ID"
            });
        }

        const teacher = await teacherService.getTeacherById(validation.data);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        return sendSuccess(
            res,
            teacher,
            "Teacher fetched successfully"
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch teacher"
        });
    }
};

// Create Teacher
const createTeacher = async (req: Request, res: Response) => {
    try {
        const validation = createTeacherValidation.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten()
            });
        }

        const teacher = await teacherService.createTeacher(validation.data);

        return sendSuccess(
            res,
            teacher,
            "Teacher created successfully",
            201
        );

    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error
        ) {
            if (error.code === "23505") {
                return res.status(409).json({
                    success: false,
                    message: "Employee number or teacher account already exists"
                });
            }

            if (error.code === "23503") {
                return res.status(404).json({
                    success: false,
                    message: "User account not found"
                });
            }
        }

        return res.status(500).json({
            success: false,
            message: "Failed to create teacher"
        });
    }
};

// Update Teacher
const updateTeacher = async (req: Request, res: Response) => {
    try {
        const idValidation = teacherIdValidation.safeParse(req.params.id);

        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacher ID"
            });
        }

        const bodyValidation = updateTeacherValidation.safeParse(req.body);

        if (!bodyValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: bodyValidation.error.flatten()
            });
        }

        const teacher = await teacherService.updateTeacher(
            idValidation.data,
            bodyValidation.data
        );

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        return sendSuccess(
            res,
            teacher,
            "Teacher updated successfully"
        );

    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Failed to update teacher";

        const statusCode = message === "Employee number or user already exists"
            ? 409
            : 500;

        return res.status(statusCode).json({
            success: false,
            message
        });
    }
};

// Delete Teacher
const deleteTeacher = async (req: Request, res: Response) => {
    try {
        const validation = teacherIdValidation.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid teacher ID"
            });
        }

        const teacher = await teacherService.deleteTeacher(validation.data);

        if (!teacher) {
            return res.status(404).json({
                success: false,
                message: "Teacher not found"
            });
        }

        return sendSuccess(
            res,
            teacher,
            "Teacher deleted successfully"
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete teacher"
        });
    }
};

export const teacherController = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};