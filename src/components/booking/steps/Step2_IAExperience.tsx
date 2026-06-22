import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom"; 
import { motion } from "framer-motion";
import { aiSuggestions } from "../../../data/mockData";
import { Camera as CameraIcon, RefreshCw, Zap, ScanFace } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { storage, db } from "../../../service/firebase";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";
import { getIAStatus } from "../../../service/configService";

interface Props {
    bookingData: any;
    setBookingData: (val: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step2_IAExperience({ bookingData, setBookingData, onNext, onBack }: Props) {
    const navigate = useNavigate(); //  Hook para navegación
    const { user } = useAuth();
    const [showHelpModal, setShowHelpModal] = useState(false);

    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [image, setImage] = useState<string | null>(bookingData.userMedia?.photo || null);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(bookingData.aiAnalysis?.suggestion ? bookingData.aiAnalysis : null);

    // Extraer inicial segura
    const getInitial = () => {
        if (user?.displayName) return user.displayName[0]?.toUpperCase() || '?';
        if (user?.email) return user.email.split('@')[0][0]?.toUpperCase() || '?';
        return '?';
    };

    const startCamera = async () => {
        try {
            const mediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: "user" }, audio: false });
            setStream(mediaStream);
            if (videoRef.current) {
                videoRef.current.srcObject = mediaStream;
            }
        } catch (err) {
            console.error("Error accessing camera:", err);
            alert("No se pudo acceder a la cámara. Por favor, verifica los permisos.");
        }
    };

    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    const capture = () => {
        if (videoRef.current && canvasRef.current) {
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const context = canvas.getContext('2d');

            if (context) {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                const photo = canvas.toDataURL('image/jpeg');
                setImage(photo);
                stopCamera();

                setBookingData((prev: any) => ({
                    ...prev,
                    userMedia: { ...prev.userMedia, photo }
                }));
            }
        }
    };

    useEffect(() => {
        if (!image) {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [image]);
const handleAIAnalysis = async () => {

if (!user) {
    alert("Debes iniciar sesión para usar la IA");
    return;
}

if (!image) {
    alert("Primero toma una foto");
    return;
}

const iaActiva = await getIAStatus();

if (!iaActiva) {
    alert("La IA está temporalmente desactivada por el administrador.");
    return;
}

setAnalyzing(true);

try {

    const response = await fetch(image);
    const blob = await response.blob();

    const fileName = `foto-${Date.now()}-${user.uid}.jpg`;
    const storageRef = ref(storage, `users/${user.uid}/photos/${fileName}`);

    await uploadBytes(storageRef, blob);

    const downloadURL = await getDownloadURL(storageRef);

   
const idToken = await user.getIdToken();

/* MEDIR TIEMPO IA */
const start = performance.now();

const iaResponse = await fetch(
  "https://us-central1-barberia-ayan.cloudfunctions.net/detectFaceShape",
  {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${idToken}`
    },
    body: JSON.stringify({
      imageUrl: downloadURL
    })
  }
);

if (!iaResponse.ok) {
  throw new Error("Error en la IA");
}

const iaResult = await iaResponse.json();

/* FIN MEDICION */
const end = performance.now();

const tiempoIA = (
  (end - start) / 1000
).toFixed(2);

console.log(
  `Tiempo IA: ${tiempoIA} segundos`
);

alert(
  `Tiempo de análisis IA: ${tiempoIA} segundos`
);



    const detectedShapeRaw = iaResult.faceShape || "Ovalado";
    const confidence = iaResult.confidence || 0.85;

    const shapeKey = detectedShapeRaw.toLowerCase();

    let availableCuts = [];

    if (shapeKey === "redondo") {
        availableCuts = aiSuggestions.redondo;
    } else if (shapeKey === "cuadrado") {
        availableCuts = aiSuggestions.cuadrado;
    } else {
        availableCuts = aiSuggestions.ovalado;
    }

    const bestCut = availableCuts[0];
    const allCuts = availableCuts;

  const analysis = {
    faceShape: detectedShapeRaw,
    suggestions: allCuts, //  TODAS LAS OPCIONES
    suggestion: bestCut   //  la principal (como antes)
};

    await addDoc(collection(db, "sugerencias"), {
        userId: user.uid,
        fotoUrl: downloadURL,
        rostro: detectedShapeRaw,
        cortePrincipal: bestCut.nombre,
        confianza: confidence,
        status: "completada",
        createdAt: Timestamp.now(),
        rawIA: iaResult
    });

    setResult(analysis);

    setBookingData((prev: any) => ({
        ...prev,
        userMedia: { ...prev.userMedia, photo: image, faceShape: detectedShapeRaw },
        aiAnalysis: analysis
    }));

} catch (err) {

    console.error("Error IA:", err);
    alert("No se pudo analizar el rostro");

} finally {

    setAnalyzing(false);

}

};

    return (
        <div className="flex flex-col items-center max-w-3xl mx-auto w-full animate-fade-in px-4 md:px-6">
            {/* Cabecera integrada: Volver + Título + Avatar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6 w-full">
                <div className="flex items-center gap-3">
                    <button
                        onClick={() => navigate("/")} // ✅ Siempre va a la Bienvenida
                        className="flex items-center gap-1 text-gray-400 hover:text-[#D4AF37] transition-colors text-sm font-medium"
                        aria-label="Volver a la página principal"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M15 19l-7-7 7-7"/>
                        </svg>
                        <span>Volver</span>
                    </button>
                    <span className="text-gray-500 hidden sm:inline">•</span>
                    <h2 className="text-2xl md:text-3xl font-bold text-[#D4AF37] font-playfair">Experiencia IA Athenea</h2>
                </div>

                {user && (
                    <div className="relative">
                        {user.photoURL ? (
                            <img
                                src={user.photoURL}
                                alt="Perfil"
                                className="w-10 h-10 rounded-full border-2 border-[#D4AF37] shadow-lg object-cover"
                                onError={(e) => {
                                    const target = e.currentTarget;
                                    target.style.display = 'none';
                                    const fallback = target.parentNode?.querySelector('.fallback-initial');
                                    if (fallback) fallback.classList.remove('hidden');
                                }}
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#D4AF37] to-[#B8860B] flex items-center justify-center text-black font-bold text-sm shadow-[0_0_10px_rgba(212,175,55,0.5)] fallback-initial hidden">
                                {getInitial()}
                            </div>
                        )}
                    </div>
                )}
            </div>

            <p className="text-gray-400 mb-8 text-center max-w-md">
                Nuestra inteligencia artificial analiza tus rasgos faciales para recomendarte el corte perfecto.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 w-full items-start">
                <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-[3/4] max-w-xs sm:max-w-sm bg-black rounded-2xl overflow-hidden border-2 border-[#1e1e1e] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
                        {image ? (
                            <img src={image} alt="Usuario" className="w-full h-full object-cover transform scale-x-[-1]" />
                        ) : (
                            <>
                                <video
                                    ref={videoRef}
                                    autoPlay
                                    playsInline
                                    muted
                                    className="w-full h-full object-cover transform scale-x-[-1]"
                                />
                                <canvas ref={canvasRef} className="hidden" />

                                {!stream && (
                                    <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-gray-500 flex-col gap-2">
                                        <CameraIcon size={48} className="animate-pulse" />
                                        <span>Iniciando cámara...</span>
                                    </div>
                                )}
                            </>
                        )}

                        {analyzing && (
                            <div className="absolute inset-0 bg-black/20 z-10">
                                <motion.div
                                    initial={{ top: "0%" }}
                                    animate={{ top: "100%" }}
                                    transition={{ repeat: Infinity, duration: 2, ease: "linear" }}
                                    className="absolute left-0 w-full h-[2px] bg-[#D4AF37] shadow-[0_0_20px_#D4AF37]"
                                />
                                <div className="absolute inset-0 flex items-center justify-center">
                                    <ScanFace size={48} className="text-[#D4AF37] animate-pulse" />
                                </div>
                            </div>
                        )}

                        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/50 rounded-tl-lg"></div>
                        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/50 rounded-tr-lg"></div>
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/50 rounded-bl-lg"></div>
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-lg"></div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        {!image ? (
                            <button
                                onClick={capture}
                                className="bg-white text-black p-3 md:p-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] font-bold"
                                disabled={!stream}
                            >
                                <CameraIcon size={24} />
                            </button>
                        ) : (
                            <button
                                onClick={() => { setImage(null); setResult(null); startCamera(); }}
                                className="px-6 md:px-8 py-3 rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors flex items-center gap-2 min-h-[50px]"
                                disabled={analyzing}
                            >
                                <RefreshCw size={20} /> Retomar Foto
                            </button>
                        )}
                    </div>
                </div>

                <div className="flex flex-col items-center w-full">
                    {!result ? (
                        <div className="text-center w-full">
                            <div className="flex justify-center mt-6">
                                <button
                                    onClick={() => setShowHelpModal(true)}
                                    className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-300 transition-colors"
                                    aria-label="Ayuda: cómo funciona la IA"
                                >
                                    <span className="text-xl"></span>
                                    <span>¿Cómo funciona?</span>
                                </button>
                            </div>

                            <button
                                onClick={handleAIAnalysis}
                                disabled={!image || analyzing}
                                className={`w-full py-3 md:py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all mt-6
                                    ${!image || analyzing
                                        ? "bg-[#1e1e1e] text-gray-600 cursor-not-allowed border border-white/5"
                                        : "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black hover:shadow-[0_0_20px_rgba(212,175,55,0.5)] transform hover:-translate-y-1"}`}
                            >
                                {analyzing ? "Analizando..." : <><Zap size={20} fill="currentColor" /> Analizar con IA</>}
                            </button>
                        </div>
                    ) : (

                       


    <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full"
    >
        <div className="mb-6 text-center">
            <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block">
                Rostro Detectado
            </span>

            <h3 className="text-2xl font-playfair font-bold text-white mt-1">
                {result.faceShape}
            </h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {result.suggestions.map(
                (sug: any, index: number) => {
                    const isSelected =
                        bookingData.aiAnalysis?.suggestion
                            ?.nombre === sug.nombre;

                    return (
                        <div
                            key={index}
                            onClick={() => {
                                setBookingData(
                                    (prev: any) => ({
                                        ...prev,
                                        aiAnalysis: {
                                            ...prev.aiAnalysis,
                                            suggestion:
                                                sug,
                                        },
                                    })
                                );
                            }}
                            className={`cursor-pointer rounded-xl overflow-hidden border-2 transition-all ${
                                isSelected
                                    ? "border-[#D4AF37] scale-105"
                                    : "border-white/10 hover:border-[#D4AF37]/40"
                            }`}
                        >
                            <img
                                src={sug.imagen}
                                alt={sug.nombre}
                                className="w-full h-40 object-cover"
                            />

                            <div className="p-3 text-center">
                                <h3 className="text-white font-bold">
                                    {sug.nombre}
                                </h3>

                                <p className="text-gray-400 text-xs">
                                    {sug.descripcion}
                                </p>

                                <p className="text-[#D4AF37] text-xs mt-1">
                                    {(
                                        sug.confianza *
                                        100
                                    ).toFixed(0)}
                                    %
                                </p>
                            </div>
                        </div>
                    );
                }
            )}
        </div>

        <button
            onClick={onNext}
            disabled={
                !bookingData.aiAnalysis
                    ?.suggestion
            }
            className="w-full mt-6 py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold rounded-xl"
        >
            Continuar con este corte
        </button>
    </motion.div>


)}



                    
                </div>
            </div>

            <div className="flex flex-col sm:flex-row justify-between w-full mt-10 border-t border-white/5 pt-6 gap-4 max-w-3xl">
                <button onClick={onBack} className="text-gray-500 hover:text-white px-8 py-4 font-medium transition-colors min-h-[50px]">
                    Atrás
                </button>
                <button
                    onClick={() => {
                        if (bookingData.service) {
                            onNext();
                        } else {
                            setBookingData((prev: any) => ({ ...prev, step: 1 }));
                        }
                    }}
                    className={`px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all min-h-[60px]
                        ${result
                            ? "bg-transparent border border-gray-600 text-gray-400 hover:border-white hover:text-white"
                            : "bg-transparent border border-gray-600 text-gray-400 hover:border-white hover:text-white"}`}
                >
                    {result ? "Omitir" : "Omitir este paso"}
                </button>
            </div>

            {showHelpModal && (
                <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4">
                    <div className="bg-[#1e1e1e] rounded-2xl max-w-md w-full border border-white/10 shadow-2xl overflow-hidden">
                        <div className="p-6 border-b border-white/10 flex justify-between items-center">
                            <h3 className="text-xl font-bold text-[#D4AF37]">¿Cómo funciona IA?</h3>
                            <button
                                onClick={() => setShowHelpModal(false)}
                                className="text-gray-400 hover:text-white text-2xl"
                                aria-label="Cerrar"
                            >
                
                            </button>
                        </div>
                        <div className="p-6 space-y-4 text-gray-300">
                            <ul className="space-y-2 list-disc pl-5">
                                <li>Toma una foto frontal con buena luz.</li>
                                <li>Nuestra IA escanea tu rostro.</li>
                                <li>Recibe una sugerencia personalizada y premium de corte.</li>
                            </ul>
                            <p className="text-sm text-gray-500 mt-2">
                                * La IA usa Google Cloud Vision API para analizar proporciones faciales (alto/ancho).
                            </p>
                        </div>
                        <div className="p-4 bg-gray-900/50 border-t border-white/10 flex justify-end">
                            <button
                                onClick={() => setShowHelpModal(false)}
                                className="px-4 py-2 bg-[#D4AF37] text-black rounded-lg font-medium hover:opacity-90"
                            >
                                Entendido
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}