import { z } from "zod";

// Result ID Validation
export const resultIdValidation = z.coerce
    .number()
    .int()
    .positive();

// Create Result Validation
export const createResultValidation = z.object({
    exam_id: z.coerce
        .number()
        .int()
        .positive("Valid exam ID is required"),

    student_id: z.coerce
        .number()
        .int()
        .positive("Valid student ID is required"),

    marks_obtained: z.coerce
        .number()
        .min(0, "Marks cannot be negative"),

    grade: z.string()
        .trim()
        .min(1, "Grade cannot be empty")
        .max(10, "Grade cannot exceed 10 characters")
        .nullable()
        .optional()
});

// Update Result Validation
export const updateResultValidation = z.object({
    marks_obtained: z.coerce
        .number()
        .min(0, "Marks cannot be negative")
        .optional(),

    grade: z.string()
        .trim()
        .min(1, "Grade cannot be empty")
        .max(10, "Grade cannot exceed 10 characters")
        .nullable()
        .optional()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);