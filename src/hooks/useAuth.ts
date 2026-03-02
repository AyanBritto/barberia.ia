// src/hooks/useAuth.ts
import { useState, useEffect } from "react";
import { auth } from "../service/firebase";
import { onAuthStateChanged, signOut } from "firebase/auth";

export function useAuth() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // 👇 Lista blanca de admins (cambia el email)
    const adminEmails = ["brittoayan5@gmail.com"]; 

    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        setUser(currentUser);
        
        // ✅ Corrección: asegurar que email no sea null
        const email = currentUser.email ?? "";
        setIsAdmin(adminEmails.includes(email));
      } else {
        setUser(null);
        setIsAdmin(false);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // ✅ AÑADE ESTA FUNCIÓN
  const logout = () => {
    return signOut(auth);
  };

  return { user, isAdmin, loading, logout }; // ✅ Añade logout aquí
}