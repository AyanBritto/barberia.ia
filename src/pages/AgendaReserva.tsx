import { useEffect, useState } from "react";
import { getReservas } from "../service/reservaService";

const horarios = [
"09:00",
"10:00",
"11:00",
"12:00",
"13:00",
"14:00",
"15:00",
"16:00",
"17:00",
"18:00"
];

export default function AgendaReservas(){

const [reservas,setReservas] = useState<any[]>([]);

useEffect(()=>{

cargar();

},[]);

const cargar = async()=>{

const data = await getReservas();

setReservas(data);

};

const reservaHora = (hora:string)=>{

return reservas.find(r=>r.horario === hora);

};

return(

<div className="bg-gray-900 p-6 rounded-xl mb-10">

<h2 className="text-xl font-bold text-[#D4AF37] mb-6">
Agenda del Día
</h2>

<div className="space-y-3">

{horarios.map(hora=>{

const reserva = reservaHora(hora);

return(

<div
key={hora}
className="flex justify-between items-center bg-black p-4 rounded-lg border border-gray-800"
>

<div className="text-[#D4AF37] font-bold">
{hora}
</div>

{reserva ? (

<div className="text-white">

{reserva.clienteNombre} — {reserva.servicio}

</div>

) : (

<div className="text-gray-500">
Disponible
</div>

)}

</div>

);

})}

</div>

</div>

);

}