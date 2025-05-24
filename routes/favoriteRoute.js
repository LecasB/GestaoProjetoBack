import express from "express";
import favoriteController from "../controllers/favoriteController.js";
const router = express.Router();

/**
 * @swagger
 * /api/v1/favorite/getAllByUserId/{id}:
 *   get:
 *     summary: Retorna todos os itens favoritados por um usuário
 *     tags:
 *       - Favoritos
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de itens favoritados
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Item'
 *       400:
 *         description: ID do usuário não fornecido
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Id obrigatório
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 */
router.get("/favorite/getAllByUserId/:id", favoriteController.getAllByUserId);

/**
 * @swagger
 * /api/v1/favorite/addFavorite:
 *   post:
 *     tags:
 *       - Favoritos
 *     summary: Adiciona um item aos favoritos do usuário
 *     description: Salva a relação de um usuário com um item favorito, armazenando apenas os IDs como strings.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - iduser
 *               - iditem
 *             properties:
 *               iduser:
 *                 type: string
 *                 example: "681fdfed8ff84f652a0dfb01"
 *               iditem:
 *                 type: string
 *                 example: "6827c3d6b2683121282808d1"
 *     responses:
 *       201:
 *         description: Favorito adicionado com sucesso
 *       400:
 *         description: Campos obrigatórios não preenchidos
 *       500:
 *         description: Erro interno do servidor
 */

router.post("/favorite/addFavorite", favoriteController.addFavorite);

export default router;
