import pool from "../../db/index.js";

import type {
    IUpdateProfile,
    IChangePassword
} from "./profile.interface.js";

import bcrypt from "bcryptjs";

// Get My Profile
const getMyProfile = async (userId: number) => {
    const result = await pool.query(
        `SELECT
            u.id AS user_id,
            u.name,
            u.email,
            u.role,
            u.is_active,
            p.phone,
            p.address,
            p.avatar,
            p.created_at,
            p.updated_at
         FROM users u
         LEFT JOIN profiles p ON u.id = p.user_id
         WHERE u.id = $1`,
        [userId]
    );

    return result.rows[0] || null;
};

// Update My Profile
const updateMyProfile = async (
    userId: number,
    payload: IUpdateProfile
) => {
    const {
        phone,
        address,
        avatar
    } = payload;

    const result = await pool.query(
        `INSERT INTO profiles (
            user_id,
            phone,
            address,
            avatar
        )
        VALUES ($1, $3, $5, $7)

        ON CONFLICT (user_id)
        DO UPDATE SET
            phone = CASE
                WHEN $2::boolean THEN $3
                ELSE profiles.phone
            END,
            address = CASE
                WHEN $4::boolean THEN $5
                ELSE profiles.address
            END,
            avatar = CASE
                WHEN $6::boolean THEN $7
                ELSE profiles.avatar
            END,
            updated_at = NOW()

        RETURNING *`,
        [
            userId,
            phone !== undefined,
            phone ?? null,
            address !== undefined,
            address ?? null,
            avatar !== undefined,
            avatar ?? null
        ]
    );

    return result.rows[0];
};

// Change Password
const changePassword = async (
    userId: number,
    payload: IChangePassword
) => {
    const { currentPassword, newPassword } = payload;

    // Find Current User Password
    const result = await pool.query(
        `SELECT password_hash
         FROM users
         WHERE id = $1`,
        [userId]
    );

    if (result.rows.length === 0) {
        throw new Error("User not found");
    }

    const user = result.rows[0];

    // Verify Current Password
    const isPasswordMatch = await bcrypt.compare(
        currentPassword,
        user.password_hash
    );

    if (!isPasswordMatch) {
        throw new Error("Current password is incorrect");
    }

    // Hash New Password
    const hashedPassword = await bcrypt.hash(
        newPassword,
        12
    );

    // Update Password
    await pool.query(
        `UPDATE users
         SET password_hash = $1,
             updated_at = NOW()
         WHERE id = $2`,
        [hashedPassword, userId]
    );

    return true;
};

// Export Profile Service
export const profileService = {
    getMyProfile,
    updateMyProfile,
    changePassword
};