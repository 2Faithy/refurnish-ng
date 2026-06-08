import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import authRouter from "./auth.routes.js";
import { pool } from "./db.js";

dotenv.config();

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);

app.use(express.json({ limit: "1mb" }));

app.get("/", (req, res) => {
  res.json({ message: "Refurnish API is running" });
});

app.get("/api/health", async (req, res) => {
  try {
    await pool.query("SELECT 1");
    res.json({ status: "ok", database: "connected" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: "error", database: "not connected" });
  }
});

app.use("/api/auth", authRouter);

const port = process.env.PORT || 4000;

app.listen(port, () => {
  console.log(`Refurnish API running on http://localhost:${port}`);
});

// Catch anything that slips through
process.on("uncaughtException", (err) => {
  console.error("Uncaught exception:", err);
});

process.on("unhandledRejection", (reason) => {
  console.error("Unhandled rejection:", reason);
});
