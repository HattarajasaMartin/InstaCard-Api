import { Router } from "express";
import { getMyProfile, updateMyProfile, updateTheme } from "../controllers/profileController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", authenticate, getMyProfile);
router.patch("/me", authenticate, updateMyProfile);
router.put("/theme", authenticate, updateTheme);

export default router;