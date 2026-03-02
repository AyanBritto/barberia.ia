// src/pages/MisReservas.tsx
import { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { Scissors, Calendar, User, Star, X } from "lucide-react";

export default function MisReservas() {
  const { user } = useAuth();
  const [reservas, setReservas] = useState<any[]>([]);

  useEffect(() => {
    const storedReservas = localStorage.getItem("reservas");
    if (storedReservas) {
      try {
        const parsed = JSON.parse(storedReservas);
        const filtered = user 
          ? parsed.filter((r: any) => r.userId === user.uid)
          : parsed;
        setReservas(filtered);
      } catch (err) {
        console.error("Error al parsear reservas:", err);
        setReservas([]);
      }
    }
  }, [user]);

  const formatDate = (timestamp: any) => {
    if (!timestamp) return "Próximamente";
    const date = new Date(timestamp.seconds * 1000);
    return date.toLocaleDateString("es-PY", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric"
    });
  };

  const handleCancel = (id: string) => {
    const updated = reservas.filter(r => r.id !== id);
    localStorage.setItem("reservas", JSON.stringify(updated));
    setReservas(updated);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-[#D4AF37] mb-8 text-center font-serif">
        Mis Reservas
      </h1>

      {reservas.length > 0 ? (
        <div className="space-y-6">
          {reservas.map((reserva) => (
            <div 
              key={reserva.id} 
              className="bg-[#1e1e1e] rounded-2xl p-6 border border-[#D4AF37]/20 shadow-lg"
            >
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                {/* Información principal */}
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-full bg-[#D4AF37] flex items-center justify-center">
                      <Scissors size={20} className="text-black" />
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-white">
                        {reserva.servicio}
                        {reserva.corteRecomendado && (
                          <span className="ml-2 text-sm font-normal text-[#D4AF37]">
                            (IA)
                          </span>
                        )}
                      </h3>
                      {reserva.corteRecomendado && (
                        <p className="text-gray-400 text-sm mt-1">
                          Corte sugerido: {reserva.corteRecomendado}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
                    <div className="flex items-center gap-2 text-gray-300">
                      <User size={16} className="text-[#D4AF37]" />
                      <span>{reserva.cliente?.nombre || "Cliente"}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Calendar size={16} className="text-[#D4AF37]" />
                      <span>{formatDate(reserva.createdAt)}</span>
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <Star size={16} className="text-[#D4AF37]" />
                      {reserva.barbero && (
                        <span>{reserva.barbero}</span>
                      )}
                    </div>
                    <div className="flex items-center gap-2 text-gray-300">
                      <span className={`px-2 py-1 rounded-full text-xs ${
                        reserva.status === "confirmada" 
                          ? "bg-green-900/50 text-green-300" 
                          : "bg-yellow-900/50 text-yellow-300"
                      }`}>
                        {reserva.status === "confirmada" ? "Confirmada" : "Pendiente"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* ✅ SOLO LA IMAGEN DEL CORTE SUGERIDO POR LA IA */}
                <div className="flex flex-col items-center">
                  {reserva.corteImagen ? (
                    <div className="w-32 h-32 rounded-xl overflow-hidden border-2 border-[#D4AF37]/30 relative mb-3">
                      <img 
                        src={reserva.corteImagen} 
                        alt={`Corte sugerido: ${reserva.corteRecomendado}`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.src = "/imagenes-cortes/default.jpg";
                        }}
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                      <div className="absolute bottom-2 left-0 right-0 text-center">
                        <span className="text-white text-xs font-bold">IA</span>
                      </div>
                    </div>
                  ) : (
                    <div className="w-32 h-32 rounded-xl bg-[#1e1e1e] flex items-center justify-center border-2 border-[#D4AF37]/20 mb-3">
                      <Scissors size={40} className="text-[#D4AF37]" />
                    </div>
                  )}

                  {/* ✅ BOTÓN DE CANCELAR */}
                  <button
                    onClick={() => handleCancel(reserva.id)}
                    className="flex items-center gap-2 px-4 py-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 rounded-lg border border-red-700/50 transition-colors"
                  >
                    <X size={16} />
                    Cancelar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 bg-[#1e1e1e] rounded-full flex items-center justify-center">
            <Scissors size={32} className="text-[#D4AF37]" />
          </div>
          <h3 className="text-xl font-bold text-white mb-2">No tienes reservas aún</h3>
          <p className="text-gray-400 max-w-md mx-auto">
            ¡Reserva tu próximo corte y lo verás aquí!
          </p>
        </div>
      )}
    </div>
  );
}