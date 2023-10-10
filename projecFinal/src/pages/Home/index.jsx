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

  const handleUpdateProfilePic = async (file) => {
    if (file) {
      const storageRef = ref(storage, `profileImages/${user.uid}`);
      const uploadTask = uploadBytesResumable(storageRef, file);

      try {
        await uploadTask;
        const downloadURL = await getDownloadURL(storageRef);
        setProfilePic(downloadURL);

        const userDocRef = doc(collection(db, "contas"), user.uid);
        await updateDoc(userDocRef, { profilePic: downloadURL });
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
      }
    }
  };

  const handleProfilePicClick = () => {
    if (user && user.providerData[0].providerId === "password") {
      fileInputRef.current.click();
    }
  };

  const handleProfilePicChange = (e) => {
    if (e.target.files[0]) {
      setNewProfilePic(e.target.files[0]);
      handleUpdateProfilePic(e.target.files[0]);
    }
  };

  return (
    <div className={`home-container ${temaEscuro ? "dark-theme" : ""}`}>
      <TemaEscuroToggle temaEscuro={temaEscuro} toggleTema={() => {}} />
      <div className="header">
        {user && user.providerData[0].providerId === "password" && (
          <div className="user-info">
            <label
              htmlFor="fileInput"
              className="profile-picture-label"
              onClick={handleProfilePicClick}
            >
              <img className="profile-picture" src={profilePic} alt="" />
            </label>
            <span>{userName || "Usuário"}</span>
            <button className="logout" onClick={handleLogout}>
              SAIR
            </button>
            <input
              type="file"
              accept="image/*"
              onChange={handleProfilePicChange}
              style={{ display: "none" }}
              ref={fileInputRef}
            />
          </div>
        )}
      </div>

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
