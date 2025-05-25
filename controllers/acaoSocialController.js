import AcaoSocial from "../models/AcaoSocial.js";
import { BlobServiceClient } from "@azure/storage-blob";

export const createAcaoSocial = async (req, res) => {
  try {
    const { title, description, associacao } = req.body;
    let objetivos = req.body.objetivos;

    // Verificação de imagens
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Nenhuma imagem foi enviada." });
    }

    // Parse dos objetivos (caso venham como string única ou array)
    if (typeof objetivos === "string") {
      // Se vier uma string separada por vírgulas
      objetivos = objetivos.split(",").map((obj) => obj.trim());
    }
    if (!Array.isArray(objetivos)) {
      return res.status(400).json({ error: "Objetivos inválidos." });
    }

    // Limita os objetivos a 3
    const limitedObjetivos = objetivos.slice(0, 3);

    // Azure config
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    const containerName = "acaosociais";
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const imageUrls = [];

    for (const file of req.files) {
      const timestamp = Date.now();
      const sanitizedName = file.originalname.replace(/\s+/g, "_");
      const uniqueFileName = `${associacao}_${timestamp}_${sanitizedName}`;

      const blockBlobClient =
        containerClient.getBlockBlobClient(uniqueFileName);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
        overwrite: true,
      });

      const url = `https://xuobucket.blob.core.windows.net/${containerName}/${uniqueFileName}`;
      imageUrls.push(url);
    }

    // Criar documento
    const novaAcao = new AcaoSocial({
      title,
      description,
      associacao,
      images: imageUrls, // já está limitado a 3 no multer
      objetivos: limitedObjetivos,
    });

    const saved = await novaAcao.save();
    return res.status(201).json(saved);
  } catch (err) {
    console.error("Erro ao criar ação social:", err);
    return res.status(500).json({
      error: "Erro ao criar ação social.",
      details: err.message,
    });
  }
};

export const getAcoesSociais = async (req, res) => {
  try {
    const acoes = await AcaoSocial.find();
    res.status(200).json(acoes);
  } catch (error) {
    console.error("Erro ao buscar ações sociais:", error);
    res.status(500).json({ message: "Erro ao buscar ações sociais." });
  }
};

// Buscar ação social por ID
export const getAcaoSocialById = async (req, res) => {
  try {
    const { id } = req.params;
    const acao = await AcaoSocial.findById(id);
    if (!acao) {
      return res.status(404).json({ message: "Ação social não encontrada." });
    }
    res.status(200).json(acao);
  } catch (error) {
    console.error("Erro ao buscar ação social:", error);
    res.status(500).json({ message: "Erro ao buscar ação social." });
  }
};

export const deleteAcaoSocial = async (req, res) => {
  try {
    const { id } = req.params;

    const acao = await AcaoSocial.findById(id);

    if (!acao) {
      return res
        .status(404)
        .json({ message: "Ação social não encontrada para exclusão." });
    }

    // Azure config
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    const containerName = "acaosociais";
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Deleta as imagens no Azure
    for (const imageUrl of acao.images) {
      // Extrai o nome do blob a partir da URL
      const fileName = imageUrl.split("/").pop();

      if (fileName) {
        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.deleteIfExists();
      }
    }

    // Deleta o documento do MongoDB
    await AcaoSocial.findByIdAndDelete(id);

    res
      .status(200)
      .json({ message: "Ação social e imagens deletadas com sucesso." });
  } catch (error) {
    console.error("Erro ao deletar ação social:", error);
    res.status(500).json({ message: "Erro ao deletar ação social." });
  }
};

export default {
  createAcaoSocial,
  getAcoesSociais,
  getAcaoSocialById,
  deleteAcaoSocial,
};
