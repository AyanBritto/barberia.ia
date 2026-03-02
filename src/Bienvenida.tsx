// src/Bienvenida.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "./hooks/useAuth";

export default function Bienvenida() {
  const navigate = useNavigate();
  const { user, isAdmin, loading, logout } = useAuth();

  return (
    <div className="min-h-screen bg-black-rich text-off-white font-montserrat flex flex-col">
      {/* HEADER */}
      <header className="fixed top-0 left-0 w-full z-50 bg-black-rich/95 backdrop-blur-sm border-b border-white/5 transition-all duration-300">
        <div className="max-w-7xl mx-auto px-6 h-24 flex items-center justify-between">
          <button onClick={() => navigate("/")} className="flex items-center gap-4 group">
            <h1 className="text-2xl font-playfair font-bold text-white tracking-widest uppercase group-hover:text-gold transition-colors">
              BarberIA<span className="text-gold group-hover:text-white transition-colors">.</span>
            </h1>
          </button>

          {!loading && (
            <div className="flex items-center gap-4">
              {user ? (
                isAdmin ? (
                  //  Solo para admins: Panel Admin + Cerrar Sesión
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate("/admin")}
                      className="text-sm font-medium hover:text-blue-400 transition-colors uppercase tracking-widest px-6 py-4 rounded-lg hover:bg-white/5 active:bg-white/10 min-h-[50px] flex items-center"
                    >
                      Panel Admin
                    </button>
                    <button
                      onClick={logout}
                      className="text-sm font-medium hover:text-red-400 transition-colors uppercase tracking-widest px-6 py-4 rounded-lg hover:bg-white/5 active:bg-white/10 min-h-[50px] flex items-center"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  //  Para usuarios normales: Mis Reservas + Cerrar Sesión + Reservar
                  <div className="flex items-center gap-4">
                    <button
                      onClick={() => navigate("/mis-reservas")}
                      className="text-sm font-medium hover:text-gold transition-colors uppercase tracking-widest px-6 py-4 rounded-lg hover:bg-white/5 active:bg-white/10 min-h-[50px] flex items-center"
                    >
                      Mis Reservas
                    </button>
                    <button
                      onClick={logout}
                      className="text-sm font-medium hover:text-red-400 transition-colors uppercase tracking-widest px-6 py-4 rounded-lg hover:bg-white/5 active:bg-white/10 min-h-[50px] flex items-center"
                    >
                      Cerrar Sesión
                    </button>
                    <button
                      onClick={() => navigate("/reserva")}
                      className="hidden sm:flex px-8 py-3 text-sm min-h-[50px] items-center uppercase tracking-widest bg-gradient-to-r from-[#d4af37] to-[#b4941f] text-black font-bold rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#d4af37]/40 active:translate-y-0 active:shadow-md border border-[#d4af37]/50 shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                    >
                      Reservar
                    </button>
                  </div>
                )
              ) : (
                //  Usuario no autenticado: Iniciar Sesión + Reservar
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => navigate("/iniciarsesion")}
                    className="text-sm font-medium hover:text-gold transition-colors uppercase tracking-widest px-6 py-4 rounded-lg hover:bg-white/5 active:bg-white/10 min-h-[50px] flex items-center"
                  >
                    Iniciar Sesión
                  </button>
                  <button
                    onClick={() => navigate("/reserva")}
                    className="hidden sm:flex px-8 py-3 text-sm min-h-[50px] items-center uppercase tracking-widest bg-gradient-to-r from-[#d4af37] to-[#b4941f] text-black font-bold rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#d4af37]/40 active:translate-y-0 active:shadow-md border border-[#d4af37]/50 shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
                  >
                    Reservar
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* HERO SECTION */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=2070&q=80"
            alt="Barber Shop Atmosphere"
            className="w-full h-full object-cover opacity-40 grayscale"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black-rich/60 via-black-rich/40 to-black-rich"></div>
        </div>

        <div className="relative z-10 text-center max-w-4xl px-6">
          <p className="text-gold tracking-[0.3em] uppercase mb-4 text-sm md:text-base animate-fade-in">Est. 2026</p>
          <h2 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-bold text-white mb-8 leading-tight animate-fade-in-up">
            El Arte de la <br /> <span className="italic text-gold">Masculinidad</span>
          </h2>
          <p className="text-gray-text text-lg md:text-xl max-w-2xl mx-auto mb-12 font-light leading-relaxed animate-fade-in-up delay-100">
            Experimenta el equilibrio perfecto entre la barbería tradicional y el estilo moderno.
            Cortes de precisión, afeitados clásicos y un ambiente exclusivo.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center animate-fade-in-up delay-200">
            <button
              onClick={() => navigate("/reserva")}
              className="px-8 py-4 bg-gradient-to-r from-[#d4af37] to-[#b4941f] text-black font-bold rounded-full transition-all duration-300 transform hover:-translate-y-1 hover:shadow-lg hover:shadow-[#d4af37]/40 active:translate-y-0 active:shadow-md border border-[#d4af37]/50 shadow-[0_4px_15px_rgba(212,175,55,0.3)]"
            >
              Agendar Cita
            </button>
            {/*  Botón "Ver Servicios" hace scroll a #servicios */}
            <button
              onClick={() => {
                const element = document.getElementById("servicios");
                if (element) {
                  element.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="bg-transparent border-2 border-[#d4af37] text-[#d4af37] px-8 py-4 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:bg-[#d4af37] hover:text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              Ver Servicios
            </button>
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      {/*  Sección con id="servicios" para el scroll */}
      <section id="servicios" className="py-24 bg-charcoal">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h3 className="text-3xl md:text-4xl font-playfair text-white mb-4">Nuestros Servicios</h3>
            <div className="w-20 h-1 bg-gold mx-auto"></div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { title: "Corte Clásico", desc: "Tijera y máquina con acabado a navaja.", price: "60.000 Gs", img: "https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=800&q=80" },
              { title: "Barba & Ritual", desc: "Perfilado, toalla caliente y aceites.", price: "40.000 Gs", img: "/barba-ritual.png" },
              { title: "Experiencia Total", desc: "Corte + Barba + Masaje capilar.", price: "90.000 Gs", img: "https://images.unsplash.com/photo-1585747860715-2ba37e788b70?auto=format&fit=crop&w=800&q=80" }
            ].map((service, idx) => (
              <div key={idx} className="group cursor-pointer">
                <div className="relative h-80 mb-6 overflow-hidden rounded-sm">
                  <img
                    src={service.img}
                    alt={service.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 grayscale group-hover:grayscale-0"
                  />
                  <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black-rich to-transparent">
                    <p className="text-gold font-bold text-lg">{service.price}</p>
                  </div>
                </div>
                <h4 className="text-2xl font-playfair text-white mb-2">{service.title}</h4>
                <p className="text-gray-text font-light">{service.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BARBERS SECTION */}
      <section className="py-24 bg-black-rich relative">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="absolute -top-4 -left-4 w-full h-full border border-gold/30 z-0"></div>
            <img
              src="https://images.unsplash.com/photo-1599351431202-1e0f0137899a?auto=format&fit=crop&w=1000&q=80"
              alt="Master Barber"
              className="relative z-10 w-full grayscale hover:grayscale-0 transition-all duration-500 shadow-2xl"
            />
          </div>
          <div>
            <h3 className="text-4xl font-playfair text-white mb-6">Maestros de la Tijera</h3>
            <p className="text-gray-text text-lg mb-8 font-light leading-relaxed">
              Nuestro equipo está formado por artesanos apasionados por su oficio.
              Con años de experiencia y formación constante en las últimas tendencias,
              garantizamos un resultado que supera tus expectativas.
            </p>
            <ul className="space-y-4 mb-10 text-gray-300">
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gold rounded-full"></span>
                Alejandro - Especialista en cortes clásicos
              </li>
              <li className="flex items-center gap-3">
                <span className="w-2 h-2 bg-gold rounded-full"></span>
                Lisandro - Experto en barbas y fades
              </li>
            </ul>
            <button
              onClick={() => navigate("/reserva")}
              className="bg-transparent border-2 border-[#d4af37] text-[#d4af37] px-8 py-3 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 hover:bg-[#d4af37] hover:text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.4)]"
            >
              Conocer al Equipo
            </button>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-charcoal py-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
          <div>
            <h2 className="text-2xl font-playfair font-bold text-white uppercase tracking-widest">BarberIA</h2>
            <p className="text-gray-text text-sm mt-2">© 2026 Todos los derechos reservados.</p>
          </div>
          <div className="flex gap-8">
            <a href="https://www.instagram.com/athenea_barber/" className="text-gray-text hover:text-gold transition-colors uppercase text-xs tracking-widest">Instagram</a>
            <a href="https://www.google.com/maps/place/Athenea+barber/@-27.332987,-55.8682439,17z/data=!3m1!4b1!4m6!3m5!1s0x9457954e1df7a6cf:0xf001b113ec425db9!8m2!3d-27.332987!4d-55.8682439!16s%2Fg%2F11pcmtpksc?entry=ttu" className="text-gray-text hover:text-gold transition-colors uppercase text-xs tracking-widest">Ubicación</a>
          </div>
        </div>
      </footer>
    </div>
  );
}