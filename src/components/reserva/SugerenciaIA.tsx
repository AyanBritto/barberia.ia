// src/components/reserva/SugerenciaIA.tsx
import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "../../service/firebase";
// import { getAuth } from "firebase/auth";

export default function SugerenciaIA() {
  const [sugerencia, setSugerencia] = useState<{
    estilo: string;
    descripcion: string;
    confianza?: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [status, setStatus] = useState<"procesando" | "completada" | "error">("procesando");
  const navigate = useNavigate();
  const location = useLocation();
  // const auth = getAuth();
  // const user = auth.currentUser;

  // Obtener docId del estado de navegación
  const docId = location.state?.docId;

  useEffect(() => {
    if (!docId) {
      setError("No se encontró el ID del análisis");
      setLoading(false);
      return;
    }

    // Escuchar cambios en el documento de Firestore
    const unsubscribe = onSnapshot(
      doc(db, "sugerencias", docId),
      (docSnap) => {
        if (docSnap.exists()) {
          const data = docSnap.data();

          if (data.status === "completada" && data.sugerencia) {
            setSugerencia(data.sugerencia);
            setStatus("completada");
            setLoading(false);
          } else if (data.status === "error") {
            setError(data.error || "No se pudo analizar la imagen");
            setStatus("error");
            setLoading(false);
          }
          // Si está en "procesando", mantenemos loading=true
        } else {
          setError("Documento no encontrado");
          setLoading(false);
        }
      },
      (error) => {
        console.error("Error al escuchar documento:", error);
        setError("Error de conexión");
        setLoading(false);
      }
    );

    // Cleanup
    return () => unsubscribe();
  }, [docId]);

  if (loading || status === "procesando") {
    return (
      <div className="min-h-screen bg-black-rich flex flex-col items-center justify-center p-6 text-off-white font-montserrat">
        <div className="text-center max-w-md animate-pulse">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-gold/30 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-gold border-t-transparent rounded-full animate-spin"></div>
          </div>
          <h2 className="text-3xl font-playfair font-bold text-gold mb-4">Analizando Rasgos...</h2>
          <p className="text-gray-300 mb-2 text-lg">Nuestra IA está diseñando tu look perfecto.</p>
          <p className="text-sm text-gray-500 tracking-widest uppercase">Por favor espera</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-black-rich flex items-center justify-center p-6 font-montserrat">
        <div className="bg-gray-dark p-8 rounded-2xl border border-red-500/30 text-center max-w-md w-full shadow-2xl">
          <div className="w-16 h-16 bg-red-500/10 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-red-500 text-3xl">⚠️</span>
          </div>
          <p className="text-red-400 mb-8 text-lg">{error}</p>
          <div className="space-y-4">
            <button
              onClick={() => navigate("/reserva")}
              className="w-full px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold transition-colors"
            >
              Intentar con otra foto
            </button>
            <button
              onClick={() => navigate(-1)}
              className="w-full px-6 py-3 border border-gray-600 text-gray-300 hover:border-gold hover:text-gold rounded-xl font-medium transition-colors"
            >
              ← Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black-rich text-off-white font-montserrat py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header Navigation */}
        <button
          onClick={() => navigate("/historial")}
          className="mb-8 text-gold hover:text-white transition-colors flex items-center gap-2 group"
        >
          <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al Historial
        </button>

        <div className="bg-gray-dark border border-gold/20 rounded-3xl p-8 md:p-12 shadow-2xl relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -mr-32 -mt-32"></div>
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-gold/5 rounded-full blur-3xl -ml-32 -mb-32"></div>

          <h2 className="text-4xl md:text-5xl font-playfair font-bold text-center text-gold mb-12 relative z-10">
            Tu Estilo Personalizado
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 relative z-10">
            {/* Foto Original */}
            <div className="flex flex-col items-center">
              <div className="relative group">
                <div className="absolute -inset-1 bg-gradient-to-r from-gold/20 to-transparent rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
                <div className="relative w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border border-gray-700 shadow-2xl bg-black">
                  <img
                    src="/placeholder-user.jpg"
                    alt="Tu foto"
                    className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity duration-300"
                    onError={(e) => (e.currentTarget.src = "https://via.placeholder.com/400x500/1a1a1a/FFFFFF?text=Foto+Usuario")}
                  />
                  <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
                    <span className="text-sm font-bold text-gray-300 uppercase tracking-wider">Tu Foto Actual</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Sugerencia IA */}
            <div className="flex flex-col items-center justify-center text-center">
              <div className="w-full max-w-sm aspect-[3/4] rounded-2xl overflow-hidden border-2 border-gold shadow-gold-glow mb-8 relative">
                <img
                  src={getSuggestionImage(sugerencia?.estilo || "")}
                  alt={sugerencia?.estilo || "Sugerencia"}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 right-4 bg-gold text-black-rich px-3 py-1 rounded-full text-xs font-bold shadow-lg">
                  IA MATCH: {(sugerencia?.confianza || 0.95) * 100}%
                </div>
              </div>

              <h4 className="text-3xl font-playfair font-bold text-white mb-4">
                {sugerencia?.estilo}
              </h4>
              <p className="text-gray-400 leading-relaxed mb-8 max-w-md">
                {sugerencia?.descripcion}
              </p>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <button
                  onClick={() => navigate("/reserva")}
                  className="flex-1 px-6 py-4 bg-gold hover:bg-gold-light text-black-rich rounded-xl font-bold transition-all duration-300 shadow-lg hover:shadow-gold/20 hover:-translate-y-1"
                >
                  ¡Lo Quiero! Agendar
                </button>
                <button
                  onClick={() => navigate("/reserva")}
                  className="flex-1 px-6 py-4 border border-gray-600 hover:border-gold text-gray-300 hover:text-gold rounded-xl font-bold transition-all duration-300"
                >
                  Probar Otro
                </button>
              </div>
            </div>
          </div>
        </div>

        <p className="mt-8 text-center text-gray-600 text-sm">
          Athenea Barber AI &bull; Tecnología diseñada para tu imagen
        </p>
      </div>
    </div>
  );
}

// Función auxiliar para obtener imagen según el estilo
function getSuggestionImage(estilo: string): string {
  const images: Record<string, string> = {
    "Corte Bob Asimétrico": "https://images.unsplash.com/photo-1503951914876-7e0a6f7c2e3d?auto=format&fit=crop&w=600&q=80",
    "Corte Moderno Sonriente": "https://images.unsplash.com/photo-1596465338537-4c7c9e3b8e9a?auto=format&fit=crop&w=600&q=80",
    "Corte Clásico Elegante": "https://images.unsplash.com/photo-1621605815971-fbc98d665033?auto=format&fit=crop&w=600&q=80",
    "Undercut Clásico": "https://images.unsplash.com/photo-1605497788044-5a32c7078486?auto=format&fit=crop&w=600&q=80",
    "Fade Alto": "https://images.unsplash.com/photo-1599351431202-1e0f0137eb5f?auto=format&fit=crop&w=600&q=80",
    "Buzz Cut": "https://images.unsplash.com/photo-1506792006437-25ed3a466a2ca?auto=format&fit=crop&w=600&q=80",
    "Pompadour": "https://images.unsplash.com/photo-1517832207067-4db24a2ae47c?auto=format&fit=crop&w=600&q=80"
  };

  return images[estilo] || "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=600&q=80";
}
