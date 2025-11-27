import React from "react";

interface Props {
  barbero: string;
  onSelect: (servicio: string) => void;
}

export default function ElegirServicio({ barbero, onSelect }: Props) {
  const servicios = [
    { nombre: "Corte + Asesoramiento", precio: "60.000 Gs" },
    { nombre: "Barba Clásica", precio: "40.000 Gs" },
    { nombre: "Corte + Barba", precio: "85.000 Gs" },
    { nombre: "Perfilado de Cejas", precio: "20.000 Gs" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">
        Elegí un servicio con {barbero}
      </h2>
      <div className="grid grid-cols-2 gap-4">
        {servicios.map((s) => (
          <button
            key={s.nombre}
            onClick={() => onSelect(s.nombre)}
            className="p-4 border rounded-xl shadow hover:bg-yellow-100"
          >
            <div className="font-semibold">{s.nombre}</div>
            <div className="text-sm text-gray-600">{s.precio}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
