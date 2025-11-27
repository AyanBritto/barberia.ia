import React, { useState } from "react";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { collection, addDoc } from "firebase/firestore";
import { v4 as uuidv4 } from "uuid";


export default function SubirFoto() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      setFile(selectedFile);
      setPreview(URL.createObjectURL(selectedFile)); // preview antes de subir
    }
  };

  const handleUpload = async () => {
    if (!file) return alert("Por favor selecciona una imagen");

    try {
      setLoading(true);
      const fileName = `${uuidv4()}-${file.name}`;
      const storageRef = ref(storage, `fotos/${fileName}`);

      // Subir archivo a Firebase Storage
      await uploadBytes(storageRef, file);

      // Obtener la URL pública
      const downloadURL = await getDownloadURL(storageRef);

      // Guardar en Firestore
      await addDoc(collection(db, "fotos"), {
        url: downloadURL,
        createdAt: new Date(),
      });

      alert("Imagen subida con éxito 🚀");
      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error("Error al subir imagen:", error);
      alert("Hubo un error al subir la imagen");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-md bg-white w-full max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4">Subir Foto</h2>

      <input type="file" accept="image/*" onChange={handleFileChange} />

      {preview && (
        <div className="mt-4">
          <img
            src={preview}
            alt="preview"
            className="w-40 h-40 object-cover rounded-lg border"
          />
        </div>
      )}

      <button
        onClick={handleUpload}
        disabled={loading}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg disabled:opacity-50"
      >
        {loading ? "Subiendo..." : "Subir Foto"}
      </button>
    </div>
  );
}
