import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import { swaggerSpec, swaggerUi } from "../utils/swagger.js";
import userRouter from "../routes/userRoute.js";
import messageRouter from "../routes/messageRoute.js";
import itemRouter from "../routes/itemRoute.js";
import newsRoute from "../routes/newsRoute.js";
import favoriteRouter from "../routes/favoriteRoute.js";
import acaoSocialRoute from "../routes/acaoSocialRoute.js";
import reviewRouter from "../routes/reviewRoute.js";
import followRouter from "../routes/followRoute.js";

import leilaoRoute from "../routes/leilaoRoute.js";
import { createServer } from "http";
import { Server as SocketIOServer } from "socket.io"; // Ensure Socket.IO is imported correctly

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../.env") });

const app = express();
const PORT = process.env.PORT || 3000;

const isLocalhost = process.env.NODE_ENV === "development";

// Create the HTTP server to run with Express
const server = createServer(app);

// Initialize the Socket.IO server using the existing server
const io = new SocketIOServer(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

export const socket = io; // Export socket.io instance for usage

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
  origin: isLocalhost ? "http://localhost:3000" : "*",
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(express.static(path.join("public")));

app.get("/", (req, res) => {
  res.sendFile(path.join("public", "index.html"));
});

app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));
app.use("/api/v1", userRouter);
app.use("/api/v1", messageRouter);
app.use("/api/v1", itemRouter);
app.use("/api/v1", newsRoute);
app.use("/api/v1", favoriteRouter);
app.use("/api/v1", acaoSocialRoute);
app.use("/api/v1", reviewRouter);
app.use("/api/v1", followRouter);

app.use("/api/v1", leilaoRoute);

// Listen on the HTTP server
server.listen(PORT, () => {
  console.log(`🚀 Servidor Express a correr em http://localhost:${PORT}`);
});

export default app;
