import validator from "validator";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { BlobServiceClient } from "@azure/storage-blob";

const createUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    let descricao = "Sou novo aqui";

    let image = "https://i.ibb.co/bgdYBCH7/default-icon.jpg";

    if (!username || !email || !password) {
      let camposNaoPreenchidos = [];

      if (!username) camposNaoPreenchidos.push("username");
      if (!email) camposNaoPreenchidos.push("email");
      if (!password) camposNaoPreenchidos.push("password");

      return res.status(400).json({
        error:
          "Campos obrigatórios não preenchidos:  " +
          camposNaoPreenchidos.join(", "),
      });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    const user = new User({ username, email, password, descricao, image });
    await user.save();

    res.status(201).json(true);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res
        .status(400)
        .json({ error: "User e password têm de vir preenchidos" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    if (user.password !== password) {
      return res.status(401).json({ error: "Senha incorreta" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email },
      "seu_segredo_super_secreto",
      { expiresIn: "7d" }
    );

    res.status(200).json({ token, id: user._id, name: user.username });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getUserById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    const user = await User.findById(id).select("-password"); // Esconde a password

    if (!user) {
      return res.status(404).json({ error: "Usuário não encontrado" });
    }

    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const updateUserInfo = async (req, res) => {
  try {
    const { id, username, descricao } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário é obrigatório" });
    }

    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User não encontrado" });
    }

    if (descricao != null || descricao != user.descricao) {
      user.descricao = descricao;
    }

    user.username = username ? username : user.username;

    await user.save();
    res.status(200).json({ message: "User Atualizado" });
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

const usermaneAvailable = async (req, res) => {
  try {
    const { username } = req.body;

    if (!username) {
      return res.status(400).json({ error: "Username é obrigatório." });
    }

    const existingUser = await User.findOne({ username });

    if (existingUser) {
      return res.status(400).json({ available: false });
    }

    return res.status(200).json({ available: true });
  } catch (error) {
    return res.status(500).json({ error: "Erro interno do servidor." });
  }
};

const updateImageUser = async (req, res) => {
  try {
    const { id } = req.body;
    const file = req.file;

    if (!id || !file) {
      if (!file) {
        return res.status(400).json({ error: "imagem obrigatório" });
      }
      return res.status(400).json({ error: "ID  obrigatório" });
    }

    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    // Preparar o upload
    const containerName = "profiles";
    const fileName = `${id}.jpg`; // ou .png se preferires
    const buffer = file.buffer;

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // Upload da imagem
    await blockBlobClient.uploadData(buffer, {
      blobHTTPHeaders: {
        blobContentType: file.mimetype,
      },
      overwrite: true,
    });

    const imageUrl = `https://xuobucket.blob.core.windows.net/${containerName}/${fileName}`;

    // Opcional: guardar no user
    user.image = imageUrl;
    await user.save();

    return res.status(200).json({ imageUrl });
  } catch (error) {
    console.error("Erro no upload:", error.message);
    return res.status(500).json({ error: "Erro ao fazer upload da imagem" });
  }
};

/* const getImagesfromBucket = async (req, res) => {
  try {
    const containerName = "profiles";

    // Create BlobServiceClient
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const imageUrls = [];

    for await (const blob of containerClient.listBlobsFlat()) {
      const blobUrl = `https://xuobucket.blob.core.windows.net/${containerName}/${blob.name}`;
      imageUrls.push(blobUrl);
    }

    return res.status(200).json({ images: imageUrls });
  } catch (error) {
    console.error("Error listing blobs:", error);
    return res.status(500).json({ error: "Failed to list images from bucket" });
  }
}; */

export default {
  createUser,
  loginUser,
  getUserById,
  updateUserInfo,
  usermaneAvailable,
  updateImageUser,
};
