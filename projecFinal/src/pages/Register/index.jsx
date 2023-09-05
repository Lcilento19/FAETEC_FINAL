import { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../../firebaseConnection";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";

import "./register.css";

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nome, setNome] = useState("");

  const navigate = useNavigate();

  async function handleRegister(e) {
    e.preventDefault();

    if (email !== "" && password !== "") {
      try {
        const userCredential = await createUserWithEmailAndPassword(
          auth,
          email,
          password
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
          senha: password,
        });

        navigate("/", { replace: true });
      } catch (error) {
        console.error("Erro ao cadastrar:", error);
      }
    } else {
      alert("Preencha os campos");
    }
  }

  return (
    <div className="login-container">
      <h1>Cadastre-se</h1>
      <span>Vamos criar sua conta!</span>

      <form className="form" onSubmit={handleRegister}>
        <input
          type="email"
          placeholder="email@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="text"
          placeholder="nome Sobrenome"
          value={nome}
          onChange={(e) => setNome(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
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
