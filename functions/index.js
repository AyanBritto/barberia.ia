const functions = require("firebase-functions");
const admin = require("firebase-admin");
const vision = require("@google-cloud/vision");

admin.initializeApp();
const client = new vision.ImageAnnotatorClient();

exports.detectFaceShape = functions.https.onRequest(async (req, res) => {

<<<<<<< HEAD
  // 🔥 CORS HEADERS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  // 🔥 Manejar preflight
  if (req.method === "OPTIONS") {
    return res.status(204).send("");
  }

  // Solo permitir POST
  if (req.method !== "POST") {
    return res.status(405).send("Method not allowed");
  }

  try {
    // Verificar autenticación
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ error: "No autorizado" });
    }

    const idToken = authHeader.split("Bearer ")[1];
    const decoded = await admin.auth().verifyIdToken(idToken);

    const { imageUrl } = req.body;

    if (!imageUrl || typeof imageUrl !== "string") {
      return res.status(400).json({ error: "Falta 'imageUrl'" });
    }

    // Llamar a Vision API
    const [result] = await client.faceDetection(imageUrl);
    const faces = result.faceAnnotations;

   // Después de obtener 'faces'
let faceShape = "Ovalado";
let confidence = 0.85;

if (faces && faces.length > 0) {
  const face = faces[0];
  const vertices = face.boundingPoly?.vertices;
  if (vertices && vertices.length >= 4) {
    const width = Math.abs(vertices[1].x - vertices[0].x);
    const height = Math.abs(vertices[2].y - vertices[0].y);
    const ratio = height / width;

    // ✅ Lógica mejorada
    if (ratio < 1.05) {
      faceShape = "Redondo";
      confidence = 0.92;
    } else if (ratio > 1.45) {
      faceShape = "Alargado";
      confidence = 0.88;
    } else if (face.joyLikelihood === "VERY_LIKELY" || face.sorrowLikelihood === "VERY_LIKELY") {
      faceShape = "Cuadrado";
      confidence = 0.85;
    } else {
      faceShape = "Ovalado";
      confidence = 0.86;
    }
  }
}

    return res.json({ faceShape, confidence });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ error: "Error interno del servidor" });
  }
});
=======
res.set("Access-Control-Allow-Origin", "*");
res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

if (req.method === "OPTIONS") {
return res.status(204).send("");
}

if (req.method !== "POST") {
return res.status(405).send("Method not allowed");
}

try {
const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.cancelarReservasNoShow =
functions.pubsub.schedule("every 5 minutes").onRun(async ()=>{

const db = admin.firestore();
const now = new Date();

const snapshot = await db.collection("reservas")
.where("estadoServicio","==","pendiente")
.get();

for(const doc of snapshot.docs){

const r = doc.data();

const fechaHora = new Date(`${r.fecha} ${r.horario}`);

const limite = new Date(fechaHora.getTime() + 15 * 60000);

if(now > limite){

await doc.ref.update({
estadoServicio:"cancelada_no_show",
status:"cancelada"
});

}

}

});
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {
  return res.status(401).json({ error: "No autorizado" });
}

const idToken = authHeader.split("Bearer ")[1];
await admin.auth().verifyIdToken(idToken);

const { imageUrl } = req.body;

if (!imageUrl) {
  return res.status(400).json({ error: "Falta imageUrl" });
}

const [result] = await client.faceDetection(imageUrl);
const faces = result.faceAnnotations;

if (!faces || faces.length === 0) {
  return res.status(400).json({ error: "No se detectó ningún rostro" });
}

const face = faces[0];

const vertices = face.boundingPoly?.vertices;

if (!vertices || vertices.length < 4) {
  return res.status(500).json({ error: "No se pudo analizar el rostro" });
}

const width = Math.abs(vertices[1].x - vertices[0].x);
const height = Math.abs(vertices[2].y - vertices[0].y);

const ratio = height / width;

let faceShape = "Ovalado";
let confidence = 0.85;

// 🔥 NUEVA LÓGICA MEJORADA

if (ratio < 1.05) {

  faceShape = "Redondo";
  confidence = 0.92;

} 
else if (ratio >= 1.05 && ratio <= 1.30) {

  faceShape = "Cuadrado";
  confidence = 0.88;

} 
else if (ratio > 1.30 && ratio <= 1.55) {

  faceShape = "Ovalado";
  confidence = 0.90;

} 
else {

  faceShape = "Alargado";
  confidence = 0.87;

}

return res.json({
  faceShape,
  confidence
});

}
catch (error) {

console.error("Error:", error);

return res.status(500).json({
  error: "Error interno del servidor"
});

}

});
>>>>>>> 21d5d75 (cambios en admin y web responsive)
