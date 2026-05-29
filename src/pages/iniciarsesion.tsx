
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  signInWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
} from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";

import { auth, db } from "../service/firebase";
import { useAuth } from "../hooks/useAuth";

export default function IniciarSesion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Si ya está logueado, redirigir
  useEffect(() => {
    if (!authLoading && user) {
      navigate("/");
    }
  }, [user, authLoading, navigate]);

  // Login con correo
  const handleEmailLogin = async (
    e: React.FormEvent<HTMLFormElement>
  ) => {
    e.preventDefault();

    if (!email || !password) return;

    setLoading(true);

    try {
      await signInWithEmailAndPassword(
        auth,
        email,
        password
      );

      navigate("/");
    } catch (error: any) {
      console.error("Error:", error);

      let message = "Error al iniciar sesión.";

      if (
        error.code === "auth/invalid-credential"
      ) {
        message =
          "Correo o contraseña incorrectos.";
      } else if (
        error.code === "auth/user-not-found"
      ) {
        message = "Usuario no encontrado.";
      }

      alert(message);
    } finally {
      setLoading(false);
    }
  };

  // Login con Google
  const handleGoogleLogin = async () => {
    setLoading(true);

    try {
      const provider =
        new GoogleAuthProvider();

      const result =
        await signInWithPopup(
          auth,
          provider
        );

      const firebaseUser = result.user;

      await setDoc(
        doc(
          db,
          "usuarios",
          firebaseUser.uid
        ),
        {
          nombre:
            firebaseUser.displayName ||
            "",
          email:
            firebaseUser.email || "",
          createdAt: new Date(),
        },
        { merge: true }
      );

      navigate("/");
    } catch (error: any) {
      console.error(
        "Error con Google:",
        error
      );

      alert(
        "No se pudo iniciar sesión con Google. Intenta nuevamente."
      );
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
        <h2 className="text-3xl font-bold text-[#D4AF37] text-center mb-8 font-serif">
          Iniciar Sesión
        </h2>

        <form
          onSubmit={handleEmailLogin}
          className="space-y-6"
        >
          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Correo Electrónico
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) =>
                setEmail(e.target.value)
              }
              className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-white focus:border-[#D4AF37] focus:outline-none"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-gray-400 text-sm mb-2">
              Contraseña
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) =>
                setPassword(e.target.value)
              }
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
            {loading
              ? "Iniciando..."
              : "Entrar con Correo"}
          </button>
        </form>

        <div className="my-6 text-center text-gray-500">
          o
        </div>

        <button
          onClick={handleGoogleLogin}
          disabled={loading}
          className={`w-full py-3 rounded-lg font-bold transition-all flex items-center justify-center gap-2 ${
            loading
              ? "bg-gray-600 cursor-not-allowed"
              : "bg-white text-black hover:bg-gray-100"
          }`}
        >
          {loading
            ? "Cargando..."
            : "Continuar con Google"}
        </button>

        <p className="text-center text-gray-500 text-sm mt-8">
          ¿Nuevo? Solo necesitas iniciar
          sesión para reservar.
        </p>
      </div>
    </div>
  );
}