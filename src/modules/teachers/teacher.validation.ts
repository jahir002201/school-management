import { z } from "zod";

// Teacher ID Validation
export const teacherIdValidation = z.coerce
    .number()
    .int()
    .positive();

// Create Teacher Validation
export const createTeacherValidation = z.object({
    user_id: z.coerce.number().int().positive(),

    employee_no: z.string()
        .min(1, "Employee number is required")
        .max(50),

    qualification: z.string()
        .min(2)
        .max(150)
        .optional()
        .nullable(),

    hire_date: z.string()
        .date()
        .optional()
        .nullable()
});

// Update Teacher Validation
export const updateTeacherValidation = z.object({
    employee_no: z.string()
        .min(1)
        .max(50)
        .optional(),

    qualification: z.string()
        .min(2)
        .max(150)
        .optional()
        .nullable(),

    hire_date: z.string()
        .date()
        .optional()
        .nullable()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);