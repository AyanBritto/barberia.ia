// src/pages/AdminPanel.tsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { collection, getDocs, query, orderBy } from "firebase/firestore";
import { db } from "../service/firebase";

export default function AdminPanel() {
  const { user, isAdmin, loading } = useAuth();
  const navigate = useNavigate();
  const [reservas, setReservas] = useState<any[]>([]);
  const [sugerencias, setSugerencias] = useState<any[]>([]);
  const [filtroEstado, setFiltroEstado] = useState<string>("todas");
  const [loadingCancel, setLoadingCancel] = useState<string | null>(null);

  useEffect(() => {
    if (loading) return;
    
    if (!isAdmin) {
      navigate("/");
      return;
    }

    const loadData = async () => {
      try {
        // Reservas desde localStorage
        const storedReservas = localStorage.getItem("reservas");
        const allReservas = storedReservas ? JSON.parse(storedReservas) : [];
        setReservas(allReservas);

        // Sugerencias desde Firestore
        const sugerenciasSnap = await getDocs(query(collection(db, "sugerencias"), orderBy("createdAt", "desc")));
        setSugerencias(sugerenciasSnap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
      } catch (err) {
        console.error("Error al cargar datos:", err);
      }
    };

    loadData();
  }, [isAdmin, loading, navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black text-white">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-[#D4AF37] border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2">Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isAdmin) return null;

  // Formatear fecha
  const formatDate = (dateString: string) => {
    if (!dateString) return "Fecha no especificada";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("es-PY", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  // Normalizar hora
  const normalizarHora = (horaStr: string) => {
    if (!horaStr) return "23:59";
    const partes = horaStr.split(':');
    let horas = parseInt(partes[0]) || 0;
    let minutos = parseInt(partes[1]) || 0;
    if (horas > 23) horas = 23;
    if (minutos > 59) minutos = 59;
    return `${horas.toString().padStart(2, '0')}:${minutos.toString().padStart(2, '0')}`;
  };

  // Ordenar por hora del día
  const reservasOrdenadas = [...reservas].sort((a, b) => {
    const horaA = normalizarHora(a.horario);
    const horaB = normalizarHora(b.horario);
    return horaA.localeCompare(horaB);
  });

  // Filtrar por estado
  const reservasFiltradas = filtroEstado === "todas"
    ? reservasOrdenadas
    : reservasOrdenadas.filter(r => r.status === filtroEstado);

  // Función para cancelar reserva
  const cancelarReserva = async (id: string) => {
    setLoadingCancel(id);
    try {
      // Actualizar en localStorage
      const existing = JSON.parse(localStorage.getItem("reservas") || "[]");
      const updated = existing.map((r: any) => 
        r.id === id ? { ...r, status: "cancelada" } : r
      );
      localStorage.setItem("reservas", JSON.stringify(updated));
      
      // Refrescar
      setReservas(updated);
      alert("Reserva cancelada exitosamente.");
    } catch (err) {
      console.error("Error al cancelar:", err);
      alert("Hubo un error al cancelar la reserva.");
    } finally {
      setLoadingCancel(null);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-[#D4AF37] mb-8">Panel de Administración</h1>
        
        {/* Filtros */}
        <div className="mb-6 flex flex-wrap gap-4">
          <select
            value={filtroEstado}
            onChange={(e) => setFiltroEstado(e.target.value)}
            className="bg-gray-900 border border-gray-700 rounded-lg px-4 py-2 text-white"
          >
            <option value="todas">Todas las reservas</option>
            <option value="confirmada">Confirmadas</option>
            <option value="completada">Completadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
          
          <button
            onClick={() => setFiltroEstado("todas")}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm"
          >
            Limpiar filtro
          </button>
        </div>

        {/* Reservas */}
        <section className="mb-12">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Historial de Reservas</h2>
            <span className="text-gray-400 text-sm">
              {reservasFiltradas.length} reserva{reservasFiltradas.length !== 1 ? 's' : ''}
            </span>
          </div>
          
          {reservasFiltradas.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reservasFiltradas.map(reserva => (
                <div key={reserva.id} className="bg-gray-900 p-4 rounded-lg border border-gray-700">
                  <div className="flex justify-between items-start mb-3">
                    <p>
                      <strong className="text-white">{reserva.cliente?.nombre || "N/A"}</strong>
                      {reserva.status === "cancelada" && (
                        <span className="ml-2 px-2 py-1 bg-red-900/50 text-red-300 text-xs rounded">Cancelada</span>
                      )}
                      {reserva.status === "completada" && (
                        <span className="ml-2 px-2 py-1 bg-green-900/50 text-green-300 text-xs rounded">Completada</span>
                      )}
                    </p>
                    {reserva.status === "confirmada" && (
                      <button
                        onClick={() => {
                          if (window.confirm("¿Estás seguro de cancelar esta reserva?")) {
                            cancelarReserva(reserva.id);
                          }
                        }}
                        disabled={loadingCancel === reserva.id}
                        className={`px-3 py-1 rounded text-xs font-medium ${
                          loadingCancel === reserva.id
                            ? "bg-gray-700 cursor-not-allowed"
                            : "bg-red-700 hover:bg-red-600 text-white"
                        }`}
                      >
                        {loadingCancel === reserva.id ? "Cancelando..." : "Cancelar"}
                      </button>
                    )}
                  </div>
                  
                  <p><strong>Servicio:</strong> {reserva.servicio || "N/A"}</p>
                  <p><strong>Barbero:</strong> {reserva.barbero || "Alejandro"}</p>
                  
                  {reserva.fecha && (
                    <p><strong>Fecha:</strong> {formatDate(reserva.fecha)}</p>
                  )}
                  {reserva.horario && (
                    <p><strong>Hora:</strong> {reserva.horario}</p>
                  )}
                  
                  {reserva.corteRecomendado && (
                    <p><strong>Corte IA:</strong> {reserva.corteRecomendado}</p>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No hay reservas con este filtro.</p>
          )}
        </section>

        {/* Sugerencias de IA */}
        <section>
          <h2 className="text-2xl font-bold mb-4">Sugerencias de IA</h2>
          {sugerencias.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sugerencias.map(sug => (
                <div key={sug.id} className="bg-gray-900 rounded-xl overflow-hidden border border-[#D4AF37]/20">
                  <img 
                    src={sug.fotoUrl} 
                    alt="Cliente" 
                    className="w-full h-32 object-cover"
                    onError={(e) => e.currentTarget.src = "/placeholder-user.jpg"}
                  />
                  <div className="p-4">
                    <p className="text-sm text-gray-400">Rostro: {sug.rostro}</p>
                    <p className="font-bold text-white">{sug.cortePrincipal}</p>
                    <p className="text-xs text-[#D4AF37] mt-1">Confianza: {(sug.confianza * 100).toFixed(0)}%</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-400">No hay sugerencias aún.</p>
          )}
        </section>
      </div>
    </div>
  );
}