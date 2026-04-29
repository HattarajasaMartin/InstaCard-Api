import cors from "cors";
import express from "express";
import { errorHandler, notFoundHandler } from "./middleware/errorMiddleware";
import authRoutes from "./routes/authRoute";
import profileRoutes from "./routes/profileRoute";
import userRoutes from "./routes/userRoute";
import linkRoute from "./routes/link.route";
import publicRoute from "./routes/publicRoute";

const app = express();
const allowedOrigin = process.env.FRONTEND_URL || "*";

app.use(
  cors({
    origin: allowedOrigin,
  }),
);
app.use(express.json());

app.get("/api/health", (_req, res) => {
  res.status(200).json({
    success: true,
    message: "API is running",
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/profiles", profileRoutes);
app.use("/api/links", linkRoute);
app.use("/u", publicRoute);

app.use(notFoundHandler);
app.use(errorHandler);

export default app;