import User from "../models/User";

exports.createUser = async (req, res) => {
  try {
    const { username, email, password, descricao } = req.body;
    const image = {
      data: req.file.buffer,
      contentType: req.file.mimetype,
    };

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
      { expiresIn: "1h" } // validade do token
    );

    res.status(200).json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
