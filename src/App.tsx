// src/App.tsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Bienvenida from "./Bienvenida";
import Reserva from "./components/reserva";

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Bienvenida />} />
        <Route path="/reserva" element={<Reserva />} />
        <Route path="*" element={<Bienvenida />} />
      </Routes>
    </Router>
  );
}