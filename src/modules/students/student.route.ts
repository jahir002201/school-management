import { Router } from "express";

import { auth } from "../../middleware/auth.js";
import { studentController } from "./student.controller.js";

const router = Router();

// Get All Students
router.get(
    "/",
    auth("admin"),
    studentController.getAllStudents
);

// Get Single Student
router.get(
    "/:id",
    auth("admin"),
    studentController.getStudentById
);

// Create Student
router.post(
    "/",
    auth("admin"),
    studentController.createStudent
);

// Update Student
router.patch(
    "/:id",
    auth("admin"),
    studentController.updateStudent
);

// Delete Student
router.delete(
    "/:id",
    auth("admin"),
    studentController.deleteStudent
);

export default router;