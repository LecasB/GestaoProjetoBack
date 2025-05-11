import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { swaggerSpec, swaggerUi } from "../utils/swagger.js";
import userRouter from "../routes/userRoute.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

const isLocalhost = process.env.NODE_ENV === "development";

// Monta a URI correta dependendo do ambiente
const mongoUriWithDb = isLocalhost
  ? `${process.env.MONGO_URI}/test`
  : process.env.MONGO_URI;

mongoose
  .connect(mongoUriWithDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() =>
    console.log(
      `🟢 Conectado ao MongoDB! Banco: ${isLocalhost ? "test" : "xou_db"}`
    )
  )
  .catch((err) => console.error("🔴 Erro:", err));

const corsOptions = {
  origin: isLocalhost ? "http://localhost:3000" : true,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", userRouter);

app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
});

export default app;
