import { Request, Response, NextFunction } from "express";
import { AdminAnalyticsService } from "../services/admin.service";
import { db } from "../config/db";
import { users, predictions } from "../db/schema";
import { eq } from "drizzle-orm";

/* =========================
   SYSTEM OVERVIEW
========================= */

export const getSystemOverview = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data =
      await AdminAnalyticsService.getSystemOverview();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/* =========================
   SYSTEM ANALYTICS
========================= */

export const getSystemAnalytics = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const data =
      await AdminAnalyticsService.getSystemAnalytics();
    res.status(200).json(data);
  } catch (error) {
    next(error);
  }
};

/* =========================
   USER MANAGEMENT
========================= */

export const getAllUsers = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allUsers = await db.select().from(users);
    res.status(200).json(allUsers);
  } catch (error) {
    next(error);
  }
};

export const deleteUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;

    await db
      .delete(users)
      .where(eq(users.id, id));

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

export const updateUserRole = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;
    const { role } = req.body;

    await db
      .update(users)
      .set({ role })
      .where(eq(users.id, id));

    res.status(200).json({
      message: "User role updated successfully",
    });
  } catch (error) {
    next(error);
  }
};

/* =========================
   PREDICTION MANAGEMENT
========================= */

export const getAllPredictions = async (
  _req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const allPredictions =
      await db.select().from(predictions);

    res.status(200).json(allPredictions);
  } catch (error) {
    next(error);
  }
};

export const deletePrediction = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const id = req.params.id as string;

    await db
      .delete(predictions)
      .where(eq(predictions.id, id));

    res.status(200).json({
      message: "Prediction deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};