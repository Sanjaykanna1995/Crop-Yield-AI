import cors from "cors";
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { db } from "./config/db";
import { sql } from "drizzle-orm";
import authRoutes from "./routes/auth.routes";
import predictionRoutes from "./routes/prediction.routes";
import userRoutes from "./routes/user.routes";
import { authenticate } from "./middleware/auth.middleware";
import { authorize } from "./middleware/role.middleware";
import { errorHandler } from "./middleware/error.middleware";
import analyticsRoutes from "./routes/analytics.routes";
import adminRoutes from "./routes/admin.routes";

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Health Check
app.get("/health", async (_req: Request, res: Response) => {
  try {
    const result = await db.execute(sql`SELECT 1`);

    res.status(200).json({
      status: "OK",
      database: "Connected ✅",
      dbResponse: result,
    });
  } catch (error) {
    res.status(500).json({
      status: "ERROR",
      database: "Connection failed ❌",
      error,
    });
  }
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/predictions", predictionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/analytics", analyticsRoutes);
app.use("/api/admin", adminRoutes);

// Test Protected
app.get("/api/protected", authenticate, (req, res) => {
  res.json({
    message: "Access granted",
    user: req.user,
  });
});

// Admin Route
app.get(
  "/api/admin-only",
  authenticate,
  authorize("admin"),
  (_req, res) => {
    res.json({
      message: "Welcome Admin 👑",
    });
  }
);

// 404
app.use((_req: Request, res: Response) => {
  res.status(404).json({
    message: "Route not found",
  });
});

// Global Error Handler
app.use(errorHandler);

export default app;