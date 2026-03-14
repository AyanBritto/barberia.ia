import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../service/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../service/firebase";
import { getIAStatus, setIAStatus } from "../service/configService";
import { getUsuarios, eliminarUsuario } from "../service/usersServices";

import {
getServicios,
crearServicio,
actualizarPrecioServicio,
eliminarServicio
} from "../service/servicesServices";

import { getReservas } from "../service/reservaService";

export default function AdminPanel(){

const { isAdmin, loading } = useAuth();
const navigate = useNavigate();

const [reservas,setReservas] = useState<any[]>([]);
const [sugerencias,setSugerencias] = useState<any[]>([]);
const [servicios,setServicios] = useState<any[]>([]);
const [usuarios,setUsuarios] = useState<any[]>([]);

const [tab,setTab] = useState("reservas");
const [iaEnabled,setIaEnabled] = useState(true);

const [nuevoNombre,setNuevoNombre] = useState("");
const [nuevoPrecio,setNuevoPrecio] = useState("");

const [reservasHoy,setReservasHoy] = useState(0);
const [reservasSemana,setReservasSemana] = useState(0);

const [busquedaCliente,setBusquedaCliente] = useState("");

useEffect(()=>{

if(loading) return;

if(!isAdmin){
navigate("/");
return;
}

cargarDatos();

},[isAdmin,loading]);

const cargarDatos = async()=>{

try{

const reservasData = await getReservas();
setReservas(reservasData);

const sugerenciasSnap = await getDocs(
query(collection(db,"sugerencias"),orderBy("createdAt","desc"))
);

const sugerenciasData = sugerenciasSnap.docs.map(doc=>({id:doc.id,...doc.data()}));
setSugerencias(sugerenciasData);

const usuariosData = await getUsuarios();
setUsuarios(usuariosData);

const serviciosData = await getServicios();
setServicios(serviciosData);

const iaStatus = await getIAStatus();
setIaEnabled(iaStatus);

const hoy = new Date();
const inicioSemana = new Date();
inicioSemana.setDate(hoy.getDate() - 7);

const hoyCount = reservasData.filter((r:any)=>{

if(!r.createdAt) return false;

let fecha;

if(r.createdAt.seconds){
fecha = new Date(r.createdAt.seconds * 1000);
}else{
fecha = new Date(r.createdAt);
}

return fecha.toDateString() === hoy.toDateString();

}).length;

const semanaCount = reservasData.filter((r:any)=>{

if(!r.createdAt) return false;

let fecha;

if(r.createdAt.seconds){
fecha = new Date(r.createdAt.seconds * 1000);
}else{
fecha = new Date(r.createdAt);
}

return fecha >= inicioSemana;

}).length;

setReservasHoy(hoyCount);
setReservasSemana(semanaCount);

}catch(err){
console.error("Error cargando datos",err);
}

};

if(loading){
return(
<div className="min-h-screen flex items-center justify-center bg-black text-white">
Cargando...
</div>
);
}

if(!isAdmin) return null;

/* CONTROL SERVICIO */

const marcarLlegada = async(id:string)=>{
await updateDoc(doc(db,"reservas",id),{estadoServicio:"cliente_llego"});
cargarDatos();
};

const iniciarServicio = async(id:string)=>{
await updateDoc(doc(db,"reservas",id),{estadoServicio:"en_servicio"});
cargarDatos();
};

const finalizarServicio = async(id:string)=>{
await updateDoc(doc(db,"reservas",id),{estadoServicio:"finalizada"});
cargarDatos();
};

/* IA */

const toggleIA = async()=>{
const newState = !iaEnabled;
await setIAStatus(newState);
setIaEnabled(newState);
};

/* SERVICIOS */

const agregarServicio = async()=>{

if(!nuevoNombre || !nuevoPrecio){
alert("Completa todos los campos");
return;
}

await crearServicio(nuevoNombre,Number(nuevoPrecio));

setNuevoNombre("");
setNuevoPrecio("");

cargarDatos();

};

const editarPrecio = async(id:string)=>{

const nuevo = prompt("Nuevo precio:");
if(!nuevo) return;

await actualizarPrecioServicio(id,Number(nuevo));
cargarDatos();

};

const borrarServicio = async(id:string)=>{

if(!window.confirm("¿Eliminar servicio?")) return;

await eliminarServicio(id);
cargarDatos();

};
/* SUBIR FOTO CORTE */

const subirFotoCorte = async (file: File, reservaId: string) => {

try{

const storageRef = ref(storage, `cortes/${reservaId}.jpg`);

await uploadBytes(storageRef,file);

const url = await getDownloadURL(storageRef);

await updateDoc(doc(db,"reservas",reservaId),{
corteImagen:url
});

cargarDatos();

}catch(error){

console.error("Error subiendo foto",error);

}

};

/* HISTORIAL */

const historialCliente = reservas.filter((r:any)=>
r.clienteNombre?.toLowerCase().includes(busquedaCliente.toLowerCase())
);

return(

<div className="min-h-screen bg-black text-white p-4 md:p-6">

<div className="max-w-6xl mx-auto">

<h1 className="text-2xl md:text-3xl font-bold text-[#D4AF37] mb-8">
Panel de Administración
</h1>

{/* DASHBOARD */}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

<div className="bg-gray-900 p-4 rounded-lg text-center">
<p className="text-gray-400 text-sm">Usuarios</p>
<p className="text-2xl font-bold text-[#D4AF37]">{usuarios.length}</p>
</div>

<div className="bg-gray-900 p-4 rounded-lg text-center">
<p className="text-gray-400 text-sm">Reservas Hoy</p>
<p className="text-2xl font-bold text-[#D4AF37]">{reservasHoy}</p>
</div>

<div className="bg-gray-900 p-4 rounded-lg text-center">
<p className="text-gray-400 text-sm">Reservas Semana</p>
<p className="text-2xl font-bold text-[#D4AF37]">{reservasSemana}</p>
</div>

<div className="bg-gray-900 p-4 rounded-lg text-center">
<p className="text-gray-400 text-sm">IA Usada</p>
<p className="text-2xl font-bold text-[#D4AF37]">{sugerencias.length}</p>
</div>

</div>

{/* TABS */}

<div className="flex flex-wrap gap-3 mb-8">

<button onClick={()=>setTab("reservas")} className="px-3 md:px-4 py-2 bg-gray-800 rounded text-sm md:text-base">Reservas</button>

<button onClick={()=>setTab("servicios")} className="px-3 md:px-4 py-2 bg-gray-800 rounded text-sm md:text-base">Servicios</button>

<button onClick={()=>setTab("usuarios")} className="px-3 md:px-4 py-2 bg-gray-800 rounded text-sm md:text-base">Usuarios</button>

<button onClick={()=>setTab("historial")} className="px-3 md:px-4 py-2 bg-gray-800 rounded text-sm md:text-base">Historial</button>

<button onClick={()=>setTab("ia")} className="px-3 md:px-4 py-2 bg-gray-800 rounded text-sm md:text-base">IA</button>

</div>

{/* RESERVAS */}

{tab==="reservas" &&(

<div>

<h2 className="text-xl font-bold mb-4">Reservas</h2>

<div className="grid md:grid-cols-2 gap-4">

{reservas.map(res=>{

let fechaTexto="";

if(res.createdAt){

const fecha = res.createdAt.seconds
? new Date(res.createdAt.seconds * 1000)
: new Date(res.createdAt);

fechaTexto = fecha.toLocaleDateString("es-PY");

}

return(

<div className="bg-gray-900 p-4 rounded flex flex-col md:flex-row gap-4 md:justify-between">

<div>

<p><b>Cliente:</b> {res.clienteNombre}</p>
<p><b>Servicio:</b> {res.servicio}</p>
<p><b>Barbero:</b> {res.barbero}</p>
<p><b>Fecha:</b> {res.fecha}</p>
<p><b>Hora:</b> {res.horario}</p>
<p><b>Estado:</b> {res.estadoServicio || "pendiente"}</p>

<div className="flex gap-2 mt-3">

<button onClick={()=>marcarLlegada(res.id)} className="bg-green-600 px-3 py-1 rounded text-sm">
Llegó
</button>

<button onClick={()=>iniciarServicio(res.id)} className="bg-yellow-600 px-3 py-1 rounded text-sm">
Iniciar
</button>

<button onClick={()=>finalizarServicio(res.id)} className="bg-blue-600 px-3 py-1 rounded text-sm">
Finalizar
</button>

</div>

</div>

{res.corteImagen &&(
<img src={res.corteImagen} className="w-full md:w-24 h-40 md:h-24 object-cover rounded border border-[#D4AF37]" />
)}

</div>

);

})}

</div>

</div>

)}

{/* HISTORIAL */}

{tab==="historial" &&(

<div>

<h2 className="text-xl font-bold mb-4">
Historial de cortes
</h2>

<input
type="text"
placeholder="Buscar cliente..."
value={busquedaCliente}
onChange={(e)=>setBusquedaCliente(e.target.value)}
className="bg-black border border-gray-700 px-3 py-2 rounded mb-6 w-full"
/>

<div className="space-y-6">

{historialCliente.map(res=>{

let fechaTexto="";

if(res.createdAt){

const fecha = res.createdAt.seconds
? new Date(res.createdAt.seconds*1000)
: new Date(res.createdAt);

fechaTexto = fecha.toLocaleDateString("es-PY");

}

return(

<div key={res.id} className="bg-gray-900 p-4 rounded flex flex-col md:flex-row gap-4">

{/* IMAGEN */}

{res.corteImagen ?(

<img
src={res.corteImagen}
alt="corte"
className="w-28 h-28 object-cover rounded border border-[#D4AF37]"
/>

):(

<label className="w-28 h-28 bg-black rounded flex items-center justify-center border border-gray-700 cursor-pointer hover:border-[#D4AF37] text-sm">

Subir foto

<input
type="file"
accept="image/*"
className="hidden"
onChange={(e)=>{

const file = e.target.files?.[0];

if(file){
subirFotoCorte(file,res.id);
}

}}
/>

</label>

)}

{/* INFO */}

<div className="flex flex-col justify-center">

<p className="text-lg font-bold text-white">
{res.clienteNombre}
</p>

<p className="text-[#D4AF37]">
{res.corteRecomendado || res.servicio}
</p>

<p className="text-gray-400 text-sm">
Barbero: {res.barbero}
</p>

<p className="text-gray-400 text-sm">
Fecha: {fechaTexto}
</p>

</div>

</div>

);

})}

</div>

</div>

)}

{/* SERVICIOS */}

{tab==="servicios" &&(

<div>

<h2 className="text-xl font-bold mb-4">Servicios</h2>

<div className="flex gap-4 mb-6">

<input
type="text"
placeholder="Nombre"
value={nuevoNombre}
onChange={(e)=>setNuevoNombre(e.target.value)}
className="bg-black border border-gray-700 px-3 py-2 rounded"
/>

<input
type="number"
placeholder="Precio"
value={nuevoPrecio}
onChange={(e)=>setNuevoPrecio(e.target.value)}
className="bg-black border border-gray-700 px-3 py-2 rounded"
/>

<button
onClick={agregarServicio}
className="bg-[#D4AF37] text-black px-4 py-2 rounded"
>
Crear
</button>

</div>

<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">

{servicios.map(serv=>(

<div key={serv.id} className="bg-gray-900 p-4 rounded">

<p className="font-bold">{serv.nombre}</p>
<p className="text-[#D4AF37]">Gs {serv.precio}</p>

<div className="flex gap-2 mt-3">

<button
onClick={()=>editarPrecio(serv.id)}
className="bg-blue-600 px-3 py-1 rounded text-sm"
>
Editar
</button>

<button
onClick={()=>borrarServicio(serv.id)}
className="bg-red-600 px-3 py-1 rounded text-sm"
>
Eliminar
</button>

</div>

</div>

))}

</div>

</div>

)}

{/* USUARIOS */}

{tab==="usuarios" &&(

<div>

<h2 className="text-xl font-bold mb-4">Usuarios</h2>

<div className="grid grid-cols-1 md:grid-cols-2 gap-4">

{usuarios.map(user=>(

<div key={user.id} className="bg-gray-900 p-4 rounded">

<p><b>Nombre:</b> {user.nombre}</p>
<p><b>Email:</b> {user.email}</p>

<button
onClick={()=>{
if(window.confirm("Eliminar usuario")){
eliminarUsuario(user.id);
cargarDatos();
}
}}
className="mt-3 bg-red-600 px-3 py-1 rounded text-sm"
>
Eliminar
</button>

</div>

))}

</div>

</div>

)}

{/* IA */}

{tab==="ia" &&(

<div>

<h2 className="text-xl font-bold mb-4">Control IA</h2>

<button
onClick={toggleIA}
className={`px-6 py-3 rounded font-bold ${iaEnabled?"bg-green-700":"bg-red-700"}`}
>
IA {iaEnabled?"ACTIVA":"APAGADA"}
</button>

</div>

)}

</div>

</div>

);

}