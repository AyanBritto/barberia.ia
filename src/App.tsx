
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy, ReactNode } from "react";
import { useAuth } from "./hooks/useAuth";
import AdminPanel from "./pages/AdminPanel";
import { Toaster } from "react-hot-toast";

// Lazy loading
const Bienvenida = lazy(() => import("./Bienvenida"));
const BookingApp = lazy(() => import("./components/booking/BookingApp"));
const IniciarSesion = lazy(() => import("./pages/iniciarsesion"));
const SugerenciaIA = lazy(() => import("./components/reserva/SugerenciaIA"));
const Historial = lazy(() => import("./pages/Historial"));
const MisReservas = lazy(() => import("./pages/MisReservas"));

export default function App() {
  const { user, loading } = useAuth();

  interface ProtectedRouteProps {
    children: ReactNode;
    roles?: string[];
  }

  const ProtectedRoute = ({
    children,
    roles,
  }: ProtectedRouteProps) => {
    const { user, rol, loading } = useAuth();

    if (loading) {
      return <div>Cargando...</div>;
    }

    if (!user) {
      return <Navigate to="/iniciarsesion" replace />;
    }

    if (roles && !roles.includes(rol)) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  };

  const LoadingScreen = () => (
    <div className="min-h-screen bg-black-rich flex items-center justify-center px-4">
      <div className="text-center">
        <div className="w-10 h-10 md:w-12 md:h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gold text-sm md:text-base">
          Cargando...
        </p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <div className="min-h-screen w-full bg-black-rich text-white">
          <Routes>
            {/* Página principal */}
            <Route path="/" element={<Bienvenida />} />

            {/* Login */}
            <Route
              path="/iniciarsesion"
              element={
                user ? (
                  <Navigate to="/" replace />
                ) : (
                  <IniciarSesion />
                )
              }
            />

            {/* ADMIN */}
            <Route
              path="/admin"
              element={
                <ProtectedRoute roles={["admin"]}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />

            {/* BARBERO */}
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
                <ProtectedRoute roles={["cliente"]}>
                  <BookingApp />
                </ProtectedRoute>
              }
            />

            <Route
              path="/sugerencia-ia"
              element={
                <ProtectedRoute roles={["cliente"]}>
                  <SugerenciaIA />
                </ProtectedRoute>
              }
            />

            <Route
              path="/historial"
              element={
                <ProtectedRoute roles={["cliente"]}>
                  <Historial />
                </ProtectedRoute>
              }
            />

            <Route
              path="/mis-reservas"
              element={
                <ProtectedRoute roles={["cliente"]}>
                  <MisReservas />
                </ProtectedRoute>
              }
            />

            {/* Ruta no encontrada */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>

          <Toaster position="top-right" />
        </div>
      </Suspense>
    </Router>
  );
}