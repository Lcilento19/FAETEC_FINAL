import express from "express";
import cors from "cors";
import OpenAI from "openai";

import dotenv from "dotenv"; // Importe o dotenv

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());

app.use(express.json());

app.get("/", (req, res) => {
  res.status(200).json({ message: "Welcome to the OpenAI API" });
});
const conversation = [];

app.post("/generate-text", async (req, res) => {
  try {
    const prompt = String(req.body.prompt); // Converte para string

    conversation.push({ role: "user", content: prompt });

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...conversation,
      ],
    });

    const assistantMessage = String(response.choices[0]?.message?.content); // Converte para string
    if (!assistantMessage) {
      console.error("Resposta da API não contém a propriedade 'text'. Resposta completa:", response);
      res.status(500).json({ error: "Something went wrong" });
      return;
    }

    conversation.push({ role: "assistant", content: assistantMessage });

    res.status(200).json({ text: assistantMessage });
  } catch (error) {
    console.error("Erro na rota /generate-text:", error);
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