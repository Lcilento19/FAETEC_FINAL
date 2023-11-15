import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebaseConnection";
import { collection, onSnapshot, query, where } from "firebase/firestore";
import "./completed.css";
import { useTema } from "../../components/TemaEscuro/TemaContext";
import TemaEscuroToggle from "../../components/TemaEscuro/AlternarTema";




export default function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [user, setUser] = useState({});
  const { temaEscuro, toggleTema } = useTema();

  useEffect(() => {
    const userDetail = localStorage.getItem("@detailUser");
    setUser(JSON.parse(userDetail));
  }, []);

  useEffect(() => {
    if (user && user.uid) {
      const tarefaRef = collection(db, "tarefas");
      const q = query(
        tarefaRef,
        where("userUid", "==", user.uid),
        where("completed", "==", true)
      );

      const unsubscribe = onSnapshot(q, (snapshot) => {
        let tasks = [];

        snapshot.forEach((doc) => {
          tasks.push({
            id: doc.id,
            tarefa: doc.data().tarefa,
          });
        });

        setCompletedTasks(tasks);
      });

      return () => unsubscribe();
    }
  }, [user]);

  return (
    <div className={`admin-container ${temaEscuro ? "dark-theme" : ""}`}>
      <h1 className="title-login">Multi</h1>
      <TemaEscuroToggle
        style={{ top: "0" }}
        temaEscuro={temaEscuro}
        toggleTema={toggleTema}
      />
      <Link className="btn-home" to={"/todolist"}>
        <img className="arrow_back" src="arrow_back.png" alt="" />
      </Link>
      <h1>Tarefas Concluídas</h1>

      <ul>
        {completedTasks.map((task) => (
          <li className="list" key={task.id}>
            {task.tarefa}
          </li>
        ))}
      </ul>
    </div>
  );
}
