import pool from "../../db/index.js";

import type {
    ICreateEnrollment,
    IUpdateEnrollment
} from "./enrollment.interface.js";

// Get All Enrollments with Pagination
const getAllEnrollments = async (
    page: number = 1,
    limit: number = 10
) => {
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT
            e.id,
            e.student_id,
            e.class_id,
            u.name AS student_name,
            u.email AS student_email,
            s.admission_no,
            c.name AS class_name,
            c.section,
            c.academic_year,
            e.created_at,
            e.updated_at
         FROM enrollments e
         INNER JOIN students s ON e.student_id = s.id
         INNER JOIN users u ON s.user_id = u.id
         INNER JOIN classes c ON e.class_id = c.id
         ORDER BY e.id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await pool.query(
        "SELECT COUNT(*) FROM enrollments"
    );

    const totalEnrollments = Number(
        countResult.rows[0].count
    );

    return {
        data: result.rows,
        pagination: {
            totalEnrollments,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalEnrollments / limit)
        }
    };
};

// Get Single Enrollment
const getEnrollmentById = async (id: number) => {
    const result = await pool.query(
        `SELECT
            e.id,
            e.student_id,
            e.class_id,
            u.name AS student_name,
            u.email AS student_email,
            s.admission_no,
            c.name AS class_name,
            c.section,
            c.academic_year,
            e.created_at,
            e.updated_at
         FROM enrollments e
         INNER JOIN students s ON e.student_id = s.id
         INNER JOIN users u ON s.user_id = u.id
         INNER JOIN classes c ON e.class_id = c.id
         WHERE e.id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

// Create Enrollment
const createEnrollment = async (
    payload: ICreateEnrollment
) => {
    try {
        const result = await pool.query(
            `INSERT INTO enrollments (
                student_id,
                class_id
            )
            VALUES ($1, $2)
            RETURNING *`,
            [
                payload.student_id,
                payload.class_id
            ]
        );

        return result.rows[0];

    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error
        ) {
            if (error.code === "23505") {
                throw new Error(
                    "This student is already enrolled in this class"
                );
            }

            if (error.code === "23503") {
                throw new Error(
                    "Student or class not found"
                );
            }
        }

        throw error;
    }
};

// Update Enrollment
const updateEnrollment = async (
    id: number,
    payload: IUpdateEnrollment
) => {
    try {
        const result = await pool.query(
            `UPDATE enrollments
             SET class_id = $2
             WHERE id = $1
             RETURNING *`,
            [
                id,
                payload.class_id
            ]
        );

        return result.rows[0] || null;

    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error
        ) {
            if (error.code === "23505") {
                throw new Error(
                    "This student is already enrolled in this class"
                );
            }

            if (error.code === "23503") {
                throw new Error("Class not found");
            }
        }

        throw error;
    }
};

// Delete Enrollment
const deleteEnrollment = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM enrollments
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0] || null;
};

// Export Enrollment Service
export const enrollmentService = {
    getAllEnrollments,
    getEnrollmentById,
    createEnrollment,
    updateEnrollment,
    deleteEnrollment
};