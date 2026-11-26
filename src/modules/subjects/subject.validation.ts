import { z } from "zod";

// Subject ID Validation
export const subjectIdValidation = z.coerce
    .number()
    .int()
    .positive();

// Create Subject Validation
export const createSubjectValidation = z.object({
    name: z.string()
        .trim()
        .min(2, "Subject name must be at least 2 characters")
        .max(100, "Subject name cannot exceed 100 characters"),

    class_id: z.coerce
        .number()
        .int()
        .positive("Valid class ID is required")
});

// Update Subject Validation
export const updateSubjectValidation = z.object({
    name: z.string()
        .trim()
        .min(2)
        .max(100)
        .optional(),

    class_id: z.coerce
        .number()
        .int()
        .positive()
        .optional()

}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);