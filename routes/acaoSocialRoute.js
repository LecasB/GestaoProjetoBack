import express from "express";
import uploadMultiImages from "../middlewares/uploadMultiFiles.js";
import acaoSocialController from "../controllers/acaoSocialController.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/acoes-sociais:
 *   post:
 *     summary: Criar uma nova ação social
 *     consumes:
 *       - multipart/form-data
 *     tags:
 *       - Ações Sociais
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: Campanha de Alimentos
 *               description:
 *                 type: string
 *                 example: Distribuição de alimentos para famílias carentes
 *               associacao:
 *                 type: string
 *                 example: ONG Vida Plena
 *               objetivos:
 *                 type: string
 *                 example: Aliviar fome, Apoiar comunidades, Fortalecer vínculos
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: Ação social criada com sucesso
 *       400:
 *         description: Erro de validação ou imagens ausentes
 *       500:
 *         description: Erro interno do servidor
 */
router.post(
  "/acoes-sociais",
  uploadMultiImages,
  acaoSocialController.createAcaoSocial
);

/**
 * @swagger
 * /api/v1/acoes-sociais:
 *   get:
 *     summary: Obter todas as ações sociais
 *     tags:
 *       - Ações Sociais
 *     responses:
 *       200:
 *         description: Lista de ações sociais
 *       500:
 *         description: Erro ao buscar ações sociais
 */
router.get("/acoes-sociais", acaoSocialController.getAcoesSociais);

/**
 * @swagger
 * /api/v1/acoes-sociais/{id}:
 *   get:
 *     summary: Obter ação social por ID
 *     tags:
 *       - Ações Sociais
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da ação social
 *     responses:
 *       200:
 *         description: Ação social encontrada
 *       404:
 *         description: Ação social não encontrada
 *       500:
 *         description: Erro ao buscar ação social
 */
router.get("/acoes-sociais/:id", acaoSocialController.getAcaoSocialById);

/**
 * @swagger
 * /api/v1/acoes-sociais/{id}:
 *   delete:
 *     summary: Deletar uma ação social por ID
 *     tags:
 *       - Ações Sociais
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID da ação social
 *     responses:
 *       200:
 *         description: Ação social deletada com sucesso
 *       404:
 *         description: Ação social não encontrada
 *       500:
 *         description: Erro ao deletar ação social
 */
router.delete("/acoes-sociais/:id", acaoSocialController.deleteAcaoSocial);

export default router;
