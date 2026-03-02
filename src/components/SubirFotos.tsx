// src/components/reserva/SubirFotos.tsx
import { useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import { useImageUpload } from "../hooks/useImageUpload";

export default function SubirFotos() {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  const {
    file,
    preview,
    loading: uploadLoading,
    error,
    handleFileChange,
    uploadImage
  } = useImageUpload();

  // 👇 Verificación mejorada
  if (authLoading || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="mt-2 text-gray-600">Verificando sesión...</p>
        </div>
      </div>
    );
  }

  const onUploadClick = async () => {
    const docId = await uploadImage();
    if (docId) {
      navigate("/sugerencia-ia", { state: { docId } });
    }
  };

  return (
    <div className="bg-black-rich text-off-white p-6 rounded-2xl border border-gold/20 shadow-2xl max-w-md mx-auto">
      <h3 className="text-2xl font-playfair font-bold text-gold mb-4 text-center">
        Sube tu Foto
      </h3>

      <div className="mb-6">
        <label className="block w-full cursor-pointer group">
          <input
            type="file"
            className="hidden"
            accept="image/*"
            onChange={handleFileChange}
          />
          <div className="w-full h-48 border-2 border-dashed border-gray-600 rounded-xl flex flex-col items-center justify-center transition-all bg-gray-dark/50 group-hover:border-gold group-hover:bg-gray-dark">
            {preview ? (
              <img
                src={preview}
                alt="Vista previa"
                className="h-full w-full object-cover rounded-xl opacity-80 group-hover:opacity-100 transition-opacity"
              />
            ) : (
              <>
                <div className="w-12 h-12 mb-3 text-gray-400 group-hover:text-gold transition-colors">
                  <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                </div>
                <span className="text-gray-400 font-medium group-hover:text-gold transition-colors">
                  Click para subir imagen
                </span>
                <span className="text-xs text-gray-500 mt-1">
                  JPG, PNG (Max 5MB)
                </span>
              </>
            )}
          </div>
        </label>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg flex items-center gap-2 text-red-400 text-sm">
          <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          {error}
        </div>
      )}

      <button
        onClick={onUploadClick}
        disabled={!file || uploadLoading}
        className={`mt-8 w-full py-3 rounded-lg font-semibold text-white transition-all transform hover:scale-105 shadow-lg ${!file || uploadLoading
          ? "bg-gray-300 cursor-not-allowed"
          : "bg-gradient-to-r from-gold to-red-barber hover:shadow-xl"
          }`}
      >
        {uploadLoading ? (
          <span className="flex items-center justify-center">
            <svg
              className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            Analizando...
          </span>
        ) : (
          "Analizar con IA"
        )}
      </button>

      <p className="text-center text-xs text-gray-500 mt-6">
        Tu foto será analizada por nuestra IA para darte la mejor sugerencia de corte.
      </p>
    </div>
  );
}