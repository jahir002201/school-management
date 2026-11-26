import pool from "../../db/index.js";

import type {
    ICreateExam,
    IUpdateExam
} from "./exam.interface.js";

// Get All Exams
const getAllExams = async (
    page: number,
    limit: number
) => {
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT
            e.id,
            e.class_id,
            e.subject_id,
            e.title,
            e.exam_date,
            e.total_marks,
            e.created_at,
            e.updated_at,
            c.name AS class_name,
            c.section,
            c.academic_year,
            s.name AS subject_name
         FROM exams e
         JOIN classes c ON e.class_id = c.id
         JOIN subjects s ON e.subject_id = s.id
         ORDER BY e.exam_date DESC, e.id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM exams`
    );

    const totalExams = Number(countResult.rows[0].count);

    return {
        data: result.rows,
        pagination: {
            totalExams,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalExams / limit)
        }
    };
};

// Get Single Exam
const getExamById = async (id: number) => {
    const result = await pool.query(
        `SELECT
            e.id,
            e.class_id,
            e.subject_id,
            e.title,
            e.exam_date,
            e.total_marks,
            e.created_at,
            e.updated_at,
            c.name AS class_name,
            c.section,
            c.academic_year,
            s.name AS subject_name
         FROM exams e
         JOIN classes c ON e.class_id = c.id
         JOIN subjects s ON e.subject_id = s.id
         WHERE e.id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

// Create Exam
const createExam = async (payload: ICreateExam) => {
    try {
        const {
            class_id,
            subject_id,
            title,
            exam_date,
            total_marks
        } = payload;

        const result = await pool.query(
            `INSERT INTO exams (
                class_id,
                subject_id,
                title,
                exam_date,
                total_marks
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING *`,
            [
                class_id,
                subject_id,
                title,
                exam_date,
                total_marks
            ]
        );

        return result.rows[0];

    } catch (error: unknown) {
        const dbError = error as { code?: string };

        if (dbError.code === "23503") {
            throw new Error("Class or subject not found");
        }

        throw error;
    }
};

// Update Exam
const updateExam = async (
    id: number,
    payload: IUpdateExam
) => {
    const {
        class_id,
        subject_id,
        title,
        exam_date,
        total_marks
    } = payload;

    try {
        const result = await pool.query(
            `UPDATE exams
             SET
                class_id = COALESCE($2, class_id),
                subject_id = COALESCE($3, subject_id),
                title = COALESCE($4, title),
                exam_date = COALESCE($5, exam_date),
                total_marks = COALESCE($6, total_marks),
                updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
            [
                id,
                class_id,
                subject_id,
                title,
                exam_date,
                total_marks
            ]
        );

        return result.rows[0] || null;

    } catch (error: unknown) {
        const dbError = error as { code?: string };

        if (dbError.code === "23503") {
            throw new Error("Class or subject not found");
        }

        throw error;
    }
};

// Delete Exam
const deleteExam = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM exams
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0] || null;
};

export const examService = {
    getAllExams,
    getExamById,
    createExam,
    updateExam,
    deleteExam
};