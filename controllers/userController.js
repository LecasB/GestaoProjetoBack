import validator from "validator";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

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

    user.save();
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
    const { id, photo } = req.body;

    if (!id || !photo) {
      return res.status(400).json({ error: "Dados têm de vir preenchidos" });
    }

    const user = await User.findById(id);

    const response = await fetch(
      `https://api.imgbb.com/1/upload?key=${process.env.IMGBB_KEY}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          image: photo,
          name: `${id}_avatar`,
        }),
      }
    );

    const data = await response.json();
    if (data) {
      res.status(200).json({ message: "Imagem Atualizada" });
      user.image = data.url;
      user.save();
    } else {
      res.status(400).json({ error: "Erro desconhecido a atualizar imagem" });
    }
  } catch (error) {
    res.status(400).json({ error: error });
  }
};

export default {
  createUser,
  loginUser,
  getUserById,
  updateUserInfo,
  usermaneAvailable,
  updateImageUser,
};
