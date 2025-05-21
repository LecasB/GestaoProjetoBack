import express from "express";
import newsController from "../controllers/newsController.js";
import uploadSingleImage from "../middlewares/uploadFile.js";
const router = express.Router();

/**
 * @swagger
 * /api/v1/news/create:
 *   post:
 *     summary: Cria uma nova notícia
 *     description: Endpoint para criar uma nova notícia com título, link de redirecionamento e imagem (upload).
 *     tags:
 *       - News
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - redirection
 *               - photo
 *             properties:
 *               title:
 *                 type: string
 *                 description: Título da notícia
 *                 example: Nova funcionalidade lançada
 *               redirection:
 *                 type: string
 *                 description: URL de redirecionamento
 *                 example: https://example.com/noticia
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Imagem da notícia
 *     responses:
 *       200:
 *         description: Notícia criada com sucesso
 *       400:
 *         description: Erro nos dados enviados ou erro no upload da imagem
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/news/create", uploadSingleImage, newsController.create);

/**
 * @swagger
 * /api/v1/news/update:
 *   put:
 *     summary: Atualiza uma notícia existente
 *     description: Atualiza os dados de uma notícia como título, redirecionamento e imagem. Apenas o ID é obrigatório. Os outros campos são opcionais e só serão atualizados se fornecidos.
 *     tags:
 *       - News
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID da notícia a ser atualizada
 *                 example: 6650ae69b26aa1a21c29cdcf
 *               title:
 *                 type: string
 *                 description: Novo título da notícia (opcional)
 *                 example: Nova atualização de título
 *               redirection:
 *                 type: string
 *                 description: Novo link de redirecionamento (opcional)
 *                 example: https://exemplo.com/atualizacao
 *               photo:
 *                 type: string
 *                 format: binary
 *                 description: Nova imagem da notícia (opcional)
 *     responses:
 *       200:
 *         description: Notícia atualizada com sucesso
 *       400:
 *         description: Erro nos dados enviados ou na atualização da imagem
 *       404:
 *         description: Notícia não encontrada
 *       500:
 *         description: Erro interno do servidor
 */
router.put("/news/update", uploadSingleImage, newsController.update);

export default router;
