import { Router } from "express";
import passport from "passport";
import {
  signup,
  login,
  forgotPassword,
  resetPassword,
  verifyEmail,
  resendVerificationCode,
} from "../controllers/auth.controller";
import { signToken } from "../utils/jwt";

const router = Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationCode);

router.get("/google", function (req, res, next) {
  var nextUrl = typeof req.query.next === "string" ? req.query.next : "";
  passport.authenticate("google", {
    scope: ["profile", "email"],
    session: false,
    state: nextUrl,
  })(req, res, next);
});

router.get(
  "/google/callback",
  passport.authenticate("google", { session: false, failureRedirect: "/login" }),
  function (req, res) {
    var user = req.user as any;
    var token = signToken({ userId: user.id, email: user.email });
    var frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    var userPayload = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      })
    );
    var nextUrl = typeof req.query.state === "string" ? req.query.state : "";
    var nextParam = nextUrl ? "&next=" + encodeURIComponent(nextUrl) : "";
    res.redirect(frontendUrl + "/auth/callback?token=" + token + "&user=" + userPayload + nextParam);
  }
);

router.get("/facebook", function (req, res, next) {
  var nextUrl = typeof req.query.next === "string" ? req.query.next : "";
  passport.authenticate("facebook", {
    scope: ["email"],
    session: false,
    state: nextUrl,
  })(req, res, next);
});

router.get(
  "/facebook/callback",
  passport.authenticate("facebook", { session: false, failureRedirect: "/login" }),
  function (req, res) {
    var user = req.user as any;
    var token = signToken({ userId: user.id, email: user.email });
    var frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
    var userPayload = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        phone: user.phone,
      })
    );
    var nextUrl = typeof req.query.state === "string" ? req.query.state : "";
    var nextParam = nextUrl ? "&next=" + encodeURIComponent(nextUrl) : "";
    res.redirect(frontendUrl + "/auth/callback?token=" + token + "&user=" + userPayload + nextParam);
  }
);

export default router;
