import { Router } from "express";
import { getMyProfile, updateMyProfile } from "../controllers/profileController";
import { authenticate } from "../middleware/authMiddleware";

const router = Router();

router.get("/me", authenticate, getMyProfile);
router.patch("/me", authenticate, updateMyProfile);

export default router;
