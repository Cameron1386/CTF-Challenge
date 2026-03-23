import dotenv from "dotenv";
dotenv.config(); // Must be first

import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import auth from "./middleware/auth.js";
import User from "./models/User.js";
import submitRoutes from "./routes/submit.js";
import leaderboardRoutes from "./routes/leaderboard.js";
import authRoutes from "./routes/auth.js";

const app = express();
app.use(express.json());

app.use(cors({
  origin: [
    "https://pandemonium-ctf.com",
    "https://www.pandemonium-ctf.com",
    "https://api.pandemonium-ctf.com"
  ],
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Routes
app.use("/api", submitRoutes);
app.use("/leaderboard", leaderboardRoutes);
app.use("/auth", authRoutes);

app.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-passwordHash");
  res.json(user);
});

// Single DB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
