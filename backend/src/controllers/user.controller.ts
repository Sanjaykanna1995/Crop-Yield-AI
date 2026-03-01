import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { db } from "../config/db";
import { users } from "../db/schema";
import { eq } from "drizzle-orm";
import {
  UpdateProfileDto,
  ChangePasswordDto,
  validateUpdateProfile,
  validateChangePassword,
} from "../dto/user.dto";

export class UserController {
  static async getProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const user = await db
        .select({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
        })
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user.length) {
        return res.status(404).json({ message: "User not found" });
      }

      return res.status(200).json(user[0]);
    } catch (error: any) {
      return res.status(500).json({ message: error.message });
    }
  }

  static async updateProfile(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data: UpdateProfileDto = req.body;

      validateUpdateProfile(data);

      const existingUser = await db
        .select()
        .from(users)
        .where(eq(users.email, data.email));

      if (existingUser.length && existingUser[0].id !== userId) {
        return res.status(400).json({
          message: "Email already in use",
        });
      }

      const updatedUser = await db
        .update(users)
        .set({
          name: data.name,
          email: data.email,
        })
        .where(eq(users.id, userId))
        .returning({
          id: users.id,
          name: users.name,
          email: users.email,
          role: users.role,
        });

      return res.status(200).json({
        message: "Profile updated successfully",
        user: updatedUser[0],
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }

  static async changePassword(req: Request, res: Response) {
    try {
      const userId = req.user?.id;

      if (!userId) {
        return res.status(401).json({ message: "Unauthorized" });
      }

      const data: ChangePasswordDto = req.body;

      validateChangePassword(data);

      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, userId))
        .limit(1);

      if (!user.length) {
        return res.status(404).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(
        data.oldPassword,
        user[0].password
      );

      if (!isMatch) {
        return res.status(400).json({
          message: "Old password is incorrect",
        });
      }

      const hashedPassword = await bcrypt.hash(data.newPassword, 10);

      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, userId));

      return res.status(200).json({
        message: "Password changed successfully",
      });
    } catch (error: any) {
      return res.status(400).json({ message: error.message });
    }
  }
}