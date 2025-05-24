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

/**
 * @swagger
 * /api/v1/news/delete:
 *   delete:
 *     summary: Elimina uma notícia
 *     description: Elimina uma notícia existente com base no ID e remove a imagem associada do Azure Blob Storage.
 *     tags:
 *       - News
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID da notícia a eliminar
 *                 example: "6650a5c4b99a92a7b07d2ac2"
 *     responses:
 *       200:
 *         description: Notícia eliminada com sucesso
 *       400:
 *         description: ID não fornecido ou inválido
 *       404:
 *         description: Notícia não encontrada
 *       500:
 *         description: Erro interno ao eliminar a notícia
 */
router.delete("/news/delete", newsController.remove);

/**
 * @swagger
 * /api/v1/news/random:
 *   get:
 *     summary: Retorna 3 notícias aleatórias
 *     tags:
 *       - News
 *     responses:
 *       200:
 *         description: Lista de 3 notícias aleatórias
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 news:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id:
 *                         type: string
 *                         example: "6827c3d6b2683121282808d1"
 *                       title:
 *                         type: string
 *                         example: "Smartphone Samsung Galaxy S24"
 *                       redirection:
 *                         type: string
 *                         example: "https://example.com/news/123"
 *                       image:
 *                         type: string
 *                         format: uri
 *                         example: "https://xuobucket.blob.core.windows.net/news/smartphone-samsung-galaxy-s24.jpg"
 *                       __v:
 *                         type: integer
 *                         example: 0
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 erro:
 *                   type: string
 *                   example: Erro interno do servidor
 */
router.get("/news/random", newsController.getRandomNews);

export default router;
