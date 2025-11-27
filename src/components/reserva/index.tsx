// src/components/reserva/index.tsx
import React, { useState } from "react";
import ElegirBarbero from "./ElegirBarbero";
import ElegirServicio from "./ElegirServicio";
import CalendarioReserva from "./CalendarioReserva";

export default function Reserva() {
  const [step, setStep] = useState<"barbero" | "servicio" | "calendario">("barbero");
  const [barbero, setBarbero] = useState<string | null>(null);
  const [servicio, setServicio] = useState<string | null>(null);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {step === "barbero" && (
        <ElegirBarbero
          onSelect={(b) => {
            setBarbero(b);
            setStep("servicio");
          }}
        />
      )}

      {step === "servicio" && barbero && (
        <ElegirServicio
          barbero={barbero}
          onSelect={(s) => {
            setServicio(s);
            setStep("calendario");
          }}
        />
      )}

      {step === "calendario" && barbero && servicio && (
        <CalendarioReserva barbero={barbero} servicio={servicio} />
      )}
    </div>
  );
}