import dotenv from "dotenv";
import express from "express";
import cors from "cors";
import mongoose from "mongoose";

import submitRoutes from "./routes/submit.js";
import leaderboardRoutes from "./routes/leaderboard.js";

const FRONTEND = "http://127.0.0.1:5500"


dotenv.config();

const app = express();
app.use(express.json());

app.use(cors({
  origin: ["https://ctf-challenge-nine.vercel.app", FRONTEND], // for testing only, allows any frontend to connect
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


const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});


import auth from "./middleware/auth.js";
import User from "./models/User.js";

app.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.userId).select("-passwordHash");
  res.json(user);
});

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => console.log("MongoDB connected"))
  .catch(err => console.error(err));


