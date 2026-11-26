import pool from "../../db/index.js";

import type {
    ICreateClass,
    IUpdateClass
} from "./class.interface.js";

// Get All Classes with Pagination
const getAllClasses = async (
    page: number = 1,
    limit: number = 10
) => {
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT
            c.id,
            c.name,
            c.section,
            c.academic_year,
            c.teacher_id,
            u.name AS teacher_name,
            u.email AS teacher_email,
            c.created_at,
            c.updated_at
         FROM classes c
         LEFT JOIN teachers t ON c.teacher_id = t.id
         LEFT JOIN users u ON t.user_id = u.id
         ORDER BY c.id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await pool.query(
        "SELECT COUNT(*) FROM classes"
    );

    const totalClasses = Number(countResult.rows[0].count);

    return {
        data: result.rows,
        pagination: {
            totalClasses,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalClasses / limit)
        }
    };
};

// Get Single Class
const getClassById = async (id: number) => {
    const result = await pool.query(
        `SELECT
            c.id,
            c.name,
            c.section,
            c.academic_year,
            c.teacher_id,
            u.name AS teacher_name,
            u.email AS teacher_email,
            c.created_at,
            c.updated_at
         FROM classes c
         LEFT JOIN teachers t ON c.teacher_id = t.id
         LEFT JOIN users u ON t.user_id = u.id
         WHERE c.id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

// Create Class
const createClass = async (payload: ICreateClass) => {
    const {
        name,
        section,
        academic_year,
        teacher_id
    } = payload;

    try {
        const result = await pool.query(
            `INSERT INTO classes (
                name,
                section,
                academic_year,
                teacher_id
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                name,
                section,
                academic_year,
                teacher_id ?? null
            ]
        );

        return result.rows[0];

    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23505"
        ) {
            throw new Error(
                "This class and section already exist for this academic year"
            );
        }

        throw error;
    }
};

// Update Class
const updateClass = async (
    id: number,
    payload: IUpdateClass
) => {
    const {
        name,
        section,
        academic_year,
        teacher_id
    } = payload;

    try {
        const result = await pool.query(
            `UPDATE classes
             SET
                name = COALESCE($2, name),
                section = COALESCE($3, section),
                academic_year = COALESCE($4, academic_year),
                teacher_id = CASE
                    WHEN $5::boolean THEN $6
                    ELSE teacher_id
                END,
                updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
            [
                id,
                name ?? null,
                section ?? null,
                academic_year ?? null,
                teacher_id !== undefined,
                teacher_id ?? null
            ]
        );

        return result.rows[0] || null;

    } catch (error) {
        if (
            typeof error === "object" &&
            error !== null &&
            "code" in error &&
            error.code === "23505"
        ) {
            throw new Error(
                "This class and section already exist for this academic year"
            );
        }

        throw error;
    }
};

// Delete Class
const deleteClass = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM classes
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0] || null;
};

// Export Class Service
export const classService = {
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass
};