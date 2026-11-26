import { z } from "zod";

// Update Profile Validation
export const updateProfileValidation = z.object({
    phone: z.string()
        .min(6, "Phone number must be at least 6 characters")
        .max(20, "Phone number is too long")
        .optional()
        .nullable(),

    address: z.string()
        .min(3, "Address must be at least 3 characters")
        .max(255, "Address is too long")
        .optional()
        .nullable(),

    avatar: z.string()
        .url("Avatar must be a valid URL")
        .max(500)
        .optional()
        .nullable()

}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);

// Change Password Validation
export const changePasswordValidation = z.object({
    currentPassword: z.string()
        .min(8, "Current password is required"),

    newPassword: z.string()
        .min(8, "New password must be at least 8 characters")
        .max(100, "Password is too long")

}).strict().refine(
    (data) => data.currentPassword !== data.newPassword,
    {
        message: "New password must be different from current password",
        path: ["newPassword"]
    }
);