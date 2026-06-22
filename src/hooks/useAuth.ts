import { useState, useEffect } from "react";
import { auth, db, storage } from "../service/firebase";
import {
  EmailAuthProvider,
  reauthenticateWithCredential
} from "firebase/auth";
import {
  onAuthStateChanged,
  signOut,
  deleteUser,
  GoogleAuthProvider,
  reauthenticateWithPopup
} from "firebase/auth";

import {
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  deleteDoc,
  doc,
  getDoc,
  setDoc
} from "firebase/firestore";

import {
  ref,
  deleteObject
} from "firebase/storage";

export function useAuth() {

  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [rol, setRol] = useState<string>("cliente");

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

      try {

        if (currentUser) {

          console.log(" UID LOGUEADO:", currentUser.uid); 

          setUser(currentUser);

          const userRef = doc(db, "usuarios", currentUser.uid);
          const userSnap = await getDoc(userRef);

          //  SI NO EXISTE → CREAR
          if (!userSnap.exists()) {

            console.log(" NO EXISTE EN FIRESTORE → SE CREA COMO CLIENTE");

            await setDoc(userRef, {
              uid: currentUser.uid,
              nombre: currentUser.displayName || "Usuario",
              email: currentUser.email,
              foto: currentUser.photoURL || "",
              rol: "cliente",
              createdAt: new Date()
            });

            setRol("cliente");
            setIsAdmin(false);

          } else {

            const data = userSnap.data();

            console.log(" DATA FIRESTORE:", data); 
            console.log(" ROL DETECTADO:", data?.rol); 

            if (data && typeof data.rol === "string") {

              setRol(data.rol);

              if (data.rol === "admin") {
                setIsAdmin(true);
              } else {
                setIsAdmin(false);
              }

            } else {

              console.log(" ROL INVÁLIDO → cliente");

              setRol("cliente");
              setIsAdmin(false);

            }

          }

        } else {

          console.log(" NO HAY USUARIO LOGUEADO");

          setUser(null);
          setRol("cliente");
          setIsAdmin(false);

        }

      } catch (error) {

        console.error(" Error en useAuth:", error);

        setRol("cliente");
        setIsAdmin(false);

      } finally {

        setLoading(false);

      }

    });

    return () => unsubscribe();

  }, []);

  /*  ELIMINAR CUENTA */
const deleteAccount = async () => {

  if (!user) throw new Error("No hay usuario autenticado");

  try {

    //  DETECTAR PROVEEDOR
    const providerId = user.providerData[0]?.providerId;

    if (providerId === "google.com") {

      const provider = new GoogleAuthProvider();
      await reauthenticateWithPopup(user, provider);

    } else {

      //  PARA EMAIL/PASSWORD
      const password = prompt("Confirma tu contraseña para eliminar tu cuenta:");

      if (!password) throw new Error("Contraseña requerida");

      const credential = EmailAuthProvider.credential(
        user.email,
        password
      );

      await reauthenticateWithCredential(user, credential);

    }

    //  BORRAR RESERVAS
    const reservasRef = collection(db, "reservas");
    const reservasQuery = query(reservasRef, where("userId", "==", user.uid));
    const reservasSnapshot = await getDocs(reservasQuery);

    const batch = writeBatch(db);

    reservasSnapshot.forEach((docItem) => {
      batch.delete(docItem.ref);
    });

    await batch.commit();

    //  BORRAR SUGERENCIAS + STORAGE
    const sugerenciasRef = collection(db, "sugerencias");
    const sugerenciasQuery = query(sugerenciasRef, where("userId", "==", user.uid));
    const sugerenciasSnapshot = await getDocs(sugerenciasQuery);

    for (const docSnap of sugerenciasSnapshot.docs) {

      const data = docSnap.data();

      try {
        if (data.fotoUrl) {
          const photoRef = ref(storage, data.fotoUrl);
          await deleteObject(photoRef);
        }
      } catch (error) {
        console.warn("No se pudo borrar la foto", error);
      }

      await deleteDoc(docSnap.ref);
    }

    //  BORRAR USUARIO FIRESTORE
    await deleteDoc(doc(db, "usuarios", user.uid));

    // BORRAR AUTH
    await deleteUser(user);

    await signOut(auth);

    return true;

  } catch (error) {

    console.error("Error al eliminar cuenta:", error);
    alert("Debes volver a iniciar sesión para eliminar tu cuenta");

    throw error;

  }

};

  const logout = () => {
    return signOut(auth);
  };

  return {
    user,
    rol,
    isAdmin,
    loading,
    logout,
    deleteAccount
  };

}