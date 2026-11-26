import bcrypt from "bcryptjs";
import pool from "../db/index.js";

const createAdmin = async () => {
    try {
        // Get Admin Information
        const name = process.env.ADMIN_NAME?.trim();
        const email = process.env.ADMIN_EMAIL?.trim().toLowerCase();
        const password = process.env.ADMIN_PASSWORD;

        // Validate Information
        if (!name || !email || !password) {
            throw new Error("Admin information is missing");
        }

        if (password.length < 8) {
            throw new Error("Password must be at least 8 characters");
        }

        // Check Existing User
        const existingUser = await pool.query(
            "SELECT id, role FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            if (existingUser.rows[0].role === "admin") {
                console.log("Admin account already exists");
                return;
            }

            throw new Error(
                "This email already belongs to a non-admin user"
            );
        }

        // Hash Password
        const hashedPassword = await bcrypt.hash(password, 12);

        // Create Admin
        const result = await pool.query(
            `INSERT INTO users (name, email, password_hash, role)
             VALUES ($1, $2, $3, $4)
             RETURNING id, name, email, role`,
            [name, email, hashedPassword, "admin"]
        );

        console.log("Admin Account Created Successfully!");
        console.log(result.rows[0]);

    } catch (error) {
        console.error("Admin Creation Failed:", error);
        process.exitCode = 1;
    } finally {
        await pool.end();
    }
};

createAdmin();