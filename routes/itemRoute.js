import express from "express";
import itemController from "../controllers/itemController.js";
import uploadSingleImage from "../middlewares/uploadFile.js";

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
 *     summary: Buscar todos os itens
 *     tags:
 *       - Items
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
router.post("/newItem", uploadSingleImage, itemController.createItem);

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

export default router;
