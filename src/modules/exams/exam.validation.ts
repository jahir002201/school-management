import { z } from "zod";

// Exam ID Validation
export const examIdValidation = z.coerce
    .number()
    .int()
    .positive();

// Create Exam Validation
export const createExamValidation = z.object({
    class_id: z.coerce
        .number()
        .int()
        .positive("Valid class ID is required"),

    subject_id: z.coerce
        .number()
        .int()
        .positive("Valid subject ID is required"),

    title: z.string()
        .trim()
        .min(2, "Exam title must be at least 2 characters")
        .max(150, "Exam title cannot exceed 150 characters"),

    exam_date: z.string()
        .date("Valid exam date is required"),

    total_marks: z.coerce
        .number()
        .positive("Total marks must be greater than 0")
});

// Update Exam Validation
export const updateExamValidation = z.object({
    class_id: z.coerce
        .number()
        .int()
        .positive()
        .optional(),

    subject_id: z.coerce
        .number()
        .int()
        .positive()
        .optional(),

    title: z.string()
        .trim()
        .min(2)
        .max(150)
        .optional(),

    exam_date: z.string()
        .date()
        .optional(),

    total_marks: z.coerce
        .number()
        .positive()
        .optional()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);