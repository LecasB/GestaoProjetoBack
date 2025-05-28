import express from "express";
import buyController from "../controllers/buyController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/buy:
 *   post:
 *     summary: Cria um registro de compra e marca o item como "sold"
 *     tags:
 *       - Compras
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idBuyer:
 *                 type: string
 *                 description: ID do comprador
 *                 example: "user123"
 *               idItem:
 *                 type: string
 *                 description: ID do item comprado
 *                 example: "6655bbf8d7e3bdf1fa67a123"
 *     responses:
 *       201:
 *         description: Compra registrada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: IDs não fornecidos ou inválidos
 *       404:
 *         description: Item não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/buy", buyController.create);

/**
 * @swagger
 * /api/v1/buy/{idBuyer}:
 *   get:
 *     summary: Retorna todos os itens comprados por um comprador
 *     tags:
 *       - Compras
 *     parameters:
 *       - in: path
 *         name: idBuyer
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do comprador
 *         example: "user123"
 *     responses:
 *       200:
 *         description: Lista de itens comprados
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Item'
 *       500:
 *         description: Erro ao buscar os itens
 */

router.get("/buy/:idBuyer", buyController.getByBuyerId);

export default router;
