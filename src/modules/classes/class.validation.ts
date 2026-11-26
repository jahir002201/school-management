import { z } from "zod";

// Class ID Validation
export const classIdValidation = z.coerce
    .number()
    .int()
    .positive();

// Create Class Validation
export const createClassValidation = z.object({
    name: z.string()
        .min(1, "Class name is required")
        .max(100),

    section: z.string()
        .min(1, "Section is required")
        .max(50),

    academic_year: z.string()
        .min(4, "Academic year is required")
        .max(20),

    teacher_id: z.coerce
        .number()
        .int()
        .positive()
        .nullable()
        .optional()
});

// Update Class Validation
export const updateClassValidation = z.object({
    name: z.string()
        .min(1)
        .max(100)
        .optional(),

    section: z.string()
        .min(1)
        .max(50)
        .optional(),

    academic_year: z.string()
        .min(4)
        .max(20)
        .optional(),

    teacher_id: z.coerce
        .number()
        .int()
        .positive()
        .nullable()
        .optional()

}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);