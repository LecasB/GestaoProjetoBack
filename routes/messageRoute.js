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
 *   post:
 *     tags:
 *       - Mensagens
 *     summary: Obter mensagens entre dois utilizadores
 *     description: Retorna todas as mensagens trocadas entre dois utilizadores.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idsender
 *               - idreceiver
 *             properties:
 *               idsender:
 *                 type: string
 *                 example: "user123"
 *               idreceiver:
 *                 type: string
 *                 example: "user456"
 *     responses:
 *       200:
 *         description: Lista de mensagens
 *       400:
 *         description: Parâmetros ausentes
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/getMessages", MessageController.getMessages);

/**
 * @swagger
 * /api/v1/getUserConversations:
 *   post:
 *     tags:
 *       - Mensagens
 *     summary: Listar IDs de utilizadores com quem o user comunicou
 *     description: Retorna uma lista de IDs únicos dos utilizadores que tiveram conversas com o utilizador especificado.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - userId
 *             properties:
 *               userId:
 *                 type: string
 *                 example: 681fdfed8ff84f652a0dfb01
 *     responses:
 *       200:
 *         description: Lista de IDs de utilizadores com quem houve conversa
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 users:
 *                   type: array
 *                   items:
 *                     type: string
 *                   example: ["681fdfed8ff84f652a0dfb01", "681fdfed8ff84f652a0dfb03"]
 *       400:
 *         description: userId não fornecido
 *       500:
 *         description: Erro interno do servidor
 */

router.post("/getUserConversations", MessageController.getMessagesByUser);

export default router;
