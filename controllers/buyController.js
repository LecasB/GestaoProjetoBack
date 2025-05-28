import Buy from "../models/Buy.js";
import Item from "../models/Item.js";

const create = async (req, res) => {
  try {
    const { idBuyer, idItem } = req.body;

    if (!idBuyer || !idItem) {
      return res.status(400).json({ error: "Ids não passados" });
    }

    const item = await Item.findById(idItem);

    if (!item) {
      return res.status(404).json({ error: "Item não encontrado" });
    }

    item.visibility = "sold";
    await item.save();

    const buy = new Buy({ idBuyer, idItem });
    await buy.save();

    return res.status(201).json({ message: "Compra registrada com sucesso." });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const getByBuyerId = async (req, res) => {
  try {
    const { idBuyer } = req.params;

    const follows = await Buy.find({ idBuyer }).populate("idItem");

    const items = follows.map((follow) => follow.idItem);

    return res.status(200).json(items);
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Erro ao buscar os itens.", details: err.message });
  }
};

export default {
  create,
  getByBuyerId,
};
