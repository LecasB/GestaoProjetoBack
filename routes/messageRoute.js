import express from "express";
import MessageController from "../controllers/messageController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/newMessage:
 *   post:
 *     tags:
 *       - Mensagens
 *     summary: Enviar uma nova mensagem
 *     description: Cria uma nova mensagem entre dois utilizadores.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idsender
 *               - idreceiver
 *               - date
 *               - message
 *             properties:
 *               idsender:
 *                 type: string
 *                 example: "user123"
 *               idreceiver:
 *                 type: string
 *                 example: "user456"
 *               date:
 *                 type: string
 *                 example: "2025-05-11T14:33:00Z"
 *               message:
 *                 type: string
 *                 example: "Olá, tudo bem?"
 *     responses:
 *       201:
 *         description: Mensagem criada com sucesso
 *       400:
 *         description: Dados inválidos
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/newMessage", MessageController.createMessage);

/**
 * @swagger
 * /api/v1/getMessages:
 *   get:
 *     tags:
 *       - Mensagens
 *     summary: Obter mensagens entre dois utilizadores
 *     description: Retorna todas as mensagens trocadas entre dois utilizadores.
 *     parameters:
 *       - in: query
 *         name: idsender
 *         required: true
 *         schema:
 *           type: string
 *         example: "user123"
 *       - in: query
 *         name: idreceiver
 *         required: true
 *         schema:
 *           type: string
 *         example: "user456"
 *     responses:
 *       200:
 *         description: Lista de mensagens
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Message'
 *       400:
 *         description: Parâmetros ausentes
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/getMessages", MessageController.getMessages);

export default router;
