import React, { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import "./register.css";
import TemaEscuroToggle from "../../components/TemaEscuro/AlternarTema"; // Importe o comutador de tema
import { useTema } from "../../components/TemaEscuro/TemaContext"; // Importe o gancho de tema

import { toast } from "react-toastify";

function Register() {
  const [email, setEmail] = useState("");
  const [password1, setPassword1] = useState("");
  const [password2, setPassword2] = useState("");

  const [nome, setNome] = useState("");
  const navigate = useNavigate();
  const { temaEscuro } = useTema(); // Acesse o estado do tema

  async function handleRegister(e) {
    e.preventDefault();

    if (email !== "" && password1 !== "" && password2 !== "" && nome !== "") {
      try {
        if (password1 !== password2) {
          toast.warn("As senhas não coincidem");
          setPassword1("");
          setPassword2("");
        } else if (password1 == password2) {
          const userCredential = await createUserWithEmailAndPassword(
            auth,
            email,
            password1
          );
          const user = userCredential.user;

          // Use o uid do usuário como o ID da pessoa
          const idDaPessoa = user.uid;

          // Salve as informações no Firestore com o mesmo ID da pessoa
          const userDocRef = doc(db, "contas", idDaPessoa);
          await setDoc(userDocRef, {
            idDaPessoa: idDaPessoa,
            nome: nome,
            email: email,
            senha: password1,
          });

          toast.success("Cadastrado com sucesso");

          navigate("/", { replace: true });
        }
      } catch (error) {
        if (error.code === "auth/email-already-in-use") {
          toast.warn("Este email já está em uso. Por favor, escolha outro.");
        } else if (error.code === "auth/invalid-email") {
          toast.warn(
            "O email fornecido é inválido. Por favor, verifique o email."
          );
        } else if (error.code === "auth/weak-password") {
          toast.warn("A senha é muito fraca. Escolha uma senha mais forte.");
        } else {
          console.error("Erro ao cadastrar:", error);
          toast.warn(
            "Ocorreu um erro ao cadastrar. Tente novamente mais tarde."
          );
        }
      }
    } else {
      toast.warn("Preencha os campos");
    }
  }

  return (
    <div className={`login-container ${temaEscuro ? "dark-theme" : ""}`}>
      <h1>Cadastre-se</h1>
      <span>Vamos criar sua conta!</span>
      <TemaEscuroToggle temaEscuro={temaEscuro} toggleTema={() => {}} />{" "}
      <form className="form" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="email@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="text"
          placeholder="Your name"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password1}
          onChange={(e) => setPassword1(e.target.value)}
        />

        <input
          type="password"
          placeholder="Confirm Password"
          value={password2}
          onChange={(e) => setPassword2(e.target.value)}
        />

        <button type="submit">Cadastrar</button>
      </form>
      <Link className="button-link" to={"/"}>
        Já possui uma conta? Faça o login.
      </Link>

    </div>
  );
}

export default Register;
