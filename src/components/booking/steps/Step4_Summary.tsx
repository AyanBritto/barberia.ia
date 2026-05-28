import { useState, useEffect } from "react";
import { CheckCircle, Calendar, Scissors, Phone, User, ChevronLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import confetti from "canvas-confetti";
import { useAuth } from "../../../hooks/useAuth";
<<<<<<< HEAD

interface Props {
    bookingData: any;
    setBookingData: (val: any) => void;
    onBack: () => void;
}

export default function Step4_Summary({ bookingData, setBookingData, onBack }: Props) {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [loading, setLoading] = useState(false);

    const confirmBooking = async () => {
        setLoading(true);
        
        try {
            // Detectar si viene del flujo de IA
            const isFromIA = bookingData.aiAnalysis?.suggestion;
            
            // Datos del cliente (prioriza lo que ya existe)
            const clientName = bookingData.client?.name || user?.displayName || "Cliente";
            const clientPhone = bookingData.client?.phone || "09xx...";

        // Crear reserva
const newReserva = {
    id: crypto.randomUUID(),
    userId: user?.uid || null,
    barbero: bookingData.appointment?.barber?.name || "Alejandro",
    servicio: isFromIA 
        ? "Corte con IA" 
        : (bookingData.service?.name || "Corte Clásico"),
    corteRecomendado: isFromIA ? bookingData.aiAnalysis.suggestion.nombre : null,
    corteImagen: isFromIA ? bookingData.aiAnalysis.suggestion.imagen : null, 
    // ✅ GUARDAR FECHA Y HORA COMPLETAS
    fecha: bookingData.appointment?.date || new Date().toISOString(), // Fecha completa
    horario: bookingData.appointment?.time || "10:00 AM", // Solo la hora
    cliente: {
        nombre: clientName,
        cedula: "DEMO-ID",
        celular: clientPhone
    },
    createdAt: { seconds: Date.now() / 1000 },
    status: "confirmada"
};

            // Guardar en localStorage
            const existing = JSON.parse(localStorage.getItem("reservas") || "[]");
            localStorage.setItem("reservas", JSON.stringify([newReserva, ...existing]));

            // Confetti
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
            setLoading(false); // ✅ Siempre se ejecuta
        }
    };

    // Determinar qué mostrar según el flujo
    const isFromIA = bookingData.aiAnalysis?.suggestion;
    const serviceName = isFromIA 
        ? "Corte con IA" 
        : (bookingData.service?.name || "Corte Clásico");
    const servicePrice = isFromIA 
        ? "85.000 Gs" 
        : (bookingData.service?.precio || "60.000 Gs");

    return (
        <div className="max-w-2xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-bold text-[#D4AF37] mb-2 text-center font-serif">Confirmación Final</h2>
            <p className="text-gray-400 text-center mb-8">Revisa los detalles de tu cita.</p>

            {/* Summary Card */}
            <div className="bg-[#1e1e1e] p-8 rounded-3xl border border-[#D4AF37]/20 shadow-[0_20px_50px_-12px_rgba(0,0,0,0.5)] mb-10 relative overflow-hidden">
                {/* Decorative Gold Line */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-[#D4AF37] to-transparent"></div>

                <div className="flex flex-col md:flex-row items-center gap-6 border-b border-white/5 pb-6 mb-6">
                    <div className="relative">
                        <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-[#121212] shadow-[0_0_0_2px_#D4AF37]">
                            {isFromIA ? (
                                <div className="w-full h-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center">
                                    <Scissors size={32} className="text-black" />
                                </div>
                            ) : (
                                <img 
                                    src={bookingData.appointment?.barber?.img || "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=400&q=80"} 
                                    alt="Barber" 
                                    className="w-full h-full object-cover" 
                                />
                            )}
                        </div>
                        <div className="absolute bottom-0 right-0 bg-[#D4AF37] rounded-full p-1.5 border-2 border-[#121212]">
                            <Scissors size={14} className="text-black" />
                        </div>
                    </div>
                    <div className="text-center md:text-left">
                        <p className="text-[#D4AF37] text-xs font-bold uppercase tracking-widest mb-1">Tu Profesional</p>
                        <p className="text-2xl font-bold text-white">
                            {isFromIA ? "IA Athenea" : (bookingData.appointment?.barber?.name || "Alejandro")}
                        </p>
                        <p className="text-gray-400 text-sm">Barbería Athenea</p>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-y-6 gap-x-4">
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
                        <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
                            <Scissors size={12} className="text-[#D4AF37]" /> Servicio
                        </p>
                        <p className="font-semibold text-white">{serviceName}</p>
                        <p className="text-[#D4AF37] text-sm mt-1">{servicePrice}</p>
                    </div>
                    <div className="p-4 rounded-xl bg-black/20 border border-white/5">
    <p className="text-gray-500 text-xs uppercase tracking-wider mb-1 flex items-center gap-2">
        <Calendar size={12} className="text-[#D4AF37]" /> Fecha y Hora
    </p>
    <p className="font-semibold text-white">
        {bookingData.appointment?.date 
            ? new Date(bookingData.appointment.date).toLocaleDateString("es-PY", {
                day: "2-digit",
                month: "2-digit", 
                year: "numeric"
              }) + ` a las ${bookingData.appointment.time || "10:00 AM"}`
            : "Hoy a las " + (bookingData.appointment?.time || "10:00 AM")
        }
    </p>
    <p className="text-gray-400 text-sm mt-1">Estimada: 45 min</p>
</div>
                </div>
            </div>

            {/* Form */}
            <div className="space-y-6 mb-10">
                <div>
                    <label className="block text-gray-400 text-sm mb-2 ml-1">Nombre Completo</label>
                    <div className="relative">
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            value={bookingData.client?.name || ""}
                            onChange={(e) => setBookingData((prev: any) => ({ 
                                ...prev, 
                                client: { ...prev.client, name: e.target.value } 
                            }))}
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all placeholder-gray-600"
                            placeholder="Ingresa tu nombre"
                        />
                    </div>
                </div>
                <div>
                    <label className="block text-gray-400 text-sm mb-2 ml-1">Teléfono / WhatsApp</label>
                    <div className="relative">
                        <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                        <input
                            type="text"
                            value={bookingData.client?.phone || ""}
                            onChange={(e) => setBookingData((prev: any) => ({ 
                                ...prev, 
                                client: { ...prev.client, phone: e.target.value } 
                            }))}
                            className="w-full bg-[#1e1e1e] border border-white/10 rounded-xl p-4 pl-12 text-white focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] focus:outline-none transition-all placeholder-gray-600"
                            placeholder="09xx..."
                        />
                    </div>
                </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between items-center border-t border-white/5 pt-6">
                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-white px-8 py-4 font-medium transition-colors flex items-center gap-2 group min-h-[50px]"
                >
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> Atrás
                </button>
                <button
                    onClick={confirmBooking}
                    disabled={loading || (
                        !bookingData.client?.name && 
                        !user?.displayName // Si hay usuario logueado, no requiere nombre
                    )}
                    className={`px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all flex items-center gap-2 min-h-[60px] lg:min-w-[250px] justify-center
                        ${(
                            loading || 
                            (!bookingData.client?.name && !user?.displayName)
                        ) 
                            ? "bg-[#2a2a2a] text-gray-600 cursor-not-allowed"
                            : "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black hover:shadow-[0_0_30px_rgba(212,175,55,0.4)] transform hover:-translate-y-1"
                        }
                    `}
                >
                    {loading ? "Procesando..." : <>Confirmar Reserva <CheckCircle size={20} /></>}
                </button>
            </div>
        </div>
    );
=======
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

>>>>>>> 21d5d75 (cambios en admin y web responsive)
}