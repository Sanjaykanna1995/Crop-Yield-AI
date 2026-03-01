"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAnalytics = void 0;
const analytics_service_1 = require("../services/analytics.service");
const getAnalytics = async (req, res, next) => {
    try {
        if (!req.user) {
            res.status(401).json({
                message: "Unauthorized",
            });
            return;
        }
        const userId = req.user.id;
        const analytics = await analytics_service_1.AnalyticsService.getUserAnalytics(userId);
        res.status(200).json(analytics);
    }
    catch (error) {
        next(error);
    }
};
exports.getAnalytics = getAnalytics;
