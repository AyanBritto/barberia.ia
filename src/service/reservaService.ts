import {
collection,
addDoc,
getDocs,
query,
where,
doc,
updateDoc,
deleteDoc
} from "firebase/firestore";

import { db } from "./firebase";


// CREAR RESERVA
export const crearReserva = async (data:any) => {

try{

await addDoc(collection(db,"reservas"),{
...data,
status:"confirmada", // estado inicial
createdAt:new Date()
});

}catch(error){

console.error("Error creando reserva",error);

}

};


// OBTENER RESERVAS POR USUARIO
export const getReservasUsuario = async (userId:string) => {

try{

const q = query(
collection(db,"reservas"),
where("userId","==",userId)
);

const snapshot = await getDocs(q);

return snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

}catch(error){

console.error("Error obteniendo reservas",error);
return [];

}

};


// OBTENER TODAS LAS RESERVAS (ADMIN)
export const getReservas = async () => {

try{

const snapshot = await getDocs(collection(db,"reservas"));

return snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

}catch(error){

console.error("Error obteniendo reservas",error);
return [];

}

};


// RESERVAS POR FECHA Y BARBERO
export const getReservasPorFecha = async (fecha:string, barbero:string) => {

try{

const q = query(
collection(db,"reservas"),
where("fecha","==",fecha),
where("barbero","==",barbero)
);

const snapshot = await getDocs(q);

return snapshot.docs.map(doc=>({
id:doc.id,
...doc.data()
}));

}catch(error){

console.error("Error obteniendo reservas por fecha",error);
return [];

}

};


// CANCELAR RESERVA POR CLIENTE
export const cancelarReserva = async (id:string) => {

try{

const ref = doc(db,"reservas",id);

await updateDoc(ref,{
status:"cancelada_cliente"
});

}catch(error){

console.error("Error cancelando reserva",error);

}

};


// CANCELAR RESERVA POR ADMIN
export const cancelarReservaAdmin = async (id:string) => {

try{

const ref = doc(db,"reservas",id);

await updateDoc(ref,{
status:"cancelada_admin"
});

}catch(error){

console.error("Error cancelando reserva por admin",error);

}

};


// ELIMINAR RESERVA (solo si alguna vez lo necesitas)
export const eliminarReserva = async (id:string) => {

try{

await deleteDoc(doc(db,"reservas",id));

}catch(error){

console.error("Error eliminando reserva",error);

}

};