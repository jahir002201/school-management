import pool from "../../db/index.js";
import type {
    ICreateAttendance,
    IUpdateAttendance
} from "./attendance.interface.js";

// Get All Attendance
const getAllAttendance = async (
    page: number,
    limit: number
) => {
    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT
            a.id,
            a.student_id,
            a.class_id,
            a.attendance_date,
            a.status,
            a.created_at,
            a.updated_at,
            u.name AS student_name,
            u.email AS student_email,
            s.admission_no,
            c.name AS class_name,
            c.section,
            c.academic_year
         FROM attendance a
         JOIN students s ON a.student_id = s.id
         JOIN users u ON s.user_id = u.id
         JOIN classes c ON a.class_id = c.id
         ORDER BY a.attendance_date DESC, a.id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await pool.query(
        `SELECT COUNT(*) FROM attendance`
    );

    const totalAttendance = Number(countResult.rows[0].count);

    return {
        data: result.rows,
        pagination: {
            totalAttendance,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalAttendance / limit)
        }
    };
};

// Get Single Attendance
const getAttendanceById = async (id: number) => {
    const result = await pool.query(
        `SELECT
            a.id,
            a.student_id,
            a.class_id,
            a.attendance_date,
            a.status,
            a.created_at,
            a.updated_at,
            u.name AS student_name,
            u.email AS student_email,
            s.admission_no,
            c.name AS class_name,
            c.section,
            c.academic_year
         FROM attendance a
         JOIN students s ON a.student_id = s.id
         JOIN users u ON s.user_id = u.id
         JOIN classes c ON a.class_id = c.id
         WHERE a.id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

// Create Attendance
const createAttendance = async (
    payload: ICreateAttendance
) => {
    try {
        const {
            student_id,
            class_id,
            attendance_date,
            status
        } = payload;

        const result = await pool.query(
            `INSERT INTO attendance (
                student_id,
                class_id,
                attendance_date,
                status
            )
            VALUES ($1, $2, $3, $4)
            RETURNING *`,
            [
                student_id,
                class_id,
                attendance_date,
                status
            ]
        );

        return result.rows[0];

    } catch (error: unknown) {
        const dbError = error as { code?: string };

        if (dbError.code === "23505") {
            throw new Error(
                "Attendance already exists for this student, class and date"
            );
        }

        if (dbError.code === "23503") {
            throw new Error(
                "Student or class not found"
            );
        }

        throw error;
    }
};

// Update Attendance
const updateAttendance = async (
    id: number,
    payload: IUpdateAttendance
) => {
    const { attendance_date, status } = payload;

    try {
        const result = await pool.query(
            `UPDATE attendance
             SET
                attendance_date = COALESCE($2, attendance_date),
                status = COALESCE($3, status),
                updated_at = NOW()
             WHERE id = $1
             RETURNING *`,
            [id, attendance_date, status]
        );

        return result.rows[0] || null;

    } catch (error: unknown) {
        const dbError = error as { code?: string };

        if (dbError.code === "23505") {
            throw new Error(
                "Attendance already exists for this student, class and date"
            );
        }

        throw error;
    }
};

// Delete Attendance
const deleteAttendance = async (id: number) => {
    const result = await pool.query(
        `DELETE FROM attendance
         WHERE id = $1
         RETURNING *`,
        [id]
    );

    return result.rows[0] || null;
};

export const attendanceService = {
    getAllAttendance,
    getAttendanceById,
    createAttendance,
    updateAttendance,
    deleteAttendance
};
