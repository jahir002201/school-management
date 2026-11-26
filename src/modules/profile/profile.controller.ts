import type { Request, Response } from "express";

import { profileService } from "./profile.service.js";

import {
    updateProfileValidation,
    changePasswordValidation
} from "./profile.validation.js";

import { sendSuccess } from "../../utils/apiResponse.js";

// Get My Profile
const getMyProfile = async (req: Request, res: Response) => {
    try {
        const userId = req.user!.id;

        const profile = await profileService.getMyProfile(userId);

        if (!profile) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        return sendSuccess(
            res,
            profile,
            "Profile fetched successfully"
        );

    } catch (error) {
        console.error("Get Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to fetch profile"
        });
    }
};

// Update My Profile
const updateMyProfile = async (req: Request, res: Response) => {
    try {
        const validation = updateProfileValidation.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten()
            });
        }

        const userId = req.user!.id;

        const profile = await profileService.updateMyProfile(
            userId,
            validation.data
        );

        return sendSuccess(
            res,
            profile,
            "Profile updated successfully"
        );

    } catch (error) {
        console.error("Update Profile Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to update profile"
        });
    }
};

// Change Password
const changePassword = async (req: Request, res: Response) => {
    try {
        const validation = changePasswordValidation.safeParse(req.body);

        if (!validation.success) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validation.error.flatten()
            });
        }

        const userId = req.user!.id;

        await profileService.changePassword(
            userId,
            validation.data
        );

        return sendSuccess(
            res,
            null,
            "Password changed successfully"
        );

    } catch (error) {
        if (error instanceof Error) {
            if (error.message === "User not found") {
                return res.status(404).json({
                    success: false,
                    message: error.message
                });
            }

            if (error.message === "Current password is incorrect") {
                return res.status(400).json({
                    success: false,
                    message: error.message
                });
            }
        }

        console.error("Change Password Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to change password"
        });
    }
};

// Export Profile Controller
export const profileController = {
    getMyProfile,
    updateMyProfile,
    changePassword
};