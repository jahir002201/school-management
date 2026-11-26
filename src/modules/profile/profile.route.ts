import { Router } from "express";

import { auth } from "../../middleware/auth.js";
import { profileController } from "./profile.controller.js";

const router = Router();

// Get My Profile
router.get(
    "/me",
    auth(),
    profileController.getMyProfile
);

// Update My Profile
router.patch(
    "/me",
    auth(),
    profileController.updateMyProfile
);

// Change Password
router.patch(
    "/me/password",
    auth(),
    profileController.changePassword
);

export default router;