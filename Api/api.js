import express from "express";
import cors from "cors";
import OpenAI from "openai";

import dotenv from "dotenv"; // Importe o dotenv

// Carregue as variáveis de ambiente do arquivo .env
dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Configurar a chave da API do OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Habilitar o middleware CORS
app.use(cors());

app.use(express.json());

// Rota GET para a raiz do servidor
app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the OpenAI API" });
});

app.post("/generate-text", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: prompt },
      ],
      max_tokens: 4000,
    });

    res.status(200).json({ text: response.choices[0].message.content });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Something went wrong" });
  }
});

app.listen(port, () => {
  console.log("\x1b[33m%s\x1b[0m", `[API] Iniciando...`);
  setTimeout(() => {
    console.clear();
    console.log("\x1b[32m%s\x1b[0m", `[Api] Server is running on port ${port}`);
  }, 3000);
});
