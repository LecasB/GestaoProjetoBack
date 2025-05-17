import express from "express";
import userController from "../controllers/userController.js";
import uploadSingleImage from "../middlewares/uploadFile.js";
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

/**
 * @swagger
 * /api/v1/user/updateInfo:
 *   post:
 *     tags:
 *       - Users
 *     summary: Atualiza informações do usuário
 *     description: Atualiza o username e/ou descrição de um usuário.
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
 *                 example: "681fdfed8ff84f652a0dfb01"
 *               username:
 *                 type: string
 *                 example: "novo_username"
 *               descricao:
 *                 type: string
 *                 example: "Nova descrição do usuário"
 *     responses:
 *       200:
 *         description: User atualizado com sucesso
 *       400:
 *         description: Dados inválidos
 *       404:
 *         description: Usuário não encontrado
 */
router.post("/user/updateInfo", userController.updateUserInfo);

/**
 * @swagger
 * /api/v1/user/usernameAvailable:
 *   post:
 *     tags:
 *       - Users
 *     summary: Verifica se o username está disponível
 *     description: Verifica se já existe um usuário com o username fornecido.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *             properties:
 *               username:
 *                 type: string
 *                 example: "usuario123"
 *     responses:
 *       200:
 *         description: Resultado da verificação de disponibilidade
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 available:
 *                   type: boolean
 *                   example: true
 *       400:
 *         description: Username não fornecido
 *       500:
 *         description: Erro interno do servidor
 */
router.post("/user/usernameAvailable", userController.usermaneAvailable);

/**
 * @swagger
 * /api/v1/user/updateImage:
 *   post:
 *     tags:
 *       - Users
 *     summary: Atualiza a imagem do usuário
 *     description: Faz upload da imagem do usuário para o serviço de imagem e atualiza o campo correspondente.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - id
 *               - photo
 *             properties:
 *               id:
 *                 type: string
 *                 example: "681fdfed8ff84f652a0dfb01"
 *               photo:
 *                 type: string
 *                 example: "base64ImagemAqui..."
 *     responses:
 *       200:
 *         description: Imagem atualizada com sucesso
 *       400:
 *         description: Erro ao atualizar imagem ou dados ausentes
 */
router.post(
  "/user/updateImage",
  uploadSingleImage,
  userController.updateImageUser
);

//router.get("/getImages", userController.getImagesfromBucket);

export default router;
