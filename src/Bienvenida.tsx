import { useNavigate } from "react-router-dom";
import SubirFoto from "./components/SubirFotos";

export default function Bienvenida() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900">
      {/* HEADER */}
      <header className="w-full flex items-center justify-between px-6 md:px-10 py-4 bg-white border-b-4 border-yellow-500 shadow-md">
        {/* Logo + Nombre */}
        <div className="flex items-center gap-2 sm:gap-3">
          <img
            src="/public/logo.png"
            alt="Athenea Barber"
            className="h-10 w-10 sm:h-12 sm:w-12 object-contain"
          />
          <h1 className="text-xl sm:text-2xl font-bold text-orange-600">
            Athenea Barber
          </h1>
        </div>

        {/* Botón login */}
        <button
          onClick={() => navigate("/iniciarsesion.tsx")}
          className="flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-4 py-2 sm:px-5 sm:py-2.5 rounded-lg shadow-lg hover:scale-105 transition-transform text-sm sm:text-base"
        >
          <span className="text-lg">→</span> Iniciar Sesión
        </button>
      </header>

      {/* HERO */}
      <main className="flex flex-col items-center justify-center flex-1 px-4 sm:px-6 text-center relative overflow-hidden">
        {/* Imagen de fondo */}
        <img
          src="/public/fondo-barberia.jpg"
          alt="Barbero"
          className="absolute inset-0 w-full h-full object-cover opacity-30"
        />

        {/* Contenido */}
        <div className="relative z-10 max-w-3xl">
          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold text-yellow-500 mb-6 drop-shadow-lg leading-tight">
            Bienvenidos a Athenea Barber
          </h2>

          <p className="text-base sm:text-lg md:text-xl text-gray-200 mb-4 leading-relaxed">
            Somos una barbería con alma clásica y estilo moderno. Cada corte es
            una experiencia personalizada, donde combinamos precisión y
            creatividad.
          </p>

          <p className="text-sm sm:text-base md:text-lg text-gray-200 mb-8 sm:mb-10">
            Nuestro objetivo es que salgas renovado y con confianza, ofreciendo
            un ambiente relajado y un servicio de primera.
          </p>

          <button
            onClick={() => navigate("/reserva")}
            className="bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-6 sm:px-8 py-2.5 sm:py-3 rounded-lg shadow-xl font-semibold text-base sm:text-lg hover:scale-105 transition-transform"
          >
            AGENDAR TURNO
          </button>
  
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <SubirFoto />
    </div>


          {/* SECCIÓN: ¿POR QUÉ ELEGIRNOS? */}
          <div className="mt-16 bg-white bg-opacity-10 p-6 rounded-2xl shadow-lg">
            <h3 className="text-2xl sm:text-3xl font-bold text-yellow-400 mb-6">
              ¿Por qué elegirnos?
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-gray-200">
              <div className="p-4 bg-gray-800 rounded-xl hover:scale-105 transition-transform">
                <h4 className="font-semibold text-lg text-yellow-400 mb-2">✨ Estilo único</h4>
                <p className="text-sm">
                  Fusionamos lo clásico con lo moderno para resaltar tu mejor versión.
                </p>
              </div>

              <div className="p-4 bg-gray-800 rounded-xl hover:scale-105 transition-transform">
                <h4 className="font-semibold text-lg text-yellow-400 mb-2">💈 Profesionales expertos</h4>
                <p className="text-sm">
                  Barberos con experiencia, dedicados a brindar precisión y creatividad en cada corte.
                </p>
              </div>

              <div className="p-4 bg-gray-800 rounded-xl hover:scale-105 transition-transform">
                <h4 className="font-semibold text-lg text-yellow-400 mb-2">🌟 Experiencia premium</h4>
                <p className="text-sm">
                  Más que un corte, ofrecemos un ambiente relajado y un servicio de primera.
                </p>
              </div>
            </div>
          </div>
        </div>
   
      </main>
    </div>
  );
}
