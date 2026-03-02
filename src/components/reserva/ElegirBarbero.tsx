
interface Props {
  onSelect: (barbero: string) => void;
}

export default function ElegirBarbero({ onSelect }: Props) {
  const barberos = [
    { nombre: "Alejandro", img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=400&q=80" },
    { nombre: "Lisandro", img: "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=400&q=80" },
  ];

  return (
    <div className="animate-fade-in">
      <h2 className="text-3xl font-playfair font-bold mb-8 text-center text-gold tracking-wide">
        Elige tu Barbero
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 justify-items-center">
        {barberos.map((b) => (
          <button
            key={b.nombre}
            onClick={() => onSelect(b.nombre)}
            className="group relative w-64 bg-charcoal rounded-xl overflow-hidden shadow-lg border border-white/5 hover:border-gold/50 transition-all duration-300"
          >
            <div className="h-64 overflow-hidden">
              <img
                src={b.img}
                alt={b.nombre}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110 grayscale group-hover:grayscale-0"
              />
            </div>
            <div className="p-4 bg-gradient-to-t from-black-rich to-charcoal text-center">
              <span className="text-xl font-bold text-white group-hover:text-gold transition-colors uppercase tracking-wider">
                {b.nombre}
              </span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
