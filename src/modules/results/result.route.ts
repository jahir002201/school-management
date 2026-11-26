import { Router } from "express";

import { resultController } from "./result.controller.js";
import { auth } from "../../middleware/auth.js";

const router = Router();

// Get All Results
router.get(
    "/",
    auth("admin"),
    resultController.getAllResults
);

// Get Single Result
router.get(
    "/:id",
    auth("admin"),
    resultController.getResultById
);

// Create Result
router.post(
    "/",
    auth("admin"),
    resultController.createResult
);

// Update Result
router.patch(
    "/:id",
    auth("admin"),
    resultController.updateResult
);

// Delete Result
router.delete(
    "/:id",
    auth("admin"),
    resultController.deleteResult
);

export default router;