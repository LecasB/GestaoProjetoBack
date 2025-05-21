import mongoose from "mongoose";
const newsSchema = new mongoose.Schema({
  image: { type: String, required: false },
  title: { type: String, required: true },
  redirection: { type: String, required: true },
});

export default mongoose.model("news", newsSchema);
