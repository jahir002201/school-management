import { Router } from "express";

import { authController } from "./auth.controller.js";
import { auth } from "../../middleware/auth.js";
import { authLimiter } from "../../middleware/rateLimiter.js";

const router = Router();

router.post("/register", authLimiter, authController.register);

router.post("/login", authLimiter, authController.login);

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