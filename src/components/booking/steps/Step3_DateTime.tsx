import { motion } from "framer-motion";
import { barbers } from "../../../data/mockData";
import { Clock, ChevronRight, ChevronLeft } from "lucide-react";

interface Props {
    bookingData: any;
    setBookingData: (val: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step3_DateTime({ bookingData, setBookingData, onNext, onBack }: Props) {
    const timeSlots = ["09:00", "10:00", "11:00", "13:00", "14:00", "15:00", "16:00", "17:00", "18:00"];

    const handleBarberSelect = (barber: any) => {
        setBookingData((prev: any) => ({
            ...prev,
            appointment: { ...prev.appointment, barber }
        }));
    };

    const handleTimeSelect = (time: string) => {
        setBookingData((prev: any) => ({
            ...prev,
            appointment: { ...prev.appointment, time, date: new Date().toISOString().split('T')[0] }
        }));
    };

    return (
        <div className="space-y-12 animate-fade-in max-w-4xl mx-auto">

            {/* Barber Selection */}
            <section>
                <div className="text-center mb-8">
                    <h2 className="text-2xl font-bold text-[#D4AF37] mb-2 font-serif">Selecciona tu Profesional</h2>
                    <p className="text-gray-400">Expertos en estilo clásico y moderno.</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {barbers.map((b) => {
                        const isSelected = bookingData.appointment.barber?.id === b.id;
                        return (
                            <motion.div
                                key={b.id}
                                onClick={() => handleBarberSelect(b)}
                                whileHover={{ y: -5 }}
                                className={`
                  cursor-pointer rounded-2xl overflow-hidden border-2 transition-all duration-300 group relative bg-[#1e1e1e]
                  ${isSelected ? "border-[#D4AF37] shadow-[0_10px_30px_rgba(212,175,55,0.15)] ring-2 ring-[#D4AF37]/50" : "border-transparent border-white/5 hover:border-[#D4AF37]/30"}
                `}
                            >
                                <div className="h-64 overflow-hidden relative">
                                    <img
                                        src={b.img}
                                        alt={b.name}
                                        className={`w-full h-full object-cover transition-transform duration-700 ${isSelected ? "scale-110 grayscale-0" : "grayscale group-hover:grayscale-0 group-hover:scale-105"}`}
                                    />
                                    <div className="absolute inset-0 bg-gradient-to-t from-[#1e1e1e] to-transparent opacity-80"></div>
                                </div>

                                <div className="absolute bottom-0 left-0 w-full p-6 text-center">
                                    <h3 className={`font-bold text-xl mb-1 ${isSelected ? "text-white" : "text-gray-300 group-hover:text-white"}`}>{b.name}</h3>
                                    <p className="text-[#D4AF37] text-xs uppercase tracking-widest font-bold">Master Barber</p>
                                </div>

                                {isSelected && (
                                    <div className="absolute top-4 right-4 bg-[#D4AF37] text-black w-8 h-8 rounded-full flex items-center justify-center font-bold shadow-lg">
                                        ✓
                                    </div>
                                )}
                            </motion.div>
                        );
                    })}
                </div>
            </section>

            {/* Time Selection */}
            {bookingData.appointment.barber && (
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="border-t border-white/10 pt-10"
                >
                    <div className="text-center mb-8">
                        <h2 className="text-2xl font-bold text-[#D4AF37] mb-2 font-serif flex items-center justify-center gap-3">
                            <Clock className="text-[#D4AF37]" /> Disponibilidad
                        </h2>
                        <p className="text-gray-400">Horarios disponibles para hoy.</p>
                    </div>

                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-w-2xl mx-auto px-4">
                        {timeSlots.map((time) => {
                            const isSelected = bookingData.appointment.time === time;
                            return (
                                <button
                                    key={time}
                                    onClick={() => handleTimeSelect(time)}
                                    className={`
                    py-4 px-6 rounded-xl font-mono font-bold border transition-all duration-200 relative overflow-hidden group min-h-[60px] flex items-center justify-center
                    ${isSelected
                                            ? "bg-[#D4AF37] text-black border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] transform scale-105 z-10"
                                            : "bg-[#252525] text-gray-400 border-white/5 hover:border-[#D4AF37]/50 hover:text-white hover:bg-[#2a2a2a]"}
                  `}
                                >
                                    {time}
                                </button>
                            );
                        })}
                    </div>
                </motion.section>
            )}

            {/* Navigation */}
            <div className="flex justify-between mt-12 pt-6 border-t border-white/5">
                <button
                    onClick={onBack}
                    className="text-gray-500 hover:text-white px-8 py-4 font-medium transition-colors flex items-center gap-2 group min-h-[50px]"
                >
                    <ChevronLeft size={24} className="group-hover:-translate-x-1 transition-transform" /> Atrás
                </button>
                <button
                    onClick={onNext}
                    disabled={!bookingData.appointment.time}
                    className={`
            px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 flex items-center gap-2 min-h-[60px]
            ${bookingData.appointment.time
                            ? "bg-[#D4AF37] text-[#121212] hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transform hover:-translate-y-1"
                            : "bg-[#2a2a2a] text-gray-600 cursor-not-allowed"}
          `}
                >
                    Siguiente <ChevronRight size={20} />
                </button>
            </div>
        </div>
    );
}
