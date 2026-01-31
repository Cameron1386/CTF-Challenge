import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  score: { type: Number, default: 0 },          // total score
  solvedFlags: { type: [String], default: [] }  // array of solved challengeIds
});

export default mongoose.model("User", userSchema);