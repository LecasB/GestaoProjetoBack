import express from "express";
import userController from "../controllers/userController.js";
const router = express.Router();

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
 *         application/json:
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
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *       400:
 *         description: Erro ao criar usuário
 */
router.post("/signup", userController.createUser);

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

/**
 * @swagger
 * /api/v1/user/{id}:
 *   get:
 *     tags:
 *       - Users
 *     summary: Buscar usuário por ID
 *     description: Retorna os dados de um usuário pelo ID (sem password).
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: ID do usuário no banco de dados
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Usuário encontrado
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 _id:
 *                   type: string
 *                 username:
 *                   type: string
 *                 email:
 *                   type: string
 *                 descricao:
 *                   type: string
 *                 image:
 *                   type: string
 *       400:
 *         description: ID inválido
 *       404:
 *         description: Usuário não encontrado
 *       500:
 *         description: Erro interno do servidor
 */
router.get("/user/:id", userController.getUserById);

export default router;
