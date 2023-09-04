import Stopwatch from "../../components/StopWatch";
import OpenAI from "../../components/OpenAI";
import "./home.css";
import { auth } from "../../firebaseConnection";
import { signOut } from "firebase/auth";

async function handleLogout() {
  await signOut(auth);
}

export default function Home() {
  return (
    <>
      <div className="home-container">
        <h1 className="titulo">Página Inicial</h1>
        <button onClick={handleLogout}>SAIR</button>
      </div>
      <OpenAI />
      <Stopwatch />
    </>
  );
}
