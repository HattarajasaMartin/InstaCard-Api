import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import type { AuthTokenPayload } from "../types/auth";

function parseTokenPayload(decoded: string | jwt.JwtPayload): AuthTokenPayload | null {
  if (typeof decoded === "string") {
    return null;
  }

  const sub = Number(decoded.sub);
  if (!Number.isInteger(sub) || sub <= 0) {
    return null;
  }

  if (typeof decoded.email !== "string" || typeof decoded.name !== "string") {
    return null;
  }

  return {
    sub,
    email: decoded.email,
    name: decoded.name,
  };
}

export function authenticate(req: Request, res: Response, next: NextFunction): Response | void {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({
      success: false,
      message: "Akses ditolak. Token tidak ditemukan atau format tidak sesuai.",
    });
  }

  const token = authHeader.split(" ")[1];

  try {
    const jwtSecret = process.env.JWT_SECRET;

    if (!jwtSecret) {
      throw new Error("JWT_SECRET belum di-set di file .env");
    }

    const decoded = jwt.verify(token, jwtSecret);
    const payload = parseTokenPayload(decoded);

    if (!payload) {
      return res.status(403).json({
        success: false,
        message: "Akses ditolak. Token tidak valid atau sudah kedaluwarsa.",
      });
    }

    req.user = payload;
    next();
  } catch (_error) {
    return res.status(403).json({
      success: false,
      message: "Akses ditolak. Token tidak valid atau sudah kedaluwarsa.",
    });
  }
}
