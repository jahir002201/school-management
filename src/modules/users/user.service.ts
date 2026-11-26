import pool from "../../db/index.js";

import type {
    IUpdateUser,
    IUpdateUserStatus
} from "./user.interface.js";

// Get All Users with Pagination
const getAllUsers = async (page: number = 1, limit: number = 10) => {

    const offset = (page - 1) * limit;

    const result = await pool.query(
        `SELECT id, name, email, role, is_active, created_at, updated_at
         FROM users
         ORDER BY id DESC
         LIMIT $1 OFFSET $2`,
        [limit, offset]
    );

    const countResult = await pool.query(
        "SELECT COUNT(*) FROM users"
    );

    const totalUsers = Number(countResult.rows[0].count);

    return {
        data: result.rows,
        pagination: {
            totalUsers,
            currentPage: page,
            limit,
            totalPages: Math.ceil(totalUsers / limit)
        }
    };
};

// Get Single User
const getUserById = async (id: number) => {

    const result = await pool.query(
        `SELECT id, name, email, role, is_active, created_at, updated_at
         FROM users
         WHERE id = $1`,
        [id]
    );

    return result.rows[0] || null;
};

// Update User
const updateUser = async (
    id: number,
    payload: IUpdateUser
) => {

    const { name, email, role } = payload;

    try {
        const result = await pool.query(
            `UPDATE users
             SET
                name = COALESCE($2, name),
                email = COALESCE($3, email),
                role = COALESCE($4, role),
                updated_at = NOW()
             WHERE id = $1
             RETURNING id, name, email, role, is_active, created_at, updated_at`,
            [
                id,
                name ?? null,
                email?.toLowerCase() ?? null,
                role ?? null
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
            throw new Error("Email already exists");
        }

        throw error;
    }
};

// Update User Status
const updateUserStatus = async (
    id: number,
    payload: IUpdateUserStatus
) => {

    const result = await pool.query(
        `UPDATE users
         SET is_active = $2,
             updated_at = NOW()
         WHERE id = $1
         RETURNING id, name, email, role, is_active`,
        [id, payload.is_active]
    );

    return result.rows[0] || null;
};

// Deactivate User Instead of Permanent Delete
const deleteUser = async (id: number) => {

    const result = await pool.query(
        `UPDATE users
         SET is_active = FALSE,
             updated_at = NOW()
         WHERE id = $1
         RETURNING id, name, email, role, is_active`,
        [id]
    );

    return result.rows[0] || null;
};

export const userService = {
    getAllUsers,
    getUserById,
    updateUser,
    updateUserStatus,
    deleteUser
};