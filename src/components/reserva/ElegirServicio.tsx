

interface Props {
  barbero: string;
  onSelect: (servicio: string) => void;
}

export default function ElegirServicio({ barbero, onSelect }: Props) {
  const servicios = [
    { nombre: "Corte + Asesoramiento", precio: "60.000 Gs", desc: "Estilo personalizado" },
    { nombre: "Barba Clásica", precio: "40.000 Gs", desc: "Perfilado y toalla caliente" },
    { nombre: "Corte + Barba", precio: "85.000 Gs", desc: "La experiencia completa" },
    { nombre: "Perfilado de Cejas", precio: "20.000 Gs", desc: "Detalle final" },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-playfair font-bold mb-2 text-center text-white">
        Servicios Disponibles
      </h2>
      <p className="text-center text-gray-text mb-8">con <span className="text-gold font-bold">{barbero}</span></p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {servicios.map((s) => (
          <button
            key={s.nombre}
            onClick={() => onSelect(s.nombre)}
            className="group relative p-6 bg-charcoal border border-white/5 rounded-xl hover:border-gold/50 hover:bg-black-rich transition-all duration-300 text-left"
          >
            <div className="flex justify-between items-start mb-2">
              <span className="font-bold text-lg text-white group-hover:text-gold transition-colors">{s.nombre}</span>
              <span className="text-gold font-mono">{s.precio}</span>
            </div>
            <p className="text-sm text-gray-500 group-hover:text-gray-400">{s.desc}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
