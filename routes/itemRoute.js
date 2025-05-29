import express from "express";
import itemController from "../controllers/itemController.js";
import uploadSingleImage from "../middlewares/uploadFile.js";
import uploadMultiImages from "../middlewares/uploadMultiFiles.js";

const router = express.Router();

/**
 * @swagger
 * /api/v1/items/user/{id}:
 *   get:
 *     summary: Buscar itens por ID do vendedor (user)
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do vendedor (seller)
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Lista de itens do vendedor retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       404:
 *         description: Nenhum item encontrado para este vendedor
 *       500:
 *         description: Erro ao buscar os itens
 */
router.get("/items/user/:id", itemController.getItemsByUserId);

/**
 * @swagger
 * /api/v1/items:
 *   get:
 *     summary: Buscar itens com filtros opcionais
 *     tags:
 *       - Items
 *     parameters:
 *       - in: query
 *         name: title
 *         schema:
 *           type: string
 *         description: Palavras-chave para buscar no título
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Preço mínimo
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Preço máximo
 *       - in: query
 *         name: condition
 *         schema:
 *           type: string
 *         description: "Condições separadas por vírgula (ex: new,used)"
 *     responses:
 *       200:
 *         description: Lista de itens retornada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *       500:
 *         description: Erro ao buscar os itens
 */
router.get("/items", itemController.getItems);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   get:
 *     summary: Buscar item por ID
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do item
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item retornado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *       404:
 *         description: Item não encontrado
 *       500:
 *         description: Erro ao buscar o item
 */
router.get("/items/:id", itemController.getItemById);

/**
 * @swagger
 * /api/v1/newItem:
 *   post:
 *     summary: Criar um novo item
 *     tags:
 *       - Items
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - idseller
 *               - title
 *               - description
 *               - price
 *               - images
 *               - condition
 *               - visibility
 *             properties:
 *               idseller:
 *                 type: string
 *                 example: "abc123"
 *               title:
 *                 type: string
 *                 example: "Smartphone Samsung Galaxy S21"
 *               description:
 *                 type: string
 *                 example: "Telemóvel usado em ótimo estado"
 *               price:
 *                 type: number
 *                 example: 299.99
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["https://example.com/image.jpg"]
 *               condition:
 *                 type: string
 *                 enum: [new, used, refurbished, broken]
 *                 example: "used"
 *               visibility:
 *                 type: string
 *                 enum: [onsale, sold, hidden]
 *                 example: "onsale"
 *     responses:
 *       201:
 *         description: Item criado com sucesso
 *       400:
 *         description: Erro na validação ou criação do item
 */

router.post("/newItem", uploadMultiImages, itemController.createItem);

/**
 * @swagger
 * /api/v1/updateItem:
 *   put:
 *     summary: Atualiza um item existente
 *     description: Atualiza os campos de um item com base nos dados fornecidos. Apenas os campos enviados e não vazios serão atualizados. Caso imagens sejam fornecidas, elas substituirão as antigas (máximo de 3 imagens).
 *     tags:
 *       - Items
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *                 description: ID do item a ser atualizado
 *                 example: 6655bbf8d7e3bdf1fa67a123
 *               title:
 *                 type: string
 *                 description: Novo título do item
 *               description:
 *                 type: string
 *                 description: Nova descrição do item
 *               price:
 *                 type: number
 *                 description: Novo preço do item
 *               condition:
 *                 type: string
 *                 description: Nova condição do item
 *                 enum: [new, used, refurbished, broken]
 *               images:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *                 description: Até 3 novas imagens para substituir as atuais
 *     responses:
 *       200:
 *         description: Item atualizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Item'
 *       400:
 *         description: Erro de validação ou envio de mais de 3 imagens
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       404:
 *         description: Item não encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 details:
 *                   type: string
 */
router.put("/updateItem", uploadMultiImages, itemController.updateItem);

/**
 * @swagger
 * /api/v1/items/{id}:
 *   delete:
 *     summary: Eliminar item por ID
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do item a eliminar
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Item eliminado com sucesso
 *       404:
 *         description: Item não encontrado
 *       500:
 *         description: Erro ao eliminar item
 */
router.delete("/items/:id", itemController.deleteItem);

/**
 * @swagger
 * /items/sold/{id}:
 *   get:
 *     summary: Obtém os itens marcados como vendidos de um utilizador.
 *     tags:
 *       - Items
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID do utilizador (vendedor).
 *     responses:
 *       200:
 *         description: Lista de itens vendidos com sucesso.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *       404:
 *         description: Nenhum item encontrado.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Nenhum item encontrado.
 *       500:
 *         description: Erro ao buscar os itens.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                   example: Erro ao buscar os itens.
 */
router.get("/items/sold/:id", itemController.getSoldItemsByUser);

export default router;
