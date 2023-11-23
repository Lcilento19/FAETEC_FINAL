import React, { useEffect, useState } from "react";
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

  const fontOptions = [
    "Arial, sans-serif",
    "Helvetica, sans-serif",
    "Times New Roman, serif",
    "Georgia, serif",
    "Verdana, sans-serif",
    "Courier New, monospace",
  ];

  const [selectedFont, setSelectedFont] = useState(fontOptions[0]);

  const { temaEscuro } = useTema();

  const handleFontChange = (e) => {
    setSelectedFont(e.target.value);
  };

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

  useEffect(() => {
    if (temaEscuro) {
      setTextColor("#ffffff");
    } else {
      setTextColor("#000000");
    }
  }, [temaEscuro]);

  const textareaStyle = {
    fontWeight: isBold ? "bold" : "normal",
    fontStyle: isItalic ? "italic" : "normal",
    color: textColor,
    fontSize: `${fontSize}px`,
    fontFamily: selectedFont,
  };

  return (
    <div className={containerClassName}>
      <Link className="btn-home" to={"/home"}>
        <img className="arrow_back" src="arrow_back.png" alt="" />
      </Link>
      <TemaEscuroToggle style={{ top: "0" }} />
      <h1 className="title-login">Multi</h1>

      <div className="buttons-editor">
        <button
          className="format-button editor-container-button"
          onClick={handleBoldClick}
        >
          Negrito
        </button>
        <button
          className="format-button editor-container-button"
          onClick={handleItalicClick}
        >
          Itálico
        </button>
        <button
          className="size-button editor-container-button"
          onClick={increaseFontSize}
        >
          +
        </button>
        <button
          className="size-button editor-container-button"
          onClick={decreaseFontSize}
        >
          -
        </button>
        <button
          className="delete-button editor-container-button"
          onClick={handleDelete}
        >
          Apagar
        </button>
        <input
          type="color"
          value={textColor}
          onChange={handleColorChange}
          className="color-input"
        />
        <select
          id="fontSelect"
          value={selectedFont}
          onChange={handleFontChange}
          className="font-select"
        >
          {fontOptions.map((font, index) => (
            <option key={index} value={font}>
              {font}
            </option>
          ))}
        </select>
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
