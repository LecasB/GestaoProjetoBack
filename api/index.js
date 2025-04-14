import express from "express";
import cors from "cors";
import testeRouter from "../routes/teste.js";

const app = express();

const corsOptions = {
  origin: true,
  methods: ["GET", "POST", "DELETE", "PUT", "PATCH", "HEAD", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.options("*", cors(corsOptions));
app.use(express.json());

app.use("/api/v1", testeRouter);

const PORT = 5000;
const MODE = "development";
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT} in ${MODE} mode.`);
});
