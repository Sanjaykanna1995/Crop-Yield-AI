"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthController = void 0;
const auth_service_1 = require("../services/auth.service");
class AuthController {
    // 🔐 REGISTER API
    static async register(req, res) {
        try {
            const { name, email, password } = req.body;
            if (!name || !email || !password) {
                return res.status(400).json({
                    message: "All fields are required",
                });
            }
            const result = await auth_service_1.AuthService.register(name, email, password);
            return res.status(201).json({
                message: "User registered successfully",
                ...result,
            });
        }
        catch (error) {
            return res.status(400).json({
                message: error.message || "Registration failed",
            });
        }
    }
    // 🔑 LOGIN API
    static async login(req, res) {
        try {
            const { email, password } = req.body;
            if (!email || !password) {
                return res.status(400).json({
                    message: "Email and password are required",
                });
            }
            const result = await auth_service_1.AuthService.login(email, password);
            return res.status(200).json({
                message: "Login successful",
                ...result,
            });
        }
        catch (error) {
            return res.status(401).json({
                message: error.message || "Login failed",
            });
        }
    }
}
exports.AuthController = AuthController;
