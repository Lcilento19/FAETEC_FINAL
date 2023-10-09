import React, { useEffect, useState } from "react";
import Stopwatch from "../../components/StopWatch";
import OpenAI from "../../components/OpenAI";
import Calculator from "../../components/Calculator";
import "./home.css";
import { auth, db } from "../../config/firebaseConnection";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection } from "firebase/firestore";
import "../../components/TemaEscuro/temaEscuro.css";
import TemaEscuroToggle from "../../components/TemaEscuro/AlternarTema"; // Importe o comutador de tema
import { useTema } from "../../components/TemaEscuro/TemaContext"; // Importe o gancho de tema
import { Link } from "react-router-dom";

async function handleLogout() {
  await signOut(auth);
}

export default function Home() {
  const [userName, setUserName] = useState("");
  const user = auth.currentUser;
  const { temaEscuro } = useTema();

  async function fetchUserName() {
    if (user) {
      if (user.providerData && user.providerData[0]) {
        // Verificar se o método de autenticação é o Google
        if (user.providerData[0].providerId === "google.com") {
          // Se for Google, use o nome da conta do Google
          setUserName(user.providerData[0].displayName || "Usuário");
        } else {
          // Se não for Google, use o nome do documento do Firestore (ou "Usuário" como padrão)
          const userDocRef = doc(collection(db, "contas"), user.uid);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.data();
          setUserName(userData?.nome || "Usuário");
        }
      }
    }
  }

  useEffect(() => {
    fetchUserName();
  }, [user]);

  return (
    <div className={`home-container ${temaEscuro ? "dark-theme" : ""}`}>
      <TemaEscuroToggle temaEscuro={temaEscuro} toggleTema={() => {}} />{" "}
      <h1 className="title-login">Multi</h1>
      <p className="user">
        Bem-vindo, <span>{userName || "Usuário"}</span>!
      </p>
      <button className="logout" onClick={handleLogout}>
        SAIR
      </button>
      <Link className="TextEditorButton" target="_self" to={"/editor"}>
        Editor de Texto
      </Link>
      <Link className="TodoListButton" target="_self" to={"/todoList"}>
        Lista de tarefas
      </Link>
      <Calculator />
      <OpenAI />
      <Stopwatch />
    </div>
  );
}
