import { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt";

export interface AuthRequest extends Request {
  userId?: string;
}

export function requireAuth(req: AuthRequest, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Not authenticated." });
  }

  const token = header.split(" ")[1];

  try {
    const payload = verifyToken(token) as { userId: string; email: string };
    req.userId = payload.userId;
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired session. Please log in again." });
  }
}