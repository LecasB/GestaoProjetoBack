import Review from "../models/Review.js";

const create = async (req, res) => {
  try {
    const { idUser, idVendor, descricao, rate } = req.body;

    if (!idUser || !idVendor || !rate || !descricao) {
      res.status(400).json({ error: "Campos obrigatorios não preenchidos" });
    }

    if (rate < 1 || rate > 5) {
      res
        .status(400)
        .json({ error: "Rate não está dentro do range permitido (1 - 5)" });
    }

    const review = new Review({ idUser, idVendor, descricao, rate });
    await review.save();

    res.status(201).json(true);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getRateById = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await Review.find({ idVendor: id });

    const totalReviews = reviews.length;

    const totalRate = reviews.reduce((sum, review) => sum + review.rate, 0);

    const averageRate =
      totalReviews > 0 ? Math.round(totalRate / totalReviews) : 0;

    res.status(200).json({
      totalReviews,
      averageRate,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getReviewsById = async (req, res) => {
  try {
    const { id } = req.params;

    const reviews = await Review.find({ idVendor: id });

    res.status(200).json({
      reviews,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default { create, getRateById, getReviewsById };
