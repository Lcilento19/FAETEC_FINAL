import React, { useState } from "react";
import "./openai.css";

function OpenAI() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");
  const [showOpenAI, setShowOpenAI] = useState(false);

  const handleGenerateText = async () => {
    try {
      const requestBody = { prompt };
      const response = await fetch("http://localhost:5000/generate-text", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json();
      setResponse(responseData.text);
    } catch (error) {
      console.error(error);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleGenerateText();
    }
  };

  const toggleOpenAI = () => {
    setShowOpenAI((prevState) => !prevState);
  };

  return (
    <div className="center-container">
      <button className="showOpenAIButton" onClick={toggleOpenAI}>
        {showOpenAI ? "Hide OpenAI" : "Show OpenAI"}
      </button>

      {showOpenAI && (
        <div className="container">
          <div className="region resposta-region">
            <h1 className="titulo">Resposta</h1>
            <div className="resposta">
              <p>{response}</p>
            </div>
          </div>
          <div className="region input-region">
            <h1 className="titulo">Pergunta</h1>
            <input
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyUp={handleKeyPress}
              type="text"
            />
          </div>
          <button className="botao" onClick={handleGenerateText}>
            Enviar
          </button>
        </div>
      )}
    </div>
  );
}

export default OpenAI;
