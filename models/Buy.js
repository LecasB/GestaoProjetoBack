import mongoose from "mongoose";

const followSchema = new mongoose.Schema({
  idBuyer: { type: String, required: true },
  idItem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "items",
    required: true,
  },
});

export default mongoose.model("buy", followSchema);
