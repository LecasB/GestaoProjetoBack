import Favorito from "../models/Favorito.js";
import Item from "../models/Item.js";
import User from "../models/User.js";

const getAllByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "Id obrigatório" });
    }

    // Buscar favoritos do usuário e popular apenas os dados do item
    const favoritos = await Favorito.find({ iduser: id }).populate("iditem");

    // Retorna só os itens populados
    const items = favoritos.map((fav) => fav.iditem);

    return res.status(200).json(items);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const addFavorite = async (req, res) => {
  try {
    const { iduser, iditem } = req.body;

    if (!iduser || !iditem) {
      return res.status(400).json({ error: "Campos não preenchidos" });
    }

    if (!(await User.findById(iduser))) {
      return res.status(400).json({ error: "User invalido" });
    }

    if (!(await Item.findById(iditem))) {
      console.log(await Item.findById(iditem));
      return res.status(400).json({ error: "Item invalido" });
    }

    const favorite = new Favorito({ iduser, iditem });
    await favorite.save();

    return res.status(201).json({ message: "Favorito adicionado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteFavorite = async (req, res) => {
  try {
    const { iduser, iditem } = req.body;

    if (!iduser || !iditem) {
      return res
        .status(400)
        .json({ error: "iduser e iditem são obrigatórios" });
    }

    const deleted = await Favorito.findOneAndDelete({ iduser, iditem });

    if (!deleted) {
      return res.status(404).json({ error: "Favorito não encontrado" });
    }

    return res.status(200).json({ message: "Favorito removido com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default { getAllByUserId, addFavorite, deleteFavorite };
