import Leilao from "../models/Leilao.js";
import { BlobServiceClient } from "@azure/storage-blob";

const createLeilao = async (req, res) => {
  try {
    const {
      descricao,
      preco,
      idVendedor,
      idUser,
      estado,
      dataInicio,
      dataFim,
    } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Nenhuma imagem recebida." });
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    const containerName = "leilao";
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const imageUrls = [];

    try {
      for (const file of req.files) {
        const timestamp = Date.now();
        const uniqueFileName = `${idVendedor}-${timestamp}-${file.originalname}`;

        const blockBlobClient =
          containerClient.getBlockBlobClient(uniqueFileName);

        await blockBlobClient.uploadData(file.buffer, {
          blobHTTPHeaders: { blobContentType: file.mimetype },
          overwrite: true,
        });

        const url = `https://xuobucket.blob.core.windows.net/${containerName}/${uniqueFileName}`;
        imageUrls.push(url);
      }
    } catch (uploadErr) {
      console.error("Erro ao fazer upload das imagens:", uploadErr);
      return res.status(500).json({
        error: "Erro ao salvar as imagens no armazenamento.",
      });
    }

    // Verificar campos obrigatórios
    const missingFields = [];
    if (!descricao) missingFields.push("descricao");
    if (!preco && preco !== 0) missingFields.push("preco");
    if (!idVendedor) missingFields.push("idVendedor");
    if (!idUser) missingFields.push("idUser");
    if (!estado) missingFields.push("estado");
    if (!dataInicio) missingFields.push("dataInicio");
    if (!dataFim) missingFields.push("dataFim");
    if (imageUrls.length === 0) missingFields.push("imagem");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error:
          "Campos obrigatórios não preenchidos: " + missingFields.join(", "),
      });
    }

    const newLeilao = new Leilao({
      descricao,
      imagem: imageUrls,
      preco,
      idVendedor,
      idUser,
      estado,
      dataInicio,
      dataFim,
    });

    await newLeilao.save();

    return res.status(201).json(newLeilao);
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      error: err.message,
    });
  }
};

const getAllLeiloes = async (req, res) => {
  try {
    const leiloes = await Leilao.find();
    return res.status(200).json(leiloes);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao buscar leilões.", details: err.message });
  }
};

const getLeilaoById = async (req, res) => {
  try {
    const { id } = req.params;
    const leilao = await Leilao.findById(id);

    if (!leilao) {
      return res.status(404).json({ error: "Leilão não encontrado." });
    }

    return res.status(200).json(leilao);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao buscar o leilão.", details: err.message });
  }
};

const updateLeilaoBid = async (req, res) => {
  try {
    const { idUser, preco } = req.body;

    if (!idUser || preco === undefined) {
      return res
        .status(400)
        .json({ error: "idUser e preco são obrigatórios." });
    }

    const leilao = await Leilao.findById(id);
    if (!leilao) {
      return res.status(404).json({ error: "Leilão não encontrado." });
    }

    leilao.idUser = idUser;
    leilao.preco = preco;

    await leilao.save();

    return res.status(200).json(leilao);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao atualizar o leilão.", details: err.message });
  }
};

export const deleteLeilao = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Leilao.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ error: "Leilão não encontrado." });
    }

    return res.status(200).json({ message: "Leilão deletado com sucesso." });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao deletar o leilão.", details: err.message });
  }
};

export default {
  createLeilao,
  getAllLeiloes,
  getLeilaoById,
  updateLeilaoBid,
  deleteLeilao,
};
