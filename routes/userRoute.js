const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const upload = require("../middlewares/uploadMiddleware");

// Rota para criar usuário com upload de imagem
router.post("/", upload.single("image"), userController.createUser);

router.post("/login", userController.loginUser);

module.exports = router;
