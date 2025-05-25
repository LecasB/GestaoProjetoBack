import mongoose from "mongoose";

const reviewsSchema = new mongoose.Schema({
  idUser: { type: String, required: true },
  idVendor: { type: String, required: true },
  rate: { type: Number, required: true },
});

export default mongoose.model("reviews", reviewsSchema);
