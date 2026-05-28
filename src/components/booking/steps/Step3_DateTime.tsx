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

const fechaSeleccionada = bookingData.appointment?.date || localDate;

const reservas = await getReservasPorFecha(
  fechaSeleccionada,
  bookingData.appointment.barber.name
);
if (!bookingData.appointment?.date) {
  setBookingData((prev:any)=>({
    ...prev,
    appointment:{
      ...prev.appointment,
      date: localDate
    }
  }));
}
const ocupados = reservas
.filter((r:any)=> r.status==="confirmada")
.map((r:any)=> r.horario);

setReservedTimes(ocupados);

}catch(error){

console.error("Error cargando reservas",error);

}

};

cargarReservas();

},[bookingData.appointment?.barber, bookingData.appointment?.date]);


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
      date: selectedDate 
    }
  }));

};


const getInitial = ()=>{
 
if(user?.displayName) return user.displayName[0]?.toUpperCase() || '?';
if(user?.email) return user.email.split('@')[0][0]?.toUpperCase() || '?';

return '?';
};
const selectedDate = bookingData.appointment?.date || localDate;
const isPastTime = (time:string) => {

  const now = new Date();

  // fecha seleccionada
  const [year, month, day] = selectedDate.split("-");
  const [hours, minutes] = time.split(":");

  const selectedDateTime = new Date(
    Number(year),
    Number(month) - 1,
    Number(day),
    Number(hours),
    Number(minutes)
  );

  return selectedDateTime < now;

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

<div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-8">

<h2 className="text-2xl font-bold text-[#D4AF37] flex items-center gap-2">
  <Clock/>
  Disponibilidad
</h2>

<input
type="date"
value={bookingData.appointment?.date || localDate}
min={localDate}
onChange={(e)=>{
  setBookingData((prev:any)=>({
    ...prev,
    appointment:{
      ...prev.appointment,
      date: e.target.value,
      time: null
    }
  }));
}}
className="bg-[#1e1e1e] text-white border border-[#D4AF37] px-4 py-2 rounded-lg"
/>

</div>

<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 max-w-3xl mx-auto">

{timeSlots.map((time)=>{

const isReserved = reservedTimes.includes(time);
const isPast = isPastTime(time);
const isSelected = bookingData.appointment?.time===time;
const isDisabled = isReserved || isPast;

return(

<button
key={time}
onClick={()=>!isDisabled && handleTimeSelect(time)}
disabled={isDisabled}
className={`
relative py-3 rounded-xl font-semibold text-sm md:text-base border transition-all duration-200

${isReserved
? "bg-red-900/70 text-red-300 border-red-700"
: isPast
? "bg-gray-800/60 text-gray-500 border-gray-700 cursor-not-allowed"
: isSelected
? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-lg scale-105"
: "bg-[#1e1e1e] text-gray-300 border-white/10 hover:border-[#D4AF37] hover:scale-105"}
`}
>
{time}

{/* LABEL */}
{isReserved && (
  <span className="block text-[10px] mt-1 text-red-400">
    Ocupado
  </span>
)}

{isPast && (
  <span className="block text-[10px] mt-1 text-gray-500">
    Pasado
  </span>
)}

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
