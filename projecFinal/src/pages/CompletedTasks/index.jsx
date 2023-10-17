import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { db } from "../../config/firebaseConnection";
import { collection, onSnapshot, query, where } from "firebase/firestore";

export default function CompletedTasks() {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [user, setUser] = useState({});

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
    <div className="admin-container">
      <h1>Tarefas Concluídas</h1>
      <Link to="/todolist">Voltar</Link>
      <ul>
        {completedTasks.map((task) => (
          <li key={task.id}>{task.tarefa}</li>
        ))}
      </ul>
    </div>
  );
}
