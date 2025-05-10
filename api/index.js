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

// Verifica se está em ambiente local, por exemplo, verificando a variável de ambiente NODE_ENV
const isLocalhost = process.env.NODE_ENV === "development";

// Define o nome do banco de dados com base no ambiente
const dbName = isLocalhost ? "test" : "xou_db";

// Monta a URI final com o nome do banco
const mongoUriWithDb = `${process.env.MONGO_URI}/${dbName}`;

// Conexão com MongoDB
mongoose
  .connect(mongoUriWithDb, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log(`🟢 Conectado ao MongoDB! Banco: ${dbName}`))
  .catch((err) => console.error("🔴 Erro:", err));

const corsOptions = {
  origin: isLocalhost ? "http://localhost:3000" : "*", // ou '*' em dev
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions)); // Preflight

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Swagger
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rotas
app.use("/api/v1", userRouter);

// Iniciar servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
});

export default app;
