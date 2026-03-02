import { useState } from "react";
import { ref, uploadBytes } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";
import { storage, db } from "../service/firebase";
import { useAuth } from "./useAuth";

export function useImageUpload() {
    const [file, setFile] = useState<File | null>(null);
    const [preview, setPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const { user } = useAuth();

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];

            if (!selectedFile.type.startsWith("image/")) {
                setError("Por favor, selecciona una imagen válida.");
                return;
            }

            if (selectedFile.size > 5 * 1024 * 1024) {
                setError("La imagen debe pesar menos de 5MB.");
                return;
            }

            setFile(selectedFile);
            setPreview(URL.createObjectURL(selectedFile));
            setError("");
        }
    };

    const uploadImage = async (): Promise<string | null> => {
        if (!file) {
            setError("Por favor, selecciona una imagen primero.");
            return null;
        }

        if (!user) {
            setError("Debes iniciar sesión para subir fotos.");
            return null;
        }

        setLoading(true);
        setError("");

        try {
            const fileName = `uploads/${user.uid}/${uuidv4()}_${file.name}`;
            const storageRef = ref(storage, fileName);
            await uploadBytes(storageRef, file);

            // Guardar referencia en Firestore
            const docRef = await addDoc(collection(db, "sugerencias"), {
                userId: user.uid,
                imageUrl: fileName, // Guardamos el path, luego se puede obtener URL pública si es necesario
                status: "procesando",
                timestamp: new Date(),
            });

            setLoading(false);
            return docRef.id;
        } catch (err) {
            console.error("Error al subir la imagen:", err);
            setError("Hubo un error al subir la imagen. Inténtalo de nuevo.");
            setLoading(false);
            return null;
        }
    };

    const reset = () => {
        setFile(null);
        setPreview(null);
        setError("");
        setLoading(false);
    }

    return {
        file,
        preview,
        loading,
        error,
        handleFileChange,
        uploadImage,
        reset
    };
}
