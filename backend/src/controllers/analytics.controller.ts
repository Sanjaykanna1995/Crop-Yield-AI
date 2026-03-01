import { Response, NextFunction } from "express";
import type { ExtendedAnalyticsResponse } from "../dto/analytics.dto";
import { AnalyticsService } from "../services/analytics.service";
import type { Request } from "express";

interface AuthRequest extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

export const getAnalytics = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({
        message: "Unauthorized",
      });
      return;
    }

    const userId = req.user.id;

    const analytics: ExtendedAnalyticsResponse =
      await AnalyticsService.getUserAnalytics(userId);

    res.status(200).json(analytics);
  } catch (error) {
    next(error);
  }
};