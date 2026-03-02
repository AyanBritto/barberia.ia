import { motion } from "framer-motion";
import { Check } from "lucide-react";

export default function Stepper({ currentStep }: { currentStep: number }) {
    const steps = ["Servicios", "IA Experience", "Agenda", "Confirmar"];

    return (
        <div className="w-full max-w-4xl mx-auto p-4 mb-4">
            <div className="flex items-center justify-between relative">
                <div className="absolute top-1/2 left-0 w-full h-1 bg-[#1e1e1e] -z-0 rounded"></div>
                <div
                    className="absolute top-1/2 left-0 h-1 bg-[#D4AF37] -z-0 rounded transition-all duration-500"
                    style={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                ></div>

                {steps.map((label, index) => {
                    const stepNum = index + 1;
                    const isActive = stepNum === currentStep;
                    const isCompleted = stepNum < currentStep;

                    return (
                        <div key={label} className="flex flex-col items-center relative z-10">
                            <motion.div
                                initial={false}
                                animate={{
                                    backgroundColor: isActive || isCompleted ? "#D4AF37" : "#1e1e1e",
                                    scale: isActive ? 1.2 : 1,
                                    color: isActive || isCompleted ? "#121212" : "#808080",
                                }}
                                className="w-10 h-10 rounded-full flex items-center justify-center font-bold border-2 border-[#121212] shadow-md"
                            >
                                {isCompleted ? <Check size={20} /> : stepNum}
                            </motion.div>
                            <span className={`text-xs mt-2 font-medium ${isActive ? "text-[#D4AF37]" : "text-gray-500"}`}>
                                {label}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
