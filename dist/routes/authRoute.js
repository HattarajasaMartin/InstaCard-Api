"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const authController_1 = require("../controllers/authController");
const validateAuthInput_1 = require("../middleware/validateAuthInput");
const router = (0, express_1.Router)();
router.post("/register", validateAuthInput_1.validateRegisterInput, authController_1.register);
router.post("/login", validateAuthInput_1.validateLoginInput, authController_1.login);
exports.default = router;
