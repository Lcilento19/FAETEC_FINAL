import React from "react";
import { useTema } from "./TemaContext";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSun, faMoon } from "@fortawesome/free-solid-svg-icons";

function AlternarTema() {
  const { temaEscuro, toggleTema } = useTema();

  const toggleTemaClick = () => {
    toggleTema();
  };

  return (
    <div
      className={`alternar-tema ${temaEscuro ? "dark" : ""}`}
      onClick={toggleTemaClick}
    >
      <label className="switch">
        {temaEscuro ? (
          <FontAwesomeIcon icon={faSun} className="icone-sol" />
        ) : (
          <FontAwesomeIcon icon={faMoon} className="icone-lua" />
        )}
      </label>
    </div>
  );
}

export default AlternarTema;
