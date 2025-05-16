import mongoose from "mongoose";

const itemSchema = new mongoose.Schema({
  idseller: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  images: { type: [String], required: true },
  condition: {
    type: String,
    required: true,
    enum: ["new", "used", "refurbished", "broken"],
  },
  visibility: {
    type: String,
    required: true,
    enum: ["onsale", "sold", "hidden"],
  },
});

export default mongoose.model("Item", itemSchema);
