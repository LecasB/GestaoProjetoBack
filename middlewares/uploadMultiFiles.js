import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image/")) {
    cb(null, true);
  } else {
    cb(new Error("Apenas ficheiros de imagem são permitidos."), false);
  }
};

const upload = multer({ storage, fileFilter });

const uploadMultipleImages = upload.array("images", 3);

export default uploadMultipleImages;
