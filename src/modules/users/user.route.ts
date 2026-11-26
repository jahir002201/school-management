import { Router } from "express";

import { auth } from "../../middleware/auth.js";
import { userController } from "./user.controller.js";

const router = Router();

// Get All Users
router.get(
    "/",
    auth("admin"),
    userController.getAllUsers
);

// Get Single User
router.get(
    "/:id",
    auth("admin"),
    userController.getUserById
);

// Update User
router.patch(
    "/:id",
    auth("admin"),
    userController.updateUser
);

// Update User Status
router.patch(
    "/:id/status",
    auth("admin"),
    userController.updateUserStatus
);

// Delete User (Soft Delete)
router.delete(
    "/:id",
    auth("admin"),
    userController.deleteUser
);

export default router;