import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { Suspense, lazy } from "react";
import { useAuth } from "./hooks/useAuth";
import AdminPanel from "./pages/AdminPanel";
import { ReactNode } from "react";

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
    requireAdmin?: boolean;
  }

  const ProtectedRoute = ({ children, requireAdmin = false }: ProtectedRouteProps) => {
    const { user, isAdmin, loading } = useAuth();

    if (loading) {
      return <div>Cargando...</div>;
    }

    if (!user) {
      return <Navigate to="/iniciarsesion" replace />;
    }

    if (requireAdmin && !isAdmin) {
      return <Navigate to="/" replace />;
    }

    return <>{children}</>;
  };

  // Loader componente
  const LoadingScreen = () => (
    <div className="min-h-screen bg-black-rich flex items-center justify-center">
      <div className="text-center">
        <div className="w-12 h-12 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-gold">Cargando...</p>
      </div>
    </div>
  );

  if (loading) {
    return <LoadingScreen />;
  }

  // ✅ NUEVA FUNCIÓN: Proteger rutas de cliente (bloquear admins)
  const ClientOnlyRoute = ({ children }: { children: ReactNode }) => {
    const { isAdmin, loading } = useAuth();
    
    if (loading) return <div>Cargando...</div>;
    if (isAdmin) return <Navigate to="/admin" replace />;
    
    return <>{children}</>;
  };

  return (
    <Router>
      <Suspense fallback={<LoadingScreen />}>
        <Routes>
          {/* Ruta pública: página de bienvenida */}
          <Route path="/" element={<Bienvenida />} />

          {/* Ruta de login: accesible solo si no hay usuario */}
          <Route
            path="/iniciarsesion"
            element={user ? <Navigate to="/reserva" /> : <IniciarSesion />}
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

          {/* ✅ RUTAS DE CLIENTE: Solo accesibles para NO admins */}
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

          {/* Redirección por defecto */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </Router>
  );
}