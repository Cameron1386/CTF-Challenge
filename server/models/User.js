import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  username: { type: String, unique: true },
  email: String,
  passwordHash: String,
  solvedFlags: [{ type: mongoose.Schema.Types.ObjectId, ref: "Flag" }]
});

export default mongoose.model("User", UserSchema);
