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
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6827c3d6b2683121282808d1"
 *                       idseller:
 *                         type: string
 *                         example: "681fdfed8ff84f652a0dfb01"
 *                       title:
 *                         type: string
 *                         example: "Smartphone Samsung Galaxy S24"
 *                       description:
 *                         type: string
 *                         example: "Telemóvel usado em ótimo estado"
 *                       price:
 *                         type: number
 *                         format: float
 *                         example: 199.99
 *                       images:
 *                         type: array
 *                         items:
 *                           type: string
 *                           format: uri
 *                           example: "https://images.samsung.com/is/image/samsung/p6pim/pt/sm-a566bliceub/gallery/pt-galaxy-a56-5g-sm-a566-sm-a566bliceub-thumb-545305043?$UX_EXT2_PNG$"
 *                       condition:
 *                         type: string
 *                         example: "used"
 *                       visibility:
 *                         type: string
 *                         example: "onsale"
 *                       __v:
 *                         type: integer
 *                         example: 0
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

/**
 * @swagger
 * /api/v1/favorite/deleteFavorite:
 *   delete:
 *     summary: Remove um item dos favoritos de um usuário
 *     tags:
 *       - Favoritos
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
 *       200:
 *         description: Favorito removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Favorito removido com sucesso
 *       400:
 *         description: Dados obrigatórios ausentes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: iduser e iditem são obrigatórios
 *       404:
 *         description: Favorito não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Favorito não encontrado
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
router.delete("/favorite/deleteFavorite", favoriteController.deleteFavorite);

export default router;
