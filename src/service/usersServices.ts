import { collection, getDocs, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export const getUsuarios = async () => {

try {

const snapshot = await getDocs(collection(db, "usuarios"));

return snapshot.docs.map(doc => ({
  id: doc.id,
  ...doc.data()
}));

} catch (error) {

console.error("Error obteniendo usuarios:", error);
return [];

}

};

export const eliminarUsuario = async (uid: string) => {

try {

await deleteDoc(doc(db, "usuarios", uid));

} catch (error) {

console.error("Error eliminando usuario:", error);

}

};