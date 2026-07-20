import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRoutes from "./routes/auth.routes";
import listingsRoutes from "./routes/listings.routes";
import adminRoutes from "./routes/admin.routes";
import passport from "./config/passport";
import "./config/passport-facebook";

const app = express();
const PORT = process.env.PORT || 5000;

app.use(
  cors({
    origin: ["http://localhost:3000", "https://392564-3000.csb.app"],
    credentials: true,
  })
);
app.use(express.json({ limit: "25mb" }));
app.use(cookieParser());
app.use(passport.initialize());

app.use("/api/auth", authRoutes);
app.use("/api/listings", listingsRoutes);
app.use("/api/admin", adminRoutes);

app.get("/", (_req, res) => {
  res.send("Refurnish backend is running.");
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
