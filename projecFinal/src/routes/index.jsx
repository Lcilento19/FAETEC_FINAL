import { Routes, Route } from "react-router-dom";

import Register from "../pages/Register";

import Private from "./Private.jsx";
import Login from "../pages/Login";
import Home from "../pages/Home";

function RoutesApp() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/register" element={<Register />} />

      <Route
        path="/home"
        element={
          <Private>
            <OpenAIComponent />
            <Home />
          </Private>
        }
      />
    </Routes>
  );
}

export default RoutesApp;
