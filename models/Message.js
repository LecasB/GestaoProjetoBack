import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
  idsender: { type: String, required: true },
  idreceiver: { type: String, required: true },
  date: { type: String, required: true },
  message: { type: String, required: true },
});

export default mongoose.model("Message", messageSchema);
