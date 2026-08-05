import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";
import { prisma } from "../config/prisma";

export interface AuthRequest extends Request {
  userId?: string;
}

export async function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const token = header.split(" ")[1];

  try {
    const payload = verifyToken(token) as { userId: string; email: string };

    // A valid JWT alone isn't enough once accounts can be deactivated/deleted —
    // check current account status on every request.
    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: { id: true, deactivatedAt: true, deletedAt: true },
    });

    if (!user || user.deletedAt) {
      return res.status(401).json({ message: "This account no longer exists. Please log in again." });
    }
    if (user.deactivatedAt) {
      return res.status(401).json({ message: "This account is deactivated. Sign in again to reactivate it." });
    }

    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session. Please log in again." });
  }
}