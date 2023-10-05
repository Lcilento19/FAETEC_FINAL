import React, { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import "../../components/TemaEscuro/temaEscuro.css";
import TemaEscuroToggle from "../../components/TemaEscuro/AlternarTema";
import { useTema } from "../../components/TemaEscuro/TemaContext";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMethod, setAuthMethod] = useState(""); // Método de autenticação
  const navigate = useNavigate();
  const { temaEscuro, toggleTema } = useTema();

  async function handleLogin(e) {
    e.preventDefault();

    if (email !== "" && password !== "") {
      const auth = getAuth();

      await signInWithEmailAndPassword(auth, email, password)
        .then(() => {
          setAuthMethod("emailAndPassword"); // Defina o método de autenticação
          navigate("/home", { replace: true });
        })
        .catch(() => {
          console.log("Erro ao fazer login");
        });
    } else {
      alert("Preencha os campos");
    }
  }

  async function handleGoogleLogin() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        setAuthMethod("googleAccount"); // Defina o método de autenticação
        navigate("/home", { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  return (
    <div className={`login-container ${temaEscuro ? "dark-theme" : ""}`}>
      <h1 className="title-login">Multi</h1>
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

        <button type="submit" className="button-login">
          Acessar
        </button>
        <button
          type="button"
          onClick={handleGoogleLogin}
          className="button-google"
        >
          <img src="google_login.png" alt="" className="google_login_image" />
          SignIn with Google
        </button>
      </form>

      <Link className="button-linkToRegister" to={"/register"}>
        Não possui uma conta? Cadastre-se
      </Link>
    </div>
  );
}

export default Login;
