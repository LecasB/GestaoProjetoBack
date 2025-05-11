import Message from "../models/Message.js";

const createMessage = async (req, res) => {
  try {
    const { idsender, idreceiver, message, date } = req.body;

    let missingFields = [];
    if (!idsender) missingFields.push("idsender");
    if (!idreceiver) missingFields.push("idreceiver");
    if (!message) missingFields.push("message");
    if (!date) missingFields.push("date");

    if (missingFields.length > 0) {
      return res.status(400).json({
        error:
          "Campos obrigatórios não preenchidos: " + missingFields.join(", "),
      });
    }

    const newMessage = new Message({ idsender, idreceiver, message, date });
    await newMessage.save();

    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const { idsender, idreceiver } = req.query;

    if (!idsender || !idreceiver) {
      return res
        .status(400)
        .json({ error: "idsender e idreceiver são obrigatórios na query" });
    }

    const messages = await Message.find({
      $or: [
        { idsender, idreceiver },
        { idsender: idreceiver, idreceiver: idsender },
      ],
    }).sort({ date: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export default {
  createMessage,
  getMessages,
};
