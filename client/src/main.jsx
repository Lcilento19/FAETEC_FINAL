import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Private from "./routes/Private";
import Erro404 from "./pages/404";
import CompletedTasks from "./pages/CompletedTasks";

import { TemaProvider } from "./components/TemaEscuro/TemaContext";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import TextEditor from "./pages/EditorTexto";
import TodoList from "./pages/TodoList";
import Footer from "./components/Footer";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Login />,
  },
  { path: "/register", element: <Register /> },
  { path: "*", element: <Erro404 /> },

  {
    path: "/home",
    element: (
      <Private>
        <Home />
      </Private>
    ),
  },
  {
    path: "/editor",
    element: (
      <Private>
        <TextEditor />
      </Private>
    ),
  },
  {
    path: "/todoList",
    element: (
      <Private>
        <TodoList />
      </Private>
    ),
  },
  {
    path: "/tasks",
    element: (
      <Private>
        <CompletedTasks />
      </Private>
    ),
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <TemaProvider>
      <ToastContainer autoClose={4000} />
      <RouterProvider router={router} />
      <Footer />
    </TemaProvider>
  </React.StrictMode>
);
