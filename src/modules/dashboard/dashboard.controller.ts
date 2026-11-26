import type { Request, Response } from "express";

import { dashboardService } from "./dashboard.service.js";

import { sendSuccess } from "../../utils/apiResponse.js";

// Get Dashboard Data
const getDashboardData = async (
    req: Request,
    res: Response
) => {
    try {
        const dashboard =
            await dashboardService.getDashboardData();

        return sendSuccess(
            res,
            dashboard,
            "Dashboard data retrieved successfully"
        );

    } catch (error) {
        console.error("Dashboard Error:", error);

        return res.status(500).json({
            success: false,
            message: "Failed to retrieve dashboard data"
        });
    }
};

// Export Dashboard Controller
export const dashboardController = {
    getDashboardData
};