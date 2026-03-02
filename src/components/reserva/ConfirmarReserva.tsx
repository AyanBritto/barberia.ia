import React, { useState } from "react";

interface ReservaType {
  barbero?: { nombre: string };
  servicio?: { nombre: string };
  horario: string;
  cliente: { nombre: string; cedula: string; celular: string };
}

export default function ConfirmarReserva({ reserva, onConfirm, onBack }: { reserva: ReservaType; onConfirm: () => void; onBack: () => void }) {
  const [cliente, setCliente] = useState(reserva.cliente);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCliente({ ...cliente, [e.target.name]: e.target.value });
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Confirmar Reserva</h2>
      <p><b>Barbero:</b> {reserva.barbero?.nombre}</p>
      <p><b>Servicio:</b> {reserva.servicio?.nombre}</p>
      <p><b>Horario:</b> {reserva.horario}</p>

      <div className="mt-4 space-y-2">
        <input name="nombre" placeholder="Nombre" value={cliente.nombre} onChange={handleChange} className="border p-2 w-full rounded" />
        <input name="cedula" placeholder="Cédula" value={cliente.cedula} onChange={handleChange} className="border p-2 w-full rounded" />
        <input name="celular" placeholder="Celular" value={cliente.celular} onChange={handleChange} className="border p-2 w-full rounded" />
      </div>

      <div className="mt-4 flex space-x-3">
        <button className="px-4 py-2 bg-gray-300 rounded" onClick={onBack}>Atrás</button>
        <button className="px-4 py-2 bg-yellow-400 rounded" onClick={onConfirm}>Confirmar</button>
      </div>
    </div>
  );
}
