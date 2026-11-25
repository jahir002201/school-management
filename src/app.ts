import express, { type Request, type Response } from "express";

import cors from "cors";
import cookieParser from "cookie-parser";

import authRouter from "./modules/auth/auth.route.js";

const app = express();

// Middleware
app.use(cors({
    origin: "http://localhost:3000",
    credentials: true
}));

app.use(express.json());
app.use(cookieParser());

// Root Route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to School Management System API"
    });
});

// Health Check
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Server is running successfully"
    });
});

// Auth Routes
app.use("/api/v1/auth", authRouter);

export default app;