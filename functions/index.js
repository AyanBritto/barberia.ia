const functions = require("firebase-functions");
const admin = require("firebase-admin");
const vision = require("@google-cloud/vision");
const nodemailer = require("nodemailer");

admin.initializeApp();
const client = new vision.ImageAnnotatorClient();

/*  CONFIG EMAIL */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "brittoayan5@gmail.com",
    pass: "chvh frvr mnov fhzp"
  }
});


// =============================
//  IA DETECTAR ROSTRO
// =============================
exports.detectFaceShape = functions.https.onRequest(async (req, res) => {

 
  //  CORS HEADERS
  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  //  Manejar preflight
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

    //  Lógica mejorada
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

res.set("Access-Control-Allow-Origin", "*");
res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");

  res.set("Access-Control-Allow-Origin", "*");
  res.set("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.set("Access-Control-Allow-Headers", "Content-Type, Authorization");


  if (req.method === "OPTIONS") return res.status(204).send("");
  if (req.method !== "POST") return res.status(405).send("Method not allowed");

  try {

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
      return res.status(400).json({ error: "No se detectó rostro" });
    }

    const face = faces[0];
    const vertices = face.boundingPoly?.vertices;

   const width = Math.abs(vertices[1].x - vertices[0].x);
const height = Math.abs(vertices[2].y - vertices[0].y);

const ratio = height / width;

//  NUEVA LÓGICA MEJORADA
const cheekWidth = width * 0.95;
const jawWidth = width * 0.85;

let faceShape = "Ovalado";
let confidence = 0.85;

if (ratio < 1.1) {

  faceShape = "Redondo";
  confidence = 0.92;

} else if (ratio >= 1.1 && ratio <= 1.35) {

  if (jawWidth < cheekWidth * 0.9) {
    faceShape = "Ovalado";
    confidence = 0.90;
  } else {
    faceShape = "Cuadrado";
    confidence = 0.87;
  }

} else {

  faceShape = "Alargado";
  confidence = 0.89;

}
    return res.json({ faceShape, confidence });

  } catch (error) {
    console.error(error);
    return res.status(500).json({ error: "Error interno" });
  }

});


// =============================
//  CANCELAR NO SHOW
// =============================
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


// =============================
//  EMAIL RESERVA CREADA
// =============================
exports.emailReservaCreada = functions.firestore
.document("reservas/{id}")
.onCreate(async (snap)=>{

  const data = snap.data();

  const mailOptions = {
    from: "BarberIA <brittoayan5@gmail.com>",
    to: data.email,
    subject: "Reserva confirmada 💈",
    text: `
Hola ${data.clienteNombre}

Tu reserva fue creada:

Servicio: ${data.servicio}
Barbero: ${data.barbero}
Fecha: ${data.fecha}
Hora: ${data.horario}

Gracias por usar Barber-IA 💈
    `
  };
if (data.barberoEmail) {
  await transporter.sendMail({
    from: "BarberIA <brittoayan5@gmail.com>",
    to: data.barberoEmail,
    subject: "Nueva reserva ✂️",
    text: `Nuevo cliente: ${data.clienteNombre}
    Servicio: ${data.servicio}
    Fecha: ${data.fecha}
    Hora: ${data.horario}`
    
  });
}
  try {
  await transporter.sendMail(mailOptions);
  transporter.verify()
  .then(() => console.log("🔥 Servidor de correo listo"))
  .catch(err => console.error("❌ Error en config email:", err));
  console.log("✅ Email enviado a:", data.email);
} catch (error) {
  console.error("❌ Error enviando email:", error);
}

});


// =============================
//  EMAIL CANCELACIÓN
// =============================
exports.emailReservaCancelada = functions.firestore
.document("reservas/{id}")
.onUpdate(async (change)=>{

  const before = change.before.data();
  const after = change.after.data();

  if (before.status === after.status) return;

  if (
    after.status === "cancelada_admin" ||
    after.status === "cancelada_cliente"
  ) {

    //  CLIENTE
    if (after.email) {
      await transporter.sendMail({
        from: "BarberIA <brittoayan5@gmail.com>",
        to: after.email,
        subject: "Reserva cancelada ❌",
        text: `
Hola ${after.clienteNombre}

Tu reserva fue cancelada.

Estado: ${after.status}
Barbero: ${after.barbero}
Fecha: ${after.fecha}
Hora: ${after.horario}

Si tienes dudas, contáctanos.
        `
      });
    }

    //  NUEVO → BARBERO
    if (after.barberoEmail) {
      await transporter.sendMail({
        from: "BarberIA <brittoayan5@gmail.com>",
        to: after.barberoEmail,
        subject: "Reserva cancelada por cliente ⚠️",
        text: `
Hola ${after.barbero}

Una reserva fue cancelada:

Cliente: ${after.clienteNombre}
Servicio: ${after.servicio}
Fecha: ${after.fecha}
Hora: ${after.horario}

Estado: ${after.status}
        `
      });
    }

  }

});
exports.deleteUserByAdmin = functions.https.onCall(async (data, context) => {

  //  Verificar que sea admin
  const uid = context.auth.uid;

  const userDoc = await admin.firestore().collection("usuarios").doc(uid).get();

  if (!userDoc.exists || userDoc.data().rol !== "admin") {
    throw new functions.https.HttpsError("permission-denied", "No autorizado");
  }

  const targetUid = data.uid;

  //  BORRAR RESERVAS
  const reservasSnap = await admin.firestore()
    .collection("reservas")
    .where("userId", "==", targetUid)
    .get();

  for (const doc of reservasSnap.docs) {
    await doc.ref.delete();
  }

  //  BORRAR SUGERENCIAS
  const sugerenciasSnap = await admin.firestore()
    .collection("sugerencias")
    .where("userId", "==", targetUid)
    .get();

  for (const doc of sugerenciasSnap.docs) {
    await doc.ref.delete();
  }

  //  BORRAR USUARIO FIRESTORE
  await admin.firestore().collection("usuarios").doc(targetUid).delete();

  // BORRAR AUTH
  await admin.auth().deleteUser(targetUid);

  return { success: true };

});
>>>>>>> 21d5d75 (cambios en admin y web responsive)
