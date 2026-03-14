import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

export const getIAStatus = async () => {

try {

const ref = doc(db, "config", "ia");
const snap = await getDoc(ref);

if (snap.exists()) {
  return snap.data().enabled;
}

return true;

} catch (error) {

console.error("Error leyendo estado IA:", error);
return true;

}

};

export const setIAStatus = async (enabled: boolean) => {

try {

const ref = doc(db, "config", "ia");

await updateDoc(ref, {
  enabled
});

} catch (error) {

console.error("Error actualizando estado IA:", error);

}

};