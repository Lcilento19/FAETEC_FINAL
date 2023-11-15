import React, { useState, useEffect } from "react";
import "./todolist.css";
import { Link } from "react-router-dom";
import { db } from "../../config/firebaseConnection";
import { toast } from "react-toastify";
import TemaEscuroToggle from "../../components/TemaEscuro/AlternarTema";
import { useTema } from "../../components/TemaEscuro/TemaContext";
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

export default function TodoList() {
  const [tarefaInput, setTarefaInput] = useState("");
  const [user, setUser] = useState({});
  const [edit, setEdit] = useState({});
  const { temaEscuro, toggleTema } = useTema();
  const [tarefas, setTarefas] = useState([]);
  const [completedTasks, setCompletedTasks] = useState([]);

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
          let completedList = [];

          snapshot.forEach((doc) => {
            const task = {
              id: doc.id,
              tarefa: doc.data().tarefa,
              userUid: doc.data().userUid,
              completed: doc.data().completed,
            };

            if (doc.data().completed) {
              completedList.push(task);
            } else {
              lista.push(task);
            }
          });

          setTarefas(lista);
          setCompletedTasks(completedList);
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
      completed: false,
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

  async function handleConcluirTarefa(id) {
    const docRef = doc(db, "tarefas", id);
    await updateDoc(docRef, {
      completed: true,
    })
      .then(() => {
        toast.success("TAREFA CONCLUÍDA");
      })
      .catch(() => {
        toast.warn("ERRO AO CONCLUIR TAREFA");
      });
  }

  return (
    <div className={`admin-container ${temaEscuro ? "dark-theme" : ""}`}>
      <h1 className="title-login">Multi</h1>
      <TemaEscuroToggle
        style={{ top: "0" }}
        temaEscuro={temaEscuro}
        toggleTema={toggleTema}
      />

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
            <button className="btn-edit" onClick={() => editTarefa(item)}>
              Editar
            </button>
            <button
              onClick={() => handleConcluirTarefa(item.id)} 
              className="btn-delete"
            >
              Concluir
            </button>
          </div>
        </article>
      ))}

      <Link className="btn-logout" target="_self" to="/tasks">
        Ver Tarefas Concluídas
      </Link>
    </div>
  );
}
