import React from "react";

interface Props {
  onSelect: (barbero: string) => void;
}

export default function ElegirBarbero({ onSelect }: Props) {
  const barberos = [
    { nombre: "Alejandro", img: "/public/logo.png" },
    { nombre: "Lisandro", img: "/public/logo.png" },
  ];

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6 text-center text-orange-600">
        CORTE + ASESORAMIENTO
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
        {barberos.map((b) => (
          <button
            key={b.nombre}
            onClick={() => onSelect(b.nombre)}
            className="w-56 bg-white rounded-xl overflow-hidden shadow-lg hover:shadow-2xl transform hover:scale-105 transition duration-300"
          >
            {/* Imagen */}
            <img
              src={b.img}
              alt={b.nombre}
              className="w-48 h-48 object-cover mx-auto rounded-lg"
            />

            {/* Nombre */}
            <div className="p-3 bg-yellow-50 text-center">
              <span className="text-lg font-bold text-orange-600 uppercase">
                {b.nombre}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
