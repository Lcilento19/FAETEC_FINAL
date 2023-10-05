import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "../config/firebaseConnection";
import { onAuthStateChanged } from "firebase/auth";

export default function Private({ children }) {
  const [loading, setLoading] = useState(true);
  const [signed, setSigned] = useState(false);

  useEffect(() => {
    async function checkLogin() {
      try {
        const unsub = onAuthStateChanged(auth, (user) => {
          if (user) {
            const userData = {
              uid: user.uid,
              email: user.email,
            };

            localStorage.setItem("@detailUser", JSON.stringify(userData));

            setLoading(false);
            setSigned(true);
          } else {
            setLoading(false);
            setSigned(false);
          }
        });
      } catch (error) {
        console.error("Erro durante a autenticação:", error);
        setLoading(false);
        setSigned(false);
      }
    }

    checkLogin();
  }, []);

  if (loading) {
    return <div>Carregando...</div>; // Pode exibir um spinner de carregamento enquanto verifica a autenticação.
  }

  if (!signed) {
    return <Navigate to="/" replace={true} />; // Redireciona para a página de login.
  }

  // Se o usuário estiver autenticado, renderiza os componentes filhos (rotas protegidas).
  return <>{children}</>;
}
