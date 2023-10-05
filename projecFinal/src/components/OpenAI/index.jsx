import React, { useState, useEffect } from "react";
import hljs from "highlight.js";
import "highlight.js/styles/agate.css";
import "./openai.css";

function OpenAI() {
  const [messages, setMessages] = useState([]);
  const [prompt, setPrompt] = useState("");
  const [showChat, setShowChat] = useState(false);
  const [conversation, setConversation] = useState([]); // Defina a variável de conversa

  const addMessage = async (message, isResponse) => {
    const codeRegex = /```([a-zA-Z]+)([^]+?)```/g;

    const formattedMessage = await Promise.all(
      message.split(codeRegex).map(async (part, index) => {
        if (index % 3 === 0) {
          return part;
        } else if (index % 3 === 1) {
          const language = part;
          const code = message.split(codeRegex)[index + 1];
          return await formatCode(code, language);
        }
      })
    );

    const newMessages = formattedMessage
      .filter((part) => part !== undefined)
      .map((part) => ({ text: part, isResponse }));

    setMessages((prevMessages) => [...prevMessages, ...newMessages]);
    setConversation((prevConversation) => [
      ...prevConversation,
      ...newMessages,
    ]);
  };

  const formatCode = async (code, language) => {
    try {
      const highlightedCode = hljs.highlightAuto(code, [language]).value;
      return `<pre><code class="hljs ${language}">${highlightedCode}</code></pre>`;
    } catch (error) {
      console.error("Erro ao formatar código:", error);
      return `<pre><code>${code}</code></pre>`;
    }
  };

  const handleGenerateText = async () => {
    try {
      const requestBody = { prompt };
      const response = await fetch("apimultiai.squareweb.app/generate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      addMessage(prompt, false);
      addMessage(responseData.text, true);
      setPrompt("");
    } catch (error) {
      console.error(error);
    }
  };

  const toggleChat = () => {
    setShowChat((prevState) => !prevState);
  };

  return (
    <div className={`openai-container ${showChat ? "show" : ""}`}>
      <button className="showOpenAIButton" onClick={toggleChat}>
        {showChat ? "Esconder OpenAI" : "Mostrar OpenAI"}
      </button>
      <h1 className="titulo-ia">Chat Ia</h1>
      <div className="chat-container">
        {conversation.map((message, index) => (
          <div
            key={index}
            className={`message ${
              message.isResponse ? "response" : "question"
            }`}
            dangerouslySetInnerHTML={{ __html: message.text }}
          />
        ))}
      </div>
      <div className="input-region">
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          onKeyUp={(e) => e.key === "Enter" && handleGenerateText()}
          type="text"
          className="input-text"
          placeholder="Digite sua mensagem..."
        />
        <button className="botao" onClick={handleGenerateText}>
          Enviar
        </button>
      </div>
    </div>
  );
}

export default OpenAI;
