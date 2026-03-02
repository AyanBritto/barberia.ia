// src/pages/Historial.tsx
import { useEffect, useState } from "react";
import { collection, query, where, orderBy, getDocs } from "firebase/firestore";
import { db } from "../service/firebase";
import { getAuth } from "firebase/auth";
import { useNavigate } from "react-router-dom";

interface Sugerencia {
  id: string;
  sugerencia: {
    imagen: string;
    estilo: string;
    descripcion: string;
  };
  createdAt: { seconds: number };
}

export default function Historial() {
  const [sugerencias, setSugerencias] = useState<Sugerencia[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cargarHistorial = async () => {
      try {
        const auth = getAuth();
        if (!auth.currentUser) return;

        const q = query(
          collection(db, "sugerencias"),
          where("userId", "==", auth.currentUser.uid),
          orderBy("createdAt", "desc")
        );

        const snapshot = await getDocs(q);
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as unknown as Sugerencia[];

        setSugerencias(data);
      } catch (error) {
        console.error("Error al cargar historial:", error);
      } finally {
        setLoading(false);
      }
    };

    cargarHistorial();
  }, []);

  if (loading) {
    return <div className="p-6 text-center">Cargando historial...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h1 className="text-3xl font-bold text-gold mb-8 text-center">Historial de Cortes</h1>

      {sugerencias.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">Aún no tienes sugerencias guardadas.</p>
          <button
            onClick={() => navigate("/reserva")}
            className="mt-4 text-gold hover:text-red-barber"
          >
            ← Comenzar una reserva
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sugerencias.map((sug) => (
            <div key={sug.id} className="border-2 border-gold rounded-xl overflow-hidden shadow-lg">
              <img
                src={sug.sugerencia.imagen}
                alt={sug.sugerencia.estilo}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h3 className="font-bold text-gold mb-2">{sug.sugerencia.estilo}</h3>
                <p className="text-sm text-gray-700">{sug.sugerencia.descripcion}</p>
                <p className="text-xs text-gray-500 mt-2">
                  {new Date(sug.createdAt.seconds * 1000).toLocaleDateString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}