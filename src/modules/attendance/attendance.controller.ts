import type { Request, Response } from "express";

import { attendanceService } from "./attendance.service.js";

import {
    attendanceIdValidation,
    createAttendanceValidation,
    updateAttendanceValidation
} from "./attendance.validation.js";

import {
    sendSuccess,
    sendPaginatedSuccess
} from "../../utils/apiResponse.js";

// Get All Attendance
const getAllAttendance = async (
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

        const result =
            await attendanceService.getAllAttendance(page, limit);

        return sendPaginatedSuccess(
            res,
            result.data,
            {
                page,
                limit,
                total: result.pagination.totalAttendance
            },
            "Attendance retrieved successfully"
        );

    } catch (error) {
        console.error("Get Attendance Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve attendance"
        });
    }
};

// Get Single Attendance
const getAttendanceById = async (
    req: Request,
    res: Response
) => {
    try {
        const validation =
            attendanceIdValidation.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID"
            });
        }

        const attendance =
            await attendanceService.getAttendanceById(
                validation.data
            );

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found"
            });
        }

        return sendSuccess(
            res,
            attendance,
            "Attendance retrieved successfully"
        );

    } catch (error) {
        console.error("Get Single Attendance Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve attendance"
        });
    }
};

// Create Attendance
const createAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        const validation =
            createAttendanceValidation.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues
            });
        }

        const attendance =
            await attendanceService.createAttendance(
                validation.data
            );

        return sendSuccess(
            res,
            attendance,
            "Attendance created successfully",
            201
        );

    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Something went wrong";

        if (message.includes("already exists")) {
            return res.status(409).json({
                success: false,
                message
            });
        }

        if (message.includes("not found")) {
            return res.status(404).json({
                success: false,
                message
            });
        }

        console.error("Create Attendance Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to create attendance"
        });
    }
};

// Update Attendance
const updateAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        const idValidation =
            attendanceIdValidation.safeParse(req.params.id);

        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID"
            });
        }

        const validation =
            updateAttendanceValidation.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.issues
            });
        }

        const attendance =
            await attendanceService.updateAttendance(
                idValidation.data,
                validation.data
            );

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found"
            });
        }

        return sendSuccess(
            res,
            attendance,
            "Attendance updated successfully"
        );

    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Something went wrong";

        if (message.includes("already exists")) {
            return res.status(409).json({
                success: false,
                message
            });
        }

        console.error("Update Attendance Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update attendance"
        });
    }
};

// Delete Attendance
const deleteAttendance = async (
    req: Request,
    res: Response
) => {
    try {
        const validation =
            attendanceIdValidation.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid attendance ID"
            });
        }

        const attendance =
            await attendanceService.deleteAttendance(
                validation.data
            );

        if (!attendance) {
            return res.status(404).json({
                success: false,
                message: "Attendance not found"
            });
        }

        return sendSuccess(
            res,
            attendance,
            "Attendance deleted successfully"
        );

    } catch (error) {
        console.error("Delete Attendance Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to delete attendance"
        });
    }
};

export const attendanceController = {
    getAllAttendance,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendance
};