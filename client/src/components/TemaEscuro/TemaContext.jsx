import React, { createContext, useContext, useState } from "react";

const TemaContext = createContext();

export const TemaProvider = ({ children }) => {
  const [temaEscuro, setTemaEscuro] = useState(false);

  const toggleTema = () => {
    setTemaEscuro(!temaEscuro);
  };

  return (
    <TemaContext.Provider value={{ temaEscuro, toggleTema }}>
      {children}
    </TemaContext.Provider>
  );
};

export const useTema = () => {
  const context = useContext(TemaContext);
  if (!context) {
    throw new Error("useTema deve ser usado dentro de um TemaProvider");
  }
  return context;
};
