import express from "express";
import leilaoController from "../controllers/leilaoController.js";
import uploadMultiImages from "../middlewares/uploadMultiFiles.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/leilao:
 *   post:
 *     summary: Cria um novo leilão
 *     description: Cria um leilão com descrição, preço, imagens, estado e datas de início/fim. As imagens são enviadas por multipart/form-data e armazenadas no Azure Blob Storage.
 *     tags:
 *       - Leilao
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - descricao
 *               - preco
 *               - idVendedor
 *               - idUser
 *               - estado
 *               - dataInicio
 *               - dataFim
 *               - images
 *             properties:
 *               descricao:
 *                 type: string
 *               preco:
 *                 type: number
 *               idVendedor:
 *                 type: string
 *                 format: objectId
 *               idUser:
 *                 type: string
 *                 format: objectId
 *               estado:
 *                 type: string
 *                 enum: [open, close]
 *               dataInicio:
 *                 type: string
 *                 format: date-time
 *               dataFim:
 *                 type: string
 *                 format: date-time
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Até 3 imagens podem ser enviadas
 *     responses:
 *       201:
 *         description: Leilão criado com sucesso
 *         content:
 *           application/json:
 *       400:
 *         description: Erro de validação ou dados faltando
 *       500:
 *         description: Erro interno no servidor
 */
router.post("/leilao", uploadMultiImages, leilaoController.createLeilao);

/**
 * @swagger
 * /api/v1/leilao:
 *   put:
 *     summary: Atualiza o preço e o utilizador atual do leilão (novo lance)
 *     tags:
 *       - Leilao
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idUser
 *               - preco
 *             properties:
 *               idUser:
 *                 type: string
 *                 description: ID do novo utilizador que fez a oferta
 *               preco:
 *                 type: number
 *                 description: Novo valor da oferta
 *     responses:
 *       200:
 *         description: Leilão atualizado com sucesso
 *       400:
 *         description: Campos obrigatórios em falta
 *       404:
 *         description: Leilão não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.put("/leilao", leilaoController.updateLeilaoBid);

/**
 * @swagger
 * /api/v1/leilao/{id}:
 *   delete:
 *     summary: Deleta um leilão pelo ID
 *     tags:
 *       - Leilao
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do leilão a ser deletado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leilão deletado com sucesso
 *       404:
 *         description: Leilão não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.delete("/leilao/:id", leilaoController.deleteLeilao);

/**
 * @swagger
 * /api/v1/leilao:
 *   get:
 *     summary: Retorna todos os leilões
 *     tags:
 *       - Leilao
 *     responses:
 *       200:
 *         description: Lista de leilões retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/leilao", leilaoController.getAllLeiloes);

/**
 * @swagger
 * /api/v1/leilao/{id}:
 *   get:
 *     summary: Retorna um leilão pelo ID
 *     tags:
 *       - Leilao
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do leilão a ser retornado
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Leilão retornado com sucesso
 *         content:
 *           application/json:
 *       404:
 *         description: Leilão não encontrado
 *       500:
 *         description: Erro interno no servidor
 */
router.get("/leilao/:id", leilaoController.getLeilaoById);

export default router;
