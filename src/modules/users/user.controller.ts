import type { Request, Response } from "express";

import { userService } from "./user.service.js";

import {
    userIdValidation,
    updateUserValidation,
    updateUserStatusValidation
} from "./user.validation.js";

import {
    sendSuccess,
    sendPaginatedSuccess
} from "../../utils/apiResponse.js";

// Get All Users
const getAllUsers = async (req: Request, res: Response) => {
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

        const result = await userService.getAllUsers(page, limit);

        return sendPaginatedSuccess(
            res,
            result.data,
            {
                page,
                limit,
                total: result.pagination.totalUsers
            },
            "Users fetched successfully"
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch users"
        });
    }
};

// Get Single User
const getUserById = async (req: Request, res: Response) => {
    try {
        const validation = userIdValidation.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const user = await userService.getUserById(validation.data);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return sendSuccess(
            res,
            user,
            "User fetched successfully"
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to fetch user"
        });
    }
};

// Update User
const updateUser = async (req: Request, res: Response) => {
    try {
        const idValidation = userIdValidation.safeParse(req.params.id);

        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const bodyValidation = updateUserValidation.safeParse(req.body);

        if (!bodyValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: bodyValidation.error.flatten()
            });
        }

        const userId = idValidation.data;
        const payload = bodyValidation.data;

        if (
            userId === req.user?.id &&
            payload.role &&
            payload.role !== "admin"
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot change your own admin role"
            });
        }

        const user = await userService.updateUser(userId, payload);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return sendSuccess(
            res,
            user,
            "User updated successfully"
        );

    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Failed to update user";

        const statusCode = message === "Email already exists"
            ? 409
            : 500;

        return res.status(statusCode).json({
            success: false,
            message
        });
    }
};

// Update User Status
const updateUserStatus = async (req: Request, res: Response) => {
    try {
        const idValidation = userIdValidation.safeParse(req.params.id);

        if (!idValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const bodyValidation = updateUserStatusValidation.safeParse(req.body);

        if (!bodyValidation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: bodyValidation.error.flatten()
            });
        }

        const userId = idValidation.data;

        if (
            userId === req.user?.id &&
            bodyValidation.data.is_active === false
        ) {
            return res.status(403).json({
                success: false,
                message: "You cannot deactivate your own account"
            });
        }

        const user = await userService.updateUserStatus(
            userId,
            bodyValidation.data
        );

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return sendSuccess(
            res,
            user,
            "User status updated successfully"
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to update user status"
        });
    }
};

// Delete User (Soft Delete)
const deleteUser = async (req: Request, res: Response) => {
    try {
        const validation = userIdValidation.safeParse(req.params.id);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID"
            });
        }

        const userId = validation.data;

        if (userId === req.user?.id) {
            return res.status(403).json({
                success: false,
                message: "You cannot deactivate your own account"
            });
        }

        const user = await userService.deleteUser(userId);

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return sendSuccess(
            res,
            user,
            "User deactivated successfully"
        );

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Failed to deactivate user"
        });
    }
};

export const userController = {
    getAllUsers,
    getUserById,
    updateUser,
    updateUserStatus,
    deleteUser
};