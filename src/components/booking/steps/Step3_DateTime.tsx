import { motion } from "framer-motion";
import { barbers } from "../../../data/mockData";
import { Clock, ChevronRight, ChevronLeft } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { getReservasPorFecha } from "../../../service/reservaService";
import { useEffect, useState } from "react";

interface Props {
bookingData: any;
setBookingData: (val: any) => void;
onNext: () => void;
onBack: () => void;
}

export default function Step3_DateTime({ bookingData, setBookingData, onNext, onBack }: Props){

const { user } = useAuth();

const timeSlots = [
"09:00",
"10:00",
"11:00",
"13:00",
"14:00",
"15:00",
"16:00",
"17:00",
"18:00"
];

const [reservedTimes,setReservedTimes] = useState<string[]>([]);

// FECHA LOCAL
const today = new Date();
const year = today.getFullYear();
const month = String(today.getMonth()+1).padStart(2,'0');
const day = String(today.getDate()).padStart(2,'0');

const localDate = `${year}-${month}-${day}`;


// 🔥 CARGAR RESERVAS
useEffect(()=>{

const cargarReservas = async ()=>{

try{

if(!bookingData.appointment?.barber) return;

const reservas = await getReservasPorFecha(
localDate,
bookingData.appointment.barber.name
);

const ocupados = reservas
.filter((r:any)=> r.status==="confirmada")
.map((r:any)=> r.horario);

setReservedTimes(ocupados);

}catch(error){

console.error("Error cargando reservas",error);

}

};

cargarReservas();

},[bookingData.appointment?.barber]);


const handleBarberSelect = (barber:any)=>{

setBookingData((prev:any)=>({
...prev,
appointment:{
...prev.appointment,
barber
}
}));

};


const handleTimeSelect = (time:string)=>{

setBookingData((prev:any)=>({
...prev,
appointment:{
...prev.appointment,
time,
date:localDate
}
}));

};


const getInitial = ()=>{
if(user?.displayName) return user.displayName[0]?.toUpperCase() || '?';
if(user?.email) return user.email.split('@')[0][0]?.toUpperCase() || '?';
return '?';
};


return(

<div className="space-y-10 md:space-y-12 animate-fade-in max-w-4xl mx-auto px-2">


{/* BARBEROS */}

<section>

<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">

<div>

<h2 className="text-xl md:text-2xl font-bold text-[#D4AF37] font-serif">
Selecciona tu Profesional
</h2>

<p className="text-gray-400">
Expertos en estilo clásico y moderno.
</p>

</div>

{user && (

<div>

{user.photoURL ? (

<img
src={user.photoURL}
className="w-10 h-10 rounded-full border-2 border-[#D4AF37]"
/>

):(

<div className="w-10 h-10 rounded-full bg-[#D4AF37] text-black flex items-center justify-center font-bold">
{getInitial()}
</div>

)}

</div>

)}

</div>


<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">

{barbers.map((b)=>{

const isSelected = bookingData.appointment?.barber?.id===b.id;

return(

<motion.div
key={b.id}
onClick={()=>handleBarberSelect(b)}
whileHover={{y:-5}}
className={`cursor-pointer rounded-xl overflow-hidden border-2 bg-[#1e1e1e]

${isSelected
?"border-[#D4AF37]"
:"border-white/5 hover:border-[#D4AF37]/40"}`}
>

<img
src={b.img}
className="w-full h-48 md:h-64 object-cover"
/>

<div className="p-4 text-center">

<h3 className="text-white font-bold">
{b.name}
</h3>

<p className="text-[#D4AF37] text-xs">
Master Barber
</p>

</div>

</motion.div>

);

})}

</div>

</section>


{/* HORARIOS */}

{bookingData.appointment?.barber &&(

<section className="border-t border-white/10 pt-10">

<div className="text-center mb-8">

<h2 className="text-2xl font-bold text-[#D4AF37] flex justify-center gap-2">

<Clock/>

Disponibilidad

</h2>

</div>


<div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-w-2xl mx-auto">

{timeSlots.map((time)=>{

const isReserved = reservedTimes.includes(time);
const isSelected = bookingData.appointment?.time===time;

return(

<button
key={time}
onClick={()=>!isReserved && handleTimeSelect(time)}
disabled={isReserved}
className={`py-2 md:py-3 rounded-xl font-bold border text-sm md:text-base

${isReserved
?"bg-red-900 text-red-400 border-red-700"
:isSelected
?"bg-[#D4AF37] text-black border-[#D4AF37]"
:"bg-[#252525] text-gray-400 border-white/5 hover:border-[#D4AF37]"}
`}
>

{isReserved ? "Ocupado" : time}

</button>

);

})}

</div>

</section>

)}


{/* BOTONES */}

<div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-10 border-t border-white/5">

<button
onClick={onBack}
className="text-gray-500 flex items-center gap-2"
>

<ChevronLeft/>

Atrás

</button>


<button
onClick={onNext}
disabled={!bookingData.appointment?.time}
className={`px-8 md:px-10 py-3 md:py-4 rounded-full font-bold

${bookingData.appointment?.time
?"bg-[#D4AF37] text-black"
:"bg-gray-800 text-gray-500"}`}

>

Siguiente

<ChevronRight/>

</button>

</div>

</div>

);

}
