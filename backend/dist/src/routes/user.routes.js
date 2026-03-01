"use strict";
// backend/src/routes/user.routes.ts
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const user_controller_1 = require("../controllers/user.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// GET /api/users/me
router.get("/me", auth_middleware_1.authenticate, user_controller_1.UserController.getProfile);
// PUT /api/users/me
router.put("/me", auth_middleware_1.authenticate, user_controller_1.UserController.updateProfile);
// PUT /api/users/change-password
router.put("/change-password", auth_middleware_1.authenticate, user_controller_1.UserController.changePassword);
exports.default = router;
