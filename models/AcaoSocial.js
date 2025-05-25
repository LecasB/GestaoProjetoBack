import mongoose from "mongoose";

const acaoSocialSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  images: { type: [String], required: true },
  associacao: { type: String, required: true },
  objetivos: { type: [String], required: true },
});

export default mongoose.model("acaosocial", acaoSocialSchema);
