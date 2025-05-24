import mongoose from "mongoose";

const favoritoSchema = new mongoose.Schema({
  iduser: { type: String, required: true },
  iditem: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "items",
    required: true,
  },
});

export default mongoose.model("Favorito", favoritoSchema);
