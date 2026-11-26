import { z } from "zod";

// Student ID Validation
export const studentIdValidation = z.coerce
    .number()
    .int()
    .positive();

// Create Student Validation
export const createStudentValidation = z.object({
    user_id: z.coerce.number().int().positive(),

    admission_no: z.string()
        .min(1, "Admission number is required")
        .max(50),

    date_of_birth: z.string()
        .date()
        .optional()
        .nullable(),

    guardian_name: z.string()
        .min(3)
        .max(100)
        .optional()
        .nullable(),

    guardian_phone: z.string()
        .min(6)
        .max(20)
        .optional()
        .nullable()
});

// Update Student Validation
export const updateStudentValidation = z.object({
    admission_no: z.string()
        .min(1)
        .max(50)
        .optional(),

    date_of_birth: z.string()
        .date()
        .nullable()
        .optional(),

    guardian_name: z.string()
        .min(3)
        .max(100)
        .nullable()
        .optional(),

    guardian_phone: z.string()
        .min(6)
        .max(20)
        .nullable()
        .optional()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);