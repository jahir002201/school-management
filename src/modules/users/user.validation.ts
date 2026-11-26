import { z } from "zod";

// User ID Validation
export const userIdValidation = z.coerce
    .number()
    .int()
    .positive();

// Update User Validation
export const updateUserValidation = z.object({
    name: z.string().min(3).max(100).optional(),

    email: z.string().email().optional(),

    role: z.enum([
        "admin",
        "teacher",
        "student"
    ]).optional()

}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);

// Update User Status Validation
export const updateUserStatusValidation = z.object({
    is_active: z.boolean()
});