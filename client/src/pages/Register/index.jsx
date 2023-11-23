import React, { useState } from "react";
import "./register.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../components/TemaEscuro/temaEscuro.css";
import TemaEscuroToggle from "../../components/TemaEscuro/AlternarTema";
import { useTema } from "../../components/TemaEscuro/TemaContext";
import { createUserWithEmailAndPassword, getAuth, sendEmailVerification } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { db, storage } from "../../config/firebaseConnection";

import { toast } from "react-toastify";
function Register() {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");
  const [nome, setNome] = useState("");
  const navigate = useNavigate();
  const { temaEscuro } = useTema();
  const [profilePic, setProfilePic] = useState(
    "https://i.imgur.com/Ulz0rmr.jpg"
  );

  async function handleRegister(e) {
    e.preventDefault();

    if (email !== "" && password1 !== "" && password2 !== "" && nome !== "") {
      try {
        if (password1 !== password2) {
          alert("As senhas não coincidem");
          setPassword1("");
          setPassword2("");
        } else if (password1 === password2) {
          const auth = getAuth();
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password1
          );

          await sendEmailVerification(userCredential.user);

          const user = userCredential.user;

          const idDaPessoa = user.uid;

          const userDocRef = doc(db, "contas", idDaPessoa);
          await setDoc(userDocRef, {
            idDaPessoa: idDaPessoa,
            nome: nome,
            email: email,
            senha: password1,
            profilePic: profilePic,
          });

          toast.success(
            "Cadastrado com sucesso. Verifique seu e-mail para ativar a conta."
          );

          navigate("/", { replace: true });
        }
      } catch (error) {
        if (error) {
          return;
        }
        if (error.code === "auth/email-already-in-use") {
          alert("Este email já está em uso. Por favor, escolha outro.");
        } else if (error.code === "auth/invalid-email") {
          alert("O email fornecido é inválido. Por favor, verifique o email.");
        } else if (error.code === "auth/weak-password") {
          alert("A senha é muito fraca. Escolha uma senha mais forte.");
        } else {
          console.error("Erro ao cadastrar:", error);
          alert("Ocorreu um erro ao cadastrar. Tente novamente mais tarde.");
        }
      }
    } else {
      alert("Preencha todos os campos");
    }
  }

  return (
    <div className={`login-container ${temaEscuro ? "dark-theme" : ""}`}>
      <h1>Cadastre-se</h1>
      <span>Vamos criar sua conta!</span>
      <TemaEscuroToggle
        style={{ top: "0" }}
        temaEscuro={temaEscuro}
        toggleTema={() => {}}
      />

      <form className="form" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Nome Sobrenome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="password"
          placeholder="Senha"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />
        <input
          type="password"
          placeholder="Confirmar senha"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />
        <button type="submit" className="register-button">
          Cadastrar
        </button>
      </form>
      <Link className="button-linkToLogin" to={"/"}>
        Já possui uma conta? Faça o login.
      </Link>
    </div>
  );
}

export default Register;
