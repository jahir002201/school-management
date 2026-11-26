import { Router } from "express";

import { dashboardController } from "./dashboard.controller.js";
import { auth } from "../../middleware/auth.js";

const router = Router();

// Get Dashboard Data (Admin Only)
router.get(
    "/",
    auth("admin"),
    dashboardController.getDashboardData
);

export default router;