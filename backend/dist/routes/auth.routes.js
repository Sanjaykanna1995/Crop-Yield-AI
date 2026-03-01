"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middleware/auth.middleware");
const router = (0, express_1.Router)();
// 🔐 Register
router.post("/register", auth_controller_1.AuthController.register);
// 🔑 Login
router.post("/login", auth_controller_1.AuthController.login);
// 👤 Get Current Logged-in User
router.get("/me", auth_middleware_1.authenticate, (req, res) => {
    res.json({
        user: req.user,
    });
});
exports.default = router;
