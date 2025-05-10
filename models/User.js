import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  image: {
    type: String,
    required: false,
    default: "https://i.ibb.co/chLJhfGz/default-icon.jpg",
  },
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  descricao: { type: String, required: true },
});

export default mongoose.model("users", userSchema);
