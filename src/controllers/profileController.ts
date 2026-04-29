import type { NextFunction, Request, Response } from "express";
import { findUserById, sanitizeUser, updateUser } from "../services/userService";
import type { UpdateProfileInput } from "../types/user";

interface ProfileBody {
  name?: unknown;
  bio?: unknown;
  avatar?: unknown;
  headline?: unknown;
}

function sanitizeProfileUpdateInput(body: ProfileBody): UpdateProfileInput {
  const payload: UpdateProfileInput = {};

  if (body.name !== undefined) payload.name = String(body.name).trim();
  if (body.bio !== undefined) payload.bio = body.bio === null ? null : String(body.bio).trim();
  if (body.avatar !== undefined) payload.avatar = body.avatar === null ? null : String(body.avatar).trim();
  if (body.headline !== undefined) payload.headline = body.headline === null ? null : String(body.headline).trim();

  return payload;
}

export async function getMyProfile(
  req: Request,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Token tidak valid.",
      });
    }

    const user = await findUserById(userId);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User tidak ditemukan.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Profil berhasil diambil.",
      data: sanitizeUser(user),
    });
  } catch (error) {
    return next(error);
  }
}

export async function updateMyProfile(
  req: Request<unknown, unknown, ProfileBody>,
  res: Response,
  next: NextFunction,
): Promise<Response | void> {
  try {
    const userId = req.user?.sub;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Akses ditolak. Token tidak valid.",
      });
    }

    const payload = sanitizeProfileUpdateInput(req.body);

    if (payload.name !== undefined && payload.name.length < 2) {
      return res.status(400).json({
        success: false,
        message: "Nama minimal 2 karakter.",
      });
    }

    if (Object.keys(payload).length === 0) {
      return res.status(400).json({
        success: false,
        message: "Tidak ada data profil yang dikirim.",
      });
    }

    const updatedUser = await updateUser(userId, payload);

    return res.status(200).json({
      success: true,
      message: "Profil berhasil diperbarui.",
      data: updatedUser,
    });
  } catch (error) {
    return next(error);
  }
}
