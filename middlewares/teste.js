import express from "express";
import { GetTeste } from "../controllers/testController.js";

const router = express.Router();

router.get("/getTest", GetTeste);

export default router;
