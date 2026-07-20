import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export function requireAdmin(req: Request, res: Response, next: NextFunction) {
  const header = req.headers.authorization;

  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ message: "Admin authentication required." });
  }

  const token = header.split(" ")[1];

  try {
    const payload = jwt.verify(token, JWT_SECRET) as { role?: string };
    if (payload.role !== "admin") {
      return res.status(403).json({ message: "Admin access required." });
    }
    next();
  } catch {
    return res.status(401).json({ message: "Invalid or expired admin session. Please log in again." });
  }
}