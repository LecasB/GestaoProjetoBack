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
const dbName = process.env.NODE_ENV === "development" ? "test" : "xuo_db";
const mongoUriWithDb =
  process.env.NODE_ENV === "development"
    ? `${process.env.MONGO_URI}/${dbName}`
    : `${process.env.MONGO_URI}`;

await mongoose
  .connect(mongoUriWithDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`🟢 Conectado ao MongoDB! Banco: ${dbName}`))
  .catch((err) => console.error("🔴 Erro:", err));

const corsOptions = {
  origin:
    process.env.NODE_ENV === "development" ? "http://localhost:3000" : "*",
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use("/api/v1", userRouter);

// Exporta a aplicação para Vercel
export default app;
