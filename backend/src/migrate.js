import { pool } from "./db.js";

await pool.query(`TRUNCATE sessions, email_verification_codes, users CASCADE`);
console.log("✅ Database cleared!");
process.exit(0);
