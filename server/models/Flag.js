import mongoose from "mongoose";

const flagSchema = new mongoose.Schema({
  challengeId: {
    type: String,
    required: true,
    unique: true
  },
  hash: {
    type: String,
    required: true
  },
  points: {
    type: Number,
    default: 100
  }
});

export default mongoose.model("Flag", flagSchema);

