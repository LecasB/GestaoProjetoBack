import Item from "../models/Item.js";

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
    const {
      idseller,
      title,
      description,
      price,
      images,
      condition,
      visibility,
    } = req.body;

    let missingFields = [];
    if (!idseller) missingFields.push("idseller");
    if (!title) missingFields.push("title");
    if (!description) missingFields.push("description");
    if (price === undefined) missingFields.push("price");
    if (!images || !Array.isArray(images) || images.length === 0)
      missingFields.push("images");
    if (!condition) missingFields.push("condition");
    if (!visibility) missingFields.push("visibility");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error:
          "Campos obrigatórios não preenchidos: " + missingFields.join(", "),
      });
    }

    const newItem = new Item({
      idseller,
      title,
      description,
      price,
      images,
      condition,
      visibility,
    });

    await newItem.save();

    res.status(201).json(newItem);
  } catch (err) {
    res
      .status(400)
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
