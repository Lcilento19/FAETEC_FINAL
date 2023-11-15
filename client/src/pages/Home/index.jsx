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
import Dropdown from "react-bootstrap/Dropdown";
import { Modal, Button } from "react-bootstrap";

async function handleLogout() {
  await signOut(auth);
}

export default function Home() {
  const [userName, setUserName] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [newProfilePic, setNewProfilePic] = useState(null);
  const [newUserName, setNewUserName] = useState("");
  const fileInputRef = useRef(null);
  const [showModal, setShowModal] = useState(false);

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

  const handleShowModal = () => {
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
  };

  const handleSaveName = () => {
    if (newUserName.trim() !== "") {
      const userDocRef = doc(collection(db, "contas"), user.uid);
      updateDoc(userDocRef, { nome: newUserName })
        .then(() => {
          setUserName(newUserName);
          setNewUserName("");
          handleCloseModal();
        })
        .catch((error) => {
          console.error("Erro ao atualizar o nome:", error);
        });
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

  const LogoutDropdown = () => (
    <Dropdown className="custom-dropdown ">
      <Dropdown.Toggle
        variant="secondary"
        className="dropdown"
        id="dropdown-basic"
      >
        <img className="profile-picture" src={profilePic} alt="" />
      </Dropdown.Toggle>

      <Dropdown.Menu className="dropdown-menu" style={{ marginTop: "20px" }}>
        {user && user.providerData[0].providerId === "password" && (
          <>
            <Dropdown.Item onClick={handleProfilePicClick}>
              Alterar Foto
            </Dropdown.Item>
            <Dropdown.Item onClick={handleShowModal}>
              Alterar Nome
            </Dropdown.Item>
          </>
        )}
        <Dropdown.Item onClick={handleLogout}>Sair</Dropdown.Item>
      </Dropdown.Menu>
    </Dropdown>
  );

  return (
    <div className={`home-container ${temaEscuro ? "dark-theme" : ""}`}>
      <TemaEscuroToggle temaEscuro={temaEscuro} toggleTema={() => {}} />
      <div className="header">
        <div className="user-info">
          <LogoutDropdown />
          <span>{userName || "Usuário"}</span>
          {user && user.providerData[0].providerId === "password" && (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleProfilePicChange}
                style={{ display: "none" }}
                ref={fileInputRef}
              />
            </>
          )}
        </div>
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
      <Modal
        style={{ border: "none" }}
        show={showModal}
        onHide={handleCloseModal}
      >
        <Modal.Header closeButton>
          <Modal.Title>Alterar Nome</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <input
            type="text"
            placeholder="Novo Nome"
            value={newUserName}
            onChange={(e) => setNewUserName(e.target.value)}
          />
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="secondary"
            style={{ backgroundColor: "rgb(185, 34, 34)", border: "none" }}
            onClick={handleCloseModal}
          >
            Fechar
          </Button>
          <Button
            variant="primary"
            style={{ backgroundColor: "#825ae0", border: "none" }}
            onClick={handleSaveName}
          >
            Salvar
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
