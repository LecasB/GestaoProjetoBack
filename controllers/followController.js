import Follow from "../models/Follow.js";

const getFollowerAndFollowingByUserId = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID do usuário não fornecido" });
    }

    const followersDocs = await Follow.find({ idfollowed: id }, "idfollower");

    const followingDocs = await Follow.find({ idfollower: id }, "idfollowed");

    const followers = followersDocs.map((f) => f.idfollower);
    const following = followingDocs.map((f) => f.idfollowed);

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

const verifyFollow = async (req, res) => {
  try {
    const { idfollower, idfollowed } = req.body;

    if (!idfollower || !idfollowed) {
      return res.status(400).json({ error: "Campos não preenchidos" });
    }

    const follow = await Follow.findOne({ idfollower, idfollowed });

    if (follow) {
      return res.status(200).json({ isFollowing: true });
    } else {
      return res.status(200).json({ isFollowing: false });
    }
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

export default {
  verifyFollow,
  getFollowerAndFollowingByUserId,
  newFollow,
  deleteFollow,
};
