// src/components/booking/Step2_IAExperience.tsx
import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { aiSuggestions } from "../../../data/mockData";
import { Camera as CameraIcon, RefreshCw, Zap, ScanFace } from "lucide-react";
import { useAuth } from "../../../hooks/useAuth";
import { storage, db, auth } from "../../../service/firebase"; // ✅ Añade auth
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { Timestamp } from "firebase/firestore";

interface Props {
    bookingData: any;
    setBookingData: (val: any) => void;
    onNext: () => void;
    onBack: () => void;
}

export default function Step2_IAExperience({ bookingData, setBookingData, onNext, onBack }: Props) {
    const { user } = useAuth();
    
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [stream, setStream] = useState<MediaStream | null>(null);
    const [image, setImage] = useState<string | null>(bookingData.userMedia.photo);
    const [analyzing, setAnalyzing] = useState(false);
    const [result, setResult] = useState<any>(bookingData.aiAnalysis.suggestions?.length > 0 ? bookingData.aiAnalysis : null);

    // Initialize Camera
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

    // Stop Camera
    const stopCamera = () => {
        if (stream) {
            stream.getTracks().forEach(track => track.stop());
            setStream(null);
        }
    };

    // Capture Photo
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

    // Start camera when component mounts if no image
    useEffect(() => {
        if (!image) {
            startCamera();
        }
        return () => {
            stopCamera();
        };
    }, [image]);

    // ✅ NUEVA FUNCIÓN CON IA REAL (usando fetch + onRequest)
    const handleAIAnalysis = async () => {
      if (!user) {
        alert("Debes iniciar sesión para usar la IA");
        return;
      }

      if (!image) {
        alert("Primero toma una foto");
        return;
      }

      setAnalyzing(true);

      try {
        // 1. Convertir imagen a Blob
        const response = await fetch(image);
        const blob = await response.blob();

        // 2. Subir a Firebase Storage
        const fileName = `foto-${Date.now()}-${user.uid}.jpg`;
        const storageRef = ref(storage, `users/${user.uid}/photos/${fileName}`);
        await uploadBytes(storageRef, blob);
        const downloadURL = await getDownloadURL(storageRef);

        // 3. ✅ OBTENER TOKEN DE AUTENTICACIÓN
        const idToken = await user.getIdToken();

        // 4. ✅ LLAMAR A LA FUNCIÓN CON FETCH (onRequest)
        const iaResponse = await fetch(
          "https://us-central1-barberia-ayan.cloudfunctions.net/detectFaceShape",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              "Authorization": `Bearer ${idToken}`
            },
            body: JSON.stringify({ imageUrl: downloadURL })
          }
        );

        if (!iaResponse.ok) {
          throw new Error(`Error ${iaResponse.status}: ${await iaResponse.text()}`);
        }

        const iaResult = await iaResponse.json();

        // 5. Extraer datos de la IA
        const detectedShapeRaw = iaResult.faceShape || "Ovalado";
        const confidence = iaResult.confidence || 0.85;

        // 6. Obtener sugerencia según el rostro detectado
        const shapeKey = detectedShapeRaw.toLowerCase();
        const availableCuts = aiSuggestions[shapeKey as keyof typeof aiSuggestions] 
          ?? aiSuggestions.ovalado 
          ?? [];

        const bestCut = availableCuts.length > 0 
          ? availableCuts[0] 
          : {
              nombre: "Corte Clásico",
              imagen: "/imagenes-cortes/default.jpg",
              descripcion: "Recomendación general.",
              confianza: 0.85
            };

        // 7. Crear análisis
        const analysis = {
          faceShape: detectedShapeRaw,
          suggestion: {
            ...bestCut,
            confianza: confidence
          }
        };

        // 8. Guardar en Firestore
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

        // 9. Actualizar estado local
        setResult(analysis);
        setBookingData((prev: any) => ({
          ...prev,
          userMedia: { ...prev.userMedia, photo: image, faceShape: detectedShapeRaw },
          aiAnalysis: analysis
        }));

      } catch (err: any) {
        console.error("Error en IA real:", err);
        
        let message = "No se pudo analizar tu rostro. ";
        if (err.message?.includes("No se detectó ningún rostro")) {
          message += "Asegúrate de que tu rostro esté bien visible y centrado.";
        } else if (err.message?.includes("imagen no es válida")) {
          message += "La foto no es válida. Intenta tomar otra.";
        } else {
          message += "Intenta nuevamente en unos momentos.";
        }
        
        alert(message);
      } finally {
        setAnalyzing(false);
      }
    };

    return (
        <div className="flex flex-col items-center max-w-3xl mx-auto w-full animate-fade-in px-4">
            <h2 className="text-3xl font-bold text-[#D4AF37] mb-2 font-playfair text-center">
                Experiencia IA Athenea
            </h2>
            <p className="text-gray-400 mb-8 text-center max-w-md">
                Nuestra inteligencia artificial analiza tus rasgos faciales para recomendarte el corte perfecto.
            </p>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full items-start">
                {/* Camera */}
                <div className="flex flex-col items-center">
                    <div className="relative w-full aspect-[3/4] max-w-sm bg-black rounded-2xl overflow-hidden border-2 border-[#1e1e1e] shadow-[0_10px_30px_rgba(0,0,0,0.5)] group">
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

                        {/* Scanner Overlay */}
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

                        {/* Decorative Corners */}
                        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#D4AF37]/50 rounded-tl-lg"></div>
                        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#D4AF37]/50 rounded-tr-lg"></div>
                        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#D4AF37]/50 rounded-bl-lg"></div>
                        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#D4AF37]/50 rounded-br-lg"></div>
                    </div>

                    <div className="flex gap-4 mt-6">
                        {!image ? (
                            <button
                                onClick={capture}
                                className="bg-white text-black p-4 rounded-full shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:scale-110 transition-transform hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] font-bold"
                                disabled={!stream}
                            >
                                <CameraIcon size={24} />
                            </button>
                        ) : (
                            <button
                                onClick={() => { setImage(null); setResult(null); startCamera(); }}
                                className="px-8 py-3 rounded-full border border-gray-600 text-gray-400 hover:text-white hover:border-white transition-colors flex items-center gap-2 min-h-[50px]"
                                disabled={analyzing}
                            >
                                <RefreshCw size={20} /> Retomar Foto
                            </button>
                        )}
                    </div>
                </div>

                {/* Sugerencia única - centrada y elegante */}
                <div className="flex flex-col items-center w-full">
                    {!result ? (
                        <div className="text-center w-full">
                            <h3 className="text-xl font-bold text-white mb-4">¿Cómo funciona?</h3>
                            <ul className="text-gray-400 space-y-3 mb-8 text-sm">
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div> Toma una foto frontal con buena luz.</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div> Nuestra IA escanea tu rostro.</li>
                                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div> Recibe **una sugerencia personalizada y premium**.</li>
                            </ul>

                            <button
                                onClick={handleAIAnalysis}
                                disabled={!image || analyzing}
                                className={`
                                    w-full py-4 rounded-xl font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all
                                    ${!image || analyzing
                                        ? "bg-[#1e1e1e] text-gray-600 cursor-not-allowed border border-white/5"
                                        : "bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black hover:shadow-[0_0_20px_#D4AF37] transform hover:-translate-y-1"}
                                `}
                            >
                                {analyzing ? "Analizando..." : <><Zap size={20} fill="currentColor" /> Analizar con IA</>}
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="w-full max-w-md bg-[#1e1e1e] p-6 rounded-2xl border border-[#D4AF37]/20 shadow-xl text-center"
                        >
                            <div className="mb-6">
                                <span className="text-[#D4AF37] text-xs font-bold uppercase tracking-[0.2em] block">Rostro Detectado</span>
                                <h3 className="text-2xl font-playfair font-bold text-white mt-1">{result.faceShape}</h3>
                            </div>

                            {/* Imagen principal - grande y centrada */}
                            <div className="w-full h-64 mb-5 overflow-hidden rounded-xl border border-white/20 shadow-inner">
                                <img 
                                    src={result.suggestion.imagen} 
                                    alt={result.suggestion.nombre}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.currentTarget.src = "/imagenes-cortes/default.jpg";
                                    }}
                                />
                            </div>

                            {/* Nombre y descripción */}
                            <h3 className="text-2xl font-playfair font-bold text-white mb-2">
                                {result.suggestion.nombre}
                            </h3>
                            <p className="text-gray-400 mb-4 text-sm">
                                {result.suggestion.descripcion}
                            </p>

                            {/* Confianza */}
                            <div className="flex justify-center items-center gap-2 mb-6">
                                <span className="text-[#D4AF37] font-bold">Confianza:</span>
                                <span className="text-white font-mono">{(result.suggestion.confianza * 100).toFixed(0)}%</span>
                            </div>

                            {/* Botón de acción */}
                            <button
                                onClick={() => {
                                    setBookingData((prev: any) => ({
                                        ...prev,
                                        aiAnalysis: { ...prev.aiAnalysis, selectedCut: result.suggestion }
                                    }));
                                    onNext();
                                }}
                                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] to-[#B8860B] text-black font-bold rounded-xl hover:shadow-[0_0_20px_rgba(212,175,55,0.4)] transition-all"
                            >
                                Agendar este corte
                            </button>
                        </motion.div>
                    )}
                </div>
            </div>

            <div className="flex justify-between w-full mt-10 border-t border-white/5 pt-6 max-w-3xl">
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
                    className={`
                        px-12 py-5 rounded-full font-bold uppercase tracking-widest text-sm transition-all min-h-[60px]
                        ${result
                            ? "bg-transparent border border-gray-600 text-gray-400 hover:border-white hover:text-white"
                            : "bg-transparent border border-gray-600 text-gray-400 hover:border-white hover:text-white"}
                    `}
                >
                    {result ? "Omitir" : "Omitir este paso"}
                </button>
            </div>
        </div>
    );
}