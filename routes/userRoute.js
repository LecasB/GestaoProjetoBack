import express from "express";
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");

/**
 * @swagger
 * /api/v1/signup:
 *   post:
 *     summary: Criar novo usuário
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               username:
 *                 type: string
 *                 example: usuario123
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *               descricao:
 *                 type: string
 *                 example: Sou um novo usuário.
 *               image:
 *                 type: string
 *                 format: url
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro ao criar usuário
 */
router.post("/signup", upload.single("image"), userController.createUser);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Login do usuário
 *     tags:
 *       - Users
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 example: usuario@email.com
 *               password:
 *                 type: string
 *                 example: senha123
 *     responses:
 *       200:
 *         description: Login realizado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                   example: "jwt_token_aqui"
 *       401:
 *         description: Senha incorreta
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/login", userController.loginUser);

module.exports = router;
