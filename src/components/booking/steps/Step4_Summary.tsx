import { useState, useEffect } from "react";
import { CheckCircle, Calendar, Scissors, Phone, User, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { useAuth } from "../../../hooks/useAuth";
import { crearReserva } from "../../../service/reservaService";

interface Props {
bookingData: any;
setBookingData: (val: any) => void;
onBack: () => void;
}

export default function Step4_Summary({ bookingData, setBookingData, onBack }: Props) {

const navigate = useNavigate();
const { user } = useAuth();
const [loading, setLoading] = useState(false);

const getInitialName = () => {

if (bookingData.client?.name) return bookingData.client.name;

const savedName = localStorage.getItem('userName');
if (savedName) return savedName;

if (user?.displayName) return user.displayName;

if (user?.email) return user.email.split('@')[0];

return "";

};

const [clientName, setClientName] = useState(getInitialName());

const [clientPhone, setClientPhone] = useState(
bookingData.client?.phone || localStorage.getItem('userPhone') || ""
);

useEffect(() => {

if (clientName) localStorage.setItem('userName', clientName);
if (clientPhone) localStorage.setItem('userPhone', clientPhone);

setBookingData((prev: any) => ({
...prev,
client: {
...prev.client,
name: clientName,
phone: clientPhone
}
}));

}, [clientName, clientPhone, setBookingData]);

const confirmBooking = async () => {

setLoading(true);

try {

const isFromIA = bookingData.aiAnalysis?.suggestion;

const finalName =
clientName || (user?.email ? user.email.split('@')[0] : "Cliente");

const finalPhone = clientPhone || "09xx...";

/* RESERVA */

const reserva = {

  userId: user?.uid || null,

  email: user?.email || null,

  clienteNombre: finalName,
  telefono: finalPhone,

  barbero: bookingData.appointment?.barber?.name || "Alejandro",
  barberoEmail: bookingData.appointment?.barber?.email || null,
  barberoId: bookingData.appointment?.barber?.uid || null,

  servicio: isFromIA
    ? "Corte con IA"
    : (bookingData.service?.nombre || "Corte Clásico"),

  precio: isFromIA
    ? 85000
    : typeof bookingData.service?.precio === "string"
      ? Number(bookingData.service.precio.replace(/\D/g, ""))
      : bookingData.service?.precio || 0,

  corteRecomendado: isFromIA
    ? bookingData.aiAnalysis?.suggestion?.nombre || null
    : null,



/* IMAGEN DEL CORTE IA */

corteImagen: isFromIA
? bookingData.aiAnalysis.suggestion.imagen
: null,

fecha: bookingData.appointment?.date || new Date().toISOString(),

horario: bookingData.appointment?.time || "10:00",

status: "confirmada",

createdAt: new Date()

};
if (!user?.email) {
  alert("Error: el usuario no tiene email");
  return;
}

await crearReserva(reserva);

/* CONFETTI */

const duration = 3000;
const end = Date.now() + duration;

const frame = () => {

confetti({
particleCount: 5,
angle: 60,
spread: 55,
origin: { x: 0 },
colors: ['#D4AF37', '#ffffff']
});

confetti({
particleCount: 5,
angle: 120,
spread: 55,
origin: { x: 1 },
colors: ['#D4AF37', '#ffffff']
});

if (Date.now() < end) requestAnimationFrame(frame);

};

frame();

setTimeout(() => {

alert("¡Reserva Confirmada con Éxito!");

navigate("/mis-reservas");

}, 1500);

} catch (err) {

console.error("Error:", err);
alert("Hubo un error. Intenta nuevamente.");

} finally {

setLoading(false);

}

};

const isFromIA = bookingData.aiAnalysis?.suggestion;

const serviceName = isFromIA
? "Corte con IA"
: (bookingData.service?.nombre || "Corte Clásico");

const servicePrice = isFromIA
? "85.000 Gs"
: (bookingData.service?.precio || "60.000 Gs");

return (

<div className="max-w-2xl mx-auto animate-fade-in px-2 md:px-4">

<div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 w-full mb-2">

<h2 className="text-2xl md:text-3xl font-bold text-[#D4AF37] font-serif">
Confirmación Final
</h2>

{user && (
<div className="relative">

{user.photoURL ? (
<img
src={user.photoURL}
alt="Perfil"
className="w-10 h-10 rounded-full border-2 border-[#D4AF37] shadow-lg object-cover"
/>
) : (
<div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black font-bold text-sm">
{user.displayName?.[0]?.toUpperCase() ||
user.email?.split('@')[0]?.[0]?.toUpperCase() ||
'?'}
</div>
)}

</div>
)}

</div>

<p className="text-gray-400 text-center mb-8">
Revisa los detalles de tu cita.
</p>

<div className="bg-[#1e1e1e] p-6 md:p-8 rounded-3xl border border-[#D4AF37]/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] mb-10">

<div className="grid grid-cols-1 sm:grid-cols-2 gap-y-6 gap-x-4">

<div className="p-4 rounded-xl bg-black/20 border border-white/5">

<p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
<Scissors size={12} className="text-[#D4AF37]" /> Servicio
</p>

<p className="font-semibold text-white">
{serviceName}
</p>

<p className="text-[#D4AF37] text-sm mt-1">
{servicePrice}
</p>

</div>

<div className="p-4 rounded-xl bg-black/20 border border-white/5">

<p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
<Calendar size={12} className="text-[#D4AF37]" /> Fecha y Hora
</p>

<p className="font-semibold text-white">
{bookingData.appointment?.date} a las {bookingData.appointment?.time}
</p>

</div>

</div>

</div>

<div className="space-y-6 mb-10">

<div>

<label className="block text-gray-400 text-sm mb-2 ml-1">
Nombre Completo
</label>

<input
type="text"
value={clientName}
onChange={(e) => setClientName(e.target.value)}
className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl p-3 md:p-4 text-white"
/>

</div>

<div>

<label className="block text-gray-400 text-sm mb-2 ml-1">
Teléfono / WhatsApp
</label>

<input
type="text"
value={clientPhone}
onChange={(e) => setClientPhone(e.target.value)}
className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl p-3 md:p-4 text-white"
/>

</div>

</div>

<div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-4 border-t border-white/5 pt-6">

<button
onClick={onBack}
className="text-gray-500 hover:text-white px-8 py-4 flex items-center gap-2"
>
<ChevronLeft size={24} /> Atrás
</button>

<button
onClick={confirmBooking}
disabled={loading}
className="px-8 md:px-12 py-4 md:py-5 rounded-full font-bold bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black"
>
{loading ? "Procesando..." : <>Confirmar Reserva <CheckCircle size={20} /></>}
</button>

</div>

</div>

);

}