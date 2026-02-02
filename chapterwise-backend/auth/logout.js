export default function logoutHandler(req, res) {
  // Clear the cookie
  res.clearCookie("token", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // true in prod
    sameSite: "Strict",
  });

  // Optionally return a message
  res.json({ message: "Logged out successfully." });
}