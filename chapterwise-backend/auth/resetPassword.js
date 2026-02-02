import bcrypt from "bcrypt";
import crypto from "crypto";
import db from "../db.js";

export default async function resetPassword(req, res) {
  const { token, password } = req.body;

  if (!token || !password) {
    return res.status(400).json({ error: "Invalid request" });
  }

  if (password.length < 8) {
    return res.status(400).json({
      error: "Password must be at least 8 characters",
    });
  }

  const hashedToken = crypto
    .createHash("sha256")
    .update(token)
    .digest("hex");

  const user = db.prepare(`
    SELECT * FROM users
    WHERE resetToken = ?
      AND resetTokenExpires > ?
  `).get(hashedToken, new Date().toISOString());

  if (!user) {
    return res.status(400).json({
      error: "Token is invalid or expired",
    });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.prepare(`
    UPDATE users
    SET password = ?,
        resetToken = NULL,
        resetTokenExpires = NULL
    WHERE id = ?
  `).run(hashedPassword, user.id);

  res.json({
    message: "Password updated successfully. You can now log in.",
  });
}
