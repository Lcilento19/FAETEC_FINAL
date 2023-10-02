import React, { useState } from "react";
import "./editorTexto.css";
import { useTema } from "../../components/TemaEscuro/TemaContext";
import TemaEscuroToggle from "../../components/TemaEscuro/AlternarTema";

import { Link } from "react-router-dom";

function TextEditor() {
  const [text, setText] = useState("");
  const [isBold, setIsBold] = useState(false);
  const [isItalic, setIsItalic] = useState(false);
  const [textColor, setTextColor] = useState("#000000");
  const [fontSize, setFontSize] = useState(16);

  const { temaEscuro } = useTema();

  const handleBoldClick = () => {
    setIsBold(!isBold);
  };

  const handleItalicClick = () => {
    setIsItalic(!isItalic);
  };

  const handleColorChange = (e) => {
    setTextColor(e.target.value);
  };

  const handleChange = (e) => {
    setText(e.target.value);
  };

  const increaseFontSize = () => {
    setFontSize((prevSize) => prevSize + 2);
  };

  const decreaseFontSize = () => {
    setFontSize((prevSize) => prevSize - 2);
  };

  const handleDelete = () => {
    setText("");
  };

  const containerClassName = temaEscuro
    ? "editor-container dark-theme"
    : "editor-container";

  const textareaStyle = {
    fontWeight: isBold ? "bold" : "normal",
    fontStyle: isItalic ? "italic" : "normal",
    color: textColor,
    fontSize: `${fontSize}px`,
  };

  return (
    <div className={containerClassName}>
      <Link className="TextEditorButton" to={"/home"}>
        Home
      </Link>
      <TemaEscuroToggle />
      <div className="buttons-editor">
        <button className="format-button" onClick={handleBoldClick}>
          Negrito
        </button>
        <button className="format-button" onClick={handleItalicClick}>
          Itálico
        </button>

        <button className="size-button" onClick={increaseFontSize}>
          +
        </button>
        <button className="size-button" onClick={decreaseFontSize}>
          -
        </button>
        <button className="delete-button" onClick={handleDelete}>
          Apagar
        </button>
        <input
          type="color"
          value={textColor}
          onChange={handleColorChange}
          className="color-input"
        />
        <textarea
          rows="10"
          cols="50"
          value={text}
          onChange={handleChange}
          placeholder="Digite seu texto aqui..."
          style={textareaStyle}
          className="text-area"
        />
      </div>
    </div>
  );
}

export default TextEditor;
