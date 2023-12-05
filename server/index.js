import express from "express";
import cors from "cors";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  req.openai = openai;
  next();
});

function handleApiError(res, errorMessage, response) {
  console.error(errorMessage, response);
  res.status(500).json({ error: "Something went wrong" });
}

app.get("/", (req, res) => {
  res.status(200).json({
    message:
      "Welcome to Multi services. Use the correct route: https://chat-api-multi.onrender.com/generate-text",
  });
});

app.get("/generate-text", (req, res) => {
  res.status(405).json({
    error: "The GET method is not allowed on this route",
  });
});

const conversation = [];

app.post("/generate-text", async (req, res) => {
  try {
    const prompt = String(req.body.prompt);
    conversation.push({ role: "user", content: prompt });

    const response = await req.openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        ...conversation,
      ],
    });

    const assistantMessage = String(response.choices[0]?.message?.content);
    if (!assistantMessage) {
      handleApiError(
        res,
        "Resposta da API não contém a propriedade 'text'.",
        response
      );
      return;
    }

    conversation.push({ role: "assistant", content: assistantMessage });

    res.status(200).json({ text: assistantMessage });
  } catch (error) {
    handleApiError(res, "Erro na rota /generate-text:", error);
  }
});

app.listen(port, () => {
  console.log("\x1b[33m%s\x1b[0m", "[API] Iniciando...");
  console.log("\x1b[32m%s\x1b[0m", `[Api] Server is running on port ${port}`);
});
