import express from "express";
import Flag from "../models/Flag.js";
import User from "../models/User.js";
import bcrypt from "bcrypt";
import auth from "../middleware/auth.js";

const router = express.Router();

router.post("/submit", auth, async (req, res) => {
  try {
    const { challenge, answer } = req.body;

    // 1️⃣ Find the flag in DB
    const flag = await Flag.findOne({ challengeId: challenge });
    if (!flag) {
      return res.status(404).json({ success: false, message: "Challenge not found" });
    }

    // 2️⃣ Check if the answer is correct
    const isCorrect = await bcrypt.compare(answer, flag.hash);
    if (!isCorrect) {
      return res.json({ success: false, message: "Incorrect flag" });
    }

    // 3️⃣ Fetch the user
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    // 4️⃣ Prevent double solves
    if (user.solvedFlags.includes(challenge)) {
      return res.json({ success: true, message: "Flag already solved!", score: user.score });
    }

    // 5️⃣ Update score and solved flags
    user.solvedFlags.push(challenge);
    user.score += 100; // you can change this to different point values per flag
    await user.save();

    // 6️⃣ Send response including updated score
    return res.json({ success: true, message: "Correct! Score updated.", score: user.score });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
});

export default router;
