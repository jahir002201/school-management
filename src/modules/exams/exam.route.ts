import { Router } from "express";

import { auth } from "../../middleware/auth.js";

import { examController } from "./exam.controller.js";

const router = Router();

// Get All Exams
router.get(
    "/",
    auth("admin"),
    examController.getAllExams
);

// Get Single Exam
router.get(
    "/:id",
    auth("admin"),
    examController.getExamById
);

// Create Exam
router.post(
    "/",
    auth("admin"),
    examController.createExam
);

// Update Exam
router.patch(
    "/:id",
    auth("admin"),
    examController.updateExam
);

// Delete Exam
router.delete(
    "/:id",
    auth("admin"),
    examController.deleteExam
);

export default router;