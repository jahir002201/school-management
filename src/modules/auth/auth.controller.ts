import type { Request, Response } from "express";

import { authService } from "./auth.service.js";

import {
    registerValidation,
    loginValidation
} from "./auth.validation.js";

import { sendSuccess } from "../../utils/apiResponse.js";

// Register Controller
const register = async (req: Request, res: Response) => {
    const validation = registerValidation.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validation.error.flatten()
        });
    }

    try {
        const result = await authService.registerUser(
            validation.data
        );

        return sendSuccess(
            res,
            result,
            "User registered successfully",
            201
        );

    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Registration failed";

        const statusCode = message === "Email already exists"
            ? 409
            : 500;

        return res.status(statusCode).json({
            success: false,
            message
        });
    }
};

// Login Controller
const login = async (req: Request, res: Response) => {
    const validation = loginValidation.safeParse(req.body);

    if (!validation.success) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: validation.error.flatten()
        });
    }

    try {
        const result = await authService.loginUser(
            validation.data
        );

        return sendSuccess(
            res,
            result,
            "Login successful"
        );

    } catch (error) {
        const message = error instanceof Error
            ? error.message
            : "Login failed";

        let statusCode = 500;

        if (message === "Invalid email or password") {
            statusCode = 401;
        } else if (message === "Your account is inactive") {
            statusCode = 403;
        }

        return res.status(statusCode).json({
            success: false,
            message
        });
    }
};

// Get Logged-in User
const me = async (req: Request, res: Response) => {
    return sendSuccess(
        res,
        {
            id: req.user?.id,
            email: req.user?.email,
            role: req.user?.role
        },
        "User profile fetched successfully"
    );
};

// Export Auth Controller
export const authController = {
    register,
    login,
    me
};