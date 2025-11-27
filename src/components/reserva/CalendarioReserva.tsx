import React, { useState } from "react";

interface Props {
  barbero: string;
  servicio: string;
}

export default function CalendarioReserva({ barbero, servicio }: Props) {
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [celular, setCelular] = useState("");
  const [horario, setHorario] = useState<string | null>(null);

  const horarios = [
    { hora: "09:00", estado: "disponible" },
    { hora: "10:00", estado: "reservado" },
    { hora: "11:00", estado: "disponible" },
    { hora: "12:00", estado: "almuerzo" },
  ];

  const confirmar = () => {
    alert(
      `Reserva confirmada:\nBarbero: ${barbero}\nServicio: ${servicio}\nHorario: ${horario}\nNombre: ${nombre}`
    );
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Reserva con {barbero} - {servicio}
      </h2>

      <div className="mb-4">
        <input
          type="text"
          placeholder="Cédula"
          value={cedula}
          onChange={(e) => setCedula(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Celular"
          value={celular}
          onChange={(e) => setCelular(e.target.value)}
          className="border p-2 mr-2 rounded"
        />
        <input
          type="text"
          placeholder="Nombre"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          className="border p-2 rounded"
        />
      </div>

      <div className="grid grid-cols-4 gap-2 mb-4">
        {horarios.map((h) => (
          <button
            key={h.hora}
            disabled={h.estado !== "disponible"}
            onClick={() => setHorario(h.hora)}
            className={`p-2 rounded ${
              h.estado === "disponible"
                ? "bg-green-300 hover:bg-green-400"
                : h.estado === "reservado"
                ? "bg-red-300"
                : "bg-yellow-300"
            }`}
          >
            {h.hora} <br /> {h.estado}
          </button>
        ))}
      </div>

      <button
        onClick={confirmar}
        disabled={!horario || !nombre}
        className="bg-yellow-500 text-white px-4 py-2 rounded"
      >
        Confirmar Reserva
      </button>
    </div>
  );
}
