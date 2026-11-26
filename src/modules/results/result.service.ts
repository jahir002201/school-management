import pool from "../../db/index.js";

import type {
    ICreateResult,
    IUpdateResult
} from "./result.interface.js";

// Get All Results
const getAllResults = async (
    page: number,
    limit: number
) => {
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT
            r.id,
            r.exam_id,
            r.student_id,
            r.marks_obtained,
            r.grade,
            r.created_at,
            r.updated_at,
            e.title AS exam_title,
            e.total_marks,
            e.exam_date,
            u.name AS student_name,
            u.email AS student_email,
            s.admission_no
         FROM results r
         JOIN exams e ON r.exam_id = e.id
         JOIN students s ON r.student_id = s.id
         JOIN users u ON s.user_id = u.id
         ORDER BY r.id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM results`
    );

    const totalResults = Number(countResult.rows[0].count);

    return {
        data: result.rows,
        pagination: {
            totalResults,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalResults / limit)
        }
    };
};

// Get Single Result
const getResultById = async (id: number) => {
    const result = await pool.query(
        `SELECT
            r.id,
            r.exam_id,
            r.student_id,
            r.marks_obtained,
            r.grade,
            r.created_at,
            r.updated_at,
            e.title AS exam_title,
            e.total_marks,
            e.exam_date,
            u.name AS student_name,
            u.email AS student_email,
            s.admission_no
         FROM results r
         JOIN exams e ON r.exam_id = e.id
         JOIN students s ON r.student_id = s.id
         JOIN users u ON s.user_id = u.id
         WHERE r.id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

// Create Result
const createResult = async (
    payload: ICreateResult
) => {
    const {
        exam_id,
        student_id,
        marks_obtained,
        grade
    } = payload;

    // Check Exam Total Marks
    const examResult = await pool.query(
        `SELECT total_marks
         FROM exams
         WHERE id = $1`,
        [exam_id]
    );

    if (examResult.rows.length === 0) {
        throw new Error("Exam not found");
    }

    const totalMarks = Number(
        examResult.rows[0].total_marks
    );

    if (marks_obtained > totalMarks) {
        throw new Error(
            `Obtained marks cannot exceed total marks (${totalMarks})`
        );
    }

    try {
        const result = await pool.query(
            `INSERT INTO results (
                exam_id,
                student_id,
                marks_obtained,
                grade
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                exam_id,
                student_id,
                marks_obtained,
                grade ?? null
            ]
        );

        return result.rows[0];

    } catch (error: unknown) {
        const dbError = error as { code?: string };

        if (dbError.code === "23505") {
            throw new Error(
                "Result already exists for this student and exam"
            );
        }

        if (dbError.code === "23503") {
            throw new Error("Exam or student not found");
        }

        throw error;
    }
};

// Update Result
const updateResult = async (
    id: number,
    payload: IUpdateResult
) => {
    const {
        marks_obtained,
        grade
    } = payload;

    // Check Existing Result
    const existingResult = await pool.query(
        `SELECT exam_id
         FROM results
         WHERE id = $1`,
        [id]
    );

    if (existingResult.rows.length === 0) {
        return null;
    }

    // Check Exam Total Marks
    if (marks_obtained !== undefined) {
        const examResult = await pool.query(
            `SELECT total_marks
             FROM exams
             WHERE id = $1`,
            [existingResult.rows[0].exam_id]
        );

        const totalMarks = Number(
            examResult.rows[0].total_marks
        );

        if (marks_obtained > totalMarks) {
            throw new Error(
                `Obtained marks cannot exceed total marks (${totalMarks})`
            );
        }
    }

    const result = await pool.query(
        `UPDATE results
         SET
            marks_obtained = COALESCE($2, marks_obtained),
            grade = CASE
                WHEN $3::boolean THEN $4
                ELSE grade
            END,
            updated_at = NOW()
         WHERE id = $1
         RETURNING *`,
        [
            id,
            marks_obtained,
            grade !== undefined,
            grade ?? null
        ]
    );

    return result.rows[0] || null;
};

// Delete Result
const deleteResult = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM results
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0] || null;
};

// Export Result Service
export const resultService = {
    getAllResults,
    getResultById,
    createResult,
    updateResult,
    deleteResult
};