"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.register = register;
exports.login = login;
const jwt_1 = require("../utils/jwt");
const userService_1 = require("../services/userService");
async function register(req, res, next) {
    try {
        const { name, email, password, bio, avatar, headline } = req.body;
        const existingUser = await (0, userService_1.findUserByEmail)(email);
        if (existingUser) {
            return res.status(409).json({
                success: false,
                message: "Email sudah terdaftar.",
            });
        }
        const user = await (0, userService_1.createUser)({
            name,
            email,
            password,
            bio,
            avatar,
            headline,
        });
        const token = (0, jwt_1.createAccessToken)(user);
        return res.status(201).json({
            success: true,
            message: "Register berhasil.",
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        if (typeof error === "object" && error !== null && "code" in error && error.code === "P2002") {
            return res.status(409).json({
                success: false,
                message: "Email sudah terdaftar.",
            });
        }
        return next(error);
    }
}
async function login(req, res, next) {
    try {
        const { email, password } = req.body;
        const userRecord = await (0, userService_1.findUserByEmail)(email);
        if (!userRecord) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah.",
            });
        }
        const isPasswordMatch = await (0, userService_1.checkPassword)(userRecord, password);
        if (!isPasswordMatch) {
            return res.status(401).json({
                success: false,
                message: "Email atau password salah.",
            });
        }
        const user = (0, userService_1.sanitizeUser)(userRecord);
        const token = (0, jwt_1.createAccessToken)(user);
        return res.status(200).json({
            success: true,
            message: "Login berhasil.",
            data: {
                user,
                token,
            },
        });
    }
    catch (error) {
        return next(error);
    }
}
