import multer from "multer";

// Armazenamento em memória (útil para envio direto para Azure)
const storage = multer.memoryStorage();

// Validação de tipo de ficheiro (ex: imagem apenas)
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Apenas ficheiros de imagem são permitidos."), false);
  }
};

const upload = multer({ storage, fileFilter });

// Middleware específico para um ficheiro com campo "photo"
const uploadSingleImage = upload.single("photo");

export default uploadSingleImage;
