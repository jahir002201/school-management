import pool from "../../db/index.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import config from "../../config/index.js";

import type {
    IRegister,
    ILogin
} from "./auth.interface.js";

// Registration
const registerUser = async (payload: IRegister) => {

    const { name, email, password } = payload;

    // Check existing user
    const existingUser = await pool.query(
        "SELECT id FROM users WHERE email = $1",
        [email.toLowerCase()]
    );

    if (existingUser.rows.length > 0) {
        throw new Error("Email already exists");
    }

    // Hash Password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Save User
    const result = await pool.query(
        `INSERT INTO users (name, email, password_hash)
         VALUES ($1, $2, $3)
         RETURNING id, name, email, role, created_at`,
        [name, email.toLowerCase(), hashedPassword]
    );

    return result.rows[0];
};


// Login
const loginUser = async (payload: ILogin) => {

    const { email, password } = payload;

    // Find User
    const result = await pool.query(
        `SELECT id, name, email, password_hash, role, is_active
         FROM users
         WHERE email = $1`,
        [email.toLowerCase()]
    );

    if (result.rows.length === 0) {
        throw new Error("Invalid email or password");
    }

    const user = result.rows[0];

    // Check Active Status
    if (!user.is_active) {
        throw new Error("Your account is inactive");
    }

    // Compare Password
    const isPasswordMatched = await bcrypt.compare(
        password,
        user.password_hash
    );

    if (!isPasswordMatched) {
        throw new Error("Invalid email or password");
    }

    // Generate JWT
    const accessToken = jwt.sign(
        {
            id: user.id,
            email: user.email,
            role: user.role
        },
        config.jwt_secret!,
        {
            expiresIn: "1d"
        }
    );

    return {
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        },
        accessToken
    };
};

export const authService = {
    registerUser,
    loginUser
};