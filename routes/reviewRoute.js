import express from "express";
import reviewController from "../controllers/reviewController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/review:
 *   post:
 *     summary: Criar uma nova avaliação (review) para um vendedor
 *     tags:
 *       - Reviews
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               idUser:
 *                 type: string
 *                 example: "654d3c...f33"
 *               idVendor:
 *                 type: string
 *                 example: "vendor123"
 *               rate:
 *                 type: integer
 *                 minimum: 1
 *                 maximum: 5
 *                 example: 4
 *     responses:
 *       201:
 *         description: Review criada com sucesso
 *       400:
 *         description: Dados inválidos ou campos obrigatórios ausentes
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/review", reviewController.create);

/**
 * @swagger
 * /api/v1/review/{id}:
 *   get:
 *     summary: Obter total de reviews e média de avaliação de um vendedor
 *     tags:
 *       - Reviews
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do vendedor (idVendor)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Estatísticas de reviews do vendedor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalReviews:
 *                   type: integer
 *                   example: 8
 *                 averageRate:
 *                   type: integer
 *                   example: 4
 *       500:
 *         description: Erro ao buscar estatísticas de reviews
 */
router.get("/review/:id", reviewController.getRateById);

export default router;
