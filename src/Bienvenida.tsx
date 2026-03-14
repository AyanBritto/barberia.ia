// src/Bienvenida.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";
import { useState } from "react";

export default function Bienvenida() {

const navigate = useNavigate();
const { user, isAdmin, loading, logout, deleteAccount } = useAuth();

const [menuOpen,setMenuOpen] = useState(false);

const handleDeleteAccount = async () => {

if(!window.confirm(
"⚠️ ¿Seguro que quieres eliminar tu cuenta? Esta acción no se puede deshacer."
)) return;

try{

await deleteAccount();
alert("Cuenta eliminada correctamente");
navigate("/");

}catch(err){

console.error(err);
alert("Error al eliminar la cuenta");

}

};

return(

<div className="min-h-screen bg-black-rich text-off-white font-montserrat flex flex-col">

{/* HEADER */}

<header className="fixed top-0 left-0 w-full z-50 bg-black-rich/95 backdrop-blur-sm border-b border-white/5">

<div className="max-w-7xl mx-auto px-4 md:px-6 h-20 md:h-24 flex items-center justify-between">

{/* LOGO */}

<button
onClick={()=>navigate("/")}
className="flex items-center gap-4 group"
>

<h1 className="text-lg md:text-2xl font-playfair font-bold text-white tracking-widest uppercase group-hover:text-gold transition-colors">
Barber-IA
<span className="text-gold group-hover:text-white transition-colors">.</span>
</h1>

</button>

{/* BOTON MENU MOVIL */}

<button
onClick={()=>setMenuOpen(!menuOpen)}
className="md:hidden text-white text-2xl"
>
☰
</button>

{/* MENU DESKTOP */}

{!loading && (

<div className="hidden md:flex items-center gap-4">

{user ? (

isAdmin ? (

<>

{/* Avatar */}

{user.photoURL ? (
<img
src={user.photoURL}
className="w-10 h-10 rounded-full border-2 border-[#d4af37] object-cover"
/>
) : (
<div className="w-10 h-10 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold">
{user.email?.[0]?.toUpperCase()}
</div>
)}

<button
onClick={()=>navigate("/admin")}
className="text-sm hover:text-blue-400 uppercase tracking-widest px-4 py-2"
>
Panel Admin
</button>

<button
onClick={logout}
className="text-sm hover:text-red-400 uppercase tracking-widest px-4 py-2"
>
Cerrar Sesión
</button>

<button
onClick={handleDeleteAccount}
className="text-sm text-red-400 uppercase tracking-widest px-4 py-2"
>
Eliminar Cuenta
</button>

</>

):( 

<>

{/* Avatar */}

{user.photoURL ? (
<img
src={user.photoURL}
className="w-10 h-10 rounded-full border-2 border-[#d4af37] object-cover"
/>
):( 
<div className="w-10 h-10 rounded-full bg-[#d4af37] text-black flex items-center justify-center font-bold">
{user.email?.[0]?.toUpperCase()}
</div>
)}

<button
onClick={()=>navigate("/mis-reservas")}
className="text-sm hover:text-gold uppercase tracking-widest px-4 py-2"
>
Mis Reservas
</button>

<button
onClick={()=>navigate("/reserva")}
className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b4941f] text-black rounded-full font-bold"
>
Reservar
</button>

<button
onClick={logout}
className="text-sm hover:text-red-400 uppercase tracking-widest px-4 py-2"
>
Cerrar Sesión
</button>

<button
onClick={handleDeleteAccount}
className="text-red-400"
>
Eliminar Cuenta
</button>
</>

)

):( 

<>

<button
onClick={()=>navigate("/iniciarsesion")}
className="text-sm hover:text-gold uppercase tracking-widest px-4 py-2"
>
Iniciar Sesión
</button>

<button
onClick={()=>navigate("/reserva")}
className="px-6 py-3 bg-gradient-to-r from-[#d4af37] to-[#b4941f] text-black rounded-full font-bold"
>
Reservar
</button>

</>

)}

</div>

)}

</div>

{/* MENU MOVIL */}

{menuOpen && (

<div className="md:hidden bg-black border-t border-white/10 px-6 py-6 flex flex-col gap-4">

{user ? (

isAdmin ? (

<>

<button onClick={()=>navigate("/admin")}>
Panel Admin
</button>

<button onClick={logout}>
Cerrar Sesión
</button>

<button
onClick={handleDeleteAccount}
className="text-red-400"
>
Eliminar Cuenta
</button>

</>

):( 

<>

<button onClick={()=>navigate("/mis-reservas")}>
Mis Reservas
</button>

<button onClick={()=>navigate("/reserva")}>
Reservar
</button>

<button onClick={logout}>
Cerrar Sesión
</button>

<button
onClick={handleDeleteAccount}
className="text-red-400"
>
Eliminar Cuenta
</button>

</>

)

):( 

<>

<button onClick={()=>navigate("/iniciarsesion")}>
Iniciar Sesión
</button>

<button onClick={()=>navigate("/reserva")}>
Reservar
</button>

</>

)}

</div>

)}

</header>

{/* HERO */}

<section className="relative min-h-screen flex items-center justify-center pt-24">

<div className="absolute inset-0">

<img
src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=2070&q=80"
className="w-full h-full object-cover opacity-40 grayscale"
/>

</div>

<div className="relative text-center max-w-4xl px-6">

<p className="text-gold tracking-[0.3em] uppercase mb-4 text-sm">
Est. 2026
</p>

<h2 className="text-3xl sm:text-5xl md:text-7xl font-playfair font-bold text-white mb-8">
El Arte de la <br/>
<span className="italic text-gold">
Masculinidad
</span>
</h2>

<p className="text-gray-300 text-base md:text-xl max-w-2xl mx-auto mb-12">
Experimenta el equilibrio perfecto entre la barbería tradicional y el estilo moderno.
</p>

<button
onClick={()=>navigate("/reserva")}
className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b4941f] text-black font-bold rounded-full"
>
Agendar Cita
</button>

</div>

</section>

</div>

);

}