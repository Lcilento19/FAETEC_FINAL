import * as React from "react";
import * as ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Private from "./routes/Private";
import Erro404 from "./pages/404";

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
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
