import Item from "../models/Item.js";
import { BlobServiceClient } from "@azure/storage-blob";

export const getItems = async (req, res) => {
  try {
    const items = await Item.find();
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar os itens." });
  }
};

export const getItemsByUserId = async (req, res) => {
  const { id } = req.params;
  try {
    const items = await Item.find({ idseller: id });
    if (!items) {
      return res.status(404).json({ error: "Nenhum item encontrado." });
    }
    res.status(200).json(items);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar os itens." });
  }
};

export const getItemById = async (req, res) => {
  const { id } = req.params;
  try {
    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item não encontrado." });
    }
    res.status(200).json(item);
  } catch (err) {
    res.status(500).json({ error: "Erro ao buscar o item." });
  }
};

export const createItem = async (req, res) => {
  try {
    const { idseller, title, description, price, condition, visibility } =
      req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: "Nenhuma imagem recebida." });
    }

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    const containerName = "items";
    const containerClient = blobServiceClient.getContainerClient(containerName);

    const imageUrls = [];

    for (const file of req.files) {
      const timestamp = Date.now();
      const uniqueFileName = `${idseller}-${timestamp}-${file.originalname}`;

      const blockBlobClient =
        containerClient.getBlockBlobClient(uniqueFileName);

      await blockBlobClient.uploadData(file.buffer, {
        blobHTTPHeaders: { blobContentType: file.mimetype },
        overwrite: true,
      });

      const url = `https://xuobucket.blob.core.windows.net/${containerName}/${fileName}`;
      imageUrls.push(url);
    }

    // Verifica campos obrigatórios
    let missingFields = [];
    if (!idseller) missingFields.push("idseller");
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (price === undefined) missingFields.push("price");
    if (!imageUrls || imageUrls.length === 0) missingFields.push("images");
    if (!condition) missingFields.push("condition");
    if (!visibility) missingFields.push("visibility");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error:
          "Campos obrigatórios não preenchidos: " + missingFields.join(", "),
      });
    }

    // Criar o novo item com URLs das imagens
    const newItem = new Item({
      idseller,
      title,
      description,
      price,
      images: imageUrls,
      condition,
      visibility,
    });

    await newItem.save();

    return res.status(201).json(newItem);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao criar o item.", details: err.message });
  }
};

export const deleteItem = async (req, res) => {
  const { id } = req.params;
  try {
    const deletedItem = await Item.findByIdAndDelete(id);
    if (!deletedItem) {
      return res.status(404).json({ error: "Item não encontrado." });
    }
    res.status(200).json({ message: "Item eliminado com sucesso." });
  } catch (err) {
    res.status(500).json({ error: "Erro ao eliminar o item." });
  }
};

export default {
  getItems,
  createItem,
  deleteItem,
  getItemsByUserId,
  getItemById,
};
