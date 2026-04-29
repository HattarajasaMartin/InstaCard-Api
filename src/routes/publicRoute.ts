import { Router } from "express";
import { getPublicProfile } from "../controllers/publicController";

const router = Router();

router.get("/:username", getPublicProfile);

export default router;