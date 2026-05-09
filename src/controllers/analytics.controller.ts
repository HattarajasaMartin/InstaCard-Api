import type { NextFunction, Request, Response } from "express";
import { getLinkAnalytics, getAnalyticsSummary, recordClick } from "../services/analytics.service";

// GET /api/analytics/links/:id
export async function getLinkAnalyticsHandler(
  req: Request<{ id: string }>,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { id } = req.params;

    const data = await getLinkAnalytics(id, Number(userId));

    if (!data) {
      return res.status(404).json({
        success: false,
        message: "Link tidak ditemukan atau bukan milik Anda.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Analitik link berhasil diambil.",
      data,
    });
  } catch (error) {
    return next(error);
  }
}

// GET /api/analytics/summary
export async function getAnalyticsSummaryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const userId = req.user?.sub;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const data = await getAnalyticsSummary(Number(userId));

    return res.status(200).json({
      success: true,
      message: "Summary analitik berhasil diambil.",
      data,
    });
  } catch (error) {
    return next(error);
  }
}

// POST /u/:username/links/:id/click
export async function recordClickHandler(
  req: Request<{ username: string; id: string }>,
  res: Response,
  next: NextFunction
): Promise<Response | void> {
  try {
    const { id } = req.params;

    const ip =
      (req.headers["x-forwarded-for"] as string)?.split(",")[0].trim() ||
      req.socket.remoteAddress ||
      "unknown";

    const userAgent = req.headers["user-agent"] || "unknown";

    await recordClick(id, ip, userAgent);

    return res.status(200).json({
      success: true,
      message: "Klik berhasil direcord.",
    });
  } catch (error) {
    return next(error);
  }
}