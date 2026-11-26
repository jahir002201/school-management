import type { Request, Response } from "express";

import { studentService } from "./student.service.js";

import {
    studentIdValidation,
    createStudentValidation,
    updateStudentValidation
} from "./student.validation.js";

import {
    sendSuccess,
    sendPaginatedSuccess
} from "../../utils/apiResponse.js";

// Get All Students
const getAllStudents = async (req: Request, res: Response) => {
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

        const result = await studentService.getAllStudents(page, limit);

        return sendPaginatedSuccess(
            res,
            result.data,
            {
                page,
                limit,
                total: result.pagination.totalStudents
            },
            "Students fetched successfully"
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch students"
        });
    }
};

// Get Single Student
const getStudentById = async (req: Request, res: Response) => {
    try {
        const validation = studentIdValidation.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await studentService.getStudentById(validation.data);

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return sendSuccess(
            res,
            student,
            "Student fetched successfully"
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch student"
        });
    }
};

// Create Student
const createStudent = async (req: Request, res: Response) => {
    try {
        const validation = createStudentValidation.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten()
            });
        }

        const student = await studentService.createStudent(validation.data);

        return sendSuccess(
            res,
            student,
            "Student created successfully",
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
                    message: "Admission number or student account already exists"
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
            message: "Failed to create student"
        });
    }
};

// Update Student
const updateStudent = async (req: Request, res: Response) => {
    try {
        const idValidation = studentIdValidation.safeParse(req.params.id);

        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const bodyValidation = updateStudentValidation.safeParse(req.body);

        if (!bodyValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: bodyValidation.error.flatten()
            });
        }

        const student = await studentService.updateStudent(
            idValidation.data,
            bodyValidation.data
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return sendSuccess(
            res,
            student,
            "Student updated successfully"
        );

    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Failed to update student";

        const statusCode = message === "Admission number or user already exists"
            ? 409
            : 500;

        return res.status(statusCode).json({
            success: false,
            message
        });
    }
};

// Delete Student
const deleteStudent = async (req: Request, res: Response) => {
    try {
        const validation = studentIdValidation.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid student ID"
            });
        }

        const student = await studentService.deleteStudent(
            validation.data
        );

        if (!student) {
            return res.status(404).json({
                success: false,
                message: "Student not found"
            });
        }

        return sendSuccess(
            res,
            student,
            "Student deleted successfully"
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to delete student"
        });
    }
};

export const studentController = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};