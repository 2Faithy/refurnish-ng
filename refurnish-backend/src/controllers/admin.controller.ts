import { Request, Response } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET as string;

export async function adminLogin(req: Request, res: Response) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required." });
    }

    const validEmail = process.env.ADMIN_EMAIL;
    const validPassword = process.env.ADMIN_PASSWORD;

    if (email !== validEmail || password !== validPassword) {
      return res.status(401).json({ message: "Invalid admin credentials." });
    }

    const token = jwt.sign({ role: "admin", email }, JWT_SECRET, { expiresIn: "12h" });

    return res.status(200).json({
      token,
      admin: { email },
    });
  } catch (err) {
    console.error("Admin login error:", err);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
}