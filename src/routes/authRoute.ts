import { Router } from "express";
import { login, register } from "../controllers/authController";
import { validateLoginInput, validateRegisterInput } from "../middleware/validateAuthInput";

const router = Router();

router.post("/register", validateRegisterInput, register);
router.post("/login", validateLoginInput, login);

export default router;
