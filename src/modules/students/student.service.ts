import pool from "../../db/index.js";

import type {
    ICreateStudent,
    IUpdateStudent
} from "./student.interface.js";

// Get All Students with Pagination
const getAllStudents = async (
    page: number = 1,
    limit: number = 10
) => {
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT
            s.id,
            s.user_id,
            u.name,
            u.email,
            s.admission_no,
            s.date_of_birth,
            s.guardian_name,
            s.guardian_phone,
            s.created_at,
            s.updated_at
         FROM students s
         INNER JOIN users u ON s.user_id = u.id
         ORDER BY s.id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await pool.query(
        "SELECT COUNT(*) FROM students"
    );

    const totalStudents = Number(countResult.rows[0].count);

    return {
        data: result.rows,
        pagination: {
            totalStudents,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalStudents / limit)
        }
    };
};

// Get Single Student
const getStudentById = async (id: number) => {
    const result = await pool.query(
        `SELECT
            s.id,
            s.user_id,
            u.name,
            u.email,
            s.admission_no,
            s.date_of_birth,
            s.guardian_name,
            s.guardian_phone,
            s.created_at,
            s.updated_at
         FROM students s
         INNER JOIN users u ON s.user_id = u.id
         WHERE s.id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

// Create Student
const createStudent = async (payload: ICreateStudent) => {
    const {
        user_id,
        admission_no,
        date_of_birth,
        guardian_name,
        guardian_phone
    } = payload;

    const result = await pool.query(
        `INSERT INTO students (
            user_id,
            admission_no,
            date_of_birth,
            guardian_name,
            guardian_phone
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *`,
        [
            user_id,
            admission_no,
            date_of_birth ?? null,
            guardian_name ?? null,
            guardian_phone ?? null
        ]
    );

    return result.rows[0];
};

// Update Student
const updateStudent = async (
    id: number,
    payload: IUpdateStudent
) => {
    const {
        admission_no,
        date_of_birth,
        guardian_name,
        guardian_phone
    } = payload;

    try {
        const result = await pool.query(
            `UPDATE students
             SET
                admission_no = COALESCE($2, admission_no),
                date_of_birth = CASE
                    WHEN $3::boolean THEN $4::date
                    ELSE date_of_birth
                END,
                guardian_name = CASE
                    WHEN $5::boolean THEN $6
                    ELSE guardian_name
                END,
                guardian_phone = CASE
                    WHEN $7::boolean THEN $8
                    ELSE guardian_phone
                END,
                updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
            [
                id,
                admission_no ?? null,
                date_of_birth !== undefined,
                date_of_birth ?? null,
                guardian_name !== undefined,
                guardian_name ?? null,
                guardian_phone !== undefined,
                guardian_phone ?? null
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
            throw new Error("Admission number or user already exists");
        }

        throw error;
    }
};

// Delete Student
const deleteStudent = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM students
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0] || null;
};

// Export Student Service
export const studentService = {
    getAllStudents,
    getStudentById,
    createStudent,
    updateStudent,
    deleteStudent
};