import express, { type Request, type Response } from "express";

import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import swaggerUi from "swagger-ui-express";
import swaggerSpec from "./docs/swagger.js";

import authRouter from "./modules/auth/auth.route.js";
import usersRouter from "./modules/users/user.route.js";
import studentsRouter from "./modules/students/student.route.js";
import teachersRouter from "./modules/teachers/teacher.route.js";
import profileRouter from "./modules/profile/profile.route.js";
import classesRouter from "./modules/classes/class.route.js";
import subjectsRouter from "./modules/subjects/subject.route.js";
import enrollmentsRouter from "./modules/enrollments/enrollment.route.js";
import attendanceRouter from "./modules/attendance/attendance.route.js";
import examRouter from "./modules/exams/exam.route.js";
import resultRouter from "./modules/results/result.route.js";
import dashboardRouter from "./modules/dashboard/dashboard.route.js";

import { notFoundHandler } from "./middleware/notFound.js";
import { globalErrorHandler } from "./middleware/error.js";

const app = express();

// Security Headers
app.use(helmet());

// CORS Configuration
const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:5173",
    "http://127.0.0.1:3000",
    "http://127.0.0.1:5173",
];

app.use(cors({
    origin: (origin, callback) => {
        // Allow Postman and server-to-server requests
        if (!origin) {
            return callback(null, true);
        }

        // Allow trusted frontend origins
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }

        console.log("Blocked CORS Origin:", origin);

        // Block untrusted origins without throwing a server error
        return callback(null, false);
    },
    credentials: true,
}));

// Body Parser
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());

// Root Route
app.get("/", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Welcome to School Management System API",
    });
});

// Health Check
app.get("/health", (req: Request, res: Response) => {
    res.status(200).json({
        success: true,
        message: "Server is running successfully",
    });
});

// Swagger Documentation
app.use(
    "/api-docs",
    swaggerUi.serve,
    swaggerUi.setup(swaggerSpec)
);

// API Routes
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/users", usersRouter);
app.use("/api/v1/students", studentsRouter);
app.use("/api/v1/teachers", teachersRouter);
app.use("/api/v1/profile", profileRouter);
app.use("/api/v1/classes", classesRouter);
app.use("/api/v1/subjects", subjectsRouter);
app.use("/api/v1/enrollments", enrollmentsRouter);
app.use("/api/v1/attendance", attendanceRouter);
app.use("/api/v1/exams", examRouter);
app.use("/api/v1/results", resultRouter);
app.use("/api/v1/dashboard", dashboardRouter);

// 404 Not Found Handler
app.use(notFoundHandler);

// Global Error Handler
app.use(globalErrorHandler);

export default app;