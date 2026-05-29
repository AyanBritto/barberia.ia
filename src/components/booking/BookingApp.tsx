import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Stepper from "./ui/Stepper";
import Step1_ServiceSelection from "./steps/Step1_ServiceSelection";
import Step2_IAExperience from "./steps/Step2_IAExperience";
import Step3_DateTime from "./steps/Step3_DateTime";
import Step4_Summary from "./steps/Step4_Summary";

// 1. Requisitos de Arquitectura: Estado Centralizado
export interface BookingState {
    step: number;
    service: { id: number; name: string; precio: string; icon: string } | null;
    userMedia: { photo: string | null; faceShape: string | null };
    aiAnalysis: { suggestions: string[] };
    appointment: { barber: { id: number; name: string; img: string } | null; date: string | null; time: string | null };
    client: { name: string; phone: string };
}

export default function BookingApp() {
    // 2. Definición del Estado Maestro
    const [bookingData, setBookingData] = useState<BookingState>({
        step: 1,
        service: null,
        userMedia: { photo: null, faceShape: null },
        aiAnalysis: { suggestions: [] },
        appointment: { barber: null, date: null, time: null },
        client: { name: "", phone: "" }
    });

    const nextStep = () => setBookingData((prev) => ({ ...prev, step: Math.min(prev.step + 1, 4) }));
    const prevStep = () => setBookingData((prev) => ({ ...prev, step: Math.max(prev.step - 1, 1) }));

    // const updateBooking = (updates: Partial<BookingState>) => {
    //     setBookingData((prev) => ({ ...prev, ...updates }));
    // };

    return (
        <div className="min-h-screen w-full bg-[#121212] text-[#e0e0e0] font-sans flex flex-col">
            {/* 3. UI/UX: Stepper */}
            <h1 className="hidden md:block text-white text-center text-xs p-2 bg-red-900/50">
Debug: BookingApp v2 Loaded
</h1>
            <Stepper currentStep={bookingData.step} />

            <div className="flex-1 max-w-4xl mx-auto w-full px-4 md:px-6 py-4 relative overflow-hidden">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={bookingData.step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.4, ease: "easeInOut" }}
                        className="w-full h-full"
                    >
                        {bookingData.step === 1 && (
                            <Step1_ServiceSelection
                                bookingData={bookingData}
                                setBookingData={setBookingData}
                                onNext={nextStep}
                            />
                        )}
                        {bookingData.step === 2 && (
                            <Step2_IAExperience
                                bookingData={bookingData}
                                setBookingData={setBookingData}
                                onNext={nextStep}
                                onBack={prevStep}
                            />
                        )}
                        {bookingData.step === 3 && (
                            <Step3_DateTime
                                bookingData={bookingData}
                                setBookingData={setBookingData}
                                onNext={nextStep}
                                onBack={prevStep}
                            />
                        )}
                        {bookingData.step === 4 && (
                            <Step4_Summary
                                bookingData={bookingData}
                                setBookingData={setBookingData}
                                onBack={prevStep}
                            />
                        )}
                    </motion.div>
                </AnimatePresence>
            </div>
        </div>
    );
}
