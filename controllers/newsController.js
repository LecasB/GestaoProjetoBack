import News from "../models/News.js";
import { BlobServiceClient } from "@azure/storage-blob";

const create = async (req, res) => {
  try {
    const { title, redirection } = req.body;
    const imageFile = req.file;

    if (!title || !redirection || !imageFile) {
      return res
        .status(400)
        .json({ error: "Dados não preenchidos obrigatório" });
    }

    // Preparar o upload
    const containerName = "news";
    const fileName = `${title}.jpg`;
    const buffer = imageFile.buffer;

    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(fileName);

    // Upload da imagem
    try {
      await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: {
          blobContentType: imageFile.mimetype,
        },
        overwrite: true,
      });
    } catch (error) {
      return res.status(400).json({ erro: error.message || error });
    }

    const image = `https://xuobucket.blob.core.windows.net/${containerName}/${fileName}`;

    const news = new News({ image, title, redirection });

    await news.save();

    return res.status(200).json({ message: "Criado com sucesso" });
  } catch (error) {
    return res.status(500).json({ erro: error.message || error });
  }
};

const sanitize = (text) => {
  return text
    .toLowerCase()
    .replace(/\s+/g, "-") // Espaços para hífens
    .replace(/[^\w\-]+/g, "") // Remove caracteres inválidos
    .replace(/\-\-+/g, "-") // Hífens consecutivos
    .replace(/^-+/, "") // Remove hífen do início
    .replace(/-+$/, ""); // Remove hífen do fim
};

const update = async (req, res) => {
  try {
    const { id, title, redirection } = req.body;
    const imageFile = req.file;

    if (!id) {
      return res.status(400).json({ error: "ID é obrigatório" });
    }

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ error: "Notícia não encontrada" });
    }

    const containerName = "news";
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);

    // Verifica se o título mudou para renomear a imagem
    if (title && title !== news.title) {
      try {
        const currentImageUrl = news.image;
        const urlParts = currentImageUrl.split("/");
        const encodedFileName = urlParts[urlParts.length - 1];
        const oldFileName = decodeURIComponent(encodedFileName);
        const newFileName = `${sanitize(title)}.jpg`;

        const oldBlobClient = containerClient.getBlockBlobClient(oldFileName);
        const newBlobClient = containerClient.getBlockBlobClient(newFileName);

        const exists = await oldBlobClient.exists();
        if (!exists) {
          return res.status(404).json({
            error: `Imagem antiga (${oldFileName}) não encontrada no Azure.`,
          });
        }

        const copyPoller = await newBlobClient.beginCopyFromURL(
          oldBlobClient.url
        );
        await copyPoller.pollUntilDone();

        await oldBlobClient.deleteIfExists();

        news.image = `https://xuobucket.blob.core.windows.net/${containerName}/${newFileName}`;
        news.title = title;
      } catch (error) {
        console.error("Erro ao renomear imagem no Azure:", error.message);
        return res
          .status(500)
          .json({ erro: "Erro ao atualizar imagem na Azure" });
      }
    } else if (title) {
      news.title = title;
    }

    // Se nova imagem for enviada, faz upload
    if (imageFile) {
      try {
        const fileName = `${sanitize(news.title)}.jpg`; // usa o título atualizado ou atual
        const buffer = imageFile.buffer;

        const blockBlobClient = containerClient.getBlockBlobClient(fileName);
        await blockBlobClient.uploadData(buffer, {
          blobHTTPHeaders: {
            blobContentType: imageFile.mimetype,
          },
          overwrite: true,
        });

        news.image = `https://xuobucket.blob.core.windows.net/${containerName}/${fileName}`;
      } catch (error) {
        console.error("Erro no upload da nova imagem:", error.message);
        return res
          .status(500)
          .json({ erro: "Erro ao fazer upload da nova imagem" });
      }
    }

    if (redirection) {
      news.redirection = redirection;
    }

    await news.save();

    return res.status(200).json({ message: "Notícia atualizada com sucesso" });
  } catch (error) {
    console.error("Erro geral no update:", error.message);
    return res.status(500).json({ erro: "Erro interno no servidor" });
  }
};

const remove = async (req, res) => {
  try {
    const { id } = req.body;

    if (!id) {
      return res.status(400).json({ error: "ID é obrigatório" });
    }

    const news = await News.findById(id);
    if (!news) {
      return res.status(404).json({ error: "Notícia não encontrada" });
    }

    // Extrai o nome do ficheiro da imagem
    const imageUrl = news.image;
    const fileName = decodeURIComponent(imageUrl.split("/").pop());

    // Remover imagem da Azure Blob Storage
    const containerName = "news";
    const blobServiceClient = BlobServiceClient.fromConnectionString(
      process.env.AZURE_STORAGE_CONNECTION_STRING
    );
    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blobClient = containerClient.getBlockBlobClient(fileName);

    await blobClient.deleteIfExists();

    // Remover documento da base de dados
    await News.findByIdAndDelete(id);

    return res.status(200).json({ message: "Notícia eliminada com sucesso" });
  } catch (error) {
    console.error("Erro ao eliminar notícia:", error.message);
    return res.status(500).json({ erro: "Erro interno ao eliminar notícia" });
  }
};

const getRandomNews = async (req, res) => {
  try {
    const randomNews = await News.aggregate([{ $sample: { size: 3 } }]);
    return res.status(200).json({ news: randomNews });
  } catch (error) {
    console.error("Erro ao buscar notícias aleatórias:", error.message);
    return res.status(500).json({ erro: "Erro interno do servidor" });
  }
};

export default {
  create,
  update,
  remove,
  getRandomNews,
};
