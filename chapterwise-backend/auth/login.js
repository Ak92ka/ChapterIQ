import bcrypt from "bcrypt";
import db from "../db.js";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export default async function loginHandler(req, res) {
  const { email, password } = req.body;

  const user = db.prepare("SELECT * FROM users WHERE email = ?").get(email);

  if (!user) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  const match = await bcrypt.compare(password, user.password);

  if (!match) {
    return res.status(401).json({ error: "Invalid email or password" });
  }

  // Create JWT
  const token = jwt.sign(
    { id: user.id, email: user.email, subscribed: user.subscribed },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRATION || "7d" }
  );

  // Set JWT in a secure, HttpOnly cookie
  res.cookie("token", token, {
    httpOnly: true,               // JS cannot read this cookie
    // secure: process.env.NODE_ENV === "production", // only send over HTTPS in prod
    secure: false,
    sameSite: "Strict",           // protects against CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });

  // Return user info separately (without token)
  res.status(200).json({
    id: user.id,
    name: user.name,
    email: user.email,
    subscribed: user.subscribed,
    subscribedAt: user.subscribedAt,
    subscribedUntil: user.subscribedUntil,
    dailyCharacters: user.dailyCharacters,
    monthlyCharacters: user.monthlyCharacters,
  });
}
