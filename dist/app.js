"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const errorMiddleware_1 = require("./middleware/errorMiddleware");
const authRoute_1 = __importDefault(require("./routes/authRoute"));
const profileRoute_1 = __importDefault(require("./routes/profileRoute"));
const userRoute_1 = __importDefault(require("./routes/userRoute"));
const app = (0, express_1.default)();
const allowedOrigin = process.env.FRONTEND_URL || "*";
app.use((0, cors_1.default)({
    origin: allowedOrigin,
}));
app.use(express_1.default.json());
app.get("/api/health", (_req, res) => {
    res.status(200).json({
        success: true,
        message: "API is running",
    });
});
app.use("/api/auth", authRoute_1.default);
app.use("/api/users", userRoute_1.default);
app.use("/api/profiles", profileRoute_1.default);
app.use(errorMiddleware_1.notFoundHandler);
app.use(errorMiddleware_1.errorHandler);
exports.default = app;
