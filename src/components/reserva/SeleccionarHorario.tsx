import React from "react";

const horarios = [
  "09:00", "10:00", "11:00", "13:00", "14:00", "15:00"
];

export default function SeleccionarHorario({ onSelect, onBack }: { onSelect: (horario: string) => void; onBack: () => void }) {
  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Selecciona un horario</h2>
      <div className="grid grid-cols-3 gap-3">
        {horarios.map((h) => (
          <button
            key={h}
            className="p-3 bg-green-200 rounded hover:bg-green-300"
            onClick={() => onSelect(h)}
          >
            {h}
          </button>
        ))}
      </div>
      <button className="mt-4 px-4 py-2 bg-gray-300 rounded" onClick={onBack}>Atrás</button>
    </div>
  );
}
