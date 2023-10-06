import { useState, useEffect } from "react";
import "./todolist.css";
import { Link, useNavigate } from "react-router-dom";

import { auth, db } from "../../config/firebaseConnection";
import { signOut } from "firebase/auth";

import { toast } from "react-toastify";

import {
  addDoc,
  collection,
  onSnapshot,
  query,
  orderBy,
  where,
  doc,
  deleteDoc,
  updateDoc,
} from "firebase/firestore";
import { Navigate } from "react-router-dom";

export default function TodoList() {
  const [tarefaInput, setTarefaInput] = useState("");
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState({});
  const navigate = useNavigate();

  const [tarefas, setTarefas] = useState([]);

  useEffect(() => {
    async function loadTarefas() {
      const userDetail = localStorage.getItem("@detailUser");
      setUser(JSON.parse(userDetail));

      if (userDetail) {
        const data = JSON.parse(userDetail);

        const tarefaRef = collection(db, "tarefas");
        const q = query(
          tarefaRef,
          orderBy("created", "desc"),
          where("userUid", "==", data?.uid)
        );

        const unsub = onSnapshot(q, (snapshot) => {
          let lista = [];

          snapshot.forEach((doc) => {
            lista.push({
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid,
            });
          });

          setTarefas(lista);
        });
      }
    }

    loadTarefas();
  }, []);

  async function handleRegister(e) {
    e.preventDefault();

    if (tarefaInput === "") {
      toast.warn("Digite sua tarefa...");
      return;
    }

    if (edit?.id) {
      handleUpdateTarefa();
      return;
    }

    await addDoc(collection(db, "tarefas"), {
      tarefa: tarefaInput,
      created: new Date(),
      userUid: user?.uid,
    })
      .then(() => {
        toast.success("TAREFA REGISTRADA");
        setTarefaInput("");
      })
      .catch((error) => {
        console.log("ERRO AO REGISTRAR " + error);
        toast.warn("Erro ao registrar tarefa.");
      });
  }

  async function handleLogout() {
    await signOut(auth);
  }

  async function deleteTarefa(id) {
    const docRef = doc(db, "tarefas", id);
    await deleteDoc(docRef);
  }

  function editTarefa(item) {
    setTarefaInput(item.tarefa);
    setEdit(item);
  }

  async function handleUpdateTarefa() {
    const docRef = doc(db, "tarefas", edit?.id);
    await updateDoc(docRef, {
      tarefa: tarefaInput,
    })
      .then(() => {
        toast.success("TAREFA ATUALIZADA");
        setTarefaInput("");
        setEdit({});
      })
      .catch(() => {
        toast.warn("ERRO AO ATUALIZAR");
        setTarefaInput("");
        setEdit({});
      });
  }

  return (
    <div className="admin-container">
      <h1>Minhas tarefas</h1>

      <form className="form" onSubmit={handleRegister}>
        <textarea
          placeholder="Digite sua tarefa..."
          value={tarefaInput}
          onChange={(e) => setTarefaInput(e.target.value)}
        />

        {Object.keys(edit).length > 0 ? (
          <button className="btn-register" type="submit">
            Atualizar tarefa
          </button>
        ) : (
          <button className="btn-register" type="submit">
            Registrar tarefa
          </button>
        )}
      </form>

      {tarefas.map((item) => (
        <article key={item.id} className="list">
          <p>{item.tarefa}</p>

          <div>
            <button className="btn-edit" onClick={() => editTarefa(item)}>Editar</button>
            <button
              onClick={() => deleteTarefa(item.id)}
              className="btn-delete"
            >
              Concluir
            </button>
          </div>
        </article>
      ))}

      <Link className="btn-logout" target="_self" to={"/home"}>
        Home
      </Link>
    </div>
  );
}
