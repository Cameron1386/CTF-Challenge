import mongoose from "mongoose";

const FlagSchema = new mongoose.Schema({
  name: String,
  hash: String,
  points: Number
});

export default mongoose.model("Flag", FlagSchema);
