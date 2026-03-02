import { motion } from "framer-motion";
import { services } from "../../../data/mockData";
import { Scissors, Zap, Crown, Eye, Sparkles, ScanFace } from "lucide-react";

// Icons mapping
const icons: any = { Scissors, Razor: Zap, Crown, Eye, Sparkles };

interface Props {
    bookingData: any;
    setBookingData: (val: any) => void;
    onNext: () => void;
}

export default function Step1_ServiceSelection({ bookingData, setBookingData, onNext }: Props) {
    const handleSelect = (service: any) => {
        setBookingData((prev: any) => ({ ...prev, service }));
    };

    const jumpToAI = () => {
        setBookingData((prev: any) => ({ ...prev, step: 2 })); // Direct jump to AI
    };

    return (
        <div className="space-y-6 animate-fade-in pb-20">
            <h2 className="text-3xl font-bold text-[#D4AF37] text-center mb-2 font-serif">
                Selecciona tu Experiencia
            </h2>

            {/* Direct AI Access Card */}
            <motion.div
                onClick={jumpToAI}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="w-full bg-gradient-to-r from-[#D4AF37]/20 to-[#1e1e1e] border-2 border-[#D4AF37] p-6 rounded-2xl cursor-pointer flex items-center justify-between group shadow-[0_0_20px_rgba(212,175,55,0.15)] mb-8"
            >
                <div className="flex items-center gap-4">
                    <div className="bg-[#D4AF37] p-3 rounded-full text-black animate-pulse">
                        <ScanFace size={32} />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white group-hover:text-[#D4AF37] transition-colors">¿No sabes qué elegir?</h3>
                        <p className="text-gray-300 text-sm">Usa nuestra IA para analizar tu rostro y recibir sugerencias.</p>
                    </div>
                </div>
                <div className="bg-[#D4AF37] text-black px-4 py-2 rounded-lg font-bold text-sm uppercase tracking-wider group-hover:bg-white transition-colors">
                    Analizar Ahora
                </div>
            </motion.div>

            <p className="text-gray-400 text-center mb-4 uppercase tracking-widest text-xs border-b border-white/10 pb-2">O elige un servicio del catálogo</p>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {services.map((s) => {
                    const Icon = icons[s.icon] || Scissors;
                    const isSelected = bookingData.service?.id === s.id;

                    return (
                        <motion.button
                            key={s.id}
                            onClick={() => handleSelect(s)}
                            whileHover={{ scale: 1.03 }}
                            whileTap={{ scale: 0.98 }}
                            className={`
                relative p-6 rounded-2xl border-2 transition-all duration-300 flex flex-col items-center justify-center gap-4 text-center w-full group
                ${isSelected
                                    ? "bg-[#1e1e1e] border-[#D4AF37] shadow-[0_0_25px_rgba(212,175,55,0.2)]"
                                    : "bg-[#1e1e1e] border-white/5 hover:border-[#D4AF37]/40 hover:bg-[#252525]"}
              `}
                        >
                            <div className={`p-4 rounded-full ${isSelected ? "bg-[#D4AF37]/10" : "bg-black/30 group-hover:bg-[#D4AF37]/5"} transition-colors`}>
                                <Icon size={32} className={isSelected ? "text-[#D4AF37]" : "text-gray-400 group-hover:text-[#D4AF37]"} />
                            </div>
                            <div>
                                <h3 className={`font-bold text-lg mb-1 ${isSelected ? "text-white" : "text-gray-200"}`}>{s.name}</h3>
                                <p className="text-[#D4AF37] font-mono text-lg">{s.precio}</p>
                            </div>

                            {isSelected && (
                                <div className="absolute top-3 right-3 w-3 h-3 bg-[#D4AF37] rounded-full shadow-[0_0_10px_#D4AF37]"></div>
                            )}
                        </motion.button>
                    );
                })}
            </div>

            <div className="flex justify-end mt-10">
                <button
                    onClick={onNext}
                    disabled={!bookingData.service}
                    className={`
            px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all duration-300 transform min-h-[60px] lg:min-w-[200px]
            ${bookingData.service
                            ? "bg-[#D4AF37] text-[#121212] hover:bg-[#FFD700] hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] hover:-translate-y-1"
                            : "bg-[#2a2a2a] text-gray-600 cursor-not-allowed"}
          `}
                >
                    Siguiente Paso
                </button>
            </div>
        </div>
    );
}
