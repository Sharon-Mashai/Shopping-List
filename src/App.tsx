import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Login from "./assets/pages/Login";
import Register from "./assets/pages/Register";
import Home from "./assets/pages/Home";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />

        <Route path="/login" element={<Login />} />

        <Route path="/register" element={<Register />} />

        <Route path="/home" element={<Home/>} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;