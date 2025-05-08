import swaggerJSDoc from "swagger-jsdoc";
import swaggerUi from "swagger-ui-express";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "API MERN",
      version: "1.0.0",
      description: "Documentação da API com Swagger",
    },
  },
  apis: [path.join(__dirname, "../routes/*.js")], // Caminho certo!
};

const swaggerSpec = swaggerJSDoc(options);

export { swaggerSpec, swaggerUi };
