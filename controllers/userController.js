import User from "../models/User";

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, descricao } = req.body;

    image = "https://i.ibb.co/chLJhfGz/default-icon.jpg";

    if (!username || !email || !password) {
      return res
        .status(400)
        .json({ error: "Campos obrigatórios não preenchidos" });
    }

    if (!validator.isEmail(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }

    const user = new User({ username, email, password, descricao, image });
    await user.save();

    res.status(201).json(user);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
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

    // Gerar token JWT
    const token = jwt.sign(
      { id: user._id, email: user.email },
      "seu_segredo_super_secreto", // chave secreta (idealmente do .env)
      { expiresIn: "7d" } // validade do token
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
