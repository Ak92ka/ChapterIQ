import crypto from "crypto";
import db from "../db.js";

export default async function forgotPassword(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  // Always return success (security best practice)
  if (!user) {
    return res.json({
      message: "If an account exists, a reset link was sent.",
    });
  }

  const token = crypto.randomBytes(32).toString("hex");
  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const expires = new Date(Date.now() + 60 * 60 * 1000).toISOString(); // 1 hour

  db.prepare(`
    UPDATE users
    SET resetToken = ?, resetTokenExpires = ?
    WHERE id = ?
  `).run(hashedToken, expires, user.id);

  const resetLink = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  // DEV: log link instead of email
  console.log("🔑 Password reset link:", resetLink);

  res.json({
    message: "If an account exists, a reset link was sent.",
  });
}
