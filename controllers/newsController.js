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

    // Se o título mudou, renomear a imagem (copiar + deletar)
    if (title && title !== news.title) {
      const oldFileName = `${news.title}.jpg`;
      const newFileName = `${title}.jpg`;

      const oldBlobClient = containerClient.getBlockBlobClient(oldFileName);
      const newBlobClient = containerClient.getBlockBlobClient(newFileName);

      // Copiar o blob para o novo nome
      const copyPoller = await newBlobClient.beginCopyFromURL(
        oldBlobClient.url
      );
      await copyPoller.pollUntilDone();

      // Deletar o antigo blob
      await oldBlobClient.deleteIfExists();

      // Atualizar o campo image para o novo URL
      news.image = `https://xuobucket.blob.core.windows.net/${containerName}/${newFileName}`;
      news.title = title;
    } else if (title) {
      // Só atualizar o título no documento se mudou
      news.title = title;
    }

    if (redirection) {
      news.redirection = redirection;
    }

    // Se enviar uma nova imagem, fazer upload com o nome atual (já atualizado se mudou o título)
    if (imageFile) {
      const fileName = `${news.title}.jpg`;
      const blockBlobClient = containerClient.getBlockBlobClient(fileName);
      try {
        await blockBlobClient.uploadData(imageFile.buffer, {
          blobHTTPHeaders: {
            blobContentType: imageFile.mimetype,
          },
          overwrite: true,
        });
        // Atualiza a URL da imagem (em caso de upload novo)
        news.image = `https://xuobucket.blob.core.windows.net/${containerName}/${fileName}`;
      } catch (error) {
        return res.status(400).json({ error: "Erro ao carregar a imagem" });
      }
    }

    await news.save();

    return res.status(200).json({ message: "Notícia atualizada com sucesso" });
  } catch (error) {
    return res.status(500).json({ error: error.message || error });
  }
};

export default {
  create,
  update,
};
