import { z } from "zod";

// Enrollment ID Validation
export const enrollmentIdValidation = z.coerce
    .number()
    .int()
    .positive();

// Create Enrollment Validation
export const createEnrollmentValidation = z.object({
    student_id: z.coerce
        .number()
        .int()
        .positive("Valid student ID is required"),

    class_id: z.coerce
        .number()
        .int()
        .positive("Valid class ID is required")
});

// Update Enrollment Validation
export const updateEnrollmentValidation = z.object({
    class_id: z.coerce
        .number()
        .int()
        .positive("Valid class ID is required")
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);