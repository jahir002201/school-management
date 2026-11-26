import { Router } from "express";

import { auth } from "../../middleware/auth.js";

import { enrollmentController } from "./enrollment.controller.js";

const router = Router();

// Admin Only
router.get(
    "/",
    auth("admin"),
    enrollmentController.getAllEnrollments
);

router.get(
    "/:id",
    auth("admin"),
    enrollmentController.getEnrollmentById
);

router.post(
    "/",
    auth("admin"),
    enrollmentController.createEnrollment
);

router.patch(
    "/:id",
    auth("admin"),
    enrollmentController.updateEnrollment
);

router.delete(
    "/:id",
    auth("admin"),
    enrollmentController.deleteEnrollment
);

export default router;