import React, { useEffect, useState } from "react";
import Stopwatch from "../../components/StopWatch";
import OpenAI from "../../components/OpenAI";
import "./home.css";
import { db, auth } from "../../firebaseConnection";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, query, where } from "firebase/firestore";

async function handleLogout() {
  await signOut(auth);
}

export default function Home() {
  const [userName, setUserName] = useState("");
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      async function fetchUserName() {
        try {
          const userDocRef = doc(collection(db, "contas"), user.uid);
          const userDocSnap = await getDoc(userDocRef);

          if (userDocSnap.exists()) {
            const userData = userDocSnap.data();
            setUserName(userData.nome);
          } else {
            console.error("Documento do usuário não encontrado.");
          }
        } catch (error) {
          console.error("Erro ao buscar o nome do usuário:", error);
        }
      }

      fetchUserName();
    }
  }, [user]);

  return (
    <>
      <div className="home-container">
        <h1 className="titulo">Página Inicial</h1>
        <p>Bem-vindo, {userName || "Usuário"}!</p>
        <button className="logout" onClick={handleLogout}>
          SAIR
        </button>
      </div>
      <OpenAI />
      <Stopwatch />
    </>
  );
}
