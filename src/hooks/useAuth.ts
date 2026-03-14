import { useState, useEffect } from "react";
import { auth, db, storage } from "../service/firebase";

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

useEffect(() => {

const adminEmails = ["brittoayan5@gmail.com"];

const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {

if (currentUser) {

setUser(currentUser);

const email = currentUser.email ?? "";
setIsAdmin(adminEmails.includes(email));

/* 🔥 CREAR USUARIO EN FIRESTORE SI NO EXISTE */

try {

const userRef = doc(db, "usuarios", currentUser.uid);
const userSnap = await getDoc(userRef);

if (!userSnap.exists()) {

await setDoc(userRef, {
uid: currentUser.uid,
nombre: currentUser.displayName || "Usuario",
email: currentUser.email,
foto: currentUser.photoURL || "",
createdAt: new Date()
});

console.log("Usuario creado en Firestore");

}

} catch (error) {

console.error("Error guardando usuario:", error);

}

} else {

setUser(null);
setIsAdmin(false);

}

setLoading(false);

});

return () => unsubscribe();

}, []);


/* 🔥 ELIMINAR CUENTA */

const deleteAccount = async () => {

if (!user) throw new Error("No hay usuario autenticado");

try {

const provider = new GoogleAuthProvider();
await reauthenticateWithPopup(user, provider);

console.log("Reautenticación correcta");


/* 🧹 ELIMINAR RESERVAS */

const reservasRef = collection(db, "reservas");
const reservasQuery = query(reservasRef, where("userId", "==", user.uid));
const reservasSnapshot = await getDocs(reservasQuery);

const batch = writeBatch(db);

reservasSnapshot.forEach((doc) => {
batch.delete(doc.ref);
});

await batch.commit();


/* 🧹 ELIMINAR SUGERENCIAS */

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


/* 🔥 ELIMINAR DOCUMENTO DE USUARIO */

await deleteDoc(doc(db,"usuarios",user.uid));


/* 🔥 ELIMINAR AUTH */

await deleteUser(user);

await signOut(auth);

return true;

} catch (error) {

console.error("Error al eliminar cuenta:", error);
throw error;

}

};

const logout = () => {
return signOut(auth);
};

return {
user,
isAdmin,
loading,
logout,
deleteAccount
};

}