import pool from "../../db/index.js";

import type {
    ICreateTeacher,
    IUpdateTeacher
} from "./teacher.interface.js";

// Get All Teachers with Pagination
const getAllTeachers = async (
    page: number = 1,
    limit: number = 10
) => {
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT
            t.id,
            t.user_id,
            u.name,
            u.email,
            t.employee_no,
            t.qualification,
            t.hire_date,
            t.created_at,
            t.updated_at
         FROM teachers t
         INNER JOIN users u ON t.user_id = u.id
         ORDER BY t.id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await pool.query(
        "SELECT COUNT(*) FROM teachers"
    );

    const totalTeachers = Number(countResult.rows[0].count);

    return {
        data: result.rows,
        pagination: {
            totalTeachers,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalTeachers / limit)
        }
    };
};

// Get Single Teacher
const getTeacherById = async (id: number) => {
    const result = await pool.query(
        `SELECT
            t.id,
            t.user_id,
            u.name,
            u.email,
            t.employee_no,
            t.qualification,
            t.hire_date,
            t.created_at,
            t.updated_at
         FROM teachers t
         INNER JOIN users u ON t.user_id = u.id
         WHERE t.id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

// Create Teacher
const createTeacher = async (payload: ICreateTeacher) => {
    const {
        user_id,
        employee_no,
        qualification,
        hire_date
    } = payload;

    const result = await pool.query(
        `INSERT INTO teachers (
            user_id,
            employee_no,
            qualification,
            hire_date
        )
        VALUES ($1, $2, $3, $4)
        RETURNING *`,
        [
            user_id,
            employee_no,
            qualification ?? null,
            hire_date ?? null
        ]
    );

    return result.rows[0];
};

// Update Teacher
const updateTeacher = async (
    id: number,
    payload: IUpdateTeacher
) => {
    const {
        employee_no,
        qualification,
        hire_date
    } = payload;

    try {
        const result = await pool.query(
            `UPDATE teachers
             SET
                employee_no = COALESCE($2, employee_no),
                qualification = CASE
                    WHEN $3::boolean THEN $4
                    ELSE qualification
                END,
                hire_date = CASE
                    WHEN $5::boolean THEN $6::date
                    ELSE hire_date
                END,
                updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
            [
                id,
                employee_no ?? null,
                qualification !== undefined,
                qualification ?? null,
                hire_date !== undefined,
                hire_date ?? null
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
            throw new Error("Employee number or user already exists");
        }

        throw error;
    }
};

// Delete Teacher
const deleteTeacher = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM teachers
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0] || null;
};

// Export Teacher Service
export const teacherService = {
    getAllTeachers,
    getTeacherById,
    createTeacher,
    updateTeacher,
    deleteTeacher
};