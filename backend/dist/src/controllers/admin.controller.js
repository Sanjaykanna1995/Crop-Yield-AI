"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePrediction = exports.getAllPredictions = exports.updateUserRole = exports.deleteUser = exports.getAllUsers = exports.getSystemAnalytics = exports.getSystemOverview = void 0;
const admin_service_1 = require("../services/admin.service");
const db_1 = require("../config/db");
const schema_1 = require("../db/schema");
const drizzle_orm_1 = require("drizzle-orm");
/* =========================
   SYSTEM OVERVIEW
========================= */
const getSystemOverview = async (_req, res, next) => {
    try {
        const data = await admin_service_1.AdminAnalyticsService.getSystemOverview();
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};
exports.getSystemOverview = getSystemOverview;
/* =========================
   SYSTEM ANALYTICS
========================= */
const getSystemAnalytics = async (_req, res, next) => {
    try {
        const data = await admin_service_1.AdminAnalyticsService.getSystemAnalytics();
        res.status(200).json(data);
    }
    catch (error) {
        next(error);
    }
};
exports.getSystemAnalytics = getSystemAnalytics;
/* =========================
   USER MANAGEMENT
========================= */
const getAllUsers = async (_req, res, next) => {
    try {
        const allUsers = await db_1.db.select().from(schema_1.users);
        res.status(200).json(allUsers);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllUsers = getAllUsers;
const deleteUser = async (req, res, next) => {
    try {
        const id = req.params.id;
        await db_1.db
            .delete(schema_1.users)
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        res.status(200).json({
            message: "User deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deleteUser = deleteUser;
const updateUserRole = async (req, res, next) => {
    try {
        const id = req.params.id;
        const { role } = req.body;
        await db_1.db
            .update(schema_1.users)
            .set({ role })
            .where((0, drizzle_orm_1.eq)(schema_1.users.id, id));
        res.status(200).json({
            message: "User role updated successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.updateUserRole = updateUserRole;
/* =========================
   PREDICTION MANAGEMENT
========================= */
const getAllPredictions = async (_req, res, next) => {
    try {
        const allPredictions = await db_1.db.select().from(schema_1.predictions);
        res.status(200).json(allPredictions);
    }
    catch (error) {
        next(error);
    }
};
exports.getAllPredictions = getAllPredictions;
const deletePrediction = async (req, res, next) => {
    try {
        const id = req.params.id;
        await db_1.db
            .delete(schema_1.predictions)
            .where((0, drizzle_orm_1.eq)(schema_1.predictions.id, id));
        res.status(200).json({
            message: "Prediction deleted successfully",
        });
    }
    catch (error) {
        next(error);
    }
};
exports.deletePrediction = deletePrediction;
