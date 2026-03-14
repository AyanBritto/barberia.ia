import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "./firebase";

export const getServicios = async () => {
try {
const snapshot = await getDocs(collection(db, "servicios"));
return snapshot.docs.map(d => ({
id: d.id,
...d.data()
}));
} catch (error) {
console.error("Error obteniendo servicios:", error);
return [];
}
};

export const crearServicio = async (nombre: string, precio: number) => {
try {
await addDoc(collection(db, "servicios"), {
nombre,
precio,
activo: true
});
} catch (error) {
console.error("Error creando servicio:", error);
throw error;
}
};

export const actualizarPrecioServicio = async (id: string, precio: number) => {
try {
const ref = doc(db, "servicios", id);
await updateDoc(ref, { precio });
} catch (error) {
console.error("Error actualizando precio:", error);
throw error;
}
};

export const eliminarServicio = async (id: string) => {
try {
const ref = doc(db, "servicios", id);
await deleteDoc(ref);
} catch (error) {
console.error("Error eliminando servicio:", error);
throw error;
}
};