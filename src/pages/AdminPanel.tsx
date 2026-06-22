import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { collection, getDocs, query, orderBy, doc, updateDoc } from "firebase/firestore";
import { db } from "../service/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { storage } from "../service/firebase";
import { getIAStatus, setIAStatus } from "../service/configService";
import { getUsuarios, eliminarUsuario } from "../service/usersServices";
import { httpsCallable } from "firebase/functions";
import { functions } from "../service/firebase";


import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

import {
getServicios,
crearServicio,
actualizarPrecioServicio,
eliminarServicio
} from "../service/servicesServices";

import { getReservas, cancelarReservaAdmin } from "../service/reservaService";


export default function AdminPanel(){

const { rol, user, loading } = useAuth();
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
const [reporteServicios, setReporteServicios] = useState<any>({});
const [reporteBarberos, setReporteBarberos] = useState<any>({});
const [totalIngresos, setTotalIngresos] = useState(0);
const [filtroFecha, setFiltroFecha] = useState("todos");
const serviciosChart = Object.entries(reporteServicios).map(([name, value]) => ({
  name,
  value
}));

const barberosChart = Object.entries(reporteBarberos).map(([name, value]) => ({
  name,
  value
}));

const COLORS = ["#D4AF37", "#8884d8", "#82ca9d", "#ff7f50"];
const deleteUserAdmin = httpsCallable(functions, "deleteUserByAdmin");
useEffect(()=>{

if(loading) return; // 

if(!rol){
  navigate("/");
  return;
}

if(rol !== "admin" && rol !== "barbero"){
  navigate("/");
  return;
}

cargarDatos();

},[rol, loading]);

const cargarDatos = async()=>{

try{

let reservasData = await getReservas();
//  FILTRO POR FECHA
const ahora = new Date();

if(filtroFecha === "hoy"){
  reservasData = reservasData.filter((r:any)=>{
    const fecha = r.createdAt?.seconds
      ? new Date(r.createdAt.seconds * 1000)
      : new Date(r.createdAt);

    return fecha.toDateString() === ahora.toDateString();
  });
}

if(filtroFecha === "semana"){
  const inicioSemana = new Date();
  inicioSemana.setDate(ahora.getDate() - 7);

  reservasData = reservasData.filter((r:any)=>{
    const fecha = r.createdAt?.seconds
      ? new Date(r.createdAt.seconds * 1000)
      : new Date(r.createdAt);

    return fecha >= inicioSemana;
  });
}
if(rol === "barbero"){
  reservasData = reservasData.filter(
    (r:any)=> r.barberoId === user?.uid // 🔥 MEJOR
  );
}

setReservas(reservasData);

const sugerenciasSnap = await getDocs(
query(collection(db,"sugerencias"),orderBy("createdAt","desc"))
);

const sugerenciasData = sugerenciasSnap.docs.map(doc=>({id:doc.id,...doc.data()}));
setSugerencias(sugerenciasData);

if(rol === "admin"){
  const usuariosData = await getUsuarios();
  setUsuarios(usuariosData);

  const serviciosData = await getServicios();
  setServicios(serviciosData);

  const iaStatus = await getIAStatus();
  setIaEnabled(iaStatus);
}

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

// ==========================
//  REPORTES (SOLO ADMIN)
// ==========================

if(rol === "admin"){

  const serviciosCount:any = {};
  const barberosCount:any = {};
  let ingresos = 0;

  reservasData.forEach((r:any)=>{

    // CONTAR SERVICIOS
    if(r.servicio){
      serviciosCount[r.servicio] = (serviciosCount[r.servicio] || 0) + 1;
    }

    // CONTAR BARBEROS
    if(r.barbero){
      barberosCount[r.barbero] = (barberosCount[r.barbero] || 0) + 1;
    }

    // INGRESOS 
if(r.status === "confirmada"){
  ingresos += r.precio || 0;
}

  });

  setReporteServicios(serviciosCount);
  setReporteBarberos(barberosCount);
  setTotalIngresos(ingresos);

}

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

if(!rol) return null;


/* CONTROL SERVICIO */

const marcarLlegada = async (id: string) => {
  try {

    console.log("actualizando llegada", id);

    await updateDoc(doc(db, "reservas", id), {
      estadoServicio: "cliente_llego"
    });

    console.log("llegada actualizada");

    cargarDatos();

  } catch (error) {
    console.error("Error marcar llegada:", error);
  }
};

const iniciarServicio = async (id: string) => {
  try {

    console.log("iniciando servicio", id);

    await updateDoc(doc(db, "reservas", id), {
      estadoServicio: "en_servicio"
    });

    console.log("servicio iniciado");

    cargarDatos();

  } catch (error) {
    console.error("Error iniciar servicio:", error);
  }
};

const finalizarServicio = async (id: string) => {
  try {

    console.log("finalizando servicio", id);

    await updateDoc(doc(db, "reservas", id), {
      estadoServicio: "finalizada"
    });

    console.log("servicio finalizado");

    cargarDatos();

  } catch (error) {
    console.error("Error finalizar servicio:", error);
  }
};

const cancelarReservaAdminPanel = async(id:string)=>{

if(!window.confirm("¿Cancelar esta reserva?")) return;

try{

await cancelarReservaAdmin(id);

cargarDatos();

}catch(error){

console.error("Error cancelando reserva",error);

}

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
{rol === "admin" ? "Panel de Administración" : "Panel del Barbero"}
</h1>
{rol === "barbero" && (
  <p className="text-gray-400 mb-6">
    Panel personal — gestiona tus reservas y clientes
  </p>
)}
<p></p>

{/* DASHBOARD */}

<div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">

{rol === "admin" && (
<div className="bg-gray-900 p-4 rounded-lg text-center">
<p className="text-gray-400 text-sm">Usuarios</p>
<p className="text-2xl font-bold text-[#D4AF37]">{usuarios.length}</p>
</div>
)}

<div className="bg-gray-900 p-4 rounded-lg text-center">
<p className="text-gray-400 text-sm">Reservas Hoy</p>
<p className="text-2xl font-bold text-[#D4AF37]">{reservasHoy}</p>
</div>

<div className="bg-gray-900 p-4 rounded-lg text-center">
<p className="text-gray-400 text-sm">Reservas Semana</p>
<p className="text-2xl font-bold text-[#D4AF37]">{reservasSemana}</p>
</div>

{rol === "admin" && (
<div className="bg-gray-900 p-4 rounded-lg text-center">
<p className="text-gray-400 text-sm">IA Usada</p>
<p className="text-2xl font-bold text-[#D4AF37]">{sugerencias.length}</p>
</div>
)}

</div>

{/* TABS */}

<div className="flex flex-wrap gap-3 mb-8">

<button 
onClick={()=>setTab("reservas")} 
className={`px-4 py-2 rounded text-sm md:text-base ${tab==="reservas" ? "bg-[#D4AF37] text-black" : "bg-gray-800 text-white"}`}
>
Reservas
</button>

<button 
onClick={()=>setTab("historial")} 
className={`px-4 py-2 rounded text-sm md:text-base ${tab==="historial" ? "bg-[#D4AF37] text-black" : "bg-gray-800 text-white"}`}
>
Historial
</button>

{rol === "admin" && (
<>
<button 
onClick={()=>setTab("servicios")} 
className={`px-4 py-2 rounded text-sm md:text-base ${tab==="servicios" ? "bg-[#D4AF37] text-black" : "bg-gray-800 text-white"}`}
>
Servicios
</button>

<button 
onClick={()=>setTab("ia")} 
className={`px-4 py-2 rounded text-sm md:text-base ${tab==="ia" ? "bg-[#D4AF37] text-black" : "bg-gray-800 text-white"}`}
>
IA
</button>

<button 
onClick={()=>setTab("usuarios")} 
className={`px-4 py-2 rounded text-sm md:text-base ${tab==="usuarios" ? "bg-[#D4AF37] text-black" : "bg-gray-800 text-white"}`}
>
Usuarios
</button>

<button 
onClick={()=>setTab("reportes")} 
className={`px-4 py-2 rounded text-sm md:text-base ${tab==="reportes" ? "bg-[#D4AF37] text-black" : "bg-gray-800 text-white"}`}
>
Reportes
</button>
</>
)}

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
<p>
  <b>Estado servicio:</b>{" "}
  {res.estadoServicio === "cliente_llego"
    ? "Cliente llegó"
    : res.estadoServicio === "en_servicio"
    ? "En servicio"
    : res.estadoServicio === "finalizada"
    ? "Finalizado"
    : "Pendiente"}
</p>
<span className={`px-2 py-1 rounded text-sm
${res.status==="confirmada" ? "bg-green-700" :
res.status==="cancelada_cliente" ? "bg-yellow-700" :
res.status==="cancelada_admin" ? "bg-red-700" :
"bg-gray-700"}`}>

{res.status==="cancelada_cliente"
? "Cancelada por cliente"
: res.status==="cancelada_admin"
? "Cancelada por admin"
: res.status}

</span>

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
<button
onClick={()=>cancelarReservaAdminPanel(res.id)}
className="bg-red-700 px-3 py-1 rounded text-sm"
>
Cancelar
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
{/* reportes */}
{tab==="reportes" && rol==="admin" &&(

<div className="space-y-10">

{/* INGRESOS */}
<div className="bg-gray-900 p-6 rounded text-center">
<h2 className="text-xl font-bold text-[#D4AF37] mb-2">Ingresos Totales</h2>
<p className="text-4xl font-bold">Gs {totalIngresos}</p>
</div>

{/* SERVICIOS */}
<div className="bg-gray-900 p-6 rounded">
<h2 className="text-xl font-bold mb-4">Servicios más usados</h2>

<ResponsiveContainer width="100%" height={300}>
  <BarChart data={serviciosChart}>
    <XAxis dataKey="name" stroke="#ccc"/>
    <YAxis stroke="#ccc"/>
    <Tooltip />
    <Bar dataKey="value" fill="#D4AF37" />
  </BarChart>
</ResponsiveContainer>

</div>

{/* BARBEROS */}
<div className="bg-gray-900 p-6 rounded">
<h2 className="text-xl font-bold mb-4">Reservas por barbero</h2>

<ResponsiveContainer width="100%" height={300}>
  <PieChart>
    <Pie
      data={barberosChart}
      dataKey="value"
      nameKey="name"
      cx="50%"
      cy="50%"
      outerRadius={100}
      label
    >
      {barberosChart.map((entry, index) => (
        <Cell key={index} fill={COLORS[index % COLORS.length]} />
      ))}
    </Pie>
    <Tooltip />
  </PieChart>
</ResponsiveContainer>

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
onClick={async ()=>{
  if(window.confirm("¿Eliminar usuario completamente? Esta acción no se puede deshacer.")){

    try{

      await deleteUserAdmin({ uid: user.id }); // 🔥 cloud function

      alert("Usuario eliminado correctamente");
      cargarDatos();

    }catch(err){
      console.error(err);
      alert("Error al eliminar usuario");
    }

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