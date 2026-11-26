import { Router } from "express";

import { auth } from "../../middleware/auth.js";
import { teacherController } from "./teacher.controller.js";

const router = Router();

// Get All Teachers
router.get(
    "/",
    auth("admin"),
    teacherController.getAllTeachers
);

// Get Single Teacher
router.get(
    "/:id",
    auth("admin"),
    teacherController.getTeacherById
);

// Create Teacher
router.post(
    "/",
    auth("admin"),
    teacherController.createTeacher
);

// Update Teacher
router.patch(
    "/:id",
    auth("admin"),
    teacherController.updateTeacher
);

// Delete Teacher
router.delete(
    "/:id",
    auth("admin"),
    teacherController.deleteTeacher
);

export default router;