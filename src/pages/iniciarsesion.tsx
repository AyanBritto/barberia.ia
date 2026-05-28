// src/pages/IniciarSesion.tsx
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../service/firebase";
import { useAuth } from "../hooks/useAuth";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../service/firebase";

export default function IniciarSesion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

 
  // Si ya está logueado, redirigir a Bienvenida
  useEffect(() => {
    if (!authLoading && user) {
      
    }
  }, [user, authLoading, navigate]);

  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/"); //  Redirección explícita a Bienvenida
    } catch (error: any) {
      console.error("Error:", error);
      let message = "Error al iniciar sesión.";
      if (error.code === "auth/invalid-credential") {
        message = "Correo o contraseña incorrectos.";
      } else if (error.code === "auth/user-not-found") {
        message = "Usuario no encontrado.";
      }
      alert(message);
    } finally {
      setLoading(false);
    }
  };


 
  return (
    <div className="min-h-screen bg-beige flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl border-2 border-gold p-8 max-w-md w-full">
        <h1 className="text-3xl font-bold text-center text-gold mb-6">Barbería Ayan</h1>
        <p className="text-center text-gray-700 mb-8">
          Inicia sesión para recibir sugerencias personalizadas de corte
        </p>

        <button
          onClick={handleLogin}
          disabled={loading}
          className={`w-full py-3 px-4 rounded-lg font-semibold text-white transition-all flex items-center justify-center gap-3 ${loading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gradient-to-r from-gold to-red-barber hover:shadow-xl"
            }`}
        >
          {loading ? (
            <>
              <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Iniciando sesión...
            </>
          ) : (
            <>
              <svg className="w-5 h-5" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" fill="#fff" />
              </svg>
              Iniciar sesión con Google
            </>
          )}
        </button>

        {error && (
          <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm text-center">
            {error}
          </div>
        )}

        <p className="text-center text-xs text-gray-500 mt-6">
          Solo usamos tu cuenta para personalizar tus sugerencias.

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      navigate("/"); // ✅ Redirección explícita a Bienvenida
       await setDoc(doc(db, "usuarios", user.uid), {
  nombre: user.displayName || "",
  email: user.email,
  createdAt: new Date()
});
    } catch (error: any) {
      console.error("Error con Google:", error);
      alert("No se pudo iniciar sesión con Google. Intenta nuevamente.");
    } finally {
      setLoading(false);
const handleGoogleLogin = async () => {
  setLoading(true);

  try {
    const provider = new GoogleAuthProvider();

    const result = await signInWithPopup(auth, provider);

    const firebaseUser = result.user;

    if (!firebaseUser) {
      console.error("No se obtuvo usuario");
      return;

    }

   await setDoc(doc(db, "usuarios", firebaseUser.uid), {
  nombre: firebaseUser.displayName || "",
  email: firebaseUser.email,
  createdAt: new Date()
}, { merge: true });

    

  } catch (error: any) {
    console.error("Error con Google:", error);
    alert("No se pudo iniciar sesión con Google. Intenta nuevamente.");
  } finally {
    setLoading(false);
  }
};

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-black-rich text-white">
        Cargando...
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-black-rich text-off-white p-4">
      <div className="w-full max-w-md bg-[#1e1e1e] rounded-2xl p-8 border border-white/10 shadow-xl">
        <h2 className="text-3xl font-bold text-[#D4AF37] text-center mb-8 font-serif">Iniciar Sesión</h2>

        <form onSubmit={handleEmailLogin} className="space-y-6">
          <div>
            <label className="block text-gray-400 text-sm mb-2">Correo Electrónico</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-3 rounded-lg font-bold transition-all ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            }`}
          >
            {loading ? "Iniciando..." : "Entrar con Correo"}
          </button>
        </form>

        <div className="my-6 text-center text-gray-500">o</div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          {loading ? "Cargando..." : "Continuar con Google"}
        </button>

        <p className="text-center text-gray-500 text-sm mt-8">
          ¿Nuevo? Solo necesitas iniciar sesión para reservar.

        </p>
      </div>
    </div>
  );
}