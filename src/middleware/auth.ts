import type { Request, Response, NextFunction } from "express";

import jwt from "jsonwebtoken";

import pool from "../db/index.js";
import config from "../config/index.js";

import type { Role } from "../types/index.js";

interface TokenPayload {
    id: number;
    email: string;
    role: Role;
}

export const auth = (...allowedRoles: Role[]) => {

    return async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {

        try {
            // Get Authorization Header
            const authHeader = req.headers.authorization;

            if (!authHeader || !authHeader.startsWith("Bearer ")) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication token is required"
                });
            }

            // Extract Token
            const token = authHeader.split(" ")[1];

            if (!token) {
                return res.status(401).json({
                    success: false,
                    message: "Authentication token is required"
                });
            }

            // Verify Token
            const decoded = jwt.verify(
                token,
                config.jwt_secret!
            );

            if (
                typeof decoded === "string" ||
                typeof decoded.id !== "number" ||
                typeof decoded.email !== "string" ||
                !["admin", "teacher", "student"].includes(decoded.role as string)
            ) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid authentication token"
                });
            }

            const payload = decoded as unknown as TokenPayload;

            // Check User in Database
            const result = await pool.query(
                `SELECT id, name, email, role, is_active
                 FROM users
                 WHERE id = $1 AND email = $2`,
                [payload.id, payload.email]
            );

            if (result.rows.length === 0) {
                return res.status(401).json({
                    success: false,
                    message: "User not found"
                });
            }

            const user = result.rows[0];

            // Check Active Status
            if (!user.is_active) {
                return res.status(403).json({
                    success: false,
                    message: "Your account is inactive"
                });
            }

            // Check Current Role
            if (user.role !== payload.role) {
                return res.status(401).json({
                    success: false,
                    message: "Invalid authentication token"
                });
            }

            // Attach User to Request
            req.user = {
                id: user.id,
                email: user.email,
                role: user.role as Role
            };

            // Role-Based Access Control
            if (
                allowedRoles.length > 0 &&
                !allowedRoles.includes(req.user.role)
            ) {
                return res.status(403).json({
                    success: false,
                    message: "You do not have permission to access this resource"
                });
            }

            next();

        } catch (error) {
            return res.status(401).json({
                success: false,
                message: "Invalid or expired authentication token"
            });
        }
    };
};