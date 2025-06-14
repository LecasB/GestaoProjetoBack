import followController from "../controllers/followController.js";
import express from "express";
const router = express.Router();

/**
 * @swagger
 * /api/v1/follow/status/{id}:
 *   get:
 *     summary: Retorna seguidores e seguidos por um usuário
 *     tags:
 *       - Seguidores
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de seguidores e seguidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 followers:
 *                   type: array
 *                   items:
 *                     type: object
 *
 *                 following:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: ID do usuário não fornecido
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao buscar seguidores e seguidos
 */
router.get(
  "/follow/status/:id",
  followController.getFollowerAndFollowingByUserId
);

/**
 * @swagger
 * /api/v1/follow/new:
 *   post:
 *     summary: Adiciona um novo seguidor
 *     tags:
 *       - Seguidores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idfollower
 *               - idfollowed
 *             properties:
 *               idfollower:
 *                 type: string
 *                 example: "681fdfed8ff84f652a0dfb01"
 *               idfollowed:
 *                 type: string
 *                 example: "681fdfed8ff84f652a0dfb02"
 *     responses:
 *       201:
 *         description: Seguidor adicionado com sucesso
 *       400:
 *         description: Campos não preenchidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Campos não preenchidos
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao adicionar seguidor
 */
router.post("/follow/new", followController.newFollow);

/**
 * @swagger
 * /api/v1/follow/delete:
 *   delete:
 *     summary: Remove um seguidor
 *     tags:
 *       - Seguidores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idfollower
 *               - idfollowed
 *             properties:
 *               idfollower:
 *                 type: string
 *                 example: "681fdfed8ff84f652a0dfb01"
 *               idfollowed:
 *                 type: string
 *                 example: "681fdfed8ff84f652a0dfb02"
 *     responses:
 *       200:
 *         description: Seguidor removido com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Seguidor removido com sucesso
 *       400:
 *         description: Campos não preenchidos
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Campos não preenchidos
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao remover seguidor
 */
router.delete("/follow/delete", followController.deleteFollow);

/**
 * @swagger
 * /api/v1/follow/verify:
 *   post:
 *     summary: Verifica se um utilizador está a seguir outro.
 *     tags:
 *       - Seguidores
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idfollower
 *               - idfollowed
 *             properties:
 *               idfollower:
 *                 type: string
 *                 description: ID do utilizador que está a seguir.
 *               idfollowed:
 *                 type: string
 *                 description: ID do utilizador que está a ser seguido.
 *     responses:
 *       200:
 *         description: Resultado da verificação do seguimento.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 isFollowing:
 *                   type: boolean
 *                   description: Indica se o utilizador está a seguir o outro.
 *       400:
 *         description: Campos não preenchidos.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Campos não preenchidos
 *       500:
 *         description: Erro interno do servidor.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao verificar seguimento
 */
router.post("/follow/verify", followController.verifyFollow);

export default router;
