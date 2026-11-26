import { Router } from "express";

import { auth } from "../../middleware/auth.js";

import {
    attendanceController
} from "./attendance.controller.js";

const router = Router();

// Get All Attendance
router.get(
    "/",
    auth("admin"),
    attendanceController.getAllAttendance
);

// Get Single Attendance
router.get(
    "/:id",
    auth("admin"),
    attendanceController.getAttendanceById
);

// Create Attendance
router.post(
    "/",
    auth("admin"),
    attendanceController.createAttendance
);

// Update Attendance
router.patch(
    "/:id",
    auth("admin"),
    attendanceController.updateAttendance
);

// Delete Attendance
router.delete(
    "/:id",
    auth("admin"),
    attendanceController.deleteAttendance
);

export default router;