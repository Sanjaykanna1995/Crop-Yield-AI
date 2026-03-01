"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const dotenv_1 = __importDefault(require("dotenv"));
const db_1 = require("./config/db");
const drizzle_orm_1 = require("drizzle-orm");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const prediction_routes_1 = __importDefault(require("./routes/prediction.routes"));
const user_routes_1 = __importDefault(require("./routes/user.routes"));
const auth_middleware_1 = require("./middleware/auth.middleware");
const role_middleware_1 = require("./middleware/role.middleware");
const error_middleware_1 = require("./middleware/error.middleware");
const analytics_routes_1 = __importDefault(require("./routes/analytics.routes"));
const admin_routes_1 = __importDefault(require("./routes/admin.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
// Middleware
app.use(express_1.default.json());
app.use((0, cors_1.default)({
    origin: [
        "http://localhost:5173",
        "https://crop-yield-ai.vercel.app"
    ],
    credentials: true,
}));
// Health Check
app.get("/health", async (_req, res) => {
    try {
        const result = await db_1.db.execute((0, drizzle_orm_1.sql) `SELECT 1`);
        res.status(200).json({
            status: "OK",
            database: "Connected ✅",
            dbResponse: result,
        });
    }
    catch (error) {
        res.status(500).json({
            status: "ERROR",
            database: "Connection failed ❌",
            error,
        });
    }
});
// Routes
app.use("/api/auth", auth_routes_1.default);
app.use("/api/predictions", prediction_routes_1.default);
app.use("/api/users", user_routes_1.default);
app.use("/api/analytics", analytics_routes_1.default);
app.use("/api/admin", admin_routes_1.default);
// Test Protected
app.get("/api/protected", auth_middleware_1.authenticate, (req, res) => {
    res.json({
        message: "Access granted",
        user: req.user,
    });
});
// Admin Route
app.get("/api/admin-only", auth_middleware_1.authenticate, (0, role_middleware_1.authorize)("admin"), (_req, res) => {
    res.json({
        message: "Welcome Admin 👑",
    });
});
// 404
app.use((_req, res) => {
    res.status(404).json({
        message: "Route not found",
    });
});
// Global Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
