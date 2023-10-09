import React, { useEffect, useState, useRef } from "react";
import Stopwatch from "../../components/StopWatch";
import OpenAI from "../../components/OpenAI";
import Calculator from "../../components/Calculator";
import "./home.css";
import { auth, db, storage } from "../../config/firebaseConnection";
import { signOut } from "firebase/auth";
import { doc, getDoc, collection, updateDoc } from "firebase/firestore";
import "../../components/TemaEscuro/temaEscuro.css";
import TemaEscuroToggle from "../../components/TemaEscuro/AlternarTema";
import { useTema } from "../../components/TemaEscuro/TemaContext";
import { Link } from "react-router-dom";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";

async function handleLogout() {
  await signOut(auth);
}

export default function Home() {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const fileInputRef = useRef(null);

  const user = auth.currentUser;
  const { temaEscuro } = useTema();

  async function fetchUserName() {
    if (user) {
      if (user.providerData && user.providerData[0]) {
        if (user.providerData[0].providerId === "google.com") {
          setUserName(user.providerData[0].displayName || "Usuário");
          setProfilePic(user.providerData[0].photoURL || "");
        } else {
          const userDocRef = doc(collection(db, "contas"), user.uid);
          const userDocSnap = await getDoc(userDocRef);
          const userData = userDocSnap.data();
          setUserName(userData?.nome || "Usuário");
          setProfilePic(userData?.profilePic);
        }
      }
    }
  }

  useEffect(() => {
    fetchUserName();
  }, [user]);

  const handleFileChange = (e) => {
    if (e.target.files[0]) {
      setNewProfilePic(e.target.files[0]);
    }
  };

  const handleUpdateProfilePic = async () => {
    if (newProfilePic) {
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, newProfilePic);

      try {
        await uploadTask;
        const downloadURL = await getDownloadURL(storageRef);
        setProfilePic(downloadURL);
        setNewProfilePic(null);

        const userDocRef = doc(collection(db, "contas"), user.uid);
        await updateDoc(userDocRef, { profilePic: downloadURL });
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
      }
    }
  };

  return (
    <div className={`home-container ${temaEscuro ? "dark-theme" : ""}`}>
      <TemaEscuroToggle temaEscuro={temaEscuro} toggleTema={() => {}} />
      <h1 className="title-login">Multi</h1>
      <img className="profile-picture" src={profilePic} alt="" />
      {user && user.providerData[0].providerId === "password" && (
        <>
          <input
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            style={{ display: "none" }}
            ref={fileInputRef}
          />
          <button className="button-home" onClick={() => fileInputRef.current.click()}>
            Escolher Nova Foto
          </button>
          {newProfilePic && (
            <button className="button-home" onClick={handleUpdateProfilePic}>Salvar Nova Foto</button>
          )}
        </>
      )}
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
