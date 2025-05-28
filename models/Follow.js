import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  idfollower: { type: String, required: true },
  idfollowed: { type: String, required: true },
});

export default mongoose.model("follow", followSchema);