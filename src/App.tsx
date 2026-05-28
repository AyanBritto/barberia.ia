import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "./hooks/useAuth";
import AdminPanel from "./pages/AdminPanel";
import { ReactNode } from "react";
import { Toaster } from "react-hot-toast";

// Lazy loading
const Bienvenida = lazy(() => import("./Bienvenida"));
import BookingApp from "./components/booking/BookingApp";
const IniciarSesion = lazy(() => import("./pages/iniciarsesion"));
const SugerenciaIA = lazy(() => import("./components/reserva/SugerenciaIA"));
const Historial = lazy(() => import("./pages/Historial"));
const MisReservas = lazy(() => import("./pages/MisReservas"));

export default function App() {
  const { user, loading } = useAuth();

  interface ProtectedRouteProps {
    children: ReactNode;
    roles?: string[]; //  cambio importante
  }

  const ProtectedRoute = ({ children, roles }: ProtectedRouteProps) => {
    const { user, rol, loading } = useAuth();

    if (loading) {
      return <div>Cargando...</div>;
    }

    if (!user) {
      return <Navigate to="/iniciarsesion" replace />;
    }

    //  VALIDACIÓN POR ROL
    if (roles && !roles.includes(rol)) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  };

  const LoadingScreen = () => (
    <div className="min-h-screen bg-black-rich flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gold text-sm md:text-base">Cargando...</p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingScreen />;
  }

        <Suspense fallback={<LoadingScreen />}>
    <div className="min-h-screen w-full bg-black-rich text-white">

        <Routes>
          {/* Ruta pública: página de bienvenida */}
          <Route path="/" element={<Bienvenida />} />

 
          {/* Ruta de login: accesible solo si no hay usuario */}
          <Route
            path="/iniciarsesion"
            element={user ? <Navigate to="/reserva" /> : <IniciarSesion />}

          {/* ✅ CORREGIDO: Redirigir a "/" si ya está logueado */}
          <Route
            path="/iniciarsesion"
            element={user ? <Navigate to="/" replace /> : <IniciarSesion />}

          />
          
          {/* Ruta de admin */}
          <Route 
            path="/admin" 
            element={
              <ProtectedRoute requireAdmin={true}>
                <AdminPanel />
              </ProtectedRoute>
            } 
          />

      <Suspense fallback={<LoadingScreen />}>
        <div className="min-h-screen w-full bg-black-rich text-white">

          <Routes>

            <Route path="/" element={<Bienvenida />} />

 
          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
 

      </div>

            <Route
              path="/iniciarsesion"
              element={user ? <Navigate to="/" replace /> : <IniciarSesion />}
            />

            {/*  ADMIN */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/*  BARBERO */}
            <Route
              path="/panel-barbero"
              element={
                <ProtectedRoute roles={["barbero"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* CLIENTE */}
            <Route
              path="/reserva"
              element={
                <ClientOnlyRoute>
                  <BookingApp />
                </ClientOnlyRoute>
              }
            />

            <Route
              path="/sugerencia-ia"
              element={
                <ClientOnlyRoute>
                  <SugerenciaIA />
                </ClientOnlyRoute>
              }
            />

            <Route
              path="/historial"
              element={
                <ClientOnlyRoute>
                  <Historial />
                </ClientOnlyRoute>
              }
            />

            <Route
              path="/mis-reservas"
              element={
                <ClientOnlyRoute>
                  <MisReservas />
                </ClientOnlyRoute>
              }
            />

            <Route path="*" element={<Navigate to="/" />} />

          </Routes>

        </div>
      </Suspense>
    </Router>
  );
}