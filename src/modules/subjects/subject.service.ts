import pool from "../../db/index.js";

import type {
    ICreateSubject,
    IUpdateSubject
} from "./subject.interface.js";

// Get All Subjects with Pagination
const getAllSubjects = async (
    page: number = 1,
    limit: number = 10
) => {
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT
            s.id,
            s.name,
            s.class_id,
            c.name AS class_name,
            c.section,
            c.academic_year,
            s.created_at,
            s.updated_at
         FROM subjects s
         INNER JOIN classes c ON s.class_id = c.id
         ORDER BY s.id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await pool.query(
        "SELECT COUNT(*) FROM subjects"
    );

    const totalSubjects = Number(
        countResult.rows[0].count
    );

    return {
        data: result.rows,
        pagination: {
            totalSubjects,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalSubjects / limit)
        }
    };
};

// Get Single Subject
const getSubjectById = async (id: number) => {
    const result = await pool.query(
        `SELECT
            s.id,
            s.name,
            s.class_id,
            c.name AS class_name,
            c.section,
            c.academic_year,
            s.created_at,
            s.updated_at
         FROM subjects s
         INNER JOIN classes c ON s.class_id = c.id
         WHERE s.id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

// Create Subject
const createSubject = async (
    payload: ICreateSubject
) => {
    try {
        const result = await pool.query(
            `INSERT INTO subjects (
                name,
                class_id
            )
            VALUES ($1, $2)
            RETURNING *`,
            [
                payload.name,
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
                    "This subject already exists in this class"
                );
            }

            if (error.code === "23503") {
                throw new Error("Class not found");
            }
        }

        throw error;
    }
};

// Update Subject
const updateSubject = async (
    id: number,
    payload: IUpdateSubject
) => {
    try {
        const result = await pool.query(
            `UPDATE subjects
             SET
                name = COALESCE($2, name),
                class_id = COALESCE($3, class_id),
                updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
            [
                id,
                payload.name ?? null,
                payload.class_id ?? null
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
                    "This subject already exists in this class"
                );
            }

            if (error.code === "23503") {
                throw new Error("Class not found");
            }
        }

        throw error;
    }
};

// Delete Subject
const deleteSubject = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM subjects
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0] || null;
};

// Export Subject Service
export const subjectService = {
    getAllSubjects,
    getSubjectById,
    createSubject,
    updateSubject,
    deleteSubject
};