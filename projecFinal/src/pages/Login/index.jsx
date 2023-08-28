import { useState } from "react";
import "./login.css";

import { Link } from "react-router-dom";

import { auth } from "../../firebaseConnection";
import { signInWithEmailAndPassword } from "firebase/auth";

import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

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
      alert("preencha os campos");
    }
  }

  return (
    <div className="login-container">
      <h1>Lista de Tarefas</h1>
      <span>Gerencie sua agenda!</span>

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
