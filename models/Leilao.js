import mongoose from "mongoose";

const leilaoSchema = new mongoose.Schema({
  descricao: { type: String, required: true },
  imagem: { type: [String], required: true },
  idVendedor: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  preco: { type: Number, required: true },
  idUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "users",
    required: true,
  },
  estado: {
    type: String,
    enum: ["open", "close"],
    required: true,
  },
  dataInicio: { type: Date, required: true },
  dataFim: { type: Date, required: true },
});

export default mongoose.model("leiloes", leilaoSchema);
