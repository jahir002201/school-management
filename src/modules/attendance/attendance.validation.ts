import { z } from "zod";

// Attendance ID Validation
export const attendanceIdValidation = z.coerce
    .number()
    .int()
    .positive();

// Create Attendance Validation
export const createAttendanceValidation = z.object({
    student_id: z.coerce
        .number()
        .int()
        .positive("Valid student ID is required"),

    class_id: z.coerce
        .number()
        .int()
        .positive("Valid class ID is required"),

    attendance_date: z.string()
        .date("Valid attendance date is required"),

    status: z.enum([
        "present",
        "absent",
        "late",
        "excused"
    ])
});

// Update Attendance Validation
export const updateAttendanceValidation = z.object({
    attendance_date: z.string()
        .date("Valid attendance date is required")
        .optional(),

    status: z.enum([
        "present",
        "absent",
        "late",
        "excused"
    ]).optional()
}).strict().refine(
    (data) => Object.keys(data).length > 0,
    {
        message: "At least one field is required"
    }
);