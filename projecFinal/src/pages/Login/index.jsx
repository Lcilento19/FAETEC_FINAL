import React, { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import { auth } from "../../firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";

import "../../components/TemaEscuro/temaEscuro.css";
import TemaEscuroToggle from "../../components/TemaEscuro/AlternarTema"; // Importe o comutador de tema
import { useTema } from "../../components/TemaEscuro/TemaContext"; // Importe o gancho de tema

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { temaEscuro, toggleTema } = useTema();

  async function handleLogin(e) {
    e.preventDefault();

    if (email !== "" && password !== "") {
      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          navigate("/home", { replace: true });
        })
        .catch(() => {
          console.log("Erro ao fazer login");
        });
    } else {
      alert("Preencha os campos");
    }
  }

  return (
    <div className={`login-container ${temaEscuro ? "dark-theme" : ""}`}>

      <img
        style={{ paddingBottom: 50 }}
        width={300}
        height={256}
        src="logo.png"
        alt=""
      />
      <TemaEscuroToggle temaEscuro={temaEscuro} toggleTema={toggleTema} />

      <form className="form" onSubmit={handleLogin}>
        <input
          type="text"
          placeholder="email@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button type="submit">Acessar</button>
      </form>
      <Link className="button-link" to={"/register"}>
        Não possui uma conta? Cadastre-se
      </Link>
    </div>
  );
}

export default Login;
