// auth.js
import jwt from "jsonwebtoken";

/**
 * Middleware to protect routes and verify JWT tokens
 */
export default function auth(req, res, next) {
  try {
    // 1️⃣ Get the Authorization header
    const header = req.headers.authorization;
    if (!header) {
      return res.status(401).json({ error: "No token provided" });
    }

    // 2️⃣ Extract the token from "Bearer <token>"
    const parts = header.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
      return res.status(401).json({ error: "Malformed token" });
    }

    const token = parts[1];

    // 3️⃣ Verify the token using your secret
    const payload = jwt.verify(token, process.env.JWT_SECRET);

    // 4️⃣ Attach user info to request object
    req.userId = payload.id;
    req.username = payload.username; // optional, useful for front-end or logging

    // 5️⃣ Proceed to the next middleware or route
    next();
  } catch (err) {
    // 6️⃣ Catch token errors (expired, invalid, etc.)
    if (err.name === "TokenExpiredError") {
      return res.status(401).json({ error: "Token expired, please log in again" });
    }
    if (err.name === "JsonWebTokenError") {
      return res.status(401).json({ error: "Invalid token" });
    }

    console.error("Auth middleware error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
