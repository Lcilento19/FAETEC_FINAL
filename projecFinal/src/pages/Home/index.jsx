import React, { useEffect, useState } from "react";
import Stopwatch from "../../components/StopWatch";
import OpenAI from "../../components/OpenAI";
import Calculator from "../../components/Calculator";
import "./home.css";
import { db, auth } from "../../firebaseConnection";
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

  useEffect(() => {
    async function fetchUserName() {
      const userDocRef = doc(collection(db, "contas"), user.uid);
      const userDocSnap = await getDoc(userDocRef);

      const userData = userDocSnap.data();
      setUserName(userData.nome);
    }

    fetchUserName();
  }, [user]);

  return (
    <div className={`home-container ${temaEscuro ? "dark-theme" : ""}`}>
      <TemaEscuroToggle temaEscuro={temaEscuro} toggleTema={() => {}} />{" "}
      <img
        style={{ paddingBottom: 50 }}
        width={300}
        height={256}
        src="logo.png"
        alt="logo"
      />{" "}
      <p className="user">
        Bem-vindo, <span>{userName || "Usuário"}</span>!
      </p>
      <button className="logout" onClick={handleLogout}>
        SAIR
      </button>
      <Link className="TextEditorButton" target="_blank" to={"/editor"}>
        Editor de Texto
      </Link>
      <Calculator />
      <OpenAI />
      <Stopwatch />
    </div>
  );
}
