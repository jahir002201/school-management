import { Router } from "express";

import { auth } from "../../middleware/auth.js";

import { classController } from "./class.controller.js";

const router = Router();

// Admin Only
router.get(
    "/",
    auth("admin"),
    classController.getAllClasses
);

router.get(
    "/:id",
    auth("admin"),
    classController.getClassById
);

router.post(
    "/",
    auth("admin"),
    classController.createClass
);

router.patch(
    "/:id",
    auth("admin"),
    classController.updateClass
);

router.delete(
    "/:id",
    auth("admin"),
    classController.deleteClass
);

export default router;