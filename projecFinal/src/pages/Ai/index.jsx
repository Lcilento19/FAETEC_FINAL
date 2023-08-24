import React, { useState } from "react";
import "./ia.css";
import Stopwatch from "../../components/StopWatch";

function OpenAIComponent() {
  const [prompt, setPrompt] = useState("");
  const [response, setResponse] = useState("");

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
      e.preventDefault(); // Prevents the default behavior of a textarea (line break)
      handleGenerateText();
    }
  };

  return (
    <>
      <div className="center-container">
        <div className="container">
          <div className="region input-region">
            <h1 className="titulo">Pergunta</h1>
            <textarea
              rows="5"
              className="input-ia"
              cols="50"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              onKeyUp={handleKeyPress} // Call handleKeyPress when a key is pressed
            />
          </div>
          <div className="region button-region">
            <button className="botao" onClick={handleGenerateText}>
              Generate Text
            </button>
          </div>
          <div className="region resposta-region">
            <h1 className="titulo">Resposta</h1>
            <div className="resposta">
              <p>{response}</p>
            </div>
          </div>
        </div>
      </div>
      <Stopwatch />
    </>
  );
}

export default OpenAIComponent;
