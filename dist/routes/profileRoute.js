"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const profileController_1 = require("../controllers/profileController");
const authMiddleware_1 = require("../middleware/authMiddleware");
const router = (0, express_1.Router)();
router.get("/me", authMiddleware_1.authenticate, profileController_1.getMyProfile);
router.patch("/me", authMiddleware_1.authenticate, profileController_1.updateMyProfile);
exports.default = router;
