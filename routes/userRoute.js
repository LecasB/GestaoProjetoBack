const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");

// Rota para criar usuário com upload de imagem
router.post("/", upload.single("image"), userController.createUser);

/**
 * @swagger
 * /api/v1/login:
 *   post:
 *     summary: Lista todos os utilizadores
 *     tags:
 *       - Users
 *     responses:
 *       200:
 *         description: Lista obtida com sucesso
 */
router.post("/login", userController.loginUser);

module.exports = router;
