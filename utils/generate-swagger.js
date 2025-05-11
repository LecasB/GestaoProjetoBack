// generate-swagger.js
import swaggerJSDoc from "swagger-jsdoc";
import fs from "fs";
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
  apis: [path.join(__dirname, "../routes/*.js")], // ajusta se necessário
};

const swaggerSpec = swaggerJSDoc(options);

// Exporta o ficheiro
fs.writeFileSync("public/swagger.json", JSON.stringify(swaggerSpec, null, 2));
console.log("✅ Swagger JSON gerado em public/swagger.json");
