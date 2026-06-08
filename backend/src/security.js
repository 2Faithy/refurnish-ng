import crypto from "crypto";
import { promisify } from "util";

const scryptAsync = promisify(crypto.scrypt);

export async function hashPassword(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const derivedKey = await scryptAsync(password, salt, 64);

  return `scrypt:${salt}:${derivedKey.toString("hex")}`;
}

export async function verifyPassword(password, storedHash) {
  const [method, salt, key] = storedHash.split(":");

  if (method !== "scrypt") {
    throw new Error("Unsupported password hash method");
  }

  const derivedKey = await scryptAsync(password, salt, 64);
  const storedKey = Buffer.from(key, "hex");

  return crypto.timingSafeEqual(derivedKey, storedKey);
}

export function sha256(value) {
  return crypto.createHash("sha256").update(value).digest("hex");
}

export function randomToken() {
  return crypto.randomBytes(32).toString("hex");
}

export function randomCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export function getCookie(req, name) {
  const cookieHeader = req.headers.cookie;

  if (!cookieHeader) return null;

  const cookies = cookieHeader.split(";").map((cookie) => cookie.trim());

  for (const cookie of cookies) {
    const [key, value] = cookie.split("=");

    if (key === name) {
      return decodeURIComponent(value);
    }
  }

  return null;
}
