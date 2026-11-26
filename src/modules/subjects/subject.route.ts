import { Router } from "express";

import { auth } from "../../middleware/auth.js";

import { subjectController } from "./subject.controller.js";

const router = Router();

// Admin Only
router.get(
    "/",
    auth("admin"),
    subjectController.getAllSubjects
);

router.get(
    "/:id",
    auth("admin"),
    subjectController.getSubjectById
);

router.post(
    "/",
    auth("admin"),
    subjectController.createSubject
);

router.patch(
    "/:id",
    auth("admin"),
    subjectController.updateSubject
);

router.delete(
    "/:id",
    auth("admin"),
    subjectController.deleteSubject
);

export default router;