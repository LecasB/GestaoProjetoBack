import Follow from "../models/Follow.js";

const getFollowerAndFollowingByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: "ID do usuário não fornecido" });
    }

    const followers = await Follow.find({ following: userId }).populate(
      "follower",
      "name email"
    );
    const following = await Follow.find({ follower: userId }).populate(
      "following",
      "name email"
    );

    return res.status(200).json({ followers, following });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const newFollow = async (req, res) => {
  try {
    const { idfollower, idfollowed } = req.body;

    if (!idfollower || !idfollowed) {
      return res.status(400).json({ error: "Campos não preenchidos" });
    }

    const follow = new Follow({ idfollower, idfollowed });
    await follow.save();

    return res.status(201).json({ message: "Seguidor adicionado com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

const deleteFollow = async (req, res) => {
  try {
    const { idfollower, idfollowed } = req.body;

    if (!idfollower || !idfollowed) {
      return res.status(400).json({ error: "Campos não preenchidos" });
    }

    await Follow.deleteOne({ idfollower, idfollowed });

    return res.status(200).json({ message: "Seguidor removido com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  getFollowerAndFollowingByUserId,
  newFollow,
  deleteFollow,
};
