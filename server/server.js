import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import submitRoutes from "./routes/submit.js";
import leaderboardRoutes from "./routes/leaderboard.js";

dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: "http://127.0.0.1:5500", // for testing only, allows any frontend to connect
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

app.use("/api", submitRoutes);
app.use("/leaderboard", leaderboardRoutes);


mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


import authRoutes from "./routes/auth.js";
app.use("/auth", authRoutes);


app.listen(3000, () => {
  console.log("Server running on port 3000");
});


import auth from "./middleware/auth.js";
import User from "./models/User.js";

app.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-passwordHash");
  res.json(user);
});



