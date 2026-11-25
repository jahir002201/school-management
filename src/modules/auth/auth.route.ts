import { Router } from "express";

import { authController } from "./auth.controller.js";
import { auth } from "../../middleware/auth.js";

const router = Router();

router.post("/register", authController.register);

router.post("/login", authController.login);

// Protected Route
router.get("/me", auth(), authController.me);

// Admin Only Test Route
router.get(
    "/admin-test",
    auth("admin"),
    (req, res) => {
        res.status(200).json({
            success: true,
            message: "Welcome Admin!",
            user: req.user
        });
    }
);

export default router;