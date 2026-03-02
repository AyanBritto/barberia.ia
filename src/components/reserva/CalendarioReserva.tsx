import { useState } from "react";
import { useNavigate } from "react-router-dom";
// import { collection, addDoc } from "firebase/firestore";
// import { db } from "../../service/firebase";
import { useAuth } from "../../hooks/useAuth";

interface Props {
  barbero: string;
  servicio: string;
}

export default function CalendarioReserva({ barbero, servicio }: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [nombre, setNombre] = useState("");
  const [cedula, setCedula] = useState("");
  const [celular, setCelular] = useState("");
  const [horario, setHorario] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const horarios = [
    { hora: "09:00", estado: "disponible" },
    { hora: "10:00", estado: "reservado" },
    { hora: "11:00", estado: "disponible" },
    { hora: "12:00", estado: "almuerzo" },
  ];

  const confirmar = async () => {
    // Demo mode: Allow reservation without real auth if needed, but we have useAuth.
    // We will simulate the auth check or just use the current user if available.
    // If no user, we can simulate a demo user or just require login as before.
    // User asked for "demo", let's keep the login requirement for flow realism but mock the save.
    if (!user) {
      alert("Debes iniciar sesión para reservar.");
      return;
    }

    if (!nombre || !cedula || !celular) {
      alert("Por favor completa todos los campos.");
      return;
    }

    setLoading(true);

    // DELAY SIMULATION
    setTimeout(() => {
      try {
        const newReserva = {
          id: crypto.randomUUID(),
          userId: user.uid,
          barbero,
          servicio,
          horario,
          cliente: { nombre, cedula, celular },
          createdAt: { seconds: Date.now() / 1000 },
          status: "confirmada"
        };

        const existingReservas = JSON.parse(localStorage.getItem("reservas") || "[]");
        localStorage.setItem("reservas", JSON.stringify([newReserva, ...existingReservas]));

        alert(
          `Reserva confirmada (DEMO):\nBarbero: ${barbero}\nServicio: ${servicio}\nHorario: ${horario}\n`
        );
        navigate("/");
      } catch (error: any) {
        console.error("Error al guardar reserva:", error);
        alert(`Hubo un error al guardar la reserva: ${error.message}`);
      } finally {
        setLoading(false);
      }
    }, 1000); // Fake network delay
  };

  return (
    <div className="animate-fade-in max-w-2xl mx-auto">
      <h2 className="text-3xl font-playfair font-bold mb-2 text-center text-white">
        Confirma tu Cita
      </h2>
      <p className="text-center text-gray-text mb-8">
        <span className="text-gold">{barbero}</span> - {servicio}
      </p>

      <div className="bg-charcoal p-8 rounded-2xl border border-white/5 shadow-2xl mb-8">
        <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Datos del Cliente</h3>
        <div className="grid grid-cols-1 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-1">Nombre Completo</label>
            <input
              type="text"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full bg-black-rich border border-white/10 rounded-lg p-3 text-white focus:border-gold focus:outline-none transition-colors"
              placeholder="Ej: Juan Perez"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-1">Cédula</label>
              <input
                type="text"
                value={cedula}
                onChange={(e) => setCedula(e.target.value)}
                className="w-full bg-black-rich border border-white/10 rounded-lg p-3 text-white focus:border-gold focus:outline-none transition-colors"
                placeholder="Ej: 1.234.567"
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-1">Celular</label>
              <input
                type="text"
                value={celular}
                onChange={(e) => setCelular(e.target.value)}
                className="w-full bg-black-rich border border-white/10 rounded-lg p-3 text-white focus:border-gold focus:outline-none transition-colors"
                placeholder="Ej: 0981..."
              />
            </div>
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-4 border-b border-white/10 pb-2">Horarios Disponibles</h3>
        <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 mb-8">
          {horarios.map((h) => {
            const isSelected = horario === h.hora;
            const isAvailable = h.estado === "disponible";

            return (
              <button
                key={h.hora}
                disabled={!isAvailable}
                onClick={() => setHorario(h.hora)}
                className={`
                  p-3 rounded-lg text-sm font-medium transition-all duration-300 border
                  ${isSelected
                    ? "bg-gold text-black-rich border-gold shadow-[0_0_15px_rgba(212,175,55,0.4)] transform scale-105"
                    : isAvailable
                      ? "bg-black-rich text-white border-white/10 hover:border-gold/50 hover:text-gold"
                      : "bg-gray-dark/50 text-gray-600 border-transparent cursor-not-allowed opacity-50"}
                `}
              >
                {h.hora}
              </button>
            );
          })}
        </div>

        <button
          onClick={confirmar}
          disabled={!horario || !nombre || !cedula || !celular || loading}
          className={`
            w-full py-4 rounded-xl font-bold text-lg uppercase tracking-wider transition-all duration-300
            ${!horario || !nombre || !cedula || !celular || loading
              ? "bg-gray-dark text-gray-500 cursor-not-allowed"
              : "bg-gold text-black-rich hover:bg-gold-hover shadow-[0_4px_20px_-5px_rgba(212,175,55,0.4)] hover:shadow-[0_4px_25px_-5px_rgba(212,175,55,0.6)] hover:-translate-y-1"}
          `}
        >
          {loading ? "Confirmando..." : "Confirmar Reserva"}
        </button>
      </div>
    </div>
  );
}
