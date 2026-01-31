import express from "express";
import User from "../models/User.js";

const router = express.Router();

// GET /leaderboard
router.get("/", async (req, res) => {
  try {
    // Find all users, sort by score descending
    const users = await User.find({})
      .sort({ score: -1 })
      .limit(10) // top 10
      .select("username score -_id"); // only send username & score

    res.json({ success: true, users });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
