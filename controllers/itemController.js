import Item from "../models/Item.js";
import { BlobServiceClient } from "@azure/storage-blob";

export const getItems = async (req, res) => {
  try {
    const { title, minPrice, maxPrice, condition } = req.query;

    const filter = {
      visibility: "onsale",
    };

    // Filtro por título (case-insensitive)
    if (title) {
      filter.title = { $regex: title, $options: "i" };
    }

    // Filtro por faixa de preço
    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = parseFloat(minPrice);
      if (maxPrice) filter.price.$lte = parseFloat(maxPrice);
    }

    // Filtro por condição
    if (condition) {
      const conditionsArray = condition
        .split(",")
        .map((c) => c.trim())
        .filter((c) => c.length > 0); // remove entradas vazias

      if (conditionsArray.length > 0) {
        filter.condition = { $in: conditionsArray };
      }
    }

    const items = await Item.find(filter);
    res.status(200).json(items);
  } catch (err) {
    console.error(err);
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

      const url = `https://xuobucket.blob.core.windows.net/${containerName}/${uniqueFileName}`;
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

export const updateItem = async (req, res) => {
  try {
    const { id, title, description, price, condition } = req.body;

    const item = await Item.findById(id);
    if (!item) {
      return res.status(404).json({ error: "Item não encontrado." });
    }

    const updates = {};

    if (title && title.trim() !== "") updates.title = title;
    if (description && description.trim() !== "")
      updates.description = description;
    if (price !== undefined && price !== "") updates.price = price;
    if (condition && condition.trim() !== "") updates.condition = condition;

    // Atualizar imagens se houver novas
    if (req.files && req.files.length > 0) {
      if (req.files.length > 3) {
        return res
          .status(400)
          .json({ error: "Máximo de 3 imagens permitido." });
      }

      const blobServiceClient = BlobServiceClient.fromConnectionString(
        process.env.AZURE_STORAGE_CONNECTION_STRING
      );
      const containerName = "items";
      const containerClient =
        blobServiceClient.getContainerClient(containerName);

      // Apaga imagens antigas (baseado nas URLs existentes)
      for (const oldUrl of item.images) {
        const blobName = oldUrl.split("/").pop();
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        await blockBlobClient.deleteIfExists();
      }

      const imageUrls = [];

      for (const file of req.files) {
        const timestamp = Date.now();
        const uniqueFileName = `${item.idseller}-${timestamp}-${file.originalname}`;

        const blockBlobClient =
          containerClient.getBlockBlobClient(uniqueFileName);

        await blockBlobClient.uploadData(file.buffer, {
          blobHTTPHeaders: { blobContentType: file.mimetype },
          overwrite: true,
        });

        const url = `https://xuobucket.blob.core.windows.net/${containerName}/${uniqueFileName}`;
        imageUrls.push(url);
      }

      updates.images = imageUrls;
    }

    // Atualiza o item
    const updatedItem = await Item.findByIdAndUpdate(id, updates, {
      new: true,
    });

    return res.status(200).json(updatedItem);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao atualizar o item.", details: err.message });
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
