"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserController = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const db_1 = require("../config/db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
const user_dto_1 = require("../dto/user.dto");
class UserController {
    static async getProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const user = await db_1.db
                .select({
                id: schema_1.users.id,
                name: schema_1.users.name,
                email: schema_1.users.email,
                role: schema_1.users.role,
            })
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
                .limit(1);
            if (!user.length) {
                return res.status(404).json({ message: "User not found" });
            }
            return res.status(200).json(user[0]);
        }
        catch (error) {
            return res.status(500).json({ message: error.message });
        }
    }
    static async updateProfile(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const data = req.body;
            (0, user_dto_1.validateUpdateProfile)(data);
            const existingUser = await db_1.db
                .select()
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.email, data.email));
            if (existingUser.length && existingUser[0].id !== userId) {
                return res.status(400).json({
                    message: "Email already in use",
                });
            }
            const updatedUser = await db_1.db
                .update(schema_1.users)
                .set({
                name: data.name,
                email: data.email,
            })
                .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
                .returning({
                id: schema_1.users.id,
                name: schema_1.users.name,
                email: schema_1.users.email,
                role: schema_1.users.role,
            });
            return res.status(200).json({
                message: "Profile updated successfully",
                user: updatedUser[0],
            });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
    static async changePassword(req, res) {
        try {
            const userId = req.user?.id;
            if (!userId) {
                return res.status(401).json({ message: "Unauthorized" });
            }
            const data = req.body;
            (0, user_dto_1.validateChangePassword)(data);
            const user = await db_1.db
                .select()
                .from(schema_1.users)
                .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId))
                .limit(1);
            if (!user.length) {
                return res.status(404).json({ message: "User not found" });
            }
            const isMatch = await bcryptjs_1.default.compare(data.oldPassword, user[0].password);
            if (!isMatch) {
                return res.status(400).json({
                    message: "Old password is incorrect",
                });
            }
            const hashedPassword = await bcryptjs_1.default.hash(data.newPassword, 10);
            await db_1.db
                .update(schema_1.users)
                .set({ password: hashedPassword })
                .where((0, drizzle_orm_1.eq)(schema_1.users.id, userId));
            return res.status(200).json({
                message: "Password changed successfully",
            });
        }
        catch (error) {
            return res.status(400).json({ message: error.message });
        }
    }
}
exports.UserController = UserController;
