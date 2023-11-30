import React, { useState } from "react";
import "./login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import {
  getAuth,
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  sendPasswordResetEmail,
} from "firebase/auth";
import "../../components/TemaEscuro/temaEscuro.css";
import TemaEscuroToggle from "../../components/TemaEscuro/AlternarTema";
import { useTema } from "../../components/TemaEscuro/TemaContext";

import { auth, db } from "../../config/firebaseConnection";

import { toast } from "react-toastify";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [authMethod, setAuthMethod] = useState("");
  const [showResetPassword, setShowResetPassword] = useState(false);
  const navigate = useNavigate();
  const { temaEscuro, toggleTema } = useTema();

  async function handleLogin(e) {
    e.preventDefault();

    if (email !== "" && password !== "") {
      const auth = getAuth();

      await signInWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
          const user = userCredential.user;

          if (user.emailVerified) {
            setAuthMethod("emailAndPassword");
            navigate("/home", { replace: true });
          } else {
            toast.warn(
              "Verifique seu e-mail para ativar a conta antes de fazer login."
            );
          }
        })
        .catch(() => {
          console.log("Erro ao fazer login");
          toast.warn("Email ou Senha incorreto(s)");
        });
    } else {
      toast.warn("Preencha os campos");
    }
  }

  async function handleGoogleLogin() {
    const auth = getAuth();
    const provider = new GoogleAuthProvider();

    signInWithPopup(auth, provider)
      .then((result) => {
        setAuthMethod("googleAccount");
        navigate("/home", { replace: true });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  async function handleResetPasswordRequest() {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success(
        "Um link de redefinição de senha foi enviado para o seu email."
      );
      setShowResetPassword(false);
    } catch (error) {
      console.error("Erro ao enviar email de redefinição de senha:", error);
      toast.warn("Ocorreu um erro ao enviar o email de redefinição de senha.");
    }
  }

  return (
    <div className={`login-container ${temaEscuro ? "dark-theme" : ""}`}>
      <h1 className="title-login">Multi</h1>
      <TemaEscuroToggle
        style={{ top: "0" }}
        temaEscuro={temaEscuro}
        toggleTema={toggleTema}
      />

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
          Entrar com o google
        </button>
      </form>

      {showResetPassword ? (
        <div className="reset-password-form">
          <button
            className="reset-password-form-button"
            onClick={handleResetPasswordRequest}
          >
            Enviar Email de Redefinição
          </button>
        </div>
      ) : (
        <Link
          className="forgot-password-link"
          to="/"
          onClick={() => setShowResetPassword(true)}
        >
          Esqueceu sua senha? Redefinir senha.
        </Link>
      )}

      <Link className="button-linkToRegister" to={"/register"}>
        Não possui uma conta? Cadastre-se.
      </Link>
    </div>
  );
}

export default Login;
